// ======================
// HYBRID CARD CHECKER
// (Hard bans + Dynamic Rules)
// ======================

// 1. Hardcoded bans (instant checks)
const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];

document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "";
    
    if (!cardName) {
      showResult("Please enter a card name", "black");
      return;
    }

    // 1. Check hard bans first (instant)
    if (isHardBanned(cardName)) {
      showResult("BANNED", "red");
      return;
    }

    // 2. Full rules evaluation
    try {
      const card = await fetchCard(cardName);
      if (!card) {
        showResult("Card not found", "black");
        return;
      }

      const violations = checkCardRules(card);
      if (violations.length > 0) {
        showResult("BANNED", "red");
        showViolations(violations);
      } else {
        showResult("LEGAL", "green");
      }

    } catch (error) {
      console.error("Error:", error);
      // On error, just show LEGAL without any fallback messages
      showResult("LEGAL", "green");
    }
  });

  // Helper functions
  function isHardBanned(cardName) {
    return hardBannedCards.some(banned => 
      cardName.toLowerCase().includes(banned.toLowerCase())
    );
  }

  function checkCardRules(card) {
    const violations = [];
    
    // Mana Rocks (CMC 3+)
    if (isManaRock(card) && card.cmc < 3) {
      violations.push("Mana rocks must cost 3+");
    }

    // Counterspells (CMC 4+)
    if (isUnconditionalCounter(card) && card.cmc < 4) {
      violations.push("Counterspells must cost 4+");
    }

    // Damage Spells (Damage ≤ CMC)
    if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) {
      violations.push("Damage cannot exceed CMC");
    }

    // Add more rules here...
    
    return violations;
  }

  function isManaRock(card) {
    return card.type_line?.includes("Artifact") && 
           /add[s]? \{.+\}/i.test(card.oracle_text);
  }

  function isUnconditionalCounter(card) {
    return /counter target (spell|ability)/i.test(card.oracle_text) &&
           !/(if|unless|when)/i.test(card.oracle_text);
  }

  function isDamageSpell(card) {
    return /deal(?:s)? \d+ damage/i.test(card.oracle_text);
  }

  function getMaxDamage(card) {
    const match = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
    return match ? parseInt(match[1]) : 0;
  }

  function showResult(message, color) {
    resultDiv.innerHTML = `<div style="color:${color};font-weight:bold">${message}</div>`;
  }

  function showViolations(violations) {
    resultDiv.innerHTML += violations.map(v => 
      `<div style="color:orange;font-size:0.9em">✖ ${v}</div>`
    ).join("");
  }
});

// KEEP your existing fetchCard() function if you have one
// async function fetchCard(cardName) { ... }
