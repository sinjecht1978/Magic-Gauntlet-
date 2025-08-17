// Format Rules Configuration (Edit This Only!)
const formatRules = {
  // 1. Manual Bans (Specific Cards)
  bannedCards: [
    "Sol Ring",
    "Mana Crypt",
    // ... add more as needed
  ],

  // 2. Card Type Bans (Entire Categories)
  bannedTypes: [
    "Planeswalker",
    // "Saga", "Tribal", etc.
  ],

  // 3. Mechanics Restrictions
  mechanics: {
    // Kill Spells
    unconditionalKill: { minCmc: 5 },
    // Counterspells
    unconditionalCounter: { minCmc: 4 },
    // Damage Spells
    damage: { maxDamageToCmcRatio: 1 }, // Damage <= CMC
    // Mana Rocks
    manaRocks: { minCmc: 3, mustEnterTapped: true },
    // Land Destruction
    landDestruction: { minCmc: 4 }
  },

  // 4. Whitelist (Overrides Bans)
  whitelist: [
    // "Tibalt, the Fiend-Blooded" // Example exception
  ]
};
