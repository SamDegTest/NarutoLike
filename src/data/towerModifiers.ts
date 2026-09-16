export interface TowerModifier {
  id: string;
  name: { it: string; en: string };
  description: { it: string; en: string };
  shortEffect: { it: string; en: string };
  icon: string; // Asset or themed icon
  type: "hazard" | "blessing" | "balanced";
  badgeColor: string;
  borderGlow: string;
}

export const TOWER_MODIFIERS: TowerModifier[] = [
  {
    id: "blood_moon",
    name: {
      it: "Luna Cremisi",
      en: "Blood Moon",
    },
    description: {
      it: "La luce scarlatta esalta l'aggressività: Danni Critici +35%, ma le cure ricevute sono ridotte del 25%.",
      en: "The scarlet glow fuels aggression: Critical Damage +35%, but incoming heals are reduced by 25%.",
    },
    shortEffect: {
      it: "Critico +35% / Cure -25%",
      en: "Crit +35% / Heals -25%",
    },
    icon: "🌕",
    type: "balanced",
    badgeColor: "bg-red-950/80 text-red-300 border-red-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
  },
  {
    id: "chakra_surge",
    name: {
      it: "Tempesta di Chakra",
      en: "Chakra Surge",
    },
    description: {
      it: "Un flusso impetuoso pervade l'arena: Tutti i combattenti iniziano lo scontro con +25 Chakra.",
      en: "A rushing flow envelops the battlefield: All combatants start battle with +25 bonus Chakra.",
    },
    shortEffect: {
      it: "+25 Chakra Iniziale",
      en: "+25 Starting Chakra",
    },
    icon: "🌀",
    type: "blessing",
    badgeColor: "bg-blue-950/80 text-cyan-300 border-cyan-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(6,182,212,0.4)]",
  },
  {
    id: "genjutsu_fog",
    name: {
      it: "Nebbia del Genjutsu",
      en: "Genjutsu Mist",
    },
    description: {
      it: "Foschia ingannevole: Tutti i ninja hanno il 15% di probabilità di schivare gli attacchi in arrivo.",
      en: "Deceptive mist: All ninjas have a 15% chance to dodge incoming attacks completely.",
    },
    shortEffect: {
      it: "+15% Probabilità Schivata",
      en: "+15% Dodge Chance",
    },
    icon: "🌫️",
    type: "balanced",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
  },
  {
    id: "elemental_resonance",
    name: {
      it: "Risonanza Elementale",
      en: "Elemental Resonance",
    },
    description: {
      it: "Le affinità elementali sono amplificate: I vantaggi di tipo infliggono x2.2 danni anziché x1.65!",
      en: "Chakra affinities are intensified: Super Effective attacks deal x2.2 damage instead of x1.65!",
    },
    shortEffect: {
      it: "Vantaggio Elementale x2.2",
      en: "Super Effective x2.2",
    },
    icon: "⚡",
    type: "blessing",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  },
  {
    id: "will_of_fire",
    name: {
      it: "Volontà del Fuoco",
      en: "Will of Fire",
    },
    description: {
      it: "Spirito indomito: I ninja con salute inferiore al 35% ottengono +30% Difesa e +20% Attacco.",
      en: "Indomitable spirit: Ninjas with HP below 35% gain +30% Defense and +20% Attack.",
    },
    shortEffect: {
      it: "Sotto 35% HP: Difesa +30%, Attacco +20%",
      en: "Below 35% HP: Def +30%, Atk +20%",
    },
    icon: "🔥",
    type: "blessing",
    badgeColor: "bg-orange-950/80 text-orange-300 border-orange-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]",
  },
  {
    id: "swift_wind",
    name: {
      it: "Passo del Vento",
      en: "Swift Wind",
    },
    description: {
      it: "Movimenti fulminei: La velocità di tutta la squadra è aumentata del 20%.",
      en: "Lightning-fast steps: Speed of the entire squad is increased by 20%.",
    },
    shortEffect: {
      it: "+20% Velocità Squadra",
      en: "+20% Squad Speed",
    },
    icon: "🌪️",
    type: "blessing",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
  },
  {
    id: "akatsuki_aura",
    name: {
      it: "Presagio dell'Alba",
      en: "Akatsuki Omen",
    },
    description: {
      it: "Presenza minacciosa: I nemici infliggono +15% di danno, ma la vittoria garantisce +50% Punteggio!",
      en: "Ominous aura: Enemies deal +15% damage, but victory grants +50% extra Score!",
    },
    shortEffect: {
      it: "Nemici +15% Danno / +50% Score",
      en: "Enemies +15% Dmg / +50% Score",
    },
    icon: "☁️",
    type: "hazard",
    badgeColor: "bg-rose-950/80 text-rose-300 border-rose-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
  },
  {
    id: "divine_tree_vitality",
    name: {
      it: "Linfa dell'Albero Divino",
      en: "Divine Tree Sap",
    },
    description: {
      it: "Energia primordiale: Tutti i ninja alleati rigenerano il 5% di HP massimi ad ogni azione.",
      en: "Primordial energy: All allied ninjas regenerate 5% max HP upon taking action.",
    },
    shortEffect: {
      it: "+5% HP Rigenerati per Turno",
      en: "+5% HP Regen per Turn",
    },
    icon: "🌳",
    type: "blessing",
    badgeColor: "bg-teal-950/80 text-teal-300 border-teal-500/50",
    borderGlow: "shadow-[0_0_15px_rgba(20,184,166,0.4)]",
  },
];

export const TOWER_MODIFIER_MAP = new Map<string, TowerModifier>(
  TOWER_MODIFIERS.map((m) => [m.id, m])
);

/**
 * Returns a random modifier for the specified floor.
 * Boss floors (multiple of 5) favor more dramatic modifiers!
 */
export function getRandomTowerModifier(floor: number): TowerModifier {
  if (floor % 5 === 0) {
    const epicModifiers = TOWER_MODIFIERS.filter((m) =>
      ["blood_moon", "akatsuki_aura", "elemental_resonance", "will_of_fire"].includes(m.id)
    );
    return epicModifiers[Math.floor(Math.random() * epicModifiers.length)] || TOWER_MODIFIERS[0];
  }

  return TOWER_MODIFIERS[Math.floor(Math.random() * TOWER_MODIFIERS.length)];
}
