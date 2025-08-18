// ======================
// MAGIC GAUNTLET CHECKER (WITH MASS BOARD WIPE RULE)
// ======================

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

    // 1. Check hard bans first
    if (isHardBanned(cardName)) {
      showBanned();
      return;
    }

    // 2. Check Scryfall API
    try {
      const card = await fetchCard(cardName);
      
      if (!card || card.object === 'error') {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      // 3. Check all format rules
      if (isBannedByRules(card)) {
        showBanned();
      } else {
        showLegal();
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:black'>API Error - Try Again</span>";
    }
  });

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

  function isHardBanned(cardName) {
    return hardBannedCards.some(banned => 
      cardName.toLowerCase().includes(banned.toLowerCase())
    );
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
    
    return false;
  }

  function isManaRock(card) {
    return card.type_line?.includes("Artifact") && 
           /add[s]? \{.+\}/i.test(card.oracle_text);
  }

  function isUnconditionalCounter(card) {
    return /counter target (spell|ability)/i.test(card.oracle_text) &&
           !/(if|unless|when)/i.test(card.oracle_text);
  }

  function isDamageSpell(card) {
    return /deal(?:s)? \d+ damage/i.test(card.oracle_text);
  }

  // NEW FUNCTION: Mass Board Wipe Check
  function isMassBoardWipe(card) {
    return /destroy all|exile all|(-|)x (-|)x|wipe all/i.test(card.oracle_text) && 
           (card.type_line.includes('Sorcery') || card.type_line.includes('Instant'));
  }

  function getMaxDamage(card) {
    const match = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
    return match ? parseInt(match[1]) : 0;
  }

  function showBanned() {
    resultDiv.innerHTML = "<span style='color:red; font-weight:bold'>BANNED</span>";
  }

  function showLegal() {
    resultDiv.innerHTML = "<span style='color:green; font-weight:bold'>LEGAL</span>";
  }
});
