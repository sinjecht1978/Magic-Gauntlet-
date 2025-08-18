// ======================
// ENHANCED CARD CHECKER
// ======================

// 1. Core Functions
const HARD_BANNED_CARDS = [
  "Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell",
  "Swords to Plowshares", "Demonic Tutor", "Ancestral Recall"
];

function isHardBanned(cardName) {
  return HARD_BANNED_CARDS.some(banned => 
    cardName.toLowerCase().includes(banned.toLowerCase())
  );
}

async function fetchCard(cardName) {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    if (!response.ok) {
      throw new Error(`Card not found: ${cardName}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 2. Enhanced Rule Checkers
function isBannedByRules(card) {
  // Check if card is null or undefined
  if (!card) return false;

  // Mana Rocks (CMC < 3)
  const isManaRock = card.type_line.includes("Artifact") && 
                    /add[s]? \{.+\}/i.test(card.oracle_text);
  if (isManaRock && card.cmc < 3) return true;

  // Counterspells (CMC < 4)
  const isCounter = /counter target spell/i.test(card.oracle_text) &&
                   !/(if|unless|when)/i.test(card.oracle_text);
  if (isCounter && card.cmc < 4) return true;

  // Damage Spells (Damage > CMC)
  const damageMatch = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
  if (damageMatch) {
    const damageAmount = parseInt(damageMatch[1]);
    if (damageAmount > card.cmc) return true;
  }

  // Board Wipes (CMC < 6)
  const isWipe = (card.type_line.includes("Sorcery") || card.type_line.includes("Instant")) &&
                /destroy all|exile all/i.test(card.oracle_text);
  if (isWipe && card.cmc < 6) return true;

  // Additional checks can be added here
  return false;
}

// 3. Main Execution
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button') || document.getElementById('check-btn');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result') || document.getElementById('result');

  // Handle both button click and Enter key press
  const checkCard = async () => {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "";
    resultDiv.style.color = "";

    if (!cardName) {
      resultDiv.innerHTML = "Please enter a card name";
      resultDiv.style.color = 'black';
      return;
    }

    try {
      // Hard bans check
      if (isHardBanned(cardName)) {
        resultDiv.innerHTML = "BANNED (Hard Ban)";
        resultDiv.style.color = 'red';
        return;
      }

      // API fetch
      const card = await fetchCard(cardName);
      if (!card) {
        resultDiv.innerHTML = "Card not found";
        resultDiv.style.color = 'black';
        return;
      }

      // Rules check
      if (isBannedByRules(card)) {
        resultDiv.innerHTML = "BANNED (Blanket Rule)";
        resultDiv.style.color = 'red';
      } else {
        resultDiv.innerHTML = "LEGAL";
        resultDiv.style.color = 'green';
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "Error checking card";
      resultDiv.style.color = 'black';
    }
  };

  // Event listeners
  if (checkBtn) checkBtn.addEventListener('click', checkCard);
  if (cardInput) {
    cardInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkCard();
    });
  }
});});
