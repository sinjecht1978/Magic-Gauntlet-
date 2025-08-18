// ===========// ======================
// HYBRID CARD CHECKER
// ======================

const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];

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

    // 1. Check hard bans first (instant)
    const lowerCardName = cardName.toLowerCase();
    if (hardBannedCards.some(banned => lowerCardName.includes(banned.toLowerCase()))) {
      resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      return;
    }

    // 2. Full rules evaluation
    try {
      const card = await fetchCard(cardName);
      if (!card) {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      // Check all rules
      if (isManaRock(card) && card.cmc < 3) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
        return;
      }
      
      if (isUnconditionalCounter(card) && card.cmc < 4) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
        return;
      }
      
      if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
        return;
      }

      // If passed all checks
      resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";

    } catch (error) {
      console.error("Error:", error);
      // On error, assume legal
      resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
    }
  });

  // Helper functions
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
});

// KEEP your existing fetchCard() function
// async function fetchCard(cardName) { ... }
