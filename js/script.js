// ======================
// FIXED VISUAL FEEDBACK VERSION
// ======================

document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  // Initialize with READY state
  resultDiv.innerHTML = "<span style='color:blue; font-weight:bold'>READY</span>";
  resultDiv.style.minHeight = "20px"; // Prevents collapse when empty

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    
    // Clear previous result but keep space
    resultDiv.innerHTML = "<span style='color:orange; font-weight:bold'>CHECKING...</span>";
    
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

      // Debug: Show what's being checked
      console.log("Checking:", {
        name: card.name,
        cmc: card.cmc, 
        type: card.type_line,
        text: card.oracle_text
      });

      if (isBannedByRules(card)) {
        showBanned();
      } else {
        showLegal();
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:red'>API Error</span>";
      // Restore READY state after 2 seconds
      setTimeout(() => {
        resultDiv.innerHTML = "<span style='color:blue; font-weight:bold'>READY</span>";
      }, 2000);
    }
  });

  // ... [keep all your existing helper functions exactly as they were] ...

  function showBanned() {
    resultDiv.innerHTML = "<span style='color:red; font-weight:bold'>BANNED</span>";
  }

  function showLegal() {
    resultDiv.innerHTML = "<span style='color:green; font-weight:bold'>LEGAL</span>";
  }
});

// Ensure this is at the end if not using modules
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
