// ======================
// FINAL CLEAN SOLUTION
// ======================

// 1. Core Functions
function isHardBanned(cardName) {
  const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];
  return hardBannedCards.some(banned => 
    cardName.toLowerCase().includes(banned.toLowerCase())
  );
}

async function fetchCard(cardName) {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// 2. Rule Checkers (only your requested rules)
function isBannedByRules(card) {
  // Mana Rocks (CMC 3+)
  const isBadManaRock = card.type_line.includes("Artifact") && 
                       /add[s]? \{.+\}/i.test(card.oracle_text) && 
                       card.cmc < 3;

  // Counterspells (CMC 4+)
  const isBadCounter = /counter target spell/i.test(card.oracle_text) &&
                      !/(if|unless|when)/i.test(card.oracle_text) && 
                      card.cmc < 4;

  // Damage Spells (Damage > CMC)
  const damageMatch = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
  const isBadDamage = damageMatch && parseInt(damageMatch[1]) > card.cmc;

  // Board Wipes (CMC 6+)
  const isBadWipe = (card.type_line.includes("Sorcery") || card.type_line.includes("Instant")) &&
                   /destroy all|exile all/i.test(card.oracle_text) && 
                   card.cmc < 6;

  return isBadManaRock || isBadCounter || isBadDamage || isBadWipe;
}

// 3. Main Execution
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  checkBtn.addEventListener('click', async function() {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = ""; // Clear previous result

    if (!cardName) return; // No empty input handling

    try {
      // Hard bans check
      if (isHardBanned(cardName)) {
        resultDiv.innerHTML = "BANNED";
        resultDiv.style.color = 'red';
        return;
      }

      // API fetch
      const card = await fetchCard(cardName);
      if (!card) return; // No "not found" message

      // Rules check
      if (isBannedByRules(card)) {
        resultDiv.innerHTML = "BANNED";
        resultDiv.style.color = 'red';
      } else {
        resultDiv.innerHTML = "LEGAL";
        resultDiv.style.color = 'green';
      }

    } catch (error) {
      console.error("Error:", error);
    }
  });
});
