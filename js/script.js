// FINAL SIMPLIFIED CARD CHECKER
document.addEventListener('DOMContentLoaded', function() {
    // Mobile debug console
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = () => eruda.init();
    }

    const checkBtn = document.getElementById('check-button');
    const cardInput = document.getElementById('card-search');
    const resultDiv = document.getElementById('checker-result');

    // HARD BANS (exact matches only)
    const HARD_BANNED = [
        "Sol Ring", "Mana Crypt", "Lightning Bolt", 
        "Counterspell", "Swords to Plowshares", "Demonic Tutor"
    ].map(c => c.toLowerCase());

    async function checkCard() {
        const cardName = cardInput.value.trim();
        resultDiv.textContent = "";
        
        if (!cardName) return;

        // 1. Check hard bans
        if (HARD_BANNED.includes(cardName.toLowerCase())) {
            resultDiv.textContent = "BANNED";
            resultDiv.style.color = "red";
            return;
        }

        try {
            // Fetch card data
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            if (!response.ok) return;
            
            const card = await response.json();
            if (card.name.toLowerCase() !== cardName.toLowerCase()) return;

            const text = card.oracle_text?.toLowerCase() || '';
            const types = card.type_line?.toLowerCase() || '';

            // 2. Check blanket ban rules
            const isBanned = 
                // All counterspells under 4CMC
                (/counter target spell/.test(text) && !/(if|unless|when)/.test(text) && card.cmc < 4) ||
                
                // Damage spells where damage > CMC
                (/deal(?:s)? (\d+) damage/.test(text) && 
                 parseInt(text.match(/deal(?:s)? (\d+) damage/)[1]) > card.cmc) ||
                
                // Mass destruction under 6CMC
                ((types.includes("sorcery") || types.includes("instant")) && 
                 /(destroy|exile) all/.test(text) && !/damage/.test(text) && card.cmc < 6) ||
                
                // Land destruction under 4CMC
                (/destroy target land/.test(text) && card.cmc < 4) ||
                
                // Mana rocks (2CMC must ETB tapped)
                (types.includes("artifact") && /add[s]? \{.+\}/.test(text) && 
                 (card.cmc < 2 || (card.cmc < 3 && !/enters (the )?battlefield tapped/.test(text)));

            // Show result
            resultDiv.textContent = isBanned ? "BANNED" : "LEGAL";
            resultDiv.style.color = isBanned ? "red" : "green";

        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Event listeners
    checkBtn.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkCard());
});
