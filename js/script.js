// ======================
// IMPROVED CARD CHECKER
// ======================

// 1. Enhanced Hard Ban List (exact matches only)
const HARD_BANNED_CARDS = [
  "Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell",
  "Swords to Plowshares", "Demonic Tutor", "Ancestral Recall"
].map(card => card.toLowerCase());

function isHardBanned(cardName) {
  return HARD_BANNED_CARDS.includes(cardName.toLowerCase());
}

// 2. More Precise Rule Checks
function isBannedByRules(card) {
  if (!card) return false;

  const typeLine = card.type_line.toLowerCase();
  const oracleText = card.oracle_text?.toLowerCase() || '';

  // Mana Rocks (CMC < 3) - Exclude creatures and conditional mana
  const isManaRock = typeLine.includes("artifact") && 
                    !typeLine.includes("creature") &&
                    /add[s]? \{.+\}/.test(oracleText) &&
                    !oracleText.includes("unless") &&
                    !oracleText.includes("if you control");
  if (isManaRock && card.cmc < 3) return true;

  // Counterspells (CMC < 4) - Exclude conditional counters
  const isCounter = /counter target spell/.test(oracleText) &&
                   !/(if|unless|when|may)/.test(oracleText);
  if (isCounter && card.cmc < 4) return true;

  // Damage Spells (Damage > CMC) - Only direct damage
  const damageMatch = oracleText.match(/deal(?:s)? (\d+) damage to (?:any|target) (?:player|creature)/i);
  if (damageMatch) {
    const damageAmount = parseInt(damageMatch[1]);
    if (damageAmount > card.cmc) return true;
  }

  // Board Wipes (CMC < 6) - Exclude conditional wipes
  const isWipe = (typeLine.includes("sorcery") || typeLine.includes("instant")) &&
                /(destroy|exile) all (creatures|permanents)/.test(oracleText) &&
                !oracleText.includes("unless");
  if (isWipe && card.cmc < 6) return true;

  return false;
}

// 3. Main Execution with Better Feedback
document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('check-button') || document.getElementById('check-btn');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result') || document.getElementById('result');

  const checkCard = async () => {
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "Checking...";
    resultDiv.style.color = 'black';

    if (!cardName) {
      resultDiv.innerHTML = "Please enter a card name";
      return;
    }

    try {
      // Hard bans check (exact match only)
      if (isHardBanned(cardName)) {
        resultDiv.innerHTML = "BANNED (Hard Ban)";
        resultDiv.style.color = 'red';
        return;
      }

      // API fetch
      const card = await fetchCard(cardName);
      if (!card) {
        resultDiv.innerHTML = "Card not found";
        return;
      }

      // Rules check with exact name verification
      if (card.name.toLowerCase() !== cardName.toLowerCase()) {
        resultDiv.innerHTML = `Did you mean: ${card.name}?`;
        return;
      }

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
    }
  };

  if (checkBtn) checkBtn.addEventListener('click', checkCard);
  if (cardInput) {
    cardInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkCard();
    });
  }
});
