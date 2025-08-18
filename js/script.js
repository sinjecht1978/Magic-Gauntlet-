// ======================
// COMPLETE WORKING SOLUTION
// ======================

// 1. First define ALL helper functions
function isHardBanned(cardName) {
  const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];
  return hardBannedCards.some(banned => 
    cardName.toLowerCase().includes(banned.toLowerCase())
  );
}

async function fetchCard(cardName) {
  try {
    console.log("Fetching card:", cardName);
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    
    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
      return null;
    }
    
    const card = await response.json();
    console.log("Received card data:", card);
    return card;
    
  } catch (error) {
    console.error("Network Error:", error);
    return null;
  }
}

function isManaRock(card) {
  return card.type_line.includes("Artifact") && 
         /add[s]? \{.+\}/i.test(card.oracle_text);
}

function isUnconditionalCounter(card) {
  return /counter target spell/i.test(card.oracle_text) &&
         !/(if|unless|when)/i.test(card.oracle_text);
}

function isDamageSpell(card) {
  return /deal(?:s)? \d+ damage/i.test(card.oracle_text);
}

function getMaxDamage(card) {
  const match = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
  return match ? parseInt(match[1]) : 0;
}

function isMassBoardWipe(card) {
  if (!card.type_line.includes('Sorcery') && !card.type_line.includes('Instant')) {
    return false;
  }
  const wipePatterns = [
    /destroy all (creatures|permanents)/i,
    /exile all (creatures|permanents)/i
  ];
  return wipePatterns.some(pattern => pattern.test(card.oracle_text));
}

function isLandDestruction(card) {
  return /destroy target land|destroy all lands/i.test(card.oracle_text);
}

function isBannedByRules(card) {
  // Mana Rocks (CMC 3+)
  if (isManaRock(card) && card.cmc < 3) return true;
  
  // Counterspells (CMC 4+)
  if (isUnconditionalCounter(card) && card.cmc < 4) return true;
  
  // Damage Spells (Damage ≤ CMC)
  if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) return true;
  
  // Mass Board Wipes (CMC 6+)
  if (isMassBoardWipe(card) && card.cmc < 6) return true;
  
  // Land Destruction (CMC 4+)
  if (isLandDestruction(card) && card.cmc < 4) return true;
  
  return false;
}

// 2. Set up the UI
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  // Verify elements exist
  if (!checkBtn || !cardInput || !resultDiv) {
    console.error("Missing required HTML elements!");
    return;
  }

  // Initialize display
  resultDiv.innerHTML = "<span style='color:blue'>READY</span>";
  resultDiv.style.minHeight = "24px";

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    console.log("Checking card:", cardName);
    
    // Clear previous result
    resultDiv.innerHTML = "<span style='color:orange'>CHECKING...</span>";
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    // 1. Check hard bans first
    if (isHardBanned(cardName)) {
      resultDiv.innerHTML = "<span style='color:red'>BANNED (Hard Ban)</span>";
      return;
    }

    try {
      // 2. Fetch card data
      const card = await fetchCard(cardName);
      
      if (!card) {
        resultDiv.innerHTML = "<span style='color:black'>Card not found. Try exact name.</span>";
        return;
      }

      // 3. Check other rules
      if (isBannedByRules(card)) {
        resultDiv.innerHTML = "<span style='color:red'>BANNED (Rules Violation)</span>";
      } else {
        resultDiv.innerHTML = "<span style='color:green'>LEGAL</span>";
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:black'>API Error - Try Again</span>";
    }
  });
});
