// ======================
// 1. RULES CONFIGURATION
// ======================
const formatRules = {
  bannedCards: [
    "Sol Ring",
    "Mana Crypt",
    "Dockside Extortionist"
  ],
  bannedTypes: [],
  bannedAbilities: [
    "Storm",
    "Dredge",
    "Annihilator"
  ],
  mechanics: {
    unconditionalKill: { minCmc: 5 },
    unconditionalCounter: { minCmc: 4 },
    damageSpells: { maxDamageToCmc: 1 },
    manaRocks: { minCmc: 3, mustEnterTapped: true },
    landDestruction: { minCmc: 4 }
  }
};

// ======================
// 2. CORE FUNCTIONALITY
// ======================
const cardCache = {};

// Initialize only when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  const cardSearch = document.getElementById('card-search');
  const resultBox = document.getElementById('result');

  // Check if elements exist before adding listeners
  if (searchButton && cardSearch && resultBox) {
    searchButton.addEventListener('click', checkLegality);
    cardSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkLegality();
    });
  } else {
    console.error("Required elements not found in DOM");
  }

  if (window.location.pathname.includes('playlist.html')) {
    loadAllSets();
  }
});

async function checkLegality() {
  alert("Testing API..."); // Moved alert here where it makes sense
  
  const cardName = document.getElementById('card-search')?.value.trim();
  const resultBox = document.getElementById('result');
  
  if (!cardName || !resultBox) {
    console.error("Missing required elements");
    return;
  }

  if (!cardName) {
    resultBox.textContent = "Please enter a card name";
    resultBox.className = "result-box";
    return;
  }

  try {
    const card = await fetchCard(cardName);
    if (!card) {
      resultBox.textContent = "Card not found";
      resultBox.className = "result-box";
      return;
    }
    
    const isLegal = evaluateCard(card);
    resultBox.textContent = `${card.name} is ${isLegal ? 'LEGAL' : 'BANNED'}`;
    resultBox.className = `result-box ${isLegal ? 'legal' : 'banned'}`;
    
  } catch (error) {
    console.error("Error checking card:", error);
    if (resultBox) {
      resultBox.textContent = "Error checking card";
      resultBox.className = "result-box";
    }
  }
}

async function fetchCard(cardName) {
  try {
    if (cardCache[cardName.toLowerCase()]) {
      return cardCache[cardName.toLowerCase()];
    }

    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`, {
      headers: {
        'User-Agent': 'MagicGauntlet/1.0',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const card = await response.json();
    
    // Cache the card data
    cardCache[cardName.toLowerCase()] = {
      name: card.name,
      cmc: card.cmc,
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      image_uris: card.image_uris,
      legalities: card.legalities,
      keywords: card.keywords || []
    };
    
    return cardCache[cardName.toLowerCase()];
    
  } catch (error) {
    console.error("Failed to fetch card:", error);
    return null;
  }
}

// ... (rest of your helper functions remain the same) ...
// ======================
// 2. CORE FUNCTIONALITY (Don't edit below unless adding new rules)
// ======================
const cardCache = {};
const searchButton = document.getElementById('search-button');
const cardSearch = document.getElementById('card-search');
const resultBox = document.getElementById('result');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  searchButton.addEventListener('click', checkLegality);
  cardSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLegality();
  });
  if (window.location.pathname.includes('playlist.html')) loadAllSets();
});

async function checkLegality() {
  const cardName = cardSearch.value.trim();
  if (!cardName) {
    resultBox.textContent = "Please enter a card name";
    resultBox.className = "result-box";
    return;
  }

  try {
    const card = await fetchCard(cardName);
    if (!card) {
      resultBox.textContent = "Card not found";
      resultBox.className = "result-box";
      return;
    }
    const isLegal = evaluateCard(card);
    resultBox.textContent = `${card.name} is ${isLegal ? 'LEGAL' : 'BANNED'}`;
    resultBox.className = `result-box ${isLegal ? 'legal' : 'banned'}`;
  } catch (error) {
    resultBox.textContent = "Error checking card";
    resultBox.className = "result-box";
    console.error("Error:", error);
  }
}

async function fetchCard(cardName) {
  try {
    if (cardCache[cardName.toLowerCase()]) {
      return cardCache[cardName.toLowerCase()];
    }
    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`, {
  headers: {
    'User-Agent': 'MagicGauntlet/1.0',
    'Accept': 'application/json'
  }
});
    // Cache the card data
    cardCache[cardName.toLowerCase()] = {
      name: card.name,
      cmc: card.cmc,
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      image_uris: card.image_uris,
      legalities: card.legalities,
      keywords: card.keywords || []
    };
    
    return cardCache[cardName.toLowerCase()];
  } catch (error) {
    console.error("Failed to fetch card:", error);
    return null;
  }
}

function evaluateCard(card) {
  if (!card) return false;
  
  // 1. Check against banned cards list
  if (formatRules.bannedCards.includes(card.name)) return false;

  // 2. Check against banned types
  if (formatRules.bannedTypes.some(type => card.type_line?.includes(type))) return false;

  // 3. Check banned abilities
  if (hasBannedAbility(card)) return false;

  // 4. Check mechanical restrictions
  if (isUnconditionalKillSpell(card) && card.cmc < formatRules.mechanics.unconditionalKill.minCmc) return false;
  if (isUnconditionalCounter(card) && card.cmc < formatRules.mechanics.unconditionalCounter.minCmc) return false;
  if (isDamageSpell(card) && getMaxDamage(card) > card.cmc * formatRules.mechanics.damageSpells.maxDamageToCmc) return false;
  if (isManaRock(card) && (card.cmc < formatRules.mechanics.manaRocks.minCmc || 
     (formatRules.mechanics.manaRocks.mustEnterTapped && !entersTapped(card)))) return false;
  if (isLandDestruction(card) && card.cmc < formatRules.mechanics.landDestruction.minCmc) return false;

  return true;
}

// ======================
// 3. HELPER FUNCTIONS
// ======================
function hasBannedAbility(card) {
  return formatRules.bannedAbilities.some(ability => 
    card.keywords?.includes(ability) || 
    card.oracle_text?.toLowerCase().includes(ability.toLowerCase())
  );
}

function isUnconditionalKillSpell(card) {
  return (/destroy target (creature|permanent)/i.test(card.oracle_text) ||
          /exile target (creature|permanent)/i.test(card.oracle_text)) &&
         !/(if|unless|when)/i.test(card.oracle_text);
}

function isUnconditionalCounter(card) {
  return /counter target (spell|ability)/i.test(card.oracle_text) &&
         !/(if|unless|when)/i.test(card.oracle_text);
}

function isDamageSpell(card) {
  return /deal(?:s)? \d+ damage/i.test(card.oracle_text);
}

function getMaxDamage(card) {
  const match = card.oracle_text.match(/deal(?:s)? (\d+) damage/i);
  return match ? parseInt(match[1]) : 0;
}

function isManaRock(card) {
  return card.type_line?.includes("Artifact") && 
         /add[s]? \{.+\}/i.test(card.oracle_text);
}

function entersTapped(card) {
  return /enters the battlefield tapped/i.test(card.oracle_text);
}

function isLandDestruction(card) {
  return /destroy target land|sacrifice a land/i.test(card.oracle_text);
}

// ======================
// 4. SET BROWSER FUNCTIONS
// ======================
async function loadAllSets() {
  try {
    const response = await fetch('https://api.scryfall.com/sets');
    const data = await response.json();
    displaySets(data.data);
  } catch (error) {
    console.error("Error loading sets:", error);
  }
}

// ... (keep all your existing set browser functions as-is) ...
