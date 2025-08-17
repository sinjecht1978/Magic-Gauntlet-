// //// New system coexists with old one
document.getElementById("advanced-check-button").addEventListener("click", async function() {
  const cardName = document.getElementById("card-search").value.trim();
  const resultDiv = document.getElementById("advanced-result");
  
  if (!cardName) {
    resultDiv.textContent = "Enter a card name";
    return;
  }

  try {
    // Reuse your existing fetch function
    const card = await fetchCard(cardName); 
    
    // Check both systems
    const isHardBanned = bannedList.includes(card.name); // Old system
    const isRuleViolation = !evaluateCard(card); // New system
    
    if (isHardBanned) {
      resultDiv.innerHTML = `<span style="color:red">BANNED (Hard List)</span>`;
    } else if (isRuleViolation) {
      resultDiv.innerHTML = `
        <span style="color:orange">BANNED (Rules)</span>
        <div>${getViolationReasons(card)}</div>
      `;
    } else {
      resultDiv.innerHTML = `<span style="color:green">LEGAL</span>`;
    }
  } catch (error) {
    resultDiv.textContent = "Error checking card";
  }
});

// Helper to explain bans
function getViolationReasons(card) {
  const reasons = [];
  if (card.cmc < 3 && isManaRock(card)) reasons.push("Mana rocks must cost 3+");
  // Add other rule checks...
  return reasons.join(", ");
}
});

// Keep all other existing functions below this point
// (fetchCard, evaluateCard, isManaRock, etc.)
