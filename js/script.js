// WORKING CARD CHECKER - ONLY RETURNS "BANNED" OR "LEGAL"
document.addEventListener('DOMContentLoaded', function() {
    // Mobile debug console
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = function() { eruda.init(); };
    }

    const checkBtn = document.getElementById('check-button');
    const cardInput = document.getElementById('card-search');
    const resultDiv = document.getElementById('checker-result');

    // HARD BANNED CARDS (exact matches only)
    const HARD_BANNED = [
        "Sol Ring", "Mana Crypt", "Lightning Bolt", 
        "Counterspell", "Swords to Plowshares", "Demonic Tutor"
    ].map(c => c.toLowerCase());

    async function checkCard() {
        const cardName = cardInput.value.trim();
        resultDiv.textContent = "";
        
        if (!cardName) return;

        // 1. Check hard bans first (exact match only)
        const lowerCardName = cardName.toLowerCase();
        if (HARD_BANNED.some(banned => banned === lowerCardName)) {
            resultDiv.textContent = "BANNED";
            resultDiv.style.color = "red";
            return;
        }

        try {
            // Fetch card data from Scryfall
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            if (!response.ok) return;
            
            const card = await response.json();
            console.log("Card data:", card); // Debugging
            
            // Verify exact name match
            if (card.name.toLowerCase() !== lowerCardName) return;

            const text = (card.oracle_text || '').toLowerCase();
            const types = (card.type_line || '').toLowerCase();

            // 2. Check all ban rules
            const isBanned = (
                // Rule 1: Counterspells under 4CMC
                (/counter target spell/.test(text) && !/(if|unless|when)/.test(text) && card.cmc < 4) ||
                
                // Rule 2: Damage spells where damage > CMC
                (() => {
                    const damageMatch = text.match(/deal(?:s)? (\d+) damage/);
                    return damageMatch && parseInt(damageMatch[1]) > card.cmc;
                })() ||
                
                // Rule 3: Mass destruction under 6CMC
                ((types.includes("sorcery") || types.includes("instant")) && 
                 /(destroy|exile) all/.test(text) && !/damage/.test(text) && card.cmc < 6) ||
                
                // Rule 4: Land destruction under 4CMC
                (/destroy target land/.test(text) && card.cmc < 4) ||
                
                // Rule 5: Mana rocks (2CMC must ETB tapped, 3CMC+ allowed)
                (types.includes("artifact") && /add[s]? \{.+\}/.test(text) && 
                 (card.cmc < 2 || (card.cmc < 3 && !/enters (the )?battlefield tapped/.test(text)))
            );

            // Show final result
            resultDiv.textContent = isBanned ? "BANNED" : "LEGAL";
            resultDiv.style.color = isBanned ? "red" : "green";

        } catch (error) {
            console.error("Error checking card:", error);
        }
    }

    // Event listeners
    checkBtn.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkCard();
    });
});
