// // ======================
// ADVANCED CARD CHECKER (Scryfall + Rules)
// ======================
document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.getElementById('search-button');
  const cardSearch = document.getElementById('card-search');
  const resultDiv = document.getElementById('result');

  // Hardcoded bans (supplements your formatRules)
  const hardBans = {
    cards: ["Sol Ring", "Mana Crypt", "Dockside Extortionist"],
    mechanics: ["Storm", "Dredge"]
  };

  checkButton.addEventListener('click', checkCardLegality);

  async function checkCardLegality() {
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

      // 1. Check hard bans
      if (hardBans.cards.some(banned => 
        card.name.toLowerCase() === banned.toLowerCase()
      )) {
        showResult("BANNED (Hardlisted)", "red");
        return;
      }

      // 2. Evaluate against format rules
      const isLegal = evaluateCard(card); // Your existing function
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
    resultDiv.innerHTML = `
      <div style="font-weight:bold;font-size:18px;color:${color}">
        ${message}
      </div>
    `;
  }
});

// Keep all other existing functions below this point
// (fetchCard, evaluateCard, isManaRock, etc.)
