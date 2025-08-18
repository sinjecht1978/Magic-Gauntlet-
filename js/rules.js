// rules.js - Complete Rule Configuration
export const formatRules = {
  // 1. Hard banned cards
  bannedCards: ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"],

  // 2. Banned types and subtypes
  bannedTypes: ["Planeswalker", "Battle"],
  bannedSubtypes: ["Rat", "Spider"], // Example: ban specific creature types

  // 3. Banned abilities
  bannedAbilities: ["Storm", "Dredge", "Annihilator", "Partner"],

  // 4. Mechanic restrictions
  mechanics: {
    counterspells: { minCmc: 4 },
    boardWipes: { minCmc: 6 },
    landDestruction: { minCmc: 4 },
    manaRocks: { 
      minCmc: 3,
      mustEnterTapped: true,
      maxManaProduced: 1
    },
    damageSpells: {
      maxDamageVsCmc: true,
      burnLimit: 3 // Max damage to players
    },
    creatures: {
      maxPower: 5, // For non-legendary
      maxToughness: 6
    }
  }
};
