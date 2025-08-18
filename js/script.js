// SIMPLIFIED BUT EFFECTIVE CARD CHECKER

// 1. Hard Banned Cards (EXACT matches only)
const HARD_BANNED = [
    "Sol Ring", 
    "Mana Crypt", 
    "Lightning Bolt", 
    "Counterspell",
    "Swords to Plowshares",
    "Demonic Tutor"
];

// 2. Card Checker Function
async function checkCardLegality() {
    const cardName = document.getElementById('card-search').value.trim();
    const resultDiv = document.getElementById('checker-result');
    
    // Clear previous result
    resultDiv.innerHTML = '';
    resultDiv.style.color = 'black';
    
    if (!cardName) {
        resultDiv.innerHTML = 'Please enter a card name';
        return;
    }

    // First check hard bans (exact match only)
    if (HARD_BANNED.some(banned => banned.toLowerCase() === cardName.toLowerCase())) {
        resultDiv.innerHTML = 'BANNED (Hard Ban)';
        resultDiv.style.color = 'red';
        return;
    }

    try {
        // Fetch from Scryfall
        const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
        const card = await response.json();
        
        // Verify we got the exact card
        if (card.name.toLowerCase() !== cardName.toLowerCase()) {
            resultDiv.innerHTML = `Did you mean: <strong>${card.name}</strong>?`;
            return;
        }

        // Now check blanket rules
        let isBanned = false;
        let reason = '';
        
        // Rule 1: Cheap mana rocks (CMC < 3)
        if (card.type_line.includes('Artifact') && 
            /add[s]? \{.+\}/i.test(card.oracle_text) && 
            card.cmc < 3) {
            isBanned = true;
            reason = 'Mana Rock (CMC < 3)';
        }
        
        // Rule 2: Efficient counters (CMC < 4)
        else if (/counter target spell/i.test(card.oracle_text) && 
                !/(if|unless|when)/i.test(card.oracle_text) && 
                card.cmc < 4) {
            isBanned = true;
            reason = 'Counterpell (CMC < 4)';
        }
        
        // Rule 3: Overpowered damage (Damage > CMC)
        else if (/deal(?:s)? (\d+) damage/i.test(card.oracle_text)) {
            const damage = parseInt(card.oracle_text.match(/deal(?:s)? (\d+) damage/i)[1]);
            if (damage > card.cmc) {
                isBanned = true;
                reason = `Damage (${damage} > CMC ${card.cmc})`;
            }
        }

        // Display result
        if (isBanned) {
            resultDiv.innerHTML = `BANNED (${reason})`;
            resultDiv.style.color = 'red';
        } else {
            resultDiv.innerHTML = 'LEGAL';
            resultDiv.style.color = 'green';
        }

    } catch (error) {
        resultDiv.innerHTML = 'Card not found or error occurred';
        console.error('Error:', error);
    }
}

// 3. Setup Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-button') || document.getElementById('check-btn');
    const cardInput = document.getElementById('card-search');
    
    if (checkBtn) checkBtn.addEventListener('click', checkCardLegality);
    if (cardInput) {
        cardInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkCardLegality();
        });
    }
});
