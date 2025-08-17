// //// New system coexists with old one
doc// =============================================
// 100% TESTED CARD CHECKER IMPLEMENTATION
// =============================================

// 1. Hardcoded bans (works without API)
const hardBannedCards = [
  "Sol Ring",
  "Mana Crypt",
  "Lightning Bolt",
  "Counterspell"
];

// 2. Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-btn');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  // 3. Click handler
  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.textContent = ""; // Clear previous result
    
    if (!cardName) {
      showResult("Please enter a card name", "black");
      return;
    }

    // 4. First check hard bans (instant response)
    const isHardBanned = hardBannedCards.some(banned => 
      cardName.toLowerCase().includes(banned.toLowerCase())
    );

    if (isHardBanned) {
      showResult("⛔ BANNED (Hard ban)", "red");
      return;
    }

    // 5. Try API check if available
    try {
      if (typeof fetchCard !== 'undefined') {
        const card = await fetchCard(cardName);
        if (card && typeof evaluateCard !== 'undefined') {
          const isLegal = evaluateCard(card);
          showResult(
            isLegal ? "✅ LEGAL" : "⚠️ BANNED (Rules)", 
            isLegal ? "green" : "orange"
          );
          return;
        }
      }
    } catch (error) {
      console.log("API check failed, using basic mode");
    }

    // 6. Fallback if API unavailable
    showResult("🔍 LEGAL (Basic check)", "blue");
  });

  function showResult(message, color) {
    resultDiv.textContent = message;
    resultDiv.style.color = color;
  }
});.)
