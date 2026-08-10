export interface Achievement {
  id: string;
  title: { it: string; en: string };
  name: { it: string; en: string };
  description: { it: string; en: string };
  icon: string;
  check: (stats: {
    totalRuns: number;
    classicRuns: number;
    shippudenRuns: number;
    maxLevel: number;
    defeatedBosses: string[];
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    title: { it: "Genin Promettente 🍥", en: "Promising Genin 🍥" },
    name: { it: "Primo Passo Shinobi", en: "First Shinobi Step" },
    description: { it: "Completa la tua prima partita (Run).", en: "Complete your first run." },
    icon: "🍥",
    check: (stats) => stats.totalRuns >= 1,
  },
  {
    id: "classic_hero",
    title: { it: "Eroe di Konoha 🍃", en: "Hero of Konoha 🍃" },
    name: { it: "Campione Naruto Classic", en: "Naruto Classic Champion" },
    description: { it: "Completa la Saga Naruto Classic.", en: "Complete the Naruto Classic Saga." },
    icon: "🍃",
    check: (stats) => stats.classicRuns >= 1 || stats.maxLevel >= 5,
  },
  {
    id: "shippuden_legend",
    title: { it: "Leggenda Vivente 👑", en: "Living Legend 👑" },
    name: { it: "Vincitore di Shippuden", en: "Shippuden Winner" },
    description: { it: "Completa la Saga Naruto Shippuden (Livello 5).", en: "Complete the Naruto Shippuden Saga (Level 5)." },
    icon: "👑",
    check: (stats) => stats.shippudenRuns >= 1 || stats.maxLevel >= 10,
  },
  {
    id: "boss_hunter",
    title: { it: "Cacciatore di Bijuu 🐉", en: "Bijuu Hunter 🐉" },
    name: { it: "Dominatore dei Boss", en: "Boss Conqueror" },
    description: { it: "Sconfiggi almeno 3 Boss differenti.", en: "Defeat at least 3 different Bosses." },
    icon: "🐉",
    check: (stats) => (stats.defeatedBosses ? stats.defeatedBosses.length >= 3 : false),
  },
  {
    id: "veteran_shinobi",
    title: { it: "Eremita dei Sei Sentieri ☯️", en: "Sage of Six Paths ☯️" },
    name: { it: "Veterano della Guerra Ninja", en: "Ninja War Veteran" },
    description: { it: "Gioca almeno 10 Run totali.", en: "Play at least 10 total runs." },
    icon: "☯️",
    check: (stats) => stats.totalRuns >= 10,
  },
];

export function getUnlockedAchievements(stats: {
  totalRuns: number;
  classicRuns: number;
  shippudenRuns: number;
  maxLevel: number;
  defeatedBosses: string[];
}): Achievement[] {
  return ACHIEVEMENTS.filter((ach) => ach.check(stats));
}
