// SIMPLE, RELIABLE CARD CHECKER
document.addEventListener('DOMContentLoaded', function() {
    // Debug check
    console.log("Checker initialized");
    
    const checkButton = document.getElementById('check-button');
    const cardInput = document.getElementById('card-search');
    const resultDiv = document.getElementById('checker-result');

    if (!checkButton || !cardInput || !resultDiv) {
        console.error("Missing required elements!");
        return;
    }

    // Hard banned cards (exact matches only)
    const HARD_BANNED = [
        "Sol Ring", 
        "Mana Crypt", 
        "Lightning Bolt", 
        "Counterspell",
        "Swords to Plowshares",
        "Demonic Tutor"
    ].map(c => c.toLowerCase());

    // Check card function
    async function checkCard() {
        const cardName = cardInput.value.trim();
        resultDiv.textContent = "Checking...";
        resultDiv.style.color = "black";

        if (!cardName) {
            resultDiv.textContent = "Please enter a card name";
            return;
        }

        // First check hard bans
        if (HARD_BANNED.includes(cardName.toLowerCase())) {
            resultDiv.textContent = "BANNED (Hard Ban)";
            resultDiv.style.color = "red";
            return;
        }

        try {
            // Fetch card data
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            if (!response.ok) throw new Error("Card not found");
            
            const card = await response.json();
            console.log("Card data:", card); // Debug log

            // Verify exact name match
            if (card.name.toLowerCase() !== cardName.toLowerCase()) {
                resultDiv.textContent = `Did you mean: ${card.name}?`;
                return;
            }

            // Check blanket ban rules
            let isBanned = false;
            const text = card.oracle_text?.toLowerCase() || '';

            // Rule 1: Cheap mana rocks
            if (card.type_line?.includes("Artifact") && 
                /add[s]? \{.+\}/.test(text) && 
                card.cmc < 3) {
                isBanned = true;
            }
            // Rule 2: Efficient counters
            else if (/counter target spell/.test(text) && 
                    !/(if|unless|when)/.test(text) && 
                    card.cmc < 4) {
                isBanned = true;
            }
            // Rule 3: Overpowered damage
            else if (/deal(?:s)? (\d+) damage/.test(text)) {
                const damage = parseInt(text.match(/deal(?:s)? (\d+) damage/)[1]);
                if (damage > card.cmc) isBanned = true;
            }

            // Show result
            resultDiv.textContent = isBanned ? "BANNED" : "LEGAL";
            resultDiv.style.color = isBanned ? "red" : "green";

        } catch (error) {
            console.error("Error:", error);
            resultDiv.textContent = "Error: " + (error.message || "Card not found");
        }
    }

    // Event listeners
    checkButton.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkCard();
    });
});
