// HARD BANNED LIST (included directly in checker)
const HARD_BANNED = [
    "sol ring", 
    "mana crypt", 
    "lightning bolt",
    "counterspell",
    "swords to plowshares",
    "demonic tutor"
];

document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-button');
    const cardInput = document.getElementById('card-search');
    const resultDiv = document.getElementById('checker-result');

    function checkCard() {
        const cardName = cardInput.value.trim().toLowerCase();
        resultDiv.textContent = "";
        
        if (!cardName) {
            resultDiv.textContent = "Please enter a card name";
            return;
        }

        // Check hard bans
        if (HARD_BANNED.includes(cardName)) {
            resultDiv.textContent = "BANNED";
            resultDiv.style.color = "red";
            return;
        }

        // Default to legal
        resultDiv.textContent = "LEGAL";
        resultDiv.style.color = "green";
    }

    // Event listeners
    checkBtn.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkCard();
    });
});
