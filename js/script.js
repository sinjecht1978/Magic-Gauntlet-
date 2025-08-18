// FINAL PERFECTED CARD CHECKER - ALL RULES EXACTLY AS YOU WANT
document.addEventListener('DOMContentLoaded', function() {
    // Mobile debug console
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        document.body.appendChild(script);
        script.onload = () => eruda.init();
        console.log("Mobile debug console enabled");
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
        resultDiv.textContent = "Checking...";
        resultDiv.style.color = "black";

        if (!cardName) {
            resultDiv.textContent = "Please enter a card name";
            return;
        }

        // 1. Check hard bans first
        if (HARD_BANNED.includes(cardName.toLowerCase())) {
            resultDiv.textContent = "BANNED (Hard Ban)";
            resultDiv.style.color = "red";
            return;
        }

        try {
            // Fetch card data from Scryfall
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            if (!response.ok) throw new Error("Card not found");
            
            const card = await response.json();
            console.log("CARD DATA:", card); // Debug log

            // Verify exact name match
            if (card.name.toLowerCase() !== cardName.toLowerCase()) {
                resultDiv.textContent = `Did you mean: ${card.name}?`;
                return;
            }

            // 2. Check blanket ban rules
            let isBanned = false;
            let reason = "";
            const text = card.oracle_text?.toLowerCase() || '';
            const types = card.type_line?.toLowerCase() || '';

            // RULE 1: All counterspells under 4CMC banned (including Cancel)
            if (/counter target spell/.test(text) && !/(if|unless|when)/.test(text)) {
                if (card.cmc < 4) {
                    isBanned = true;
                    reason = `Counterspell (${card.cmc}CMC)`;
                }
            }

            // RULE 2: Damage spells where damage > CMC (Shock banned: 2 damage for 1 mana)
            else if (/deal(?:s)? (\d+) damage/.test(text)) {
                const damage = parseInt(text.match(/deal(?:s)? (\d+) damage/)[1]);
                if (damage > card.cmc) {
                    isBanned = true;
                    reason = `Damage (${damage} for ${card.cmc} mana)`;
                }
            }

            // RULE 3: Mass destruction under 6CMC (all non-damage wipes)
            else if ((types.includes("sorcery") || types.includes("instant")) && 
                    /(destroy|exile) all/.test(text) && 
                    !/damage/.test(text)) {
                if (card.cmc < 6) {
                    isBanned = true;
                    reason = `Mass Destruction (${card.cmc}CMC)`;
                }
            }

            // RULE 4: Land destruction under 4CMC
            else if (/destroy target land/.test(text) && card.cmc < 4) {
                isBanned = true;
                reason = `Land Destruction (${card.cmc}CMC)`;
            }

            // RULE 5: Mana rocks (2CMC must ETB tapped, 3CMC+ allowed)
            else if (types.includes("artifact") && /add[s]? \{.+\}/.test(text)) {
                const comesTapped = /enters (the )?battlefield tapped/.test(text);
                if (card.cmc < 2 || (card.cmc < 3 && !comesTapped)) {
                    isBanned = true;
                    reason = `Mana Rock (${card.cmc}CMC${comesTapped ? ' ETB tapped' : ''})`;
                }
            }

            // Show final result
            resultDiv.textContent = isBanned ? `BANNED (${reason})` : "LEGAL";
            resultDiv.style.color = isBanned ? "red" : "green";

        } catch (error) {
            resultDiv.textContent = "Error: Card not found";
            console.error("Error:", error);
        }
    }

    // Event listeners
    checkBtn.addEventListener('click', checkCard);
    cardInput.addEventListener('keypress', (e) => e.key === 'Enter' && checkCard());
});
