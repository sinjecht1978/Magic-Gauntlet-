// ======================
// MAGIC GAUNTLET FORMAT CHECKER (WITH SCRYFALL API)
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
      const card = await fetchScryfallCard(cardName);
      if (!card) {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      if (isBannedByRules(card)) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      } else {
        resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:black'>API Error - Try Again</span>";
    }
  });

  // SCRYFALL API CALL
  async function fetchScryfallCard(cardName) {
    try {
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Scryfall error:", error);
      return null;
    }
  }

  function isBannedByRules(card) {
    // Check all rules (same as previous implementation)
    if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) return true;
    if (isUnconditionalKillSpell(card) && card.cmc < 5) return true;
    if (isUnconditionalCounter(card) && card.cmc < 4) return true;
    if (isMassBoardWipe(card) && card.cmc < 6) return true;
    if (isLandDestruction(card) && card.cmc < 4) return true;
    if (isDualLand(card) && hasPositiveETB(card)) return true;
    if (isManaRock(card) && (producesMultipleMana(card) || (card.cmc < 3 && !entersTapped(card)))) return true;
    if (isCompetitiveCard(card)) return true;
    return false;
  }

  // Keep all the same helper functions from previous implementation
  function isDamageSpell(card) { /* ... */ }
  function getMaxDamage(card) { /* ... */ }
  function isUnconditionalKillSpell(card) { /* ... */ }
  // ... (all other helper functions remain identical)
});
