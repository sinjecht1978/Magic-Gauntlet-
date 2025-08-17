// rules.js
conconst formatRules = {
  // 1. Specific Card Bans
  bannedCards: [
    "Sol Ring", 
    "Lightning Bolt",
    "Counterspell"
  ],

  // 2. Type Bans (whole categories)
  bannedTypes: [
    "Planeswalker", // All planeswalkers
    "Saga"          // All sagas
  ],

  // 3. Ability Bans
  bannedAbilities: [
    "Storm",
    "Dredge",
    "Annihilator",
    "Partner"
  ],

  // 4. Mechanic Restrictions
  mechanics: {
    counterspells: { minCmc: 4 },
    boardWipes: { minCmc: 6 }
    // ... other mechanical rules
  }
}
