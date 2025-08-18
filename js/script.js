// ======================
// PROPERLY ORDERED SCRIPT
// ======================

// 1. First define ALL helper functions
function isHardBanned(cardName) {
  const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];
  return hardBannedCards.some(banned => 
    cardName.toLowerCase().includes(banned.toLowerCase())
  );
}

function fetchCard(cardName) {
  // ... existing fetchCard implementation ...
}

// ... all other helper functions (isManaRock, isUnconditionalCounter, etc.) ...

// 2. Then add your DOM event listeners
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  // Initialize display
  resultDiv.innerHTML = "<span style='color:blue'>READY</span>";

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "<span style='color:orange'>CHECKING...</span>";
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    try {
      const card = await fetchCard(cardName);
      
      if (!card || card.object === 'error') {
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
      resultDiv.innerHTML = "<span style='color:black'>API Error</span>";
    }
  });
});
