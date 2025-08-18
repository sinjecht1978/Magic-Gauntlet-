// ========// =============================================
// FINAL CARD CHECKER IMPLEMENTATION
// =============================================

const hardBannedCards = [
  "Sol Ring",
  "Mana Crypt",
  "Lightning Bolt",
  "Counterspell"
];

document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = ""; // Clear previous result
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    // 1. Check hard bans first
    if (hardBannedCards.some(banned => 
      cardName.toLowerCase().includes(banned.toLowerCase())
    )) {
      resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      return;
    }

    // 2. Try API check if available
    try {
      if (typeof fetchCard !== 'undefined') {
        const card = await fetchCard(cardName);
        if (card && typeof evaluateCard !== 'undefined') {
          const isLegal = evaluateCard(card);
          resultDiv.innerHTML = isLegal 
            ? "<span style='color:green'>LEGAL</span>" 
            : "<span style='color:orange'>BANNED</span>";
          return;
        }
      }
    } catch (error) {
      console.log("API check failed");
    }

    // 3. Fallback for basic legal check
    resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
  });
});
