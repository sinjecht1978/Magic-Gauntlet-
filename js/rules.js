// rules.js
const formatRules = {
  // A. Manual Bans (Specific Cards)
  bannedCards: [
    "Sol Ring",
    "Mana Crypt",
    "Dockside Extortionist"
    // Add more as needed
  ],

  // B. Banned Card Types
  bannedTypes: [
    // "Planeswalker", // Uncomment to ban all planeswalkers
    // "Saga"         // Uncomment to ban all sagas
  ],

  // C. Mechanics Restrictions
  mechanics: {
    unconditionalKill: { minCmc: 5 },
    unconditionalCounter: { minCmc: 4 },
    damageSpells: { maxDamageToCmc: 1 },
    manaRocks: { minCmc: 3, mustEnterTapped: true },
    landDestruction: { minCmc: 4 }
  },

  // D. NEW: Banned Abilities
  bannedAbilities: [
    "Storm",
    "Dredge",
    "Annihilator",
    "venture into the dungeon",
    "enter the dungeon"
    // Add more ability phrases (case-insensitive)
  ],

  // E. NEW: Banned Ability Combos
  bannedCombos: [
    {
      types: ["Creature"], // Required types
      abilities: ["Flying", "Haste"] // ALL listed abilities must be present
    }
    // Add more combos as needed
  ]
};
