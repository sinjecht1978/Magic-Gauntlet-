// ======================
// MAGIC GAUNTLET FORMAT CHECKER
// ======================

document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "";
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    try {
      const card = await fetchCard(cardName);
      if (!card) {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      // Check all format rules
      if (isBannedByRules(card)) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      } else {
        resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
    }
  });

  function isBannedByRules(card) {
    // Damage spells check
    if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) {
      return true;
    }

    // Kill spells check
    if (isUnconditionalKillSpell(card) && card.cmc < 5) {
      return true;
    }

    // Counter spells check
    if (isUnconditionalCounter(card) && card.cmc < 4) {
      return true;
    }

    // Board wipes check
    if (isMassBoardWipe(card) && card.cmc < 6) {
      return true;
    }

    // Land destruction check
    if (isLandDestruction(card) && card.cmc < 4) {
      return true;
    }

    // Dual lands check
    if (isDualLand(card) && hasPositiveETB(card)) {
      return true;
    }

    // Mana rocks check
    if (isManaRock(card) && (producesMultipleMana(card) || (card.cmc < 3 && !entersTapped(card)))) {
      return true;
    }

    // Competitive cards heuristic check
    if (isCompetitiveCard(card)) {
      return true;
    }

    return false;
  }

  // Helper functions for each rule
  function isDamageSpell(card) {
    return /deal(?:s)? \d+ damage/i.test(card.oracle_text);
  }

  function getMaxDamage(card) {
    const match = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
    return match ? parseInt(match[1]) : 0;
  }

  function isUnconditionalKillSpell(card) {
    return /destroy target (creature|permanent)/i.test(card.oracle_text) &&
           !/(if|unless|when)/i.test(card.oracle_text);
  }

  function isUnconditionalCounter(card) {
    return /counter target (spell|ability)/i.test(card.oracle_text) &&
           !/(if|unless|when)/i.test(card.oracle_text);
  }

  function isMassBoardWipe(card) {
    return /destroy all (creatures|permanents)/i.test(card.oracle_text) ||
           /exile all (creatures|permanents)/i.test(card.oracle_text);
  }

  function isLandDestruction(card) {
    return /destroy target land/i.test(card.oracle_text) ||
           /destroy all lands/i.test(card.oracle_text);
  }

  function isDualLand(card) {
    return card.type_line.includes("Land") && 
           /(enters the battlefield|\\{T\\}) (.*) add \\{[^}]\\} or \\{[^}]\\}/.test(card.oracle_text);
  }

  function hasPositiveETB(card) {
    return /enters the battlefield (untapped|with|and)/i.test(card.oracle_text);
  }

  function isManaRock(card) {
    return card.type_line.includes("Artifact") && 
           /add[s]? \\{[^}]\\}/i.test(card.oracle_text);
  }

  function producesMultipleMana(card) {
    return /add[s]? \\{[^}]\\} (and|or) \\{[^}]\\}/i.test(card.oracle_text) ||
           /add[s]? \\
