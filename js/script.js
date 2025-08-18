// main.js - Now with rules.js integration
import { formatRules } from './rules.js';

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

    try {
      const card = await fetchCard(cardName);
      if (!card || card.object === 'error') {
        resultDiv.innerHTML = "<span style='color:black'>Card not found</span>";
        return;
      }

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

  // Rule checking functions now use formatRules
  function isBannedByRules(card) {
    // 1. Check hard banned cards
    if (formatRules.bannedCards.some(banned => 
      card.name.toLowerCase().includes(banned.toLowerCase())
    )) return true;

    // 2. Check banned types
    if (formatRules.bannedTypes.some(type => 
      card.type_line.includes(type)
    )) return true;

    // 3. Check banned abilities
    if (formatRules.bannedAbilities.some(ability => 
      card.oracle_text.includes(ability)
    )) return true;

    // 4. Check mechanical restrictions
    if (isUnconditionalCounter(card) && card.cmc < formatRules.mechanics.counterspells.minCmc) 
      return true;
    
    if (isMassBoardWipe(card) && card.cmc < formatRules.mechanics.boardWipes.minCmc) 
      return true;
    
    if (isLandDestruction(card) && card.cmc < formatRules.mechanics.landDestruction.minCmc) 
      return true;
    
    if (isManaRock(card) && (
      card.cmc < formatRules.mechanics.manaRocks.minCmc ||
      (formatRules.mechanics.manaRocks.mustEnterTapped && !entersTapped(card))
    )) return true;
    
    if (isDamageSpell(card) && 
       formatRules.mechanics.damageSpells.maxDamageVsCmc && 
       getMaxDamage(card) > card.cmc) 
      return true;

    return false;
  }

  // ... (keep all your existing helper functions unchanged)
});

// ... (keep fetchCard and other utilities)
