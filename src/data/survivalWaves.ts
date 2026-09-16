import { Ninja, RunNinja, SurvivalSupplyChoice, GameItem } from "@/types/index";
import { ALL_ITEMS } from "@/data/items";
import { NINJA_MAP } from "@/data/ninjas";

// Pool of enemies for survival mode
const SURVIVAL_NORMAL_ENEMIES = [
  "naruto_shippuden", "sasuke_shippuden", "sakura_shippuden", "kakashi_shippuden",
  "lee_shippuden", "neji_shippuden", "shikamaru_shippuden", "hinata_shippuden",
  "kiba_shippuden", "shino_shippuden", "choji_shippuden", "ino_shippuden",
  "temari_shippuden", "kankuro_shippuden", "sai_shippuden", "yamato_shippuden",
  "kankuro_kid", "temari_kid", "gaara_kid", "zabuza", "haku"
];

const SURVIVAL_ELITE_ENEMIES = [
  "itachi_shippuden", "kisame_shippuden", "deidara_boss", "sasori_boss",
  "hidan_boss", "kakuzu_boss", "orochimaru_shippuden", "kabuto_shippuden",
  "jiraiya_shippuden", "tsunade_shippuden", "minato_shippuden", "tobirama_shippuden"
];

const SURVIVAL_BOSSES = [
  "pain_boss", "obito_boss", "madara_boss", "obito_tt", "madara_tt"
];

export interface SurvivalWaveInfo {
  wave: number;
  title: { it: string; en: string };
  isBossWave: boolean;
  enemies: string[];
  rewardCoins: number;
  rewardScore: number;
  statMultiplier: number;
}

export function getSurvivalWaveInfo(wave: number): SurvivalWaveInfo {
  const isBossWave = wave % 5 === 0;
  const isMilestone = wave % 10 === 0;
  
  // Stat scaling: +6% per 5 waves
  const scaleTier = Math.floor((wave - 1) / 5);
  const statMultiplier = 1.0 + (scaleTier * 0.08);

  let enemies: string[] = [];
  let title = {
    it: `Ondata ${wave}: Fronte dell'Alleanza`,
    en: `Wave ${wave}: Alliance Frontline`,
  };

  if (wave === 5) {
    title = {
      it: "Ondata 5: Assalto dei Sette Spadaccini",
      en: "Wave 5: Seven Swordsmen Assault",
    };
    enemies = ["zabuza", "haku", "kisame_shippuden"];
  } else if (wave === 10) {
    title = {
      it: "Ondata 10: Invasione dei Sei Sentieri di Pain",
      en: "Wave 10: Six Paths of Pain Invasion",
    };
    enemies = ["pain_boss", "deidara_boss", "sasori_boss"];
  } else if (wave === 15) {
    title = {
      it: "Ondata 15: I Leggendari Kage del Passato",
      en: "Wave 15: Legendary Reanimated Kage",
    };
    enemies = ["tobirama_shippuden", "minato_shippuden", "itachi_shippuden"];
  } else if (wave === 20) {
    title = {
      it: "Ondata 20: Risveglio di Madara Uchiha",
      en: "Wave 20: Awakening of Madara Uchiha",
    };
    enemies = ["madara_boss", "obito_boss", "kabuto_shippuden"];
  } else if (wave % 5 === 0) {
    const bossIndex = Math.floor((wave / 5) % SURVIVAL_BOSSES.length);
    const mainBoss = SURVIVAL_BOSSES[bossIndex] || "madara_tt";
    const minion1 = SURVIVAL_ELITE_ENEMIES[(wave * 3) % SURVIVAL_ELITE_ENEMIES.length];
    const minion2 = SURVIVAL_ELITE_ENEMIES[(wave * 7) % SURVIVAL_ELITE_ENEMIES.length];
    title = {
      it: `Ondata ${wave}: Scontro Epico con i Boss`,
      en: `Wave ${wave}: Epic Boss Encounter`,
    };
    enemies = [mainBoss, minion1, minion2];
  } else {
    // Normal / Elite waves
    const enemyCount = wave <= 3 ? 2 : 3;
    const pool = wave >= 6 ? [...SURVIVAL_NORMAL_ENEMIES, ...SURVIVAL_ELITE_ENEMIES] : SURVIVAL_NORMAL_ENEMIES;
    
    // Pick unique opponents
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    enemies = shuffled.slice(0, enemyCount);
  }

  const rewardCoins = isMilestone ? 150 : isBossWave ? 75 : 20 + Math.min(30, wave * 2);
  const rewardScore = isMilestone ? 1000 : isBossWave ? 500 : 150 + (wave * 25);

  return {
    wave,
    title,
    isBossWave,
    enemies,
    rewardCoins,
    rewardScore,
    statMultiplier,
  };
}

export function getSurvivalSupplyChoices(wave: number): SurvivalSupplyChoice[] {
  const choices: SurvivalSupplyChoice[] = [];

  // Choice 1: Field Medical Ration (Heal or Revive)
  choices.push({
    id: `supply_heal_${wave}`,
    type: "heal",
    title: {
      it: "Razione Medica dell'Alleanza",
      en: "Alliance Medical Ration",
    },
    description: {
      it: "Ripristina il 40% di HP e Chakra a tutti i membri vivi della squadra (o rianima 1 caduto al 50% HP).",
      en: "Restores 40% HP & Chakra to all living members (or revives 1 fallen ally with 50% HP).",
    },
    icon: "/ramen.png",
    healPercent: 40,
  });

  // Choice 2: Forbidden Jutsu Upgrade / Secret Scroll
  choices.push({
    id: `supply_jutsu_${wave}`,
    type: "jutsu",
    title: {
      it: "Pergamena di Potenziamento Jutsu",
      en: "Jutsu Mastery Scroll",
    },
    description: {
      it: "Permette di evolvere o sostituire la mossa attiva di un ninja con una variante di rango superiore.",
      en: "Evolve or replace an active move of a team ninja with a higher rank jutsu.",
    },
    icon: "/items/forbidden_jutsu_scroll.png",
  });

  // Choice 3: Shinobi Equipment / Stat Talisman
  const availableItems = ALL_ITEMS.filter((i: GameItem) => i.id !== "forbidden_jutsu_scroll");
  const randomItem: GameItem = availableItems[Math.floor(Math.random() * availableItems.length)] || ALL_ITEMS[0];

  choices.push({
    id: `supply_item_${wave}`,
    type: "item",
    title: {
      it: `Armeria da Campo: ${randomItem.name.it}`,
      en: `Field Armory: ${randomItem.name.en}`,
    },
    description: {
      it: `${randomItem.description.it}`,
      en: `${randomItem.description.en}`,
    },
    icon: `/items/${randomItem.id}.png`,
    rewardItem: randomItem,
  });

  return choices;
}
