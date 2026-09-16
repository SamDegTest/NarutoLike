export type DailyQuestCategory = "combat" | "team" | "items" | "bosses";

export interface DailyQuestDefinition {
  id: string;
  type: string;
  category: DailyQuestCategory;
  title: { it: string; en: string };
  description: { it: string; en: string };
  tip: { it: string; en: string };
  image: string;
  iconFallbackEmoji: string;
  targetCount: number;
  rewardCoins: number;
  elementNature?: string; // Optional element requirement (Fire, Water, Wind, Lightning, Earth)
}

export interface DailyQuestProgress {
  questId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyQuestsState {
  dateKey: string; // "YYYY-MM-DD"
  quests: DailyQuestProgress[];
  allCompletedBonusClaimed?: boolean;
}

export const DAILY_QUEST_DEFINITIONS: DailyQuestDefinition[] = [
  // 1. COMBAT
  {
    id: "dq_win_3_battles",
    type: "win_battles",
    category: "combat",
    title: { it: "Vittorie Shinobi", en: "Shinobi Victories" },
    description: { it: "Vinci 3 combattimenti sulla mappa in una o più run.", en: "Win 3 combat battles on the map across any runs." },
    tip: { it: "Seleziona i nodi di combattimento con la spada incrociata per avanzare rapidamente.", en: "Select crossed swords combat nodes to progress quickly." },
    image: "/achievements/node_conqueror_1.png",
    iconFallbackEmoji: "⚔️",
    targetCount: 3,
    rewardCoins: 80,
  },
  {
    id: "dq_win_5_battles",
    type: "win_battles",
    category: "combat",
    title: { it: "Guerriero Inarrestabile", en: "Unstoppable Warrior" },
    description: { it: "Vinci 5 combattimenti sulla mappa.", en: "Win 5 combat battles on the map." },
    tip: { it: "Mantieni alta la vita della squadra usando le pause ristoro o gli strumenti curativi.", en: "Keep team health high using rest stops or healing items." },
    image: "/achievements/war_veteran.png",
    iconFallbackEmoji: "💥",
    targetCount: 5,
    rewardCoins: 120,
  },
  {
    id: "dq_fire_battles",
    type: "element_battle_fire",
    category: "combat",
    title: { it: "Fiamma di Konoha", en: "Konoha Flame" },
    description: { it: "Vinci 2 combattimenti con almeno un ninja Fuoco (Katon) nel team.", en: "Win 2 battles with at least one Fire (Katon) ninja in your team." },
    tip: { it: "Esempi di ninja Fuoco: Sasuke, Jiraiya, Itachi, Sarutobi.", en: "Fire affinity ninja examples: Sasuke, Jiraiya, Itachi, Sarutobi." },
    image: "/elements/fuoco.png",
    iconFallbackEmoji: "🔥",
    targetCount: 2,
    rewardCoins: 90,
    elementNature: "Fire",
  },
  {
    id: "dq_water_battles",
    type: "element_battle_water",
    category: "combat",
    title: { it: "Marea della Nebbia", en: "Mist Tide" },
    description: { it: "Vinci 2 combattimenti con almeno un ninja Acqua (Suiton) nel team.", en: "Win 2 battles with at least one Water (Suiton) ninja in your team." },
    tip: { it: "Esempi di ninja Acqua: Zabuza, Haku, Kisame, Tobirama.", en: "Water affinity ninja examples: Zabuza, Haku, Kisame, Tobirama." },
    image: "/elements/acqua.png",
    iconFallbackEmoji: "💧",
    targetCount: 2,
    rewardCoins: 90,
    elementNature: "Water",
  },
  {
    id: "dq_wind_battles",
    type: "element_battle_wind",
    category: "combat",
    title: { it: "Raffica della Tempesta", en: "Storm Gust" },
    description: { it: "Vinci 2 combattimenti con almeno un ninja Vento (Fuuton) nel team.", en: "Win 2 battles with at least one Wind (Fuuton) ninja in your team." },
    tip: { it: "Esempi di ninja Vento: Naruto, Temari, Danzo, Asuma.", en: "Wind affinity ninja examples: Naruto, Temari, Danzo, Asuma." },
    image: "/elements/vento.png",
    iconFallbackEmoji: "🌪️",
    targetCount: 2,
    rewardCoins: 90,
    elementNature: "Wind",
  },
  {
    id: "dq_lightning_battles",
    type: "element_battle_lightning",
    category: "combat",
    title: { it: "Fulmine Tagliente", en: "Cutting Lightning" },
    description: { it: "Vinci 2 combattimenti con almeno un ninja Fulmine (Raiton) nel team.", en: "Win 2 battles with at least one Lightning (Raiton) ninja in your team." },
    tip: { it: "Esempi di ninja Fulmine: Kakashi, Sasuke Shippuden, Raikage.", en: "Lightning affinity ninja examples: Kakashi, Sasuke Shippuden, Raikage." },
    image: "/elements/fulmine.png",
    iconFallbackEmoji: "⚡",
    targetCount: 2,
    rewardCoins: 90,
    elementNature: "Lightning",
  },
  {
    id: "dq_earth_battles",
    type: "element_battle_earth",
    category: "combat",
    title: { it: "Baluardo di Roccia", en: "Stone Bulwark" },
    description: { it: "Vinci 2 combattimenti con almeno un ninja Terra (Doton) nel team.", en: "Win 2 battles with at least one Earth (Doton) ninja in your team." },
    tip: { it: "Esempi di ninja Terra: Jiraiya, Kakashi, Onoki, Yamato.", en: "Earth affinity ninja examples: Jiraiya, Kakashi, Onoki, Yamato." },
    image: "/elements/terra.png",
    iconFallbackEmoji: "🪨",
    targetCount: 2,
    rewardCoins: 90,
    elementNature: "Earth",
  },

  // 2. BOSSES
  {
    id: "dq_defeat_1_boss",
    type: "defeat_boss",
    category: "bosses",
    title: { it: "Cacciatore di Boss", en: "Boss Hunter" },
    description: { it: "Sconfiggi 1 Boss principale al termine di un capitolo.", en: "Defeat 1 Chapter Boss at the end of a map stage." },
    tip: { it: "Raggiungi l'ultimo nodo di una mappa e abbatti il Boss finale con una combo sinergica.", en: "Reach the final node of a map stage and take down the Chapter Boss." },
    image: "/trophy.png",
    iconFallbackEmoji: "👹",
    targetCount: 1,
    rewardCoins: 150,
  },
  {
    id: "dq_defeat_2_bosses",
    type: "defeat_boss",
    category: "bosses",
    title: { it: "Dominatore dei Boss", en: "Boss Conqueror" },
    description: { it: "Sconfiggi 2 Boss principali durante le tue avventure.", en: "Defeat 2 Chapter Bosses during your adventures." },
    tip: { it: "Avanza attraverso più livelli o saghe per abbattere 2 Boss e ottenere la taglia massima.", en: "Progress through stages or sagas to take down 2 bosses for max bounty." },
    image: "/achievements/sannin_legend.png",
    iconFallbackEmoji: "👑",
    targetCount: 2,
    rewardCoins: 250,
  },

  // 3. TEAM & RECRUITMENT
  {
    id: "dq_recruit_2_ninjas",
    type: "recruit_ninjas",
    category: "team",
    title: { it: "Nuove Reclute", en: "New Recruits" },
    description: { it: "Recluta 2 nuovi ninja dall'Accademia o dai negozi durante le run.", en: "Recruit 2 new ninjas from the Academy or shops." },
    tip: { it: "Fermati nei nodi Accademia con l'icona ninja o visita il Mercato Shinobi.", en: "Stop at Academy nodes with the ninja icon or visit the Shinobi Shop." },
    image: "/academy.png",
    iconFallbackEmoji: "🥷",
    targetCount: 2,
    rewardCoins: 80,
  },
  {
    id: "dq_eat_ramen_2",
    type: "eat_ramen",
    category: "team",
    title: { it: "Pausa da Ichiraku", en: "Ichiraku Break" },
    description: { it: "Mangia il Ramen da Ichiraku 2 volte per ripristinare la squadra.", en: "Eat Ramen at Ichiraku 2 times to restore your team." },
    tip: { it: "I nodi Ramen ricaricano completamente HP e Chakra a tutta la squadra a costo zero.", en: "Ramen nodes fully recover team HP and Chakra for free." },
    image: "/ramen.png",
    iconFallbackEmoji: "🍜",
    targetCount: 2,
    rewardCoins: 70,
  },
  {
    id: "dq_upgrade_jutsu_1",
    type: "upgrade_jutsu",
    category: "team",
    title: { it: "Segreti del Rotolo", en: "Scroll Secrets" },
    description: { it: "Potenzia il Jutsu di un ninja trovando un Rotolo Proibito.", en: "Upgrade a ninja's Jutsu using a Forbidden Scroll." },
    tip: { it: "Visita i nodi con il rotolo o usa un Rotolo Proibito dall'inventario per sbloccare jutsus superiori.", en: "Visit Scroll nodes or use a Forbidden Scroll to unlock higher jutsus." },
    image: "/items/forbidden_jutsu_scroll.png",
    iconFallbackEmoji: "📜",
    targetCount: 1,
    rewardCoins: 85,
  },

  // 4. ITEMS & EQUIPMENT
  {
    id: "dq_collect_2_items",
    type: "collect_items",
    category: "items",
    title: { it: "Scorte Tattiche", en: "Tactical Supplies" },
    description: { it: "Raccogli o acquista 2 strumenti o pozioni nei nodi Oggetti.", en: "Collect or buy 2 items or potions in Item nodes." },
    tip: { it: "I nodi con il forziere contengono armi, armature e pozioni di cura.", en: "Chest nodes grant weapons, armors and healing potions." },
    image: "/backpack.png",
    iconFallbackEmoji: "📦",
    targetCount: 2,
    rewardCoins: 75,
  },
  {
    id: "dq_equip_2_items",
    type: "equip_items",
    category: "items",
    title: { it: "Armato Fino ai Denti", en: "Armed to the Teeth" },
    description: { it: "Assegna o equipaggia 2 strumenti ai membri del tuo team.", en: "Equip or assign 2 items to your team members." },
    tip: { it: "Apri lo Zaino dal pannello laterale e assegna armi o reliquie ai tuoi ninja per aumentare le statistiche.", en: "Open Backpack from sidebar and equip items to your ninjas." },
    image: "/items/iron_shield_talisman.png",
    iconFallbackEmoji: "🛡️",
    targetCount: 2,
    rewardCoins: 75,
  },
  {
    id: "dq_use_1_consumable",
    type: "use_consumables",
    category: "items",
    title: { it: "Alchimia Shinobi", en: "Shinobi Alchemy" },
    description: { it: "Utilizza 1 oggetto consumabile (es. Pozione o Tonico di Chakra).", en: "Use 1 consumable item (e.g. Health Potion or Chakra Tonic)." },
    tip: { it: "Usa le pozioni dallo zaino prima dei combattimenti più impegnativi.", en: "Use potions from backpack before tough combat encounters." },
    image: "/items/secret_elixir.png",
    iconFallbackEmoji: "🧪",
    targetCount: 1,
    rewardCoins: 60,
  },
];

/**
 * Returns today's date formatted as "YYYY-MM-DD" in local time
 */
export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Simple deterministic pseudo-random hash generator based on date string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates exactly 3 distinct, balanced daily quests for a given date key.
 */
export function generateDailyQuestsForDate(dateKey: string): DailyQuestProgress[] {
  const seed = hashString(dateKey);

  const combatPool = DAILY_QUEST_DEFINITIONS.filter((q) => q.category === "combat");
  const bossTeamPool = DAILY_QUEST_DEFINITIONS.filter((q) => q.category === "bosses" || q.category === "team");
  const itemPool = DAILY_QUEST_DEFINITIONS.filter((q) => q.category === "items");

  const pick1 = combatPool[seed % combatPool.length];
  const pick2 = bossTeamPool[(seed >> 3) % bossTeamPool.length];
  const pick3 = itemPool[(seed >> 6) % itemPool.length];

  const selected = [pick1, pick2, pick3].filter(Boolean);

  const uniqueIds = new Set(selected.map((s) => s.id));
  if (uniqueIds.size < 3) {
    return DAILY_QUEST_DEFINITIONS.slice(0, 3).map((q) => ({
      questId: q.id,
      progress: 0,
      completed: false,
      claimed: false,
    }));
  }

  return selected.map((q) => ({
    questId: q.id,
    progress: 0,
    completed: false,
    claimed: false,
  }));
}

/**
 * Calculates remaining hours and minutes until midnight (next daily reset)
 */
export function getTimeUntilNextDailyReset(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

/**
 * Merges two daily quests states for the current day, always preserving the maximum
 * progress, completed status, and claimed status so no completed quest is ever lost.
 */
export function mergeDailyQuestsStates(
  stateA: DailyQuestsState | null | undefined,
  stateB: DailyQuestsState | null | undefined
): DailyQuestsState {
  const todayKey = getTodayDateKey();

  const validA = stateA && stateA.dateKey === todayKey && Array.isArray(stateA.quests) ? stateA : null;
  const validB = stateB && stateB.dateKey === todayKey && Array.isArray(stateB.quests) ? stateB : null;

  if (!validA && !validB) {
    return {
      dateKey: todayKey,
      quests: generateDailyQuestsForDate(todayKey),
      allCompletedBonusClaimed: false,
    };
  }

  const templates = generateDailyQuestsForDate(todayKey);
  const sourceA = validA?.quests || [];
  const sourceB = validB?.quests || [];

  const mergedQuests = templates.map((tmpl) => {
    const qA = sourceA.find((q) => q.questId === tmpl.questId);
    const qB = sourceB.find((q) => q.questId === tmpl.questId);

    const progressA = qA?.progress ?? 0;
    const progressB = qB?.progress ?? 0;
    const maxProgress = Math.max(progressA, progressB);

    const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === tmpl.questId);
    const target = def?.targetCount ?? 1;

    const isCompleted = Boolean(qA?.completed || qB?.completed || maxProgress >= target);
    const isClaimed = Boolean(qA?.claimed || qB?.claimed);

    return {
      questId: tmpl.questId,
      progress: Math.min(target, maxProgress),
      completed: isCompleted,
      claimed: isClaimed,
    };
  });

  return {
    dateKey: todayKey,
    quests: mergedQuests,
    allCompletedBonusClaimed: Boolean(validA?.allCompletedBonusClaimed || validB?.allCompletedBonusClaimed),
  };
}

