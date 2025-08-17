// ======================
// 1. RULES CONFIGURATION
// ======================
const formatRules = {
  bannedCards: [
    "Sol Ring",
    "Mana Crypt",
    "Dockside Extortionist",
    "Lightning Bolt",
    "Counterspell"
    // Add more as needed
  ],
  // ... (keep your other rules the same) ...
};

// ======================
// 2. CARD CHECKER IMPLEMENTATION
// ======================
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  const cardSearch = document.getElementById('card-search');
  const resultBox = document.getElementById('result');

  // Simple check on button click
  searchButton.addEventListener('click', checkLegality);
  
  // Also check when Enter key is pressed
  cardSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLegality();
  });

  function checkLegality() {
    const cardName = cardSearch.value.trim();
    if (!cardName) {
      resultBox.textContent = "Please enter a card name";
      resultBox.style.color = "black";
      return;
    }

    // Normalize the input (remove special chars, make lowercase)
    const normalizedInput = cardName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check against banned list first (simple comparison)
    const isBanned = formatRules.bannedCards.some(bannedCard => 
      bannedCard.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedInput
    );

    if (isBanned) {
      showResult("BANNED", "red");
      return;
    }

    // If not in simple banned list, check with Scryfall API
    checkWithScryfall(cardName);
  }

  function checkWithScryfall(cardName) {
    fetchCard(cardName)
      .then(card => {
        const isLegal = evaluateCard(card);
        showResult(isLegal ? "LEGAL" : "BANNED", isLegal ? "green" : "red");
      })
      .catch(error => {
        console.error("Error:", error);
        showResult("Error checking card", "black");
      });
  }

  function showResult(message, color) {
    resultBox.textContent = message;
    resultBox.style.color = color;
    resultBox.style.fontWeight = "bold";
    resultBox.style.fontSize = "18px";
  }

  // ... (keep your existing fetchCard() and evaluateCard() functions) ...
});
