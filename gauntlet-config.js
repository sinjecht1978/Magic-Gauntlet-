// ========== GAUNTLET CONFIGURATION - EDIT THIS FILE ONLY ==========
// This file contains ALL your ban lists, sets, and prize settings
// Edit this file, save it, and the main page will automatically use the new settings

const GAUNTLET_CONFIG = {
    version: "2026.06.02.1901",
    hardBannedCards: [
        "Sol Ring",
        "Lightning Bolt",
        "Mana Crypt",
        "The Book of Exalted Deeds",
        "Celestial Unicorn",
        "Dancing Sword",
        "Dawnbringer Cleric",
        "Dragon's Disciple",
        "Guardian of Faith",
        "Icingdeath, Frost Tyrant",
        "Ingenious Smith",
        "Teleportation Circle",
        "Loyal Warhound",
        "Minimus Containment",
        "Monk of the Open Hand",
        "Oswald Fiddlebender",
        "Portable Hole",
        "Mind Flayer",
        "The Blackstaff of Waterdeep",
        "Demilich",
        "Dragon Turtle",
        "Feywild Trickster",
        "Grazilaxx, Illithid Scholar",
        "Guild Thief",
        "Iymrith, Desert Doom",
        "Asmodeus the Archfiend",
        "Wizard's Spellbook",
        "You Come to a River",
        "Lightfoot Rogue",
        "The Book of Vile Darkness",
        "Check for Traps",
        "Death-Priest of Myrkul",
        "Demogorgon's Clutches",
        "Dungeon Crawler",
        "Ebondeath, Dracolich",
        "Forsworn Paladin",
        "Gelatinous Cube",
        "Grim Bounty",
        "Grim Wanderer",
        "Battle Cry Goblin",
        "Power Word Kill",
        "Sphere of Annihilation",
        "Vorpal Sword",
        "Westgate Regent",
        "Wight",
        "Minion of the Mighty",
        "Chaos Channeler",
        "Critical Hit",
        "Delina, Wild Mage",
        "Flameskull",
        "Goblin Javelineer",
        "Hobgoblin Bandit Lord",
        "Hobgoblin Captain",
        "Hulking Bugbear",
        "Inferno of the Star Mounts"
    ],
    bannedCardTypes: [
        "Planeswalker",
        "Dungeon",
        "Class",
        "Saga",
        "Scheme",
        "Conspiracy"
    ],
    bannedAbilities: [
        "slivers",
        "infect",
        "venture into the dungeon"
    ],
    forceLegalCards: [],
    forceBannedCards: [],
    legalSets: [
        "Adventures in the Forgotten Realms",
        "Aether Revolt",
        "Alliances",
        "Core Set 2020",
        "Core Set 2021",
        "Dominaria",
        "Fallen Empires",
        "Homelands",
        "Ice Age",
        "Ixalan",
        "Khans of Tarkir",
        "Modern Horizons 2",
        "Rivals of Ixalan",
        "The Dark",
        "The Lord of the Rings: Tales of Middle-earth",
        "Zendikar Rising"
    ],
    cashPrize: "50.00"
};

// Export for use in main file (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAUNTLET_CONFIG;
}
