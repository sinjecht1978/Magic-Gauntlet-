// ======================
// PROPERLY STRUCTURED SCRIPT
// ======================

// 1. First define ALL helper functions at the top
function isHardBanned(cardName) {
  const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];
  return hardBannedCards.some(banned => 
    cardName.toLowerCase().includes(banned.toLowerCase())
  );
}

async function fetchCard(cardName) {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.error("Scryfall error:", error);
    return { object: 'error' };
  }
}

function isBannedByRules(card) {
  // ... your existing rule checks ...
}

// ... include all other helper functions here ...

// 2. Then add your DOM event listeners
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  // Initialize display
  resultDiv.innerHTML = "<span style='color:blue'>READY</span>";

  checkBtn.addEventListener('click', async function() {
    console.log("Button clicked - input value:", cardInput.value);
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "<span style='color:orange'>CHECKING...</span>";
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    // 1. Check hard bans first
    if (isHardBanned(cardName)) {
      resultDiv.innerHTML = "<span style='color:red'>BANNED</span>";
      return;
    }

    try {
      const card = await fetchCard(cardName);
      
      if (!card || card.object === 'error') {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      // 2. Check other rules
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
