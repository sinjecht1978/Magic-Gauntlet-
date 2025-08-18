// rules.js - External Rules Configuration
export const formatRules = {
  // 1. Hard banned cards
  bannedCards: [
    "Sol Ring", 
    "Mana Crypt",
    "Lightning Bolt",
    "Counterspell"
  ],

  // 2. Banned types
  bannedTypes: [
    "Planeswalker",
    "Saga"
  ],

  // 3. Banned abilities
  bannedAbilities: [
    "Storm",
    "Dredge", 
    "Annihilator",
    "Partner"
  ],

  // 4. Mechanic restrictions
  mechanics: {
    counterspells: { minCmc: 4 },
    boardWipes: { minCmc: 6 },
    landDestruction: { minCmc: 4 },
    manaRocks: { 
      minCmc: 3,
      mustEnterTapped: true
    },
    damageSpells: {
      maxDamageVsCmc: true  // Damage must be ≤ CMC
    }
  }
};
