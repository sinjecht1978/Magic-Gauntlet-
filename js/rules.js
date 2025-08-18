// rules.js
export const formatRules = {
  bannedCards: ["Sol Ring", "Mana Crypt", "Lightning Bolt", "Counterspell"],
  
  bannedTypes: ["Planeswalker", "Saga"],
  
  bannedAbilities: ["Storm", "Dredge", "Annihilator", "Partner"],
  
  mechanics: {
    counterspells: { minCmc: 4 },
    boardWipes: { minCmc: 6 },
    landDestruction: { minCmc: 4 },
    manaRocks: { 
      minCmc: 3,
      mustEnterTapped: true
    },
    damageSpells: {
      maxDamageVsCmc: true
    }
  }
};  }
};
