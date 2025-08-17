// ======================
// CARD LEGALITY CHECKER
// ======================

document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  const cardSearch = document.getElementById('card-search');
  const resultBox = document.getElementById('result');

  // Event listeners
  searchButton.addEventListener('click', checkLegality);
  cardSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLegality();
  });

  async function checkLegality() {
    const cardName = cardSearch.value.trim();
    if (!cardName) {
      showResult("Please enter a card name", "black");
      return;
    }

    try {
      const card = await fetchCard(cardName);
      if (!card) {
        showResult("Card not found", "black");
        return;
      }

      // 1. Check hard banned list
      const isHardBanned = formatRules.bannedCards.some(bannedCard => 
        card.name.toLowerCase() === bannedCard.toLowerCase()
      );

      if (isHardBanned) {
        showResult("BANNED (Hard banned)", "red");
        return;
      }

      // 2. Check full rules
      const isLegal = evaluateCard(card);
      showResult(
        isLegal ? "LEGAL" : "BANNED (Rules violation)",
        isLegal ? "green" : "orange"
      );

    } catch (error) {
      console.error("Error:", error);
      showResult("Error checking card", "black");
    }
  }

  function showResult(message, color) {
    resultBox.textContent = message;
    resultBox.style.color = color;
    resultBox.style.fontWeight = "bold";
    resultBox.style.fontSize = "18px";
  }
});

// Keep all other existing functions below this point
// (fetchCard, evaluateCard, isManaRock, etc.)
