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

export interface Jutsu {
  id: string;
  name: string;
  power: number;
  chakraCost: number;
  nature: "Katon" | "Suiton" | "Fuuton" | "Doton" | "Raiton" | "Taijutsu" | "Genjutsu" | "Iryo";
  sprite: string;         // Path to jutsu static sprite (e.g. "/sprites/jutsus/rasengan.png")
  description: string;
}

export type NodeType = "battle" | "powerup" | "item" | "heal" | "boss" | "recruit";

export interface MapNode {
  id: string;
  type: NodeType;
  label: string;
  stage: number;          // Column index (0, 1, 2, 3)
  connections: string[];  // Next node IDs that can be reached
  resolved: boolean;
  opponents?: string[];   // Opponent Ninja IDs (if battle/boss)
}

export type ItemType = "consumable" | "assignable";

export interface GameItem {
  id: string;             // Item ID e nome immagine /items/${id}.png
  type: ItemType;
  name: { it: string; en: string };
  description: { it: string; en: string };
  iconEmoji: string;      // Emoji fallback se /items/${id}.png manca
  // Effetti consumabili
  healPercent?: number;              // es. Curare 50% o 100% HP
  healChakraPercent?: number;        // es. Curare 50% o 100% Chakra
  singleNinjaBattleStatBoost?: {     // Boost per 1 lotta a 1 ninja
    attackMultiplier?: number;
    defenseMultiplier?: number;
    speedMultiplier?: number;
  };
  teamBattleStatBoost?: {            // Boost per 1 lotta a tutta la squadra
    attackMultiplier?: number;
    defenseMultiplier?: number;
    speedMultiplier?: number;
  };
  coinMultiplierFights?: number;     // Aumento monete guadagnate per X combattimenti
  luckRarityBoostFights?: number;    // Aumento fortuna (trovare ninja di rank alto) per X combattimenti
  jutsuLevelUpgrade?: boolean;       // Permette di evolvere 1 mossa ninja (Rotolo Proibito)
  
  // Effetti assegnabili (1 per ninja)
  equipStats?: {
    hpMax?: number;
    chakraMax?: number;
    attack?: number;
    defense?: number;
    speed?: number;
  };
}

export interface InventoryItem {
  item: GameItem;
  quantity: number; // Per i consumabili cumulabili
}

export interface RunNinja extends Ninja {
  level: number;
  currentHp: number;
  currentChakra: number;
  equippedItem?: GameItem | null;
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
