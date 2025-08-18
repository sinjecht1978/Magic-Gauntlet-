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

    // 1. Hard ban check
    if (hardBannedCards.some(banned => 
      cardName.toLowerCase().includes(banned.toLowerCase())
    )) {
      resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      return;
    }

    // 2. API check
    try {
      if (window.fetchCard) { // More reliable check
        const card = await fetchCard(cardName);
        if (card && window.evaluateCard) {
          resultDiv.innerHTML = evaluateCard(card)
            ? "<span style='color:green'>LEGAL</span>"
            : "<span style='color:orange'>BANNED</span>";
          return;
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }

    // 3. Fallback
    resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
  });
});
