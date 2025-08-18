
document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-button');
    const cardInput = document.getElementById('card-search');
    const resultDiv = document.getElementById('checker-result');

    // Hard banned cards (same as in banned.html)
    const HARD_BANNED = [
        "Sol Ring", "Mana Crypt", "Lightning Bolt",
        "Counterspell", "Swords to Plowshares", "Demonic Tutor"
    ].map(c => c.toLowerCase());

    function checkCard() {
        const cardName = cardInput.value.trim();
        resultDiv.textContent = "";
        
        if (!cardName) return;

        // Check hard bans (exact match only)
        if (HARD_BANNED.includes(cardName.toLowerCase())) {
            resultDiv.textContent = "BANNED";
            resultDiv.style.color = "red";
            return;
        }

        // For now just show legal - we'll add more rules later
        resultDiv.textContent = "LEGAL";
        resultDiv.style.color = "green";
    }

    // Event listeners
    checkBtn.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkCard();
    });
});
