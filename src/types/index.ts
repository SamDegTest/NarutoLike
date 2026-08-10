export interface BaseStats {
  hp: number;
  chakra: number;
  attack: number;
  defense: number;
  speed: number;
}

export type CharacterVersion = "kid" | "shippuden" | "boruto" | "special";

export type NinjaRank = "S" | "A" | "B" | "C";

export type ChakraNature =
  | "Fire"      // Katon 🔥
  | "Water"     // Suiton 💧
  | "Wind"      // Fuuton 🌪️
  | "Lightning" // Raiton ⚡
  | "Earth"     // Doton 🪨
  | "Ice"       // Hyoton ❄️
  | "Taijutsu"  // Taijutsu 👊
  | "YinYang";  // Yin-Yang ☯️

export type NinjaClan = "Uchiha" | "Uzumaki" | "Hyuga" | "Hatake" | "Senju" | "Otsutsuki" | "Nara" | "Akimichi" | "Yamanaka" | "Kazekage" | "Aburame" | "Inuzuka" | "Other";
export type NinjaTeamGroup = "Team7" | "Team8" | "Team10" | "TeamGuy" | "Sannin" | "Akatsuki" | "SevenSwordsmen" | "Other";

export interface Ninja {
  id: string;             // Unique ID: e.g., "naruto_kid", "naruto_shippuden"
  characterId: string;    // Base character: e.g., "naruto"
  name: string;           // Display Name: e.g., "Naruto Uzumaki (Shippuden)"
  rank: NinjaRank;        // Rank / Rarity: "S" | "A" | "B" | "C"
  chakraNature: ChakraNature; // Primary Chakra Nature / Affinity
  version: CharacterVersion;
  baseStats: BaseStats;
  sprite: string;         // Relative path or filename: "/sprites/naruto_shippuden.png"
  activeJutsuId: string;  // Single active move (replaceable during run)
  jutsuList: string[];    // Ordered list of moves from weakest to strongest
  clan?: NinjaClan;
  teamGroup?: NinjaTeamGroup;
}

export interface RunNinja extends Ninja {
  level: number;
  currentHp: number;
  currentChakra: number;
}

export interface Jutsu {
  id: string;
  name: string;
  power: number;
  chakraCost: number;
  nature: "Katon" | "Suiton" | "Fuuton" | "Doton" | "Raiton" | "Taijutsu" | "Genjutsu" | "Iryo";
  sprite: string;         // Path to jutsu static sprite (e.g. "/sprites/jutsus/rasengan.png")
  description: string;
}

export type NodeType = "battle" | "powerup" | "heal" | "boss" | "recruit";

export interface MapNode {
  id: string;
  type: NodeType;
  label: string;
  stage: number;          // Column index (0, 1, 2, 3)
  connections: string[];  // Next node IDs that can be reached
  resolved: boolean;
  opponents?: string[];   // Opponent Ninja IDs (if battle/boss)
}

export interface PowerUpItem {
  id: string;
  name: string;
  description: string;
  statModifier?: {        // Optional stat boosts
    hpMax?: number;
    attack?: number;
    defense?: number;
    speed?: number;
  };
  learnJutsuId?: string;  // Optional new Jutsu Scroll reward
  isJutsuUpgrade?: boolean; // Generic upgrade action trigger
  usedOnNinjaId?: string;
  oldJutsuId?: string;
  newJutsuId?: string;
}
