// ======================
// MAGIC GAUNTLET COMPLETE RULE CHECKER (DEBUGGING VERSION)
// ======================

const hardBannedCards = ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"];

document.addEventListener('DOMContentLoaded', function() {
  // Debug initialization
  console.log("Script loaded!");
  document.getElementById('checker-result').innerHTML = "READY";
  
  const checkBtn = document.getElementById('check-button');
  const cardInput = document.getElementById('card-search');
  const resultDiv = document.getElementById('checker-result');

  checkBtn.addEventListener('click', async function() {
    console.log("Button clicked - input value:", cardInput.value);
    resultDiv.innerHTML = "WORKING...";
    
    const cardName = cardInput.value.trim();
    resultDiv.innerHTML = "";
    
    if (!cardName) {
      resultDiv.innerHTML = "<span style='color:black'>Please enter a card name</span>";
      return;
    }

    // 1. Check hard bans first
    if (isHardBanned(cardName)) {
      console.log("Hard banned:", cardName);
      showBanned();
      return;
    }

    // 2. Check Scryfall API
    try {
      const card = await fetchCard(cardName);
      console.log("API response:", card);
      
      if (!card || card.object === 'error') {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

      // 3. Debug rule checking
      const isBanned = debugRuleCheck(card); // Using debug version
      if (isBanned) {
        showBanned();
      } else {
        showLegal();
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "<span style='color:black'>API Error - Try Again</span>";
    }
  });

  // Debug rule checker
  function debugRuleCheck(card) {
    const reasons = [];
    
    if (isManaRock(card) && card.cmc < 3) 
      reasons.push(`Mana Rock (CMC ${card.cmc} < 3)`);
    
    if (isUnconditionalCounter(card) && card.cmc < 4) 
      reasons.push(`Counterspell (CMC ${card.cmc} < 4)`);
    
    if (isDamageSpell(card) && getMaxDamage(card) > card.cmc) 
      reasons.push(`Damage spell (${getMaxDamage(card)} > ${card.cmc})`);
    
    if (isMassBoardWipe(card) && card.cmc < 6) 
      reasons.push(`Board wipe (CMC ${card.cmc} < 6)`);
    
    if (isLandDestruction(card) && card.cmc < 4) 
      reasons.push(`Land destruction (CMC ${card.cmc} < 4)`);
    
    console.log(`Rule check for ${card.name}:`, reasons.length ? reasons : "LEGAL");
    return reasons.length > 0;
  }

  // SCRYFALL API CALL
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

  // ... [Keep all your existing helper functions exactly as they were] ...
  // isHardBanned(), isManaRock(), isUnconditionalCounter(), etc...
  // ... [All the way through showLegal()] ...
});
