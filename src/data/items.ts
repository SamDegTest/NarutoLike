import { GameItem } from "@/types";

/**
 * CATALOGO OGGETTI DI GIOCO (Consumabili & Assegnabili)
 * Ogni oggetto ha un ID univoco. Le immagini corrispondenti sono in `/items/${id}.png`
 */
export const GAME_ITEMS_CATALOG: GameItem[] = [
  // ==========================================
  // 1. OGGETTI CONSUMABILI (Consumabili)
  // ==========================================
  {
    id: "war_tonic",
    type: "consumable",
    name: { it: "Tonico da Guerra", en: "War Tonic" },
    description: {
      it: "• +50% HP (tutta la squadra)\n• +50% Chakra (tutta la squadra)",
      en: "• +50% HP (all team)\n• +50% Chakra (all team)",
    },
    iconEmoji: "💊",
    healPercent: 50,
    healChakraPercent: 50,
  },
  {
    id: "secret_elixir",
    type: "consumable",
    name: { it: "Elisir del Clan Senju", en: "Senju Clan Elixir" },
    description: {
      it: "• +100% HP (tutta la squadra)\n• +100% Chakra (tutta la squadra)",
      en: "• +100% HP (all team)\n• +100% Chakra (all team)",
    },
    iconEmoji: "🧪",
    healPercent: 100,
    healChakraPercent: 100,
  },
  {
    id: "chakra_ointment",
    type: "consumable",
    name: { it: "Unguento del Rospo Eremita", en: "Sage Toad Ointment" },
    description: {
      it: "• +30% Attacco (tutta la squadra per 1 battaglia)",
      en: "• +30% Attack (all team for 1 battle)",
    },
    iconEmoji: "🍶",
    teamBattleStatBoost: {
      attackMultiplier: 1.3,
    },
  },
  {
    id: "iron_shield_talisman",
    type: "consumable",
    name: { it: "Talismano della Difesa d'Acciaio", en: "Iron Defense Talisman" },
    description: {
      it: "• +40% Difesa (tutta la squadra per 1 battaglia)",
      en: "• +40% Defense (all team for 1 battle)",
    },
    iconEmoji: "📜",
    teamBattleStatBoost: {
      defenseMultiplier: 1.4,
    },
  },
  {
    id: "gold_cat_talisman",
    type: "consumable",
    name: { it: "Gatto della Fortuna (Maneki-Neko Ryo)", en: "Lucky Fortune Cat (Maneki-Neko)" },
    description: {
      it: "• +100% Monete Ryo (nelle prossime 3 battaglie)",
      en: "• +100% Ryo Coins (for next 3 battles)",
    },
    iconEmoji: "🐱",
    coinMultiplierFights: 3,
  },
  {
    id: "forbidden_jutsu_scroll",
    type: "consumable",
    name: { it: "Rotolo Proibito delle Tecniche", en: "Forbidden Jutsu Scroll" },
    description: {
      it: "• EVOLVE 1 Jutsu a scelta di 1 ninja",
      en: "• EVOLVES 1 Jutsu of choice on 1 ninja",
    },
    iconEmoji: "📜",
    jutsuLevelUpgrade: true,
  },

  // ==========================================
  // 2. OGGETTI ASSEGNABILI (Equipaggiabili - 1 per ninja)
  // ==========================================
  {
    id: "forehead_protector",
    type: "assignable",
    name: { it: "Coprifronte della Foglia Rinforzato", en: "Reinforced Headband" },
    description: {
      it: "• +50 HP Max\n• +15 Difesa",
      en: "• +50 Max HP\n• +15 Defense",
    },
    iconEmoji: "🛡️",
    equipStats: {
      defense: 15,
      hpMax: 50,
    },
  },
  {
    id: "choku_tomoe_amulet",
    type: "assignable",
    name: { it: "Amuleto Sharingan Tomoe", en: "Sharingan Tomoe Amulet" },
    description: {
      it: "• +20 Attacco\n• +12 Velocità",
      en: "• +20 Attack\n• +12 Speed",
    },
    iconEmoji: "👁️",
    equipStats: {
      attack: 20,
      speed: 12,
    },
  },
  {
    id: "chakra_blade",
    type: "assignable",
    name: { it: "Lama di Chakra di Asuma", en: "Chakra Blade" },
    description: {
      it: "• +35 Attacco\n• +30 Chakra Max",
      en: "• +35 Attack\n• +30 Max Chakra",
    },
    iconEmoji: "🗡️",
    equipStats: {
      attack: 35,
      chakraMax: 30,
    },
  },
  {
    id: "anbu_mask",
    type: "assignable",
    name: { it: "Maschera Anbu della Volpe", en: "Fox Anbu Mask" },
    description: {
      it: "• +25 Velocità\n• +10 Difesa",
      en: "• +25 Speed\n• +10 Defense",
    },
    iconEmoji: "🎭",
    equipStats: {
      speed: 25,
      defense: 10,
    },
  },
  {
    id: "hokage_necklace",
    type: "assignable",
    name: { it: "Collana del Primo Hokage", en: "First Hokage's Necklace" },
    description: {
      it: "• +120 HP Max\n• +50 Chakra Max",
      en: "• +120 Max HP\n• +50 Max Chakra",
    },
    iconEmoji: "📿",
    equipStats: {
      hpMax: 120,
      chakraMax: 50,
    },
  },
  {
    id: "weights_of_lee",
    type: "assignable",
    name: { it: "Pesi da Caviglia di Rock Lee", en: "Rock Lee's Ankle Weights" },
    description: {
      it: "• +40 Velocità\n• +15 Attacco",
      en: "• +40 Speed\n• +15 Attack",
    },
    iconEmoji: "🏋️",
    equipStats: {
      speed: 40,
      attack: 15,
    },
  },
];

/**
 * Estrae n oggetti casuali bilanciati (sia consumabili che assegnabili)
 */
export function sampleRandomItems(count: number = 3): GameItem[] {
  const shuffled = [...GAME_ITEMS_CATALOG].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
