import { GameItem } from "@/types";

/**
 * CATALOGO OGGETTI DI GIOCO (Consumabili & Assegnabili Leggendari)
 * Bilanciati con Rarità (S, A, B, C) e statistiche da Game Designer.
 */
export const GAME_ITEMS_CATALOG: GameItem[] = [
  // ==========================================
  // 1. OGGETTI CONSUMABILI (Tactical Consumables)
  // ==========================================
  {
    id: "secret_elixir",
    type: "consumable",
    rarity: "S",
    name: { it: "Elisir del Clan Senju", en: "Senju Clan Elixir" },
    description: {
      it: "• Cura 100% HP e 100% Chakra (tutta la squadra)\n• Rianima i ninja caduti al 50% HP",
      en: "• Heals 100% HP & 100% Chakra (all team)\n• Revives defeated ninjas to 50% HP",
    },
    iconEmoji: "🧪",
    healPercent: 100,
    healChakraPercent: 100,
  },
  {
    id: "forbidden_jutsu_scroll",
    type: "consumable",
    rarity: "S",
    name: { it: "Rotolo Proibito delle Tecniche Segrete", en: "Forbidden Jutsu Scroll" },
    description: {
      it: "• Evolve e potenzia 1 Jutsu a scelta di 1 ninja al livello successivo",
      en: "• Evolves 1 Jutsu of choice on 1 ninja to next tier",
    },
    iconEmoji: "📜",
    jutsuLevelUpgrade: true,
  },
  {
    id: "chakra_ointment",
    type: "consumable",
    rarity: "A",
    name: { it: "Unguento del Rospo Eremita", en: "Sage Toad Ointment" },
    description: {
      it: "• +60% Attacco a tutta la squadra (durata: 3 battaglie)",
      en: "• +60% Attack to all team (duration: 3 battles)",
    },
    iconEmoji: "🍶",
    teamBattleStatBoost: {
      attackMultiplier: 1.6,
    },
    durationFights: 3,
  },
  {
    id: "iron_shield_talisman",
    type: "consumable",
    rarity: "A",
    name: { it: "Talismano della Difesa d'Acciaio", en: "Iron Defense Talisman" },
    description: {
      it: "• +60% Difesa a tutta la squadra (durata: 3 battaglie)",
      en: "• +60% Defense to all team (duration: 3 battles)",
    },
    iconEmoji: "📜",
    teamBattleStatBoost: {
      defenseMultiplier: 1.6,
    },
    durationFights: 3,
  },
  {
    id: "speed_pill",
    type: "consumable",
    rarity: "A",
    name: { it: "Pillola del Lampo Giallo", en: "Yellow Flash Speed Pill" },
    description: {
      it: "• +60% Velocità a tutta la squadra (durata: 3 battaglie)",
      en: "• +60% Speed to all team (duration: 3 battles)",
    },
    iconEmoji: "⚡",
    teamBattleStatBoost: {
      speedMultiplier: 1.6,
    },
    durationFights: 3,
  },
  {
    id: "gold_cat_talisman",
    type: "consumable",
    rarity: "B",
    name: { it: "Maneki-Neko della Fortuna Dorata", en: "Golden Fortune Maneki-Neko" },
    description: {
      it: "• +150% Monete Ryo extra (durata: 5 battaglie)",
      en: "• +150% extra Ryo Coins (duration: 5 battles)",
    },
    iconEmoji: "🐱",
    coinMultiplierFights: 5,
  },
  {
    id: "war_tonic",
    type: "consumable",
    rarity: "C",
    name: { it: "Tonico da Guerra dei Saggi", en: "Sage War Tonic" },
    description: {
      it: "• Cura 75% HP (tutta la squadra)\n• Ripristina 75% Chakra (tutta la squadra)",
      en: "• Heals 75% HP (all team)\n• Restores 75% Chakra (all team)",
    },
    iconEmoji: "💊",
    healPercent: 75,
    healChakraPercent: 75,
  },

  // ==========================================
  // 2. OGGETTI ASSEGNABILI (Equipable Artifacts - 1 per ninja)
  // ==========================================
  {
    id: "hokage_necklace",
    type: "assignable",
    rarity: "S",
    name: { it: "Collana del Primo Hokage", en: "First Hokage's Necklace" },
    description: {
      it: "• +250 HP Max\n• +100 Chakra Max",
      en: "• +250 Max HP\n• +100 Max Chakra",
    },
    iconEmoji: "📿",
    equipStats: {
      hpMax: 250,
      chakraMax: 100,
    },
  },
  {
    id: "kusanagi_sword",
    type: "assignable",
    rarity: "S",
    name: { it: "Spada Kusanagi di Orochimaru", en: "Kusanagi Sword of Orochimaru" },
    description: {
      it: "• +65 Attacco\n• +30 Velocità\n• +40 Chakra Max",
      en: "• +65 Attack\n• +30 Speed\n• +40 Max Chakra",
    },
    iconEmoji: "🗡️",
    equipStats: {
      attack: 65,
      speed: 30,
      chakraMax: 40,
    },
  },
  {
    id: "yata_mirror",
    type: "assignable",
    rarity: "S",
    name: { it: "Scudo Spezzo-Illusioni di Yata", en: "Yata Mirror Shield" },
    description: {
      it: "• +60 Difesa\n• +150 HP Max",
      en: "• +60 Defense\n• +150 Max HP",
    },
    iconEmoji: "🛡️",
    equipStats: {
      defense: 60,
      hpMax: 150,
    },
  },
  {
    id: "weights_of_lee",
    type: "assignable",
    rarity: "A",
    name: { it: "Pesi da Caviglia di Rock Lee", en: "Rock Lee's Ankle Weights" },
    description: {
      it: "• +70 Velocità\n• +35 Attacco",
      en: "• +70 Speed\n• +35 Attack",
    },
    iconEmoji: "🏋️",
    equipStats: {
      speed: 70,
      attack: 35,
    },
  },
  {
    id: "choku_tomoe_amulet",
    type: "assignable",
    rarity: "A",
    name: { it: "Amuleto Mangekyō Sharingan", en: "Mangekyō Sharingan Amulet" },
    description: {
      it: "• +50 Attacco\n• +35 Velocità\n• +25 Difesa",
      en: "• +50 Attack\n• +35 Speed\n• +25 Defense",
    },
    iconEmoji: "👁️",
    equipStats: {
      attack: 50,
      speed: 35,
      defense: 25,
    },
  },
  {
    id: "chakra_blade",
    type: "assignable",
    rarity: "B",
    name: { it: "Lama di Chakra di Asuma", en: "Chakra Blade of Asuma" },
    description: {
      it: "• +55 Attacco\n• +60 Chakra Max",
      en: "• +55 Attack\n• +60 Max Chakra",
    },
    iconEmoji: "🗡️",
    equipStats: {
      attack: 55,
      chakraMax: 60,
    },
  },
  {
    id: "anbu_mask",
    type: "assignable",
    rarity: "B",
    name: { it: "Maschera della Volpe Anbu", en: "Fox Anbu Mask" },
    description: {
      it: "• +45 Velocità\n• +35 Difesa\n• +60 HP Max",
      en: "• +45 Speed\n• +35 Defense\n• +60 Max HP",
    },
    iconEmoji: "🎭",
    equipStats: {
      speed: 45,
      defense: 35,
      hpMax: 60,
    },
  },
  {
    id: "forehead_protector",
    type: "assignable",
    rarity: "C",
    name: { it: "Coprifronte della Foglia Rinforzato", en: "Reinforced Headband" },
    description: {
      it: "• +100 HP Max\n• +35 Difesa",
      en: "• +100 Max HP\n• +35 Defense",
    },
    iconEmoji: "🛡️",
    equipStats: {
      hpMax: 100,
      defense: 35,
    },
  },
];

/**
 * Estrae n oggetti casuali bilanciati (sia consumabili che assegnabili)
 * Pesa le probabilità in base alla rarità dell'oggetto:
 * C: 50% | B: 35% | A: 12% | S: 3%
 */
export function sampleRandomItems(count: number = 3): GameItem[] {
  const byRarity: Record<string, GameItem[]> = {
    C: GAME_ITEMS_CATALOG.filter((i) => i.rarity === "C"),
    B: GAME_ITEMS_CATALOG.filter((i) => i.rarity === "B"),
    A: GAME_ITEMS_CATALOG.filter((i) => i.rarity === "A"),
    S: GAME_ITEMS_CATALOG.filter((i) => i.rarity === "S"),
  };

  const sampleOneItem = (): GameItem => {
    const rand = Math.random() * 100;
    let rank = "C";
    if (rand < 3) rank = "S";
    else if (rand < 15) rank = "A";
    else if (rand < 50) rank = "B";

    const pool = byRarity[rank].length > 0 ? byRarity[rank] : GAME_ITEMS_CATALOG;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const items: GameItem[] = [];
  const usedIds = new Set<string>();

  let attempts = 0;
  while (items.length < count && attempts < 50) {
    attempts++;
    const candidate = sampleOneItem();
    if (!usedIds.has(candidate.id)) {
      usedIds.add(candidate.id);
      items.push(candidate);
    }
  }

  // Fallback if needed
  while (items.length < count) {
    const candidate = GAME_ITEMS_CATALOG[Math.floor(Math.random() * GAME_ITEMS_CATALOG.length)];
    items.push(candidate);
  }

  return items;
}
