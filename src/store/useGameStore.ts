import { create } from "zustand";
import { Ninja, RunNinja, MapNode, PowerUpItem, NodeType, GameItem, InventoryItem, SagaId, SurvivalSupplyChoice, ChaosDraftPackage } from "@/types/index";
import { sampleRandomItems, ALL_ITEMS } from "@/data/items";
import { NINJA_MAP } from "@/data/ninjas";
import { sampleNinjasByRarity } from "@/lib/rarity";
import { useBattleStore, simulateAndResolveBattle } from "./useBattleStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { getUnlockedAchievements, getAchievementRewardCoins, Achievement } from "@/data/achievements";
import { getNinjaEffectiveStats } from "@/utils/statUtils";
import { CustomKeybindings, DEFAULT_KEYBINDINGS } from "@/lib/keybindings";
import { DailyQuestsState, getTodayDateKey, generateDailyQuestsForDate, DAILY_QUEST_DEFINITIONS, mergeDailyQuestsStates } from "@/data/dailyQuests";
import { TowerModifier, getRandomTowerModifier, TOWER_MODIFIER_MAP } from "@/data/towerModifiers";
import { getSurvivalWaveInfo, getSurvivalSupplyChoices } from "@/data/survivalWaves";
import { generateChaosDraftPackages } from "@/data/chaosDraft";

export const updateCoinsInDB = async (newCoins: number) => {
  const user = useAuthStore.getState().user;
  if (!user) return;
  try {
    await supabase.from("profiles").update({ total_coins: newCoins, updated_at: new Date() }).eq("id", user.id);
  } catch (err) {
    console.error("Error updating coins in DB:", err);
  }
};

export const consolidateInventory = (rawInventory: InventoryItem[]): InventoryItem[] => {
  if (!rawInventory || !Array.isArray(rawInventory)) return [];
  const map = new Map<string, InventoryItem>();

  for (const entry of rawInventory) {
    if (!entry || !entry.item || !entry.item.id) continue;
    const itemId = entry.item.id;
    const qty = Math.max(1, entry.quantity || 1);
    if (map.has(itemId)) {
      const existing = map.get(itemId)!;
      existing.quantity += qty;
    } else {
      map.set(itemId, {
        item: entry.item,
        quantity: qty,
      });
    }
  }

  return Array.from(map.values());
};

interface GameState {
  playerRoster: Ninja[];
  playerTeam: Ninja[];
  runTeam: RunNinja[];
  currentLevel: number;
  activeMap: MapNode[];
  currentNodeId: string | null;
  isRunActive: boolean;
  activeSagaId: string | null; // "classic_naruto" | "shippuden_naruto" | "endless_tower" | "survival_war" | "chaos_draft" | null
  startingChoices: Ninja[] | null; // The 3 random starter ninjas offered
  activePowerUps: PowerUpItem[];
  availablePowerUpChoices: PowerUpItem[] | null;
  pendingJutsuToLearn: string | null; // The jutsu id waiting to be learned by a team member
  availableRecruitChoices: Ninja[] | null; // The 3 random ninjas offered to recruit
  shippudenUnlocked: boolean;
  defeatedBosses: string[];
  totalRunsCount: number;
  classicRunsCount: number;
  shippudenRunsCount: number;
  towerRunsCount: number;
  survivalRunsCount: number;
  chaosDraftRunsCount: number;
  currentRunScore: number;
  totalScore: number;
  classicHighScore: number;
  shippudenHighScore: number;
  towerMaxFloor: number;
  towerHighScore: number;
  survivalMaxWave: number;
  survivalHighScore: number;
  chaosDraftHighScore: number;
  activeTowerModifier: TowerModifier | null;
  availableChaosPackages: ChaosDraftPackage[] | null;
  availableSurvivalSupplies: SurvivalSupplyChoice[] | null;
  isSurvivalCampActive: boolean;
  totalCoins: number;
  sessionCoins: number;
  sagaStarterChoices: Record<string, Ninja[] | null>;
  unlockedAchievementsMap: Record<string, string>; // { [achievementId]: ISOStringTimestamp }
  newlyUnlockedTrophy: Achievement | null;

  hasCompletedTutorial: boolean;
  isTutorialActive: boolean;
  tutorialStep: number;
  explainedNodeTypes: string[];
  activeNodeTutorialPopup: { titleKey: string; textKey: string } | null;

  recruitRerollCost: number;
  completedSagaVictory: { sagaId: string; scoreGained: number; coinsGained: number } | null;

  inventory: InventoryItem[];
  availableItemChoices: GameItem[] | null;
  activeConsumableEffects: { item: GameItem; remainingBattles: number }[];
  dailyQuestsData: DailyQuestsState;

  // Actions
  initializeDailyQuests: () => void;
  incrementDailyQuestProgress: (questType: string, amount?: number) => void;
  claimDailyQuestReward: (questId: string) => boolean;
  claimAllDailyQuestRewards: () => void;
  chooseItemFromNode: (item: GameItem) => void;
  useConsumableItem: (itemId: string, targetNinjaId?: string) => void;
  equipItemToNinja: (itemId: string, targetNinjaId: string) => void;
  unequipItemFromNinja: (targetNinjaId: string) => void;
  decrementConsumableEffectsOnBattle: () => void;
  dismissSagaVictory: () => void;
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  dismissNodeTutorialPopup: () => void;
  selectSaga: (sagaId: string | null) => void;
  selectChaosDraftPackage: (packageId: string) => void;
  chooseSurvivalSupply: (choiceId: string) => void;
  selectStartingCharacter: (id: string) => void;
  addNinjaToTeam: (id: string) => void;
  removeNinjaFromTeam: (id: string) => void;
  startRun: () => void;
  selectNode: (nodeId: string) => void;
  resolveCurrentNode: () => void;
  choosePowerUp: (powerUp: PowerUpItem) => void;
  learnJutsu: (ninjaId: string) => void;
  gainTeamLevels: (amount: number) => void;
  chooseRecruit: (id: string, replaceNinjaId?: string) => void;
  skipRecruit: () => void;
  rerollRecruitChoices: () => boolean;
  reviveAndContinueRun: (cost: number) => boolean;
  buyAndRecruitNinja: (ninjaId: string, cost: number, replaceNinjaId?: string) => boolean;
  buyAndAddItemToInventory: (item: GameItem, cost: number) => boolean;
  moveNinjaUp: (index: number) => void;
  moveNinjaDown: (index: number) => void;
  setLeaderNinja: (index: number) => void;
  reorderTeam: (fromIndex: number, toIndex: number) => void;
  autoSortTeam: () => void;
  applyHealingAtCampfire: (healPercent?: number, cost?: number) => boolean;
  syncTeamStats: (updatedTeam: RunNinja[]) => void;
  advanceToNextLevel: () => void;
  endRun: () => void;
  customKeybindings: CustomKeybindings;
  setCustomKeybindings: (bindings: CustomKeybindings) => void;
  resetCustomKeybindings: () => void;
  abandonRun: () => void;
  registerBossDefeat: (bossId: string) => void;
  checkAndUnlockAchievements: () => void;
  dismissTrophyNotification: () => void;
  saveToCloud: () => Promise<void>;
  loadCloudSave: () => Promise<void>;
  saveGuestRunToLocalStorage: () => void;
  loadGuestRunFromLocalStorage: () => void;
  clearLocalSave: () => void;
  autoResolvePendingBattleNode: () => void;
}

const ALL_BOSS_IDS = [
  "mizuki", "haku", "zabuza", "orochimaru_shippuden", "gaara_kid",
  "deidara_boss", "sasori_boss", "hidan_boss", "kakuzu_boss", "itachi_shippuden",
  "kisame_shippuden", "pain_boss", "kabuto_shippuden", "obito_boss", "obito_tt", "madara_boss", "madara_tt"
];

const POWER_UP_POOL: PowerUpItem[] = [
  { id: "jutsu_upgrade", name: "Rotolo Proibito", description: "Migliora la mossa attiva di uno dei tuoi ninja", isJutsuUpgrade: true },
];

function generateLevelMap(sagaId: string, level: number): MapNode[] {
  let bossId = "mizuki";
  let bossLabel = "Il Tradimento di Mizuki";
  let opponentsPool = [
    "naruto_kid", "sasuke_kid", "sakura_kid", "kakashi_kid",
    "lee_kid", "neji_kid", "shikamaru_kid", "hinata_kid", "tenten_kid",
    "choji_kid", "ino_kid", "kiba_kid", "shino_kid", "temari_kid", "kankuro_kid", "iruka_kid"
  ];

  let bossOpponents: string[] = [bossId];

  if (sagaId === "classic_naruto") {
    if (level === 1) {
      bossId = "mizuki";
      bossLabel = "Il Tradimento di Mizuki";
      bossOpponents = ["mizuki", "iruka_kid"];
    } else if (level === 2) {
      bossId = "haku";
      bossLabel = "Specchi Diabolici: Haku & Zabuza";
      bossOpponents = ["haku", "zabuza"];
    } else if (level === 3) {
      bossId = "zabuza";
      bossLabel = "Il Demone della Nebbia: Zabuza & Haku";
      bossOpponents = ["zabuza", "haku"];
    } else if (level === 4) {
      bossId = "orochimaru_shippuden";
      bossLabel = "L'invasione della Foglia: Orochimaru & Kabuto";
      bossOpponents = ["orochimaru_shippuden", "kabuto_shippuden"];
    } else if (level === 5) {
      bossId = "gaara_kid";
      bossLabel = "Il Risveglio dello Shukaku: Gaara, Temari & Kankuro (Boss Finale)";
      bossOpponents = ["gaara_kid", "temari_kid", "kankuro_kid"];
    }
  } else if (sagaId === "shippuden_naruto") {
    // Shippuden saga setup
    opponentsPool = [
      "naruto_shippuden", "sasuke_shippuden", "sakura_shippuden", "kakashi_shippuden",
      "gaara_shippuden", "lee_shippuden", "neji_shippuden", "shikamaru_shippuden",
      "hinata_shippuden", "sasuke_hebi", "tenten_shippuden", "choji_shippuden",
      "ino_shippuden", "kiba_shippuden", "shino_shippuden", "temari_shippuden",
      "kankuro_shippuden", "guy_shippuden", "minato_shippuden", "kurenai_shippuden",
      "asuma_shippuden", "hiruzen_shippuden", "konohamaru_kid", "konan_shippuden",
      "tobirama_shippuden", "hashirama_shippuden", "suigetsu_shippuden", "jugo_shippuden",
      "karin_shippuden", "danzo_shippuden", "onoki_shippuden", "raikage4_shippuden",
      "gengetsu_shippuden", "raikage3_shippuden", "chiyo_shippuden", "zetsu_shippuden",
      "killer_bee_shippuden", "darui_shippuden", "mu_shippuden", "nagato_shippuden",
      "yamato_shippuden"
    ];

    if (level === 1) {
      bossId = "deidara_boss";
      bossLabel = "Salvataggio del Kazekage: Deidara & Sasori";
      bossOpponents = ["deidara_boss", "sasori_boss"];
    } else if (level === 2) {
      bossId = "hidan_boss";
      bossLabel = "I Due Immortali: Hidan & Kakuzu";
      bossOpponents = ["hidan_boss", "kakuzu_boss"];
    } else if (level === 3) {
      bossId = "itachi_shippuden";
      bossLabel = "Lo Scontro dei Fratelli: Itachi & Kisame";
      bossOpponents = ["itachi_shippuden", "kisame_shippuden"];
    } else if (level === 4) {
      bossId = "kisame_shippuden";
      bossLabel = "Caccia all'Ottacoda: Kisame & Itachi";
      bossOpponents = ["kisame_shippuden", "itachi_shippuden"];
    } else if (level === 5) {
      bossId = "pain_boss";
      bossLabel = "Distruzione della Foglia: Pain & Konan";
      bossOpponents = ["pain_boss", "konan_shippuden"];
    } else if (level === 6) {
      bossId = "kabuto_shippuden";
      bossLabel = "Infiltrazione Eremitica: Kabuto & Orochimaru";
      bossOpponents = ["kabuto_shippuden", "orochimaru_shippuden"];
    } else if (level === 7) {
      bossId = "obito_boss";
      bossLabel = "Dichiarazione di Guerra: Obito & Deidara";
      bossOpponents = ["obito_boss", "deidara_boss"];
    } else if (level === 8) {
      bossId = "madara_boss";
      bossLabel = "La Leggenda Risorta: Madara & Obito";
      bossOpponents = ["madara_boss", "obito_boss"];
    } else if (level === 9) {
      bossId = "obito_tt";
      bossLabel = "Il Risveglio del Decacoda: Obito Jinchūriki & Madara";
      bossOpponents = ["obito_tt", "madara_boss"];
    } else if (level === 10) {
      bossId = "madara_tt";
      bossLabel = "L'Incubo del Sogno Infinito: Madara Decacoda & Obito Decacoda (Boss Finale)";
      bossOpponents = ["madara_tt", "obito_tt"];
    }
  } else if (sagaId === "survival_war") {
    // Survival Mode: Single wave node per level
    const waveInfo = getSurvivalWaveInfo(level);
    return [
      {
        id: `survival_wave_${level}`,
        type: waveInfo.isBossWave ? "boss" : "battle",
        label: waveInfo.title.it,
        stage: 0,
        connections: [],
        resolved: false,
        opponents: waveInfo.enemies,
      },
    ];
  } else if (sagaId === "chaos_draft") {
    // Chaos Draft: 7 Procedural chapters with wild boss pairings
    opponentsPool = Array.from(NINJA_MAP.values())
      .filter((n) => !ALL_BOSS_IDS.includes(n.id))
      .map((n) => n.id);

    if (level === 1) {
      bossId = "zabuza";
      bossLabel = "Distorsione 1: Demone della Nebbia (Zabuza & Haku)";
      bossOpponents = ["zabuza", "haku"];
    } else if (level === 2) {
      bossId = "gaara_kid";
      bossLabel = "Distorsione 2: Tempesta di Sabbia (Gaara & Sasori)";
      bossOpponents = ["gaara_kid", "sasori_boss"];
    } else if (level === 3) {
      bossId = "itachi_shippuden";
      bossLabel = "Distorsione 3: Ombre dell'Akatsuki (Itachi & Kisame)";
      bossOpponents = ["itachi_shippuden", "kisame_shippuden"];
    } else if (level === 4) {
      bossId = "pain_boss";
      bossLabel = "Distorsione 4: Il Giudizio Divino (Pain & Deidara)";
      bossOpponents = ["pain_boss", "deidara_boss"];
    } else if (level === 5) {
      bossId = "danzo_shippuden";
      bossLabel = "Distorsione 5: Il Vertice dei Kage (Danzo & Raikage)";
      bossOpponents = ["danzo_shippuden", "raikage4_shippuden"];
    } else if (level === 6) {
      bossId = "madara_boss";
      bossLabel = "Distorsione 6: La Leggenda Risorta (Madara & Obito)";
      bossOpponents = ["madara_boss", "obito_boss"];
    } else if (level === 7) {
      bossId = "madara_tt";
      bossLabel = "Distorsione Finale: Tsukuyomi Assoluto (Madara Decacoda & Obito Decacoda)";
      bossOpponents = ["madara_tt", "obito_tt"];
    }
  } else if (sagaId === "endless_tower") {
    // Endless Tower pool (all characters)
    opponentsPool = [
      "naruto_kid", "sasuke_kid", "sakura_kid", "kakashi_kid", "lee_kid", "neji_kid",
      "shikamaru_kid", "hinata_kid", "tenten_kid", "choji_kid", "ino_kid", "kiba_kid",
      "shino_kid", "temari_kid", "kankuro_kid", "iruka_kid", "naruto_shippuden",
      "sasuke_shippuden", "sakura_shippuden", "kakashi_shippuden", "gaara_shippuden",
      "lee_shippuden", "neji_shippuden", "shikamaru_shippuden", "hinata_shippuden",
      "sasuke_hebi", "tenten_shippuden", "choji_shippuden", "ino_shippuden",
      "kiba_shippuden", "shino_shippuden", "temari_shippuden", "kankuro_shippuden",
      "guy_shippuden", "minato_shippuden", "kurenai_shippuden", "asuma_shippuden",
      "hiruzen_shippuden", "konohamaru_kid", "konan_shippuden", "tobirama_shippuden",
      "hashirama_shippuden", "suigetsu_shippuden", "jugo_shippuden", "karin_shippuden",
      "danzo_shippuden", "onoki_shippuden", "raikage4_shippuden", "gengetsu_shippuden",
      "raikage3_shippuden", "chiyo_shippuden", "zetsu_shippuden", "killer_bee_shippuden",
      "darui_shippuden", "mu_shippuden", "nagato_shippuden", "yamato_shippuden"
    ];

    if (level === 5) {
      bossId = "zabuza";
      bossLabel = "Guardiani 5° Piano: Zabuza & Haku (Rinati)";
      bossOpponents = ["zabuza", "haku"];
    } else if (level === 10) {
      bossId = "itachi_shippuden";
      bossLabel = "Guardiani 10° Piano: Itachi & Sasuke Uchiha";
      bossOpponents = ["itachi_shippuden", "sasuke_hebi"];
    } else if (level === 15) {
      bossId = "jiraiya_shippuden";
      bossLabel = "Guardiani 15° Piano: I Tre Sannin Leggendari";
      bossOpponents = ["jiraiya_shippuden", "tsunade_shippuden", "orochimaru_shippuden"];
    } else if (level === 20) {
      bossId = "pain_boss";
      bossLabel = "Guardiani 20° Piano: I Sei Sentieri di Pain & Konan";
      bossOpponents = ["pain_boss", "konan_shippuden", "nagato_shippuden"];
    } else if (level === 25) {
      bossId = "raikage4_shippuden";
      bossLabel = "Guardiani 25° Piano: I Cinque Kage Riuniti";
      bossOpponents = ["raikage4_shippuden", "onoki_shippuden", "gaara_shippuden"];
    } else if (level === 30) {
      bossId = "madara_boss";
      bossLabel = "Guardiani 30° Piano: Madara Uchiha & Hashirama Senju";
      bossOpponents = ["madara_boss", "hashirama_shippuden", "tobirama_shippuden"];
    } else if (level % 5 === 0) {
      bossId = "madara_tt";
      bossLabel = `Dominatori ${level}° Piano: Madara Decacoda & Armata Tsukuyomi`;
      bossOpponents = ["madara_tt", "obito_tt", "pain_boss"];
    } else {
      const guardians = [
        { id: "kakashi_shippuden", label: `Guardiano ${level}° Piano: Kakashi & Guy`, team: ["kakashi_shippuden", "guy_shippuden"] },
        { id: "minato_shippuden", label: `Guardiano ${level}° Piano: Minato & Kakashi`, team: ["minato_shippuden", "kakashi_kid"] },
        { id: "deidara_boss", label: `Guardiano ${level}° Piano: Deidara & Sasori`, team: ["deidara_boss", "sasori_boss"] },
        { id: "hidan_boss", label: `Guardiano ${level}° Piano: Hidan & Kakuzu`, team: ["hidan_boss", "kakuzu_boss"] },
        { id: "kisame_shippuden", label: `Guardiano ${level}° Piano: Kisame & Suigetsu`, team: ["kisame_shippuden", "suigetsu_shippuden"] },
        { id: "danzo_shippuden", label: `Guardiano ${level}° Piano: Danzo & Root Anbu`, team: ["danzo_shippuden", "zetsu_shippuden"] },
        { id: "killer_bee_shippuden", label: `Guardiano ${level}° Piano: Killer Bee & Darui`, team: ["killer_bee_shippuden", "darui_shippuden"] },
        { id: "hiruzen_shippuden", label: `Guardiano ${level}° Piano: Hiruzen & Konohamaru`, team: ["hiruzen_shippuden", "konohamaru_kid"] },
      ];
      const g = guardians[(level - 1) % guardians.length];
      bossId = g.id;
      bossLabel = g.label;
      bossOpponents = g.team;
    }
  }

  const p = sagaId === "endless_tower"
    ? Math.max(0, Math.min(1, (level - 1) / 25))
    : Math.max(0, Math.min(1, (level - 1) / Math.max(1, (sagaId === "classic_naruto" ? 5 : 10) - 1)));

  // Calculate rank weights based on level progression
  // Level 1: C ~60%, B ~30%, A ~10%, S ~1%
  // Final Level: C ~2%, B ~10%, A ~46%, S ~42%
  const weightC = Math.max(2, 60 * (1 - p) * (1 - p));
  const weightB = Math.max(10, 30 + 20 * Math.sin(p * Math.PI));
  const weightA = Math.max(10, 10 + 35 * p);
  const weightS = Math.max(1, 1 + 39 * p * p);

  const poolNinjas = opponentsPool
    .map((id) => NINJA_MAP.get(id))
    .filter((n): n is Ninja => n !== undefined);

  const byRank: Record<string, Ninja[]> = {
    C: poolNinjas.filter((n) => (n.rank || "C") === "C"),
    B: poolNinjas.filter((n) => (n.rank || "C") === "B"),
    A: poolNinjas.filter((n) => (n.rank || "C") === "A"),
    S: poolNinjas.filter((n) => (n.rank || "C") === "S"),
  };

  const sampleOpponentByWeightedRank = (): string => {
    const activeRanks: { rank: string; weight: number }[] = [];
    if (byRank.C.length > 0) activeRanks.push({ rank: "C", weight: weightC });
    if (byRank.B.length > 0) activeRanks.push({ rank: "B", weight: weightB });
    if (byRank.A.length > 0) activeRanks.push({ rank: "A", weight: weightA });
    if (byRank.S.length > 0) activeRanks.push({ rank: "S", weight: weightS });

    const totalWeight = activeRanks.reduce((sum, r) => sum + r.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const r of activeRanks) {
      if (rand < r.weight) {
        const candidates = byRank[r.rank];
        return candidates[Math.floor(Math.random() * candidates.length)].id;
      }
      rand -= r.weight;
    }

    return opponentsPool[Math.floor(Math.random() * opponentsPool.length)];
  };

  const getRandomOpponents = (stage: number) => {
    let count = 1;
    if (stage === 2) count = Math.random() > 0.5 ? 2 : 1;
    else if (stage === 3 || stage === 4 || stage === 5) count = 2;
    else if (stage === 6) count = Math.random() > 0.5 ? 3 : 2;

    return Array.from({ length: count }).map(() => sampleOpponentByWeightedRank());
  };

  const makeNode = (id: string, stage: number, label: string, connections: string[], type: NodeType): MapNode => {
    let suffix = " (Lotta)";
    if (type === "powerup" || type === "item") suffix = " (Oggetto)";
    if (type === "recruit") suffix = " (Recluta)";
    return {
      id,
      type,
      label: `${label}${suffix}`,
      stage,
      connections,
      resolved: false,
      opponents: type === "battle" ? getRandomOpponents(stage) : undefined,
    };
  };

  let finalMap: MapNode[] = [];
  let attempts = 0;

  while (attempts < 1000) {
    attempts++;

    // Force first choice (Row 1) to always offer exactly one simple battle and one recruitment
    const row1Types = ["battle", "recruit"].sort(() => 0.5 - Math.random()) as NodeType[];

    // Remaining 13 middle nodes (Row 2 to 5) are generated from the pool:
    // 2 recruits + 2 items + 9 battles
    const nodePool: NodeType[] = [
      "recruit", "recruit",
      "item", "item",
      "battle", "battle", "battle", "battle", "battle", "battle", "battle", "battle", "battle"
    ];
    const shuffledPool = nodePool.sort(() => 0.5 - Math.random());

    const row2Types = shuffledPool.slice(0, 3);
    const row3Types = shuffledPool.slice(3, 7);
    const row4Types = shuffledPool.slice(7, 10);
    const row5Types = shuffledPool.slice(10, 13);

    const map: MapNode[] = [
      // Row 0 (Top Start)
      {
        id: "0_start",
        type: "item",
        label: "Cassa degli Oggetti",
        stage: 0,
        connections: ["1_A", "1_B"],
        resolved: false,
      },
      // Row 1
      makeNode("1_A", 1, "Sentiero Sinistro", ["2_A", "2_B"], row1Types[0]),
      makeNode("1_B", 1, "Sentiero Destro", ["2_B", "2_C"], row1Types[1]),
      // Row 2
      makeNode("2_A", 2, "Radura Ovest", ["3_A", "3_B"], row2Types[0]),
      makeNode("2_B", 2, "Passo Centrale", ["3_B", "3_C"], row2Types[1]),
      makeNode("2_C", 2, "Radura Est", ["3_C", "3_D"], row2Types[2]),
      // Row 3 (Middle Center)
      makeNode("3_A", 3, "Valico Estremo", ["4_A"], row3Types[0]),
      makeNode("3_B", 3, "Bosco Celato", ["4_A", "4_B"], row3Types[1]),
      makeNode("3_C", 3, "Fiume Rapido", ["4_B", "4_C"], row3Types[2]),
      makeNode("3_D", 3, "Rovine Antiche", ["4_C"], row3Types[3]),
      // Row 4
      makeNode("4_A", 4, "Bivio Ovest", ["5_A"], row4Types[0]),
      makeNode("4_B", 4, "Bivio Centrale", ["5_A", "5_B"], row4Types[1]),
      makeNode("4_C", 4, "Bivio Est", ["5_B", "5_C"], row4Types[2]),
      // Row 5
      makeNode("5_A", 5, "Valle Occidentale", ["6_heal"], row5Types[0]),
      makeNode("5_B", 5, "Valle Centrale", ["6_heal", "6_B"], row5Types[1]),
      makeNode("5_C", 5, "Valle Orientale", ["6_B"], row5Types[2]),
      // Row 6
      {
        id: "6_heal",
        type: "heal",
        label: "Ramen Ichiraku",
        stage: 6,
        connections: ["7_boss"],
        resolved: false,
      },
      {
        id: "6_B",
        type: "battle",
        label: "Ultima Difesa (Lotta)",
        stage: 6,
        connections: ["7_boss"],
        resolved: false,
        opponents: getRandomOpponents(6),
      },
      // Row 7 (Bottom Boss)
      {
        id: "7_boss",
        type: "boss",
        label: bossLabel,
        stage: 7,
        connections: [],
        resolved: false,
        opponents: bossOpponents,
      },
    ];

    // Validate recruit nodes: max 3 in the entire map
    const totalRecruits = map.filter((n) => n.type === "recruit").length;
    if (totalRecruits > 3) continue;

    // Validate recruit nodes: max 2 in any single path from start to boss
    let pathExceeded = false;
    const checkPath = (nodeId: string, currentCount: number) => {
      const node = map.find((n) => n.id === nodeId);
      if (!node) return;

      const isRecruit = node.type === "recruit" ? 1 : 0;
      const newCount = currentCount + isRecruit;

      if (newCount > 2) {
        pathExceeded = true;
        return;
      }

      for (const connId of node.connections) {
        checkPath(connId, newCount);
        if (pathExceeded) return;
      }
    };

    checkPath("0_start", 0);
    if (pathExceeded) continue;

    finalMap = map;
    break;
  }

  return finalMap;
}

let isLoggingOut = false;

export const useGameStore = create<GameState>((set, get) => ({
  playerRoster: Array.from(NINJA_MAP.values()),
  playerTeam: [],
  runTeam: [],
  currentLevel: 1,
  activeMap: [],
  currentNodeId: null,
  isRunActive: false,
  activeSagaId: null,
  startingChoices: null,
  activePowerUps: [],
  availablePowerUpChoices: null,
  pendingJutsuToLearn: null,
  availableRecruitChoices: null,

  skipRecruit: () => {
    set({ availableRecruitChoices: null });
    get().resolveCurrentNode();
  },
  shippudenUnlocked: typeof window !== "undefined" ? localStorage.getItem("shippudenUnlocked") === "true" : false,
  defeatedBosses: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("defeatedBosses") || "[]") : [],
  totalRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("totalRunsCount")) || 0 : 0,
  classicRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("classicRunsCount")) || 0 : 0,
  shippudenRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("shippudenRunsCount")) || 0 : 0,
  towerRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("towerRunsCount")) || 0 : 0,
  survivalRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("survivalRunsCount")) || 0 : 0,
  chaosDraftRunsCount: typeof window !== "undefined" ? Number(localStorage.getItem("chaosDraftRunsCount")) || 0 : 0,
  currentRunScore: 0,
  totalScore: typeof window !== "undefined" ? Number(localStorage.getItem("totalScore")) || 0 : 0,
  classicHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("classicHighScore")) || 0 : 0,
  shippudenHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("shippudenHighScore")) || 0 : 0,
  towerMaxFloor: typeof window !== "undefined" ? Number(localStorage.getItem("towerMaxFloor")) || 0 : 0,
  towerHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("towerHighScore")) || 0 : 0,
  survivalMaxWave: typeof window !== "undefined" ? Number(localStorage.getItem("survivalMaxWave")) || 0 : 0,
  survivalHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("survivalHighScore")) || 0 : 0,
  chaosDraftHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("chaosDraftHighScore")) || 0 : 0,
  activeTowerModifier: null,
  availableChaosPackages: null,
  availableSurvivalSupplies: null,
  isSurvivalCampActive: false,
  totalCoins: typeof window !== "undefined"
    ? (useAuthStore.getState().user
      ? Number(localStorage.getItem("totalCoins")) || 0
      : Number(localStorage.getItem("guest_coins_cache")) || 0)
    : 0,
  sessionCoins: typeof window !== "undefined"
    ? Number(localStorage.getItem("guest_coins_cache")) || 0
    : 0,
  inventory: [],
  availableItemChoices: null,
  activeConsumableEffects: [],
  recruitRerollCost: 75,
  completedSagaVictory: null,
  dismissSagaVictory: () => set({ completedSagaVictory: null }),
  sagaStarterChoices: {},
  unlockedAchievementsMap: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("unlockedAchievementsMap") || "{}") : {},
  newlyUnlockedTrophy: null,
  dailyQuestsData: typeof window !== "undefined"
    ? (() => {
      try {
        const saved = localStorage.getItem("narutolike_daily_quests");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.dateKey === getTodayDateKey() && Array.isArray(parsed.quests) && parsed.quests.length > 0) {
            return parsed;
          }
        }
      } catch { }
      const today = getTodayDateKey();
      return { dateKey: today, quests: generateDailyQuestsForDate(today) };
    })()
    : { dateKey: getTodayDateKey(), quests: generateDailyQuestsForDate(getTodayDateKey()) },

  hasCompletedTutorial: typeof window !== "undefined"
    ? localStorage.getItem("narutolike_tutorial_completed") === "true" || (Number(localStorage.getItem("totalRunsCount")) || 0) > 0
    : false,
  isTutorialActive: false,
  tutorialStep: 1,
  explainedNodeTypes: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("narutolike_explained_nodes") || "[]") : [],
  activeNodeTutorialPopup: null,

  dismissNodeTutorialPopup: () => set({ activeNodeTutorialPopup: null }),

  customKeybindings: DEFAULT_KEYBINDINGS,

  setCustomKeybindings: (bindings: CustomKeybindings) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ customKeybindings: bindings });
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_keybindings", JSON.stringify(bindings));
    }
    get().saveToCloud();
  },

  resetCustomKeybindings: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ customKeybindings: DEFAULT_KEYBINDINGS });
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_keybindings", JSON.stringify(DEFAULT_KEYBINDINGS));
    }
    get().saveToCloud();
  },

  startTutorial: () => {
    set({ isTutorialActive: true, tutorialStep: 1 });
  },
  nextTutorialStep: () => {
    const current = get().tutorialStep;
    if (current >= 5) {
      get().skipTutorial();
    } else {
      set({ tutorialStep: current + 1 });
    }
  },
  prevTutorialStep: () => {
    const current = get().tutorialStep;
    if (current > 1) {
      const prevStep = current - 1;
      if (prevStep === 1) {
        set({ tutorialStep: 1, isRunActive: false });
      } else {
        set({ tutorialStep: prevStep });
      }
    }
  },
  skipTutorial: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("narutolike_tutorial_completed", "true");
    }
    set({ isTutorialActive: false, hasCompletedTutorial: true });
    get().checkAndUnlockAchievements();
  },
  resetTutorial: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("narutolike_tutorial_completed");
      localStorage.removeItem("narutolike_explained_nodes");
    }
    set({ hasCompletedTutorial: false, isTutorialActive: true, tutorialStep: 1, explainedNodeTypes: [] });
  },

  initializeDailyQuests: () => {
    const todayKey = getTodayDateKey();
    let current = get().dailyQuestsData;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("narutolike_daily_quests");
        if (saved) {
          const parsed = JSON.parse(saved);
          current = mergeDailyQuestsStates(current, parsed);
        }
      } catch {}
    }

    const merged = mergeDailyQuestsStates(current, null);
    set({ dailyQuestsData: merged });
    if (typeof window !== "undefined") {
      localStorage.setItem("narutolike_daily_quests", JSON.stringify(merged));
    }
  },

  incrementDailyQuestProgress: (questType: string, amount = 1) => {
    const user = useAuthStore.getState().user;
    if (!user) return; // Daily quests are exclusive to logged-in users

    get().initializeDailyQuests();
    const { dailyQuestsData } = get();
    if (!dailyQuestsData || !dailyQuestsData.quests) return;

    let changed = false;
    const updatedQuests = dailyQuestsData.quests.map((q) => {
      const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
      if (!def || def.type !== questType || q.completed) return q;

      const newProgress = Math.min(def.targetCount, q.progress + amount);
      const isCompleted = newProgress >= def.targetCount;
      if (newProgress !== q.progress || isCompleted !== q.completed) {
        changed = true;
        return {
          ...q,
          progress: newProgress,
          completed: isCompleted,
        };
      }
      return q;
    });

    if (changed) {
      const updatedState: DailyQuestsState = { ...dailyQuestsData, quests: updatedQuests };
      set({ dailyQuestsData: updatedState });
      if (typeof window !== "undefined") {
        localStorage.setItem("narutolike_daily_quests", JSON.stringify(updatedState));
      }
      get().saveToCloud();
    }
  },

  claimDailyQuestReward: (questId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return false;

    const { dailyQuestsData, totalCoins, sessionCoins } = get();
    const qIndex = dailyQuestsData.quests.findIndex((q) => q.questId === questId);
    if (qIndex < 0) return false;

    const quest = dailyQuestsData.quests[qIndex];
    if (!quest.completed || quest.claimed) return false;

    const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === questId);
    const reward = def?.rewardCoins || 50;

    const newTotalCoins = totalCoins + reward;
    const newSessionCoins = sessionCoins + reward;

    const updatedQuests = [...dailyQuestsData.quests];
    updatedQuests[qIndex] = { ...quest, claimed: true };

    const updatedState = { ...dailyQuestsData, quests: updatedQuests };
    set({
      dailyQuestsData: updatedState,
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("narutolike_daily_quests", JSON.stringify(updatedState));
      localStorage.setItem("totalCoins", String(newTotalCoins));
      updateCoinsInDB(newTotalCoins);
    }

    get().saveToCloud();
    return true;
  },

  claimAllDailyQuestRewards: () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { dailyQuestsData, totalCoins, sessionCoins } = get();

    let totalBonus = 0;
    const updatedQuests = dailyQuestsData.quests.map((q) => {
      if (q.completed && !q.claimed) {
        const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
        totalBonus += def?.rewardCoins || 50;
        return { ...q, claimed: true };
      }
      return q;
    });

    if (totalBonus <= 0) return;

    const newTotalCoins = totalCoins + totalBonus;
    const newSessionCoins = sessionCoins + totalBonus;

    const updatedState = { ...dailyQuestsData, quests: updatedQuests };
    set({
      dailyQuestsData: updatedState,
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("narutolike_daily_quests", JSON.stringify(updatedState));
      localStorage.setItem("totalCoins", String(newTotalCoins));
      updateCoinsInDB(newTotalCoins);
    }

    get().saveToCloud();
  },

  dismissTrophyNotification: () => {
    set({ newlyUnlockedTrophy: null });
  },

  checkAndUnlockAchievements: () => {
    const state = get();
    const stats = {
      totalRuns: state.totalRunsCount,
      classicRuns: state.classicRunsCount,
      shippudenRuns: state.shippudenRunsCount,
      towerRuns: state.towerRunsCount,
      maxLevel: state.currentLevel,
      totalScore: state.totalScore || 0,
      classicHighScore: state.classicHighScore || 0,
      shippudenHighScore: state.shippudenHighScore || 0,
      towerMaxFloor: state.towerMaxFloor || 0,
      towerHighScore: state.towerHighScore || 0,
      defeatedBosses: state.defeatedBosses || [],
      hasCompletedTutorial: state.hasCompletedTutorial || false,
    };

    const unlockedList = getUnlockedAchievements(stats);
    const currentMap = { ...state.unlockedAchievementsMap };
    let newlyUnlocked: Achievement | null = null;
    let mapChanged = false;

    const nowISO = new Date().toISOString();

    let addedCoins = 0;

    for (const ach of unlockedList) {
      if (!currentMap[ach.id]) {
        currentMap[ach.id] = nowISO;
        newlyUnlocked = ach;
        mapChanged = true;
        addedCoins += getAchievementRewardCoins(ach);
      }
    }

    if (mapChanged) {
      const user = useAuthStore.getState().user;

      if (user) {
        const updatedTotalCoins = state.totalCoins + addedCoins;
        set({
          unlockedAchievementsMap: currentMap,
          newlyUnlockedTrophy: newlyUnlocked ? newlyUnlocked : state.newlyUnlockedTrophy,
          totalCoins: updatedTotalCoins,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("unlockedAchievementsMap", JSON.stringify(currentMap));
          localStorage.setItem("totalCoins", String(updatedTotalCoins));
        }

        updateCoinsInDB(updatedTotalCoins);
        state.saveToCloud();
      } else {
        set({
          unlockedAchievementsMap: currentMap,
          newlyUnlockedTrophy: newlyUnlocked ? newlyUnlocked : state.newlyUnlockedTrophy,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("unlockedAchievementsMap", JSON.stringify(currentMap));
        }
      }
    }
  },

  selectSaga: (sagaId) => {
    if (sagaId) {
      if (sagaId === "chaos_draft") {
        set({
          activeSagaId: sagaId,
          availableChaosPackages: generateChaosDraftPackages(),
          startingChoices: null,
          playerTeam: [],
        });
        return;
      }

      const { sagaStarterChoices } = get();
      let choices = sagaStarterChoices[sagaId];

      if (!choices || choices.length === 0) {
        const isShippuden = sagaId === "shippuden_naruto";
        const isTower = sagaId === "endless_tower";
        const isSurvival = sagaId === "survival_war";
        const targetRoster = Array.from(NINJA_MAP.values()).filter((n) => {
          if (isTower || isSurvival) return !ALL_BOSS_IDS.includes(n.id);
          const isCorrectVersion = isShippuden ? n.version === "shippuden" : n.version === "kid";
          return isCorrectVersion && !ALL_BOSS_IDS.includes(n.id);
        });
        choices = sampleNinjasByRarity(targetRoster, 3);
      }

      set({
        activeSagaId: sagaId,
        startingChoices: choices,
        availableChaosPackages: null,
        sagaStarterChoices: {
          ...sagaStarterChoices,
          [sagaId]: choices,
        },
        playerTeam: [],
      });
    } else {
      set({
        activeSagaId: null,
        startingChoices: null,
        availableChaosPackages: null,
        playerTeam: [],
      });
    }
  },

  selectChaosDraftPackage: (packageId: string) => {
    const { availableChaosPackages, totalRunsCount, chaosDraftRunsCount } = get();
    const pkg = availableChaosPackages?.find((p) => p.id === packageId);
    if (!pkg) return;

    const runTeam: RunNinja[] = pkg.ninjas.map((ninja) => ({
      ...ninja,
      level: 5,
      currentHp: ninja.baseStats.hp,
      currentChakra: ninja.baseStats.chakra,
    }));

    let initialInventory: InventoryItem[] = [];
    if (pkg.bonusItem) {
      initialInventory.push({ item: pkg.bonusItem, quantity: 1 });
    }

    const newChaosRuns = chaosDraftRunsCount + 1;
    const newTotalRuns = totalRunsCount + 1;

    if (typeof window !== "undefined") {
      localStorage.setItem("chaosDraftRunsCount", String(newChaosRuns));
      localStorage.setItem("totalRunsCount", String(newTotalRuns));
    }

    set({
      activeSagaId: "chaos_draft",
      playerTeam: pkg.ninjas,
      runTeam,
      inventory: initialInventory,
      currentLevel: 1,
      currentRunScore: 0,
      activeMap: generateLevelMap("chaos_draft", 1),
      currentNodeId: null,
      isRunActive: true,
      availableChaosPackages: null,
      startingChoices: null,
      chaosDraftRunsCount: newChaosRuns,
      totalRunsCount: newTotalRuns,
      activePowerUps: [],
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      availableItemChoices: null,
      activeConsumableEffects: [],
      defeatedBosses: [],
    });

    get().saveToCloud();
  },

  chooseSurvivalSupply: (choiceId: string) => {
    const { availableSurvivalSupplies, runTeam, inventory, currentLevel } = get();
    const choice = availableSurvivalSupplies?.find((c) => c.id === choiceId);
    if (!choice) return;

    let updatedTeam = [...runTeam];
    let updatedInventory = [...inventory];

    if (choice.type === "heal" && choice.healPercent) {
      updatedTeam = updatedTeam.map((ninja) => {
        const eff = getNinjaEffectiveStats(ninja, [], updatedTeam, "it");
        const maxHp = eff.hpMax.total;
        const maxChakra = eff.chakraMax.total;
        const isFallen = ninja.currentHp <= 0;
        const healHp = Math.round((maxHp * choice.healPercent!) / 100);
        return {
          ...ninja,
          currentHp: isFallen ? Math.round(maxHp * 0.5) : Math.min(maxHp, ninja.currentHp + healHp),
          currentChakra: Math.min(maxChakra, ninja.currentChakra + healHp),
        };
      });
    } else if (choice.type === "item" && choice.rewardItem) {
      const existing = updatedInventory.findIndex((i) => i.item.id === choice.rewardItem!.id);
      if (existing >= 0) {
        updatedInventory[existing] = {
          ...updatedInventory[existing],
          quantity: updatedInventory[existing].quantity + 1,
        };
      } else {
        updatedInventory.push({ item: choice.rewardItem, quantity: 1 });
      }
    } else if (choice.type === "jutsu") {
      const scroll = ALL_ITEMS.find((i: GameItem) => i.id === "forbidden_jutsu_scroll");
      if (scroll) {
        const existing = updatedInventory.findIndex((i) => i.item.id === scroll.id);
        if (existing >= 0) {
          updatedInventory[existing].quantity += 1;
        } else {
          updatedInventory.push({ item: scroll, quantity: 1 });
        }
      }
    }

    const nextWave = currentLevel + 1;

    set({
      runTeam: updatedTeam,
      inventory: consolidateInventory(updatedInventory),
      currentLevel: nextWave,
      activeMap: generateLevelMap("survival_war", nextWave),
      currentNodeId: null,
      isSurvivalCampActive: false,
      availableSurvivalSupplies: null,
    });

    get().saveToCloud();
  },

  selectStartingCharacter: (id) => {
    const { startingChoices } = get();
    if (!startingChoices) return;

    const chosen = startingChoices.find((n) => n.id === id);
    if (!chosen) return;

    set({ playerTeam: [chosen] });
    get().startRun();
  },

  addNinjaToTeam: (id) =>
    set((state) => {
      const ninja = state.playerRoster.find((n) => n.id === id);
      if (ninja && state.playerTeam.length < 6 && !state.playerTeam.some((n) => n.id === id)) {
        return { playerTeam: [...state.playerTeam, ninja] };
      }
      return {};
    }),

  removeNinjaFromTeam: (id) =>
    set((state) => ({
      playerTeam: state.playerTeam.filter((n) => n.id !== id),
    })),

  startRun: () => {
    const { playerTeam, activeSagaId, totalRunsCount, classicRunsCount, shippudenRunsCount, towerRunsCount, survivalRunsCount, chaosDraftRunsCount } = get();
    if (playerTeam.length === 0 || !activeSagaId) return;

    const newTotalRuns = totalRunsCount + 1;
    const isClassic = activeSagaId === "classic_naruto";
    const isTower = activeSagaId === "endless_tower";
    const isSurvival = activeSagaId === "survival_war";
    const isChaos = activeSagaId === "chaos_draft";
    const newClassicRuns = isClassic ? classicRunsCount + 1 : classicRunsCount;
    const newShippudenRuns = activeSagaId === "shippuden_naruto" ? shippudenRunsCount + 1 : shippudenRunsCount;
    const newTowerRuns = isTower ? towerRunsCount + 1 : towerRunsCount;
    const newSurvivalRuns = isSurvival ? survivalRunsCount + 1 : survivalRunsCount;
    const newChaosRuns = isChaos ? chaosDraftRunsCount + 1 : chaosDraftRunsCount;

    if (typeof window !== "undefined") {
      localStorage.setItem("totalRunsCount", String(newTotalRuns));
      localStorage.setItem("classicRunsCount", String(newClassicRuns));
      localStorage.setItem("shippudenRunsCount", String(newShippudenRuns));
      localStorage.setItem("towerRunsCount", String(newTowerRuns));
      localStorage.setItem("survivalRunsCount", String(newSurvivalRuns));
      localStorage.setItem("chaosDraftRunsCount", String(newChaosRuns));
    }

    const runTeam: RunNinja[] = playerTeam.map((ninja) => ({
      ...ninja,
      level: 5,
      currentHp: ninja.baseStats.hp,
      currentChakra: ninja.baseStats.chakra,
    }));

    const initialTowerModifier = isTower ? getRandomTowerModifier(1) : null;

    set({
      runTeam,
      currentLevel: 1,
      currentRunScore: 0,
      activeMap: generateLevelMap(activeSagaId, 1),
      currentNodeId: null,
      isRunActive: true,
      activePowerUps: [],
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      availableItemChoices: null,
      inventory: [],
      activeConsumableEffects: [],
      defeatedBosses: [],
      totalRunsCount: newTotalRuns,
      classicRunsCount: newClassicRuns,
      shippudenRunsCount: newShippudenRuns,
      towerRunsCount: newTowerRuns,
      survivalRunsCount: newSurvivalRuns,
      chaosDraftRunsCount: newChaosRuns,
      activeTowerModifier: initialTowerModifier,
      recruitRerollCost: 75,
      sagaStarterChoices: {},
    });

    get().checkAndUnlockAchievements();
  },

  selectNode: (nodeId) => {
    const { activeMap, explainedNodeTypes } = get();
    const node = activeMap.find((n) => n.id === nodeId);
    if (!node || node.resolved) return;

    set({ currentNodeId: nodeId });

    if (!explainedNodeTypes.includes(node.type)) {
      const nodeTutorialKeys: Record<string, { titleKey: string; textKey: string }> = {
        powerup: { titleKey: "tutorialNodePowerupTitle", textKey: "tutorialNodePowerupText" },
        recruit: { titleKey: "tutorialNodeRecruitTitle", textKey: "tutorialNodeRecruitText" },
        heal: { titleKey: "tutorialNodeHealTitle", textKey: "tutorialNodeHealText" },
        boss: { titleKey: "tutorialNodeBossTitle", textKey: "tutorialNodeBossText" },
      };

      const popup = nodeTutorialKeys[node.type];
      if (popup) {
        const updatedExplained = [...explainedNodeTypes, node.type];
        set({
          activeNodeTutorialPopup: popup,
          explainedNodeTypes: updatedExplained,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("narutolike_explained_nodes", JSON.stringify(updatedExplained));
        }
      }
    }

    if (node.type === "heal") {
      // Allow player to open Ramen Ichiraku modal overlay to eat Ramen for 100% HP & 100% Chakra team heal
      return;
    }

    if (node.type === "powerup" || node.type === "item") {
      const randomItems = sampleRandomItems(3);
      set({
        availableItemChoices: randomItems,
      });
    }

    if (node.type === "recruit") {
      const { runTeam, defeatedBosses, activeSagaId } = get();
      const teamCharIds = runTeam.map((n) => n.characterId);
      const isShippuden = activeSagaId === "shippuden_naruto";

      const pool = Array.from(NINJA_MAP.values()).filter((n) => {
        if (teamCharIds.includes(n.characterId)) return false;

        if (isShippuden) {
          if (n.version !== "shippuden") return false;
        } else {
          if (n.version !== "kid") return false;
        }

        if (ALL_BOSS_IDS.includes(n.id)) {
          if (n.id === "gaara_kid") return true;
          return defeatedBosses.includes(n.id);
        }

        return true;
      });

      const sampledChoices = sampleNinjasByRarity(pool, 3);
      set({ availableRecruitChoices: sampledChoices });
    }

    if (node.type === "battle" || node.type === "boss") {
      const { runTeam } = get();
      const opponents = (node.opponents || [])
        .map((id) => NINJA_MAP.get(id))
        .filter((n): n is Ninja => n !== undefined);
      useBattleStore.getState().startBattle(runTeam, opponents);
    }
  },

  resolveCurrentNode: () => {
    const { currentNodeId, activeMap } = get();
    if (!currentNodeId) return;

    set({
      activeMap: activeMap.map((node) =>
        node.id === currentNodeId ? { ...node, resolved: true } : node
      ),
    });
  },

  choosePowerUp: (powerUp) => {
    const { activePowerUps } = get();

    if (powerUp.isJutsuUpgrade) {
      set({
        activePowerUps: [...activePowerUps, powerUp],
        pendingJutsuToLearn: "UPGRADE",
      });
    }
  },

  learnJutsu: (ninjaId) => {
    const { runTeam, pendingJutsuToLearn, currentNodeId, activeMap, activePowerUps } = get();
    const node = activeMap.find((n) => n.id === currentNodeId);
    if (!pendingJutsuToLearn) return;

    let oldJutsuId = "";
    let newJutsuId = "";

    const updatedTeam = runTeam.map((ninja) => {
      if (ninja.id === ninjaId) {
        const currentIndex = ninja.jutsuList.indexOf(ninja.activeJutsuId);
        const nextJutsuId = currentIndex < ninja.jutsuList.length - 1
          ? ninja.jutsuList[currentIndex + 1]
          : ninja.activeJutsuId;

        oldJutsuId = ninja.activeJutsuId;
        newJutsuId = nextJutsuId;

        return {
          ...ninja,
          activeJutsuId: nextJutsuId,
        };
      }
      return ninja;
    });

    const updatedPowerUps = [...activePowerUps];
    if (updatedPowerUps.length > 0) {
      const lastIdx = updatedPowerUps.length - 1;
      updatedPowerUps[lastIdx] = {
        ...updatedPowerUps[lastIdx],
        usedOnNinjaId: ninjaId,
        oldJutsuId,
        newJutsuId,
      };
    }

    set({
      runTeam: updatedTeam,
      pendingJutsuToLearn: null,
      availablePowerUpChoices: null,
      activePowerUps: updatedPowerUps,
    });

    get().gainTeamLevels(1); // Gain 1 level for move upgrade
    get().incrementDailyQuestProgress("upgrade_jutsu", 1);
    get().resolveCurrentNode();

    if (node?.type === "boss") {
      get().advanceToNextLevel();
    }
  },

  gainTeamLevels: (amount) => {
    const { runTeam } = get();
    const updatedTeam = runTeam.map((ninja) => {
      const newLevel = ninja.level + amount;
      const stats = { ...ninja.baseStats };

      stats.hp += amount * 10;
      stats.chakra += amount * 5;
      stats.attack += amount * 2;
      stats.defense += amount * 1;
      stats.speed += amount * 1;

      return {
        ...ninja,
        level: newLevel,
        baseStats: stats,
        currentHp: Math.min(stats.hp, ninja.currentHp + amount * 10),
        currentChakra: Math.min(stats.chakra, ninja.currentChakra + amount * 5),
      };
    });
    set({ runTeam: updatedTeam });
  },

  syncTeamStats: (updatedTeam) => {
    set({ runTeam: updatedTeam });

    const isWiped = updatedTeam.every((n) => n.currentHp <= 0);
    if (isWiped) {
      get().endRun();
    }
  },

  chooseRecruit: (ninjaId, replaceNinjaId) => {
    const { runTeam, availableRecruitChoices, inventory } = get();
    const chosen = (availableRecruitChoices || []).find((n) => n.id === ninjaId) || NINJA_MAP.get(ninjaId);
    if (!chosen) return;

    // Dynamically scale recruited ninja level & stats to match current team level
    const teamLevel = Math.max(5, ...runTeam.map((n) => n.level || 5));
    const N = Math.max(0, teamLevel - 5);
    const stats = { ...chosen.baseStats };

    stats.hp += N * 10;
    stats.chakra += N * 5;
    stats.attack += N * 2;
    stats.defense += N * 1;
    stats.speed += N * 1;

    const newNinja: RunNinja = {
      ...chosen,
      level: teamLevel,
      baseStats: stats,
      currentHp: stats.hp,
      currentChakra: stats.chakra,
    };

    let updatedTeam = [...runTeam];
    let updatedInventory = [...inventory];

    if (replaceNinjaId) {
      const dismissedNinja = runTeam.find((n) => n.id === replaceNinjaId);
      if (dismissedNinja?.equippedItem) {
        const itemToReturn = dismissedNinja.equippedItem;
        const existingIdx = updatedInventory.findIndex((inv) => inv.item.id === itemToReturn.id);
        if (existingIdx >= 0) {
          updatedInventory[existingIdx] = {
            ...updatedInventory[existingIdx],
            quantity: updatedInventory[existingIdx].quantity + 1,
          };
        } else {
          updatedInventory.push({ item: itemToReturn, quantity: 1 });
        }
      }
      updatedTeam = updatedTeam.map((n) => (n.id === replaceNinjaId ? newNinja : n));
    } else if (updatedTeam.length < 6) {
      updatedTeam.push(newNinja);
    }

    set({
      runTeam: updatedTeam,
      inventory: consolidateInventory(updatedInventory),
      availableRecruitChoices: null,
    });

    get().incrementDailyQuestProgress("recruit_ninjas", 1);
    get().resolveCurrentNode();
  },

  reviveAndContinueRun: (cost: number) => {
    const { totalCoins, sessionCoins, runTeam, activeConsumableEffects } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < cost) return false;

    const newTotalCoins = Math.max(0, totalCoins - cost);
    const newSessionCoins = Math.max(0, sessionCoins - cost);

    const revivedTeam = runTeam.map((ninja) => {
      const effStats = getNinjaEffectiveStats(ninja, activeConsumableEffects, runTeam, "it");
      return {
        ...ninja,
        currentHp: effStats.hpMax.total,
        currentChakra: effStats.chakraMax.total,
      };
    });

    set({
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
      runTeam: revivedTeam,
    });

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        updateCoinsInDB(newTotalCoins);
      } else {
        localStorage.setItem("guest_coins_cache", String(newSessionCoins));
      }
    }

    get().saveToCloud();
    return true;
  },

  buyAndRecruitNinja: (ninjaId: string, cost: number, replaceNinjaId?: string) => {
    const { totalCoins, sessionCoins } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < cost) return false;

    const newTotalCoins = Math.max(0, totalCoins - cost);
    const newSessionCoins = Math.max(0, sessionCoins - cost);

    set({
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
    });

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        updateCoinsInDB(newTotalCoins);
      } else {
        localStorage.setItem("guest_coins_cache", String(newSessionCoins));
      }
    }

    get().chooseRecruit(ninjaId, replaceNinjaId);
    get().saveToCloud();
    return true;
  },

  buyAndAddItemToInventory: (item: GameItem, cost: number) => {
    const { totalCoins, sessionCoins, inventory } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < cost) return false;

    const newTotalCoins = Math.max(0, totalCoins - cost);
    const newSessionCoins = Math.max(0, sessionCoins - cost);

    const updatedInventory = [...inventory];
    const existingIndex = updatedInventory.findIndex((inv) => inv.item.id === item.id);
    if (existingIndex >= 0) {
      updatedInventory[existingIndex] = {
        ...updatedInventory[existingIndex],
        quantity: updatedInventory[existingIndex].quantity + 1,
      };
    } else {
      updatedInventory.push({ item, quantity: 1 });
    }

    set({
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
      inventory: consolidateInventory(updatedInventory),
    });

    get().incrementDailyQuestProgress("collect_items", 1);

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        updateCoinsInDB(newTotalCoins);
      } else {
        localStorage.setItem("guest_coins_cache", String(newSessionCoins));
      }
    }

    get().saveToCloud();
    return true;
  },

  rerollRecruitChoices: () => {
    const { totalCoins, sessionCoins, recruitRerollCost, runTeam, defeatedBosses, activeSagaId } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < recruitRerollCost) return false;

    const newTotalCoins = Math.max(0, totalCoins - recruitRerollCost);
    const newSessionCoins = Math.max(0, sessionCoins - recruitRerollCost);
    const teamCharIds = runTeam.map((n) => n.characterId);
    const isShippuden = activeSagaId === "shippuden_naruto";

    const pool = Array.from(NINJA_MAP.values()).filter((n) => {
      if (teamCharIds.includes(n.characterId)) return false;
      if (isShippuden) {
        if (n.version !== "shippuden") return false;
      } else {
        if (n.version !== "kid") return false;
      }
      if (ALL_BOSS_IDS.includes(n.id)) {
        if (n.id === "gaara_kid") return true;
        return defeatedBosses.includes(n.id);
      }
      return true;
    });

    const newChoices = sampleNinjasByRarity(pool, 3);
    const nextCost = recruitRerollCost + 25;

    set({
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
      availableRecruitChoices: newChoices,
      recruitRerollCost: nextCost,
    });

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        updateCoinsInDB(newTotalCoins);
      } else {
        localStorage.setItem("guest_coins_cache", String(newSessionCoins));
      }
    }

    get().saveToCloud();
    return true;
  },

  chooseItemFromNode: (item: GameItem) => {
    const { inventory } = get();
    const updatedInventory = [...inventory];

    const existingIndex = updatedInventory.findIndex((inv) => inv.item.id === item.id);
    if (existingIndex >= 0) {
      updatedInventory[existingIndex] = {
        ...updatedInventory[existingIndex],
        quantity: updatedInventory[existingIndex].quantity + 1,
      };
    } else {
      updatedInventory.push({ item, quantity: 1 });
    }

    set({
      inventory: consolidateInventory(updatedInventory),
      availableItemChoices: null,
    });

    get().incrementDailyQuestProgress("collect_items", 1);
    get().resolveCurrentNode();
    get().saveToCloud();
  },

  useConsumableItem: (itemId: string, targetNinjaId?: string) => {
    const { inventory, runTeam, activeConsumableEffects } = get();
    const invIndex = inventory.findIndex((inv) => inv.item.id === itemId && inv.item.type === "consumable");
    if (invIndex < 0) return;

    const gameItem = inventory[invIndex].item;
    let updatedTeam = [...runTeam];

    // Effect: Heal percent HP & Chakra based on total effective stats
    if (gameItem.healPercent !== undefined || gameItem.healChakraPercent !== undefined) {
      updatedTeam = updatedTeam.map((ninja) => {
        const effStats = getNinjaEffectiveStats(ninja, activeConsumableEffects, runTeam, "it");
        const maxHp = effStats.hpMax.total;
        const maxChakra = effStats.chakraMax.total;

        let newHp = ninja.currentHp;
        let newChakra = ninja.currentChakra;

        if (gameItem.healPercent) {
          const boostHp = Math.round((maxHp * gameItem.healPercent) / 100);
          newHp = Math.min(maxHp, ninja.currentHp + boostHp);
        }
        if (gameItem.healChakraPercent) {
          const boostChakra = Math.round((maxChakra * gameItem.healChakraPercent) / 100);
          newChakra = Math.min(maxChakra, ninja.currentChakra + boostChakra);
        }

        return { ...ninja, currentHp: newHp, currentChakra: newChakra };
      });
    }

    // Effect: Jutsu level upgrade (Forbidden Scroll)
    if (gameItem.jutsuLevelUpgrade && targetNinjaId) {
      updatedTeam = updatedTeam.map((ninja) => {
        if (ninja.id === targetNinjaId) {
          const currentIndex = ninja.jutsuList.indexOf(ninja.activeJutsuId);
          const nextJutsuId =
            currentIndex < ninja.jutsuList.length - 1
              ? ninja.jutsuList[currentIndex + 1]
              : ninja.activeJutsuId;

          return {
            ...ninja,
            activeJutsuId: nextJutsuId,
          };
        }
        return ninja;
      });
    }

    // Register active battle boost effect if consumable grants temporary fight boosts
    let updatedActiveEffects = [...activeConsumableEffects];

    let durationFights = 0;
    if (gameItem.teamBattleStatBoost || gameItem.singleNinjaBattleStatBoost) {
      durationFights = gameItem.durationFights || 3;
    } else if (gameItem.coinMultiplierFights) {
      durationFights = gameItem.coinMultiplierFights;
    } else if (gameItem.luckRarityBoostFights) {
      durationFights = gameItem.luckRarityBoostFights;
    }

    if (durationFights > 0) {
      const existingIdx = updatedActiveEffects.findIndex((e) => e.item.id === gameItem.id);
      if (existingIdx >= 0) {
        updatedActiveEffects[existingIdx] = {
          ...updatedActiveEffects[existingIdx],
          remainingBattles: updatedActiveEffects[existingIdx].remainingBattles + durationFights,
        };
      } else {
        updatedActiveEffects.push({ item: gameItem, remainingBattles: durationFights });
      }
    }

    // Decrement quantity or remove from inventory
    const updatedInventory = [...inventory];
    if (updatedInventory[invIndex].quantity > 1) {
      updatedInventory[invIndex] = {
        ...updatedInventory[invIndex],
        quantity: updatedInventory[invIndex].quantity - 1,
      };
    } else {
      updatedInventory.splice(invIndex, 1);
    }

    set({
      runTeam: updatedTeam,
      inventory: updatedInventory,
      activeConsumableEffects: updatedActiveEffects,
    });

    get().incrementDailyQuestProgress("use_consumables", 1);
    get().saveToCloud();
  },

  decrementConsumableEffectsOnBattle: () => {
    const { activeConsumableEffects } = get();
    if (activeConsumableEffects.length === 0) return;

    const updated = activeConsumableEffects
      .map((e) => ({ ...e, remainingBattles: e.remainingBattles - 1 }))
      .filter((e) => e.remainingBattles > 0);

    set({ activeConsumableEffects: updated });
  },

  equipItemToNinja: (itemId: string, targetNinjaId: string) => {
    const { inventory, runTeam, activeConsumableEffects } = get();
    const invIndex = inventory.findIndex((inv) => inv.item.id === itemId && inv.item.type === "assignable");
    if (invIndex < 0) return;

    const gameItem = inventory[invIndex].item;
    const ninjaIndex = runTeam.findIndex((n) => n.id === targetNinjaId);
    if (ninjaIndex < 0) return;

    const targetNinja = runTeam[ninjaIndex];
    const oldEffStats = getNinjaEffectiveStats(targetNinja, activeConsumableEffects, runTeam, "it");
    const oldMaxHp = oldEffStats.hpMax.total;
    const wasFullHp = targetNinja.currentHp >= oldMaxHp;

    const oldMaxChakra = oldEffStats.chakraMax.total;
    const wasFullChakra = targetNinja.currentChakra >= oldMaxChakra;

    const updatedInventory = [...inventory];
    if (targetNinja.equippedItem) {
      const returnItem = targetNinja.equippedItem;
      const existingIdx = updatedInventory.findIndex((inv) => inv.item.id === returnItem.id);
      if (existingIdx >= 0) {
        updatedInventory[existingIdx] = {
          ...updatedInventory[existingIdx],
          quantity: updatedInventory[existingIdx].quantity + 1,
        };
      } else {
        updatedInventory.push({ item: returnItem, quantity: 1 });
      }
    }

    if (updatedInventory[invIndex].quantity > 1) {
      updatedInventory[invIndex] = {
        ...updatedInventory[invIndex],
        quantity: updatedInventory[invIndex].quantity - 1,
      };
    } else {
      updatedInventory.splice(invIndex, 1);
    }

    const updatedTeam = [...runTeam];
    const ninjaWithItem = {
      ...targetNinja,
      equippedItem: gameItem,
    };
    updatedTeam[ninjaIndex] = ninjaWithItem;

    const newEffStats = getNinjaEffectiveStats(ninjaWithItem, activeConsumableEffects, updatedTeam, "it");
    const newMaxHp = newEffStats.hpMax.total;
    const hpBonus = Math.max(0, newMaxHp - oldMaxHp);

    const newMaxChakra = newEffStats.chakraMax.total;
    const chakraBonus = Math.max(0, newMaxChakra - oldMaxChakra);

    const newHp = wasFullHp ? newMaxHp : Math.min(newMaxHp, targetNinja.currentHp + hpBonus);
    const newChakra = wasFullChakra ? newMaxChakra : Math.min(newMaxChakra, targetNinja.currentChakra + chakraBonus);

    updatedTeam[ninjaIndex] = {
      ...ninjaWithItem,
      currentHp: newHp,
      currentChakra: newChakra,
    };

    set({
      runTeam: updatedTeam,
      inventory: consolidateInventory(updatedInventory),
    });

    get().incrementDailyQuestProgress("equip_items", 1);
    get().saveToCloud();
  },

  unequipItemFromNinja: (targetNinjaId: string) => {
    const { inventory, runTeam, activeConsumableEffects } = get();
    const ninjaIndex = runTeam.findIndex((n) => n.id === targetNinjaId);
    if (ninjaIndex < 0) return;

    const targetNinja = runTeam[ninjaIndex];
    if (!targetNinja.equippedItem) return;

    const equipped = targetNinja.equippedItem;
    const updatedTeam = [...runTeam];
    const ninjaWithoutItem = {
      ...targetNinja,
      equippedItem: null,
    };
    updatedTeam[ninjaIndex] = ninjaWithoutItem;

    const newEffStats = getNinjaEffectiveStats(ninjaWithoutItem, activeConsumableEffects, updatedTeam, "it");
    const newMaxHp = newEffStats.hpMax.total;
    const newHp = Math.min(newMaxHp, targetNinja.currentHp);

    const newMaxChakra = newEffStats.chakraMax.total;
    const newChakra = Math.min(newMaxChakra, targetNinja.currentChakra);

    updatedTeam[ninjaIndex] = {
      ...ninjaWithoutItem,
      currentHp: newHp,
      currentChakra: newChakra,
    };

    const updatedInventory = [...inventory];
    const existingIdx = updatedInventory.findIndex((inv) => inv.item.id === equipped.id);
    if (existingIdx >= 0) {
      updatedInventory[existingIdx] = {
        ...updatedInventory[existingIdx],
        quantity: updatedInventory[existingIdx].quantity + 1,
      };
    } else {
      updatedInventory.push({ item: equipped, quantity: 1 });
    }

    set({
      runTeam: updatedTeam,
      inventory: consolidateInventory(updatedInventory),
    });

    get().saveToCloud();
  },

  moveNinjaUp: (index) => {
    const { runTeam } = get();
    if (index <= 0 || index >= runTeam.length) return;

    const updated = [...runTeam];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    set({ runTeam: updated });
  },

  moveNinjaDown: (index) => {
    const { runTeam } = get();
    if (index < 0 || index >= runTeam.length - 1) return;

    const updated = [...runTeam];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    set({ runTeam: updated });
  },

  setLeaderNinja: (index) => {
    const { runTeam } = get();
    if (index <= 0 || index >= runTeam.length) return;

    const updated = [...runTeam];
    const leader = updated.splice(index, 1)[0];
    updated.unshift(leader);

    set({ runTeam: updated });
  },

  reorderTeam: (fromIndex, toIndex) => {
    const { runTeam } = get();
    if (
      fromIndex < 0 ||
      fromIndex >= runTeam.length ||
      toIndex < 0 ||
      toIndex >= runTeam.length ||
      fromIndex === toIndex
    ) {
      return;
    }
    const updated = [...runTeam];
    const [dragged] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, dragged);
    set({ runTeam: updated });
  },

  autoSortTeam: () => {
    const { runTeam } = get();
    if (runTeam.length <= 1) return;

    const rankBonusMap: Record<string, number> = { S: 400, A: 250, B: 100, C: 0 };
    const getStrength = (ninja: RunNinja) => {
      const rankBonus = rankBonusMap[ninja.rank || "C"] || 0;
      return (
        ninja.level * 100 +
        ninja.baseStats.attack * 4 +
        ninja.baseStats.hp +
        ninja.baseStats.chakra * 2 +
        ninja.baseStats.defense * 2 +
        ninja.baseStats.speed * 2 +
        rankBonus
      );
    };

    const updated = [...runTeam].sort((a, b) => getStrength(b) - getStrength(a));
    set({ runTeam: updated });
  },

  applyHealingAtCampfire: (healPercent: number = 100, cost: number = 0) => {
    const { totalCoins, sessionCoins, runTeam, activeConsumableEffects } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (cost > 0 && currentCoins < cost) return false;

    const newTotalCoins = Math.max(0, totalCoins - cost);
    const newSessionCoins = Math.max(0, sessionCoins - cost);

    const updatedTeam = runTeam.map((ninja) => {
      const effStats = getNinjaEffectiveStats(ninja, activeConsumableEffects, runTeam, "it");
      const maxHp = effStats.hpMax.total;
      const maxChakra = effStats.chakraMax.total;

      const healHp = Math.round((maxHp * healPercent) / 100);
      const healChakra = Math.round((maxChakra * healPercent) / 100);

      return {
        ...ninja,
        currentHp: Math.min(maxHp, ninja.currentHp + healHp),
        currentChakra: Math.min(maxChakra, ninja.currentChakra + healChakra),
      };
    });

    set({
      totalCoins: newTotalCoins,
      sessionCoins: newSessionCoins,
      runTeam: updatedTeam,
    });

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        updateCoinsInDB(newTotalCoins);
      } else {
        localStorage.setItem("guest_coins_cache", String(newSessionCoins));
      }
    }

    get().incrementDailyQuestProgress("eat_ramen", 1);
    get().resolveCurrentNode();
    get().saveToCloud();
    return true;
  },

  advanceToNextLevel: () => {
    const { currentLevel, activeSagaId, currentRunScore, towerMaxFloor, totalCoins, sessionCoins } = get();
    if (!activeSagaId) return;

    // Saga level caps & final boss completions
    if (activeSagaId === "classic_naruto" && currentLevel >= 5) {
      // Defeated final boss of Classic Naruto! (+2000 Final Boss Bonus + 200 Level Advance)
      const finalScore = currentRunScore + 2200;
      const earnedCoins = Math.floor(finalScore * 0.01);
      set({
        shippudenUnlocked: true,
        currentRunScore: finalScore,
        completedSagaVictory: {
          sagaId: "classic_naruto",
          scoreGained: finalScore,
          coinsGained: earnedCoins,
        },
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("shippudenUnlocked", "true");
      }

      get().endRun();
      return;
    }

    if (activeSagaId === "shippuden_naruto" && currentLevel >= 10) {
      // Defeated final boss of Shippuden! (+5000 Final Boss Bonus + 200 Level Advance)
      const finalScore = currentRunScore + 5200;
      const earnedCoins = Math.floor(finalScore * 0.01);
      set({
        currentRunScore: finalScore,
        completedSagaVictory: {
          sagaId: "shippuden_naruto",
          scoreGained: finalScore,
          coinsGained: earnedCoins,
        },
      });

      get().endRun();
      return;
    }

    if (activeSagaId === "endless_tower") {
      // Endless Tower floor cleared!
      const isBossFloor = currentLevel % 5 === 0;
      const floorRewardCoins = isBossFloor ? 100 : 25;
      const floorRewardScore = isBossFloor ? 600 : 250;

      const nextLevel = currentLevel + 1;
      const updatedScore = currentRunScore + floorRewardScore;
      const newMaxFloor = Math.max(towerMaxFloor, currentLevel);
      const newTotalCoins = totalCoins + floorRewardCoins;
      const newSessionCoins = sessionCoins + floorRewardCoins;
      const nextModifier = getRandomTowerModifier(nextLevel);

      const { user } = useAuthStore.getState();
      if (user) {
        updateCoinsInDB(newTotalCoins);
      }

      set({
        currentLevel: nextLevel,
        currentRunScore: updatedScore,
        towerMaxFloor: newMaxFloor,
        totalCoins: newTotalCoins,
        sessionCoins: newSessionCoins,
        activeTowerModifier: nextModifier,
        activeMap: generateLevelMap(activeSagaId, nextLevel),
        currentNodeId: null,
        availablePowerUpChoices: null,
        pendingJutsuToLearn: null,
        availableRecruitChoices: null,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("towerMaxFloor", String(newMaxFloor));
        if (user) {
          localStorage.setItem("totalCoins", String(newTotalCoins));
        } else {
          localStorage.setItem("guest_coins_cache", String(newSessionCoins));
        }
      }

      get().saveToCloud();
      get().checkAndUnlockAchievements();
      return;
    }

    const nextLevel = currentLevel + 1;
    const updatedScore = currentRunScore + 200; // Level advance bonus

    set({
      currentLevel: nextLevel,
      currentRunScore: updatedScore,
      activeMap: generateLevelMap(activeSagaId, nextLevel),
      currentNodeId: null,
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
    });

    get().saveToCloud();
    get().checkAndUnlockAchievements();
  },

  endRun: () => {
    const {
      currentRunScore,
      totalScore,
      classicHighScore,
      shippudenHighScore,
      towerHighScore,
      towerMaxFloor,
      survivalHighScore,
      survivalMaxWave,
      chaosDraftHighScore,
      activeSagaId,
      classicRunsCount,
      shippudenRunsCount,
      towerRunsCount,
      survivalRunsCount,
      chaosDraftRunsCount,
      totalRunsCount,
      totalCoins,
      sessionCoins,
      currentLevel,
    } = get();
    const { user } = useAuthStore.getState();

    // Earn coins equal to 1% of points earned in this completed run (win or lose)
    const earnedCoins = Math.floor(currentRunScore * 0.01);
    const newTotalCoins = totalCoins + earnedCoins;
    const newSessionCoins = sessionCoins + earnedCoins;

    if (user) {
      updateCoinsInDB(newTotalCoins);
    } else if (typeof window !== "undefined") {
      localStorage.setItem("guest_coins_cache", String(newSessionCoins));
    }

    // Accumulate current run score into total cumulative score if points were scored
    if (currentRunScore > 0) {
      const newTotalScore = totalScore + currentRunScore;
      let newClassicHigh = classicHighScore;
      let newShippudenHigh = shippudenHighScore;
      let newTowerHigh = towerHighScore;
      let newTowerFloor = towerMaxFloor;
      let newSurvivalHigh = survivalHighScore;
      let newSurvivalWave = survivalMaxWave;
      let newChaosDraftHigh = chaosDraftHighScore;
      let newClassicRuns = classicRunsCount;
      let newShippudenRuns = shippudenRunsCount;
      let newTowerRuns = towerRunsCount;
      let newSurvivalRuns = survivalRunsCount;
      let newChaosDraftRuns = chaosDraftRunsCount;
      let newTotalRuns = totalRunsCount + 1;

      if (activeSagaId === "classic_naruto") {
        newClassicHigh = Math.max(classicHighScore, currentRunScore);
        newClassicRuns += 1;
      } else if (activeSagaId === "shippuden_naruto") {
        newShippudenHigh = Math.max(shippudenHighScore, currentRunScore);
        newShippudenRuns += 1;
      } else if (activeSagaId === "endless_tower") {
        newTowerHigh = Math.max(towerHighScore, currentRunScore);
        newTowerFloor = Math.max(towerMaxFloor, currentLevel);
        newTowerRuns += 1;
      } else if (activeSagaId === "survival_war") {
        newSurvivalHigh = Math.max(survivalHighScore, currentRunScore);
        newSurvivalWave = Math.max(survivalMaxWave, currentLevel);
        newSurvivalRuns += 1;
      } else if (activeSagaId === "chaos_draft") {
        newChaosDraftHigh = Math.max(chaosDraftHighScore, currentRunScore);
        newChaosDraftRuns += 1;
      }

      set({
        totalScore: newTotalScore,
        classicHighScore: newClassicHigh,
        shippudenHighScore: newShippudenHigh,
        towerHighScore: newTowerHigh,
        towerMaxFloor: newTowerFloor,
        survivalHighScore: newSurvivalHigh,
        survivalMaxWave: newSurvivalWave,
        chaosDraftHighScore: newChaosDraftHigh,
        classicRunsCount: newClassicRuns,
        shippudenRunsCount: newShippudenRuns,
        towerRunsCount: newTowerRuns,
        survivalRunsCount: newSurvivalRuns,
        chaosDraftRunsCount: newChaosDraftRuns,
        totalRunsCount: newTotalRuns,
        totalCoins: newTotalCoins,
        sessionCoins: newSessionCoins,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("totalScore", String(newTotalScore));
        localStorage.setItem("classicHighScore", String(newClassicHigh));
        localStorage.setItem("shippudenHighScore", String(newShippudenHigh));
        localStorage.setItem("towerHighScore", String(newTowerHigh));
        localStorage.setItem("towerMaxFloor", String(newTowerFloor));
        localStorage.setItem("survivalHighScore", String(newSurvivalHigh));
        localStorage.setItem("survivalMaxWave", String(newSurvivalWave));
        localStorage.setItem("chaosDraftHighScore", String(newChaosDraftHigh));
        localStorage.setItem("classicRunsCount", String(newClassicRuns));
        localStorage.setItem("shippudenRunsCount", String(newShippudenRuns));
        localStorage.setItem("towerRunsCount", String(newTowerRuns));
        localStorage.setItem("survivalRunsCount", String(newSurvivalRuns));
        localStorage.setItem("chaosDraftRunsCount", String(newChaosDraftRuns));
        localStorage.setItem("totalRunsCount", String(newTotalRuns));
        if (user) {
          localStorage.setItem("totalCoins", String(newTotalCoins));
        } else {
          localStorage.setItem("guest_coins_cache", String(newSessionCoins));
        }
      }
    } else {
      set({
        totalCoins: newTotalCoins,
        sessionCoins: newSessionCoins,
      });
      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("totalCoins", String(newTotalCoins));
        } else {
          localStorage.setItem("guest_coins_cache", String(newSessionCoins));
        }
      }
    }

    set({
      isRunActive: false,
      activeSagaId: null,
      activeTowerModifier: null,
      playerTeam: [],
      runTeam: [],
      currentNodeId: null,
      activeMap: [],
      startingChoices: null,
      sagaStarterChoices: {},
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      currentRunScore: 0,
      inventory: [],
      activeConsumableEffects: [],
      isSurvivalCampActive: false,
      availableSurvivalSupplies: null,
      availableChaosPackages: null,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("narutolike_guest_run_save");
    }

    get().saveToCloud();
    get().checkAndUnlockAchievements();
  },

  abandonRun: () => {
    // Abandoning a run forfeits ALL points and coins for this run
    set({
      isRunActive: false,
      activeSagaId: null,
      playerTeam: [],
      runTeam: [],
      currentNodeId: null,
      activeMap: [],
      startingChoices: null,
      sagaStarterChoices: {},
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      currentRunScore: 0,
      inventory: [],
      activeConsumableEffects: [],
      isSurvivalCampActive: false,
      availableSurvivalSupplies: null,
      availableChaosPackages: null,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("narutolike_guest_run_save");
    }

    get().saveToCloud();
  },

  registerBossDefeat: (bossId) => {
    const { defeatedBosses } = get();
    if (defeatedBosses.includes(bossId)) return;

    const updated = [...defeatedBosses, bossId];
    set({ defeatedBosses: updated });
    if (typeof window !== "undefined") {
      localStorage.setItem("defeatedBosses", JSON.stringify(updated));
    }

    get().checkAndUnlockAchievements();
  },

  saveToCloud: async () => {
    if (isLoggingOut) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const state = get();

    // 1. Save active game save state with all extended node choices & run fields
    await supabase.from("game_saves").upsert({
      id: session.user.id,
      updated_at: new Date(),
      active_saga_id: state.activeSagaId,
      current_level: state.currentLevel,
      currentNodeId: state.currentNodeId,
      is_run_active: state.isRunActive,
      run_team: state.runTeam,
      active_map: state.activeMap,
      active_power_ups: state.activePowerUps,
      available_power_up_choices: state.availablePowerUpChoices,
      pending_jutsu_to_learn: state.pendingJutsuToLearn,
      available_recruit_choices: state.availableRecruitChoices,
      available_item_choices: state.availableItemChoices,
      inventory: state.inventory,
      active_consumable_effects: state.activeConsumableEffects,
      defeated_bosses: state.defeatedBosses,
      current_run_score: state.currentRunScore,
      recruit_reroll_cost: state.recruitRerollCost,
      starting_choices: state.startingChoices,
      daily_quests: state.dailyQuestsData,
      tower_floor: state.activeSagaId === "endless_tower" ? state.currentLevel : 1,
      tower_modifier: state.activeTowerModifier?.id || null,
    });

    // 2. Fetch existing profile stats using maybeSingle()
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("total_runs, classic_runs, shippuden_runs, tower_runs, survival_runs, chaos_draft_runs, max_level_reached, total_score, classic_high_score, shippuden_high_score, tower_high_score, tower_max_floor, survival_max_wave, survival_high_score, chaos_draft_high_score, total_coins")
      .eq("id", session.user.id)
      .maybeSingle();

    const dbTotal = existingProfile?.total_runs ?? 0;
    const dbClassic = existingProfile?.classic_runs ?? 0;
    const dbShippuden = existingProfile?.shippuden_runs ?? 0;
    const dbTower = existingProfile?.tower_runs ?? 0;
    const dbSurvival = existingProfile?.survival_runs ?? 0;
    const dbChaos = existingProfile?.chaos_draft_runs ?? 0;
    const dbMaxLevel = existingProfile?.max_level_reached ?? 1;
    const dbTotalScore = existingProfile?.total_score ?? 0;
    const dbClassicHigh = existingProfile?.classic_high_score ?? 0;
    const dbShippudenHigh = existingProfile?.shippuden_high_score ?? 0;
    const dbTowerHigh = existingProfile?.tower_high_score ?? 0;
    const dbTowerMaxFloor = existingProfile?.tower_max_floor ?? 0;
    const dbSurvivalMaxWave = existingProfile?.survival_max_wave ?? 0;
    const dbSurvivalHigh = existingProfile?.survival_high_score ?? 0;
    const dbChaosHigh = existingProfile?.chaos_draft_high_score ?? 0;

    // Strict non-decreasing calculation
    const finalTotal = Math.max(dbTotal, state.totalRunsCount);
    const finalClassic = Math.max(dbClassic, state.classicRunsCount);
    const finalShippuden = Math.max(dbShippuden, state.shippudenRunsCount);
    const finalTower = Math.max(dbTower, state.towerRunsCount);
    const finalSurvival = Math.max(dbSurvival, state.survivalRunsCount);
    const finalChaos = Math.max(dbChaos, state.chaosDraftRunsCount);
    const finalMaxLevel = Math.max(dbMaxLevel, state.shippudenUnlocked ? 6 : state.currentLevel);
    const finalTotalScore = Math.max(dbTotalScore, state.totalScore);
    const finalClassicHigh = Math.max(dbClassicHigh, state.classicHighScore);
    const finalShippudenHigh = Math.max(dbShippudenHigh, state.shippudenHighScore);
    const finalTowerHigh = Math.max(dbTowerHigh, state.towerHighScore);
    const finalTowerMaxFloor = Math.max(dbTowerMaxFloor, state.towerMaxFloor);
    const finalSurvivalMaxWave = Math.max(dbSurvivalMaxWave, state.survivalMaxWave);
    const finalSurvivalHigh = Math.max(dbSurvivalHigh, state.survivalHighScore);
    const finalChaosHigh = Math.max(dbChaosHigh, state.chaosDraftHighScore);

    // State totalCoins holds the true current balance (reflecting earnings and expenditures)
    const finalCoins = state.totalCoins;

    // Keep store synchronized
    set({
      totalRunsCount: finalTotal,
      classicRunsCount: finalClassic,
      shippudenRunsCount: finalShippuden,
      towerRunsCount: finalTower,
      survivalRunsCount: finalSurvival,
      chaosDraftRunsCount: finalChaos,
      totalScore: finalTotalScore,
      classicHighScore: finalClassicHigh,
      shippudenHighScore: finalShippudenHigh,
      towerHighScore: finalTowerHigh,
      towerMaxFloor: finalTowerMaxFloor,
      survivalMaxWave: finalSurvivalMaxWave,
      survivalHighScore: finalSurvivalHigh,
      chaosDraftHighScore: finalChaosHigh,
      totalCoins: finalCoins,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("totalRunsCount", String(finalTotal));
      localStorage.setItem("classicRunsCount", String(finalClassic));
      localStorage.setItem("shippudenRunsCount", String(finalShippuden));
      localStorage.setItem("towerRunsCount", String(finalTower));
      localStorage.setItem("survivalRunsCount", String(finalSurvival));
      localStorage.setItem("chaosDraftRunsCount", String(finalChaos));
      localStorage.setItem("totalScore", String(finalTotalScore));
      localStorage.setItem("classicHighScore", String(finalClassicHigh));
      localStorage.setItem("shippudenHighScore", String(finalShippudenHigh));
      localStorage.setItem("towerHighScore", String(finalTowerHigh));
      localStorage.setItem("towerMaxFloor", String(finalTowerMaxFloor));
      localStorage.setItem("survivalMaxWave", String(finalSurvivalMaxWave));
      localStorage.setItem("survivalHighScore", String(finalSurvivalHigh));
      localStorage.setItem("chaosDraftHighScore", String(finalChaosHigh));
      localStorage.setItem("totalCoins", String(finalCoins));
      localStorage.setItem("shippudenUnlocked", String(finalMaxLevel >= 5));
      localStorage.setItem("defeatedBosses", JSON.stringify(state.defeatedBosses));
    }

    const userAuthName = useAuthStore.getState().username || session.user.user_metadata?.username || (session.user.email ? session.user.email.split("@")[0] : "Shinobi");

    await supabase.from("profiles").upsert({
      id: session.user.id,
      username: userAuthName,
      max_level_reached: finalMaxLevel,
      total_runs: finalTotal,
      classic_runs: finalClassic,
      shippuden_runs: finalShippuden,
      tower_runs: finalTower,
      survival_runs: finalSurvival,
      chaos_draft_runs: finalChaos,
      total_score: finalTotalScore,
      classic_high_score: finalClassicHigh,
      shippuden_high_score: finalShippudenHigh,
      tower_high_score: finalTowerHigh,
      tower_max_floor: finalTowerMaxFloor,
      survival_max_wave: finalSurvivalMaxWave,
      survival_high_score: finalSurvivalHigh,
      chaos_draft_high_score: finalChaosHigh,
      total_coins: finalCoins,
      unlocked_achievements: state.unlockedAchievementsMap,
      custom_keybindings: state.customKeybindings,
      daily_quests: state.dailyQuestsData,
      updated_at: new Date()
    });
  },

  loadCloudSave: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: save } = await supabase
      .from("game_saves")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (save) {
      const isRunActive = save.is_run_active || false;
      const loadedRunTeam = save.run_team || [];
      const loadedMap = save.active_map || [];
      const loadedBosses = save.defeated_bosses || [];

      const isTower = save.active_saga_id === "endless_tower";
      const restoredModifier = save.tower_modifier ? TOWER_MODIFIER_MAP.get(save.tower_modifier) || null : (isTower ? getRandomTowerModifier(save.current_level || 1) : null);

      set({
        activeSagaId: save.active_saga_id || null,
        currentLevel: save.current_level || 1,
        currentNodeId: save.currentNodeId || save.current_node_id || null,
        isRunActive: isRunActive,
        activeTowerModifier: restoredModifier,
        runTeam: loadedRunTeam,
        playerTeam: isRunActive ? loadedRunTeam : [],
        activeMap: loadedMap,
        activePowerUps: save.active_power_ups || [],
        availablePowerUpChoices: isRunActive ? (save.available_power_up_choices || null) : null,
        pendingJutsuToLearn: isRunActive ? (save.pending_jutsu_to_learn || null) : null,
        availableRecruitChoices: isRunActive ? (save.available_recruit_choices || null) : null,
        availableItemChoices: isRunActive ? (save.available_item_choices || null) : null,
        inventory: isRunActive ? consolidateInventory(save.inventory || []) : [],
        activeConsumableEffects: isRunActive ? (save.active_consumable_effects || []) : [],
        defeatedBosses: loadedBosses,
        currentRunScore: isRunActive ? (save.current_run_score || 0) : 0,
        recruitRerollCost: isRunActive ? (save.recruit_reroll_cost || 75) : 75,
        startingChoices: isRunActive ? (save.starting_choices || null) : null,
        shippudenUnlocked: (profile?.max_level_reached || 0) >= 5 || false
      });

      if (typeof window !== "undefined" && loadedBosses.length > 0) {
        localStorage.setItem("defeatedBosses", JSON.stringify(loadedBosses));
      }
      if (isRunActive) {
        get().autoResolvePendingBattleNode();
      }
    }
    if (profile) {
      const dbTotal = profile.total_runs ?? 0;
      const dbClassic = profile.classic_runs ?? 0;
      const dbShippuden = profile.shippuden_runs ?? 0;
      const dbTower = profile.tower_runs ?? 0;
      const dbSurvival = profile.survival_runs ?? 0;
      const dbChaos = profile.chaos_draft_runs ?? 0;
      const maxLevel = profile.max_level_reached ?? 1;
      const dbTotalScore = profile.total_score ?? 0;
      const dbClassicHigh = profile.classic_high_score ?? 0;
      const dbShippudenHigh = profile.shippuden_high_score ?? 0;
      const dbTowerHigh = profile.tower_high_score ?? 0;
      const dbTowerMaxFloor = profile.tower_max_floor ?? 0;
      const dbSurvivalMaxWave = profile.survival_max_wave ?? 0;
      const dbSurvivalHigh = profile.survival_high_score ?? 0;
      const dbChaosHigh = profile.chaos_draft_high_score ?? 0;
      const dbCoins = profile.total_coins ?? 0;

      let loadedAchievementsMap: Record<string, string> = {};
      if (profile.unlocked_achievements) {
        if (typeof profile.unlocked_achievements === "object" && !Array.isArray(profile.unlocked_achievements)) {
          loadedAchievementsMap = profile.unlocked_achievements;
        } else if (Array.isArray(profile.unlocked_achievements)) {
          profile.unlocked_achievements.forEach((id: string) => {
            loadedAchievementsMap[id] = new Date().toISOString();
          });
        }
      } else if (typeof window !== "undefined") {
        try {
          loadedAchievementsMap = JSON.parse(localStorage.getItem("unlockedAchievementsMap") || "{}");
        } catch {
          loadedAchievementsMap = {};
        }
      }

      let loadedKeybindings: CustomKeybindings = DEFAULT_KEYBINDINGS;
      if (profile.custom_keybindings && typeof profile.custom_keybindings === "object") {
        loadedKeybindings = { ...DEFAULT_KEYBINDINGS, ...profile.custom_keybindings };
      } else if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("custom_keybindings");
          if (saved) loadedKeybindings = { ...DEFAULT_KEYBINDINGS, ...JSON.parse(saved) };
        } catch {
          loadedKeybindings = DEFAULT_KEYBINDINGS;
        }
      }

      const isTutorialDone = dbTotal > 0 || (typeof window !== "undefined" && localStorage.getItem("narutolike_tutorial_completed") === "true");

      set({
        totalRunsCount: dbTotal,
        classicRunsCount: dbClassic,
        shippudenRunsCount: dbShippuden,
        towerRunsCount: dbTower,
        survivalRunsCount: dbSurvival,
        chaosDraftRunsCount: dbChaos,
        totalScore: dbTotalScore,
        classicHighScore: dbClassicHigh,
        shippudenHighScore: dbShippudenHigh,
        towerHighScore: dbTowerHigh,
        towerMaxFloor: dbTowerMaxFloor,
        survivalMaxWave: dbSurvivalMaxWave,
        survivalHighScore: dbSurvivalHigh,
        chaosDraftHighScore: dbChaosHigh,
        totalCoins: dbCoins,
        shippudenUnlocked: maxLevel >= 5,
        hasCompletedTutorial: isTutorialDone,
        unlockedAchievementsMap: loadedAchievementsMap,
        customKeybindings: loadedKeybindings,
      });

      if (typeof window !== "undefined") {
        if (isTutorialDone) {
          localStorage.setItem("narutolike_tutorial_completed", "true");
        }
        localStorage.setItem("custom_keybindings", JSON.stringify(loadedKeybindings));
        localStorage.setItem("totalRunsCount", String(dbTotal));
        localStorage.setItem("classicRunsCount", String(dbClassic));
        localStorage.setItem("shippudenRunsCount", String(dbShippuden));
        localStorage.setItem("towerRunsCount", String(dbTower));
        localStorage.setItem("totalScore", String(dbTotalScore));
        localStorage.setItem("classicHighScore", String(dbClassicHigh));
        localStorage.setItem("shippudenHighScore", String(dbShippudenHigh));
        localStorage.setItem("towerHighScore", String(dbTowerHigh));
        localStorage.setItem("towerMaxFloor", String(dbTowerMaxFloor));
        localStorage.setItem("totalCoins", String(dbCoins));
        localStorage.setItem("shippudenUnlocked", String(maxLevel >= 5));
        localStorage.setItem("unlockedAchievementsMap", JSON.stringify(loadedAchievementsMap));
      }
    }

    // Safe daily quests loading: Merge local + profile + game_saves so completed quests are NEVER lost!
    const localDailyQuests = typeof window !== "undefined"
      ? (() => {
          try {
            const raw = localStorage.getItem("narutolike_daily_quests");
            return raw ? JSON.parse(raw) : null;
          } catch { return null; }
        })()
      : null;

    let mergedQuests = mergeDailyQuestsStates(get().dailyQuestsData, localDailyQuests);
    if (profile?.daily_quests) {
      mergedQuests = mergeDailyQuestsStates(mergedQuests, profile.daily_quests);
    }
    if (save?.daily_quests) {
      mergedQuests = mergeDailyQuestsStates(mergedQuests, save.daily_quests);
    }

    set({ dailyQuestsData: mergedQuests });
    if (typeof window !== "undefined") {
      localStorage.setItem("narutolike_daily_quests", JSON.stringify(mergedQuests));
    }

    get().checkAndUnlockAchievements();
  },

  saveGuestRunToLocalStorage: () => {
    if (typeof window === "undefined") return;
    const user = useAuthStore.getState().user;
    if (user) return; // Only save to guest localStorage if not logged in

    const state = get();
    if (!state.isRunActive) {
      localStorage.removeItem("narutolike_guest_run_save");
      return;
    }
    const runData = {
      isRunActive: state.isRunActive,
      activeSagaId: state.activeSagaId,
      currentLevel: state.currentLevel,
      currentNodeId: state.currentNodeId,
      activeMap: state.activeMap,
      runTeam: state.runTeam,
      playerTeam: state.playerTeam,
      startingChoices: state.startingChoices,
      activePowerUps: state.activePowerUps,
      availablePowerUpChoices: state.availablePowerUpChoices,
      pendingJutsuToLearn: state.pendingJutsuToLearn,
      availableRecruitChoices: state.availableRecruitChoices,
      availableItemChoices: state.availableItemChoices,
      inventory: state.inventory,
      activeConsumableEffects: state.activeConsumableEffects,
      defeatedBosses: state.defeatedBosses,
      currentRunScore: state.currentRunScore,
      recruitRerollCost: state.recruitRerollCost,
    };
    localStorage.setItem("narutolike_guest_run_save", JSON.stringify(runData));
  },

  loadGuestRunFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    const user = useAuthStore.getState().user;
    if (user) return; // Only load guest save if not logged in

    if (typeof window !== "undefined") {
      const savedQuests = localStorage.getItem("narutolike_daily_quests");
      if (savedQuests) {
        try {
          const parsed = JSON.parse(savedQuests);
          const merged = mergeDailyQuestsStates(get().dailyQuestsData, parsed);
          set({ dailyQuestsData: merged });
          localStorage.setItem("narutolike_daily_quests", JSON.stringify(merged));
        } catch { }
      } else {
        get().initializeDailyQuests();
      }
    }

    const raw = localStorage.getItem("narutolike_guest_run_save");
    if (!raw) return;
    try {
      const runData = JSON.parse(raw);
      if (runData && runData.isRunActive) {
        set({
          isRunActive: true,
          activeSagaId: runData.activeSagaId || null,
          currentLevel: runData.currentLevel || 1,
          currentNodeId: runData.currentNodeId || null,
          activeMap: runData.activeMap || [],
          runTeam: runData.runTeam || [],
          playerTeam: runData.playerTeam || [],
          startingChoices: runData.startingChoices || null,
          activePowerUps: runData.activePowerUps || [],
          availablePowerUpChoices: runData.availablePowerUpChoices || null,
          pendingJutsuToLearn: runData.pendingJutsuToLearn || null,
          availableRecruitChoices: runData.availableRecruitChoices || null,
          availableItemChoices: runData.availableItemChoices || null,
          inventory: consolidateInventory(runData.inventory || []),
          activeConsumableEffects: runData.activeConsumableEffects || [],
          defeatedBosses: runData.defeatedBosses || [],
          currentRunScore: runData.currentRunScore || 0,
          recruitRerollCost: runData.recruitRerollCost || 75,
        });

        get().autoResolvePendingBattleNode();
      }
    } catch (err) {
      console.error("Error parsing guest run save:", err);
    }
  },

  autoResolvePendingBattleNode: () => {
    const state = get();
    if (!state.isRunActive || !state.currentNodeId || state.runTeam.length === 0) return;

    const activeNode = state.activeMap.find((n) => n.id === state.currentNodeId);
    if (!activeNode || (activeNode.type !== "battle" && activeNode.type !== "boss")) return;

    // If node is already resolved, don't re-simulate and keep currentNodeId intact
    if (activeNode.resolved) {
      return;
    }

    const isBoss = activeNode.type === "boss";
    const oppNinjas: Ninja[] = (activeNode.opponents || [])
      .map((id) => NINJA_MAP.get(id))
      .filter((n): n is Ninja => !!n);

    if (oppNinjas.length === 0) {
      get().resolveCurrentNode();
      get().saveToCloud();
      get().saveGuestRunToLocalStorage();
      return;
    }

    const outcome = simulateAndResolveBattle(state.runTeam, oppNinjas, isBoss, state.currentLevel);

    if (outcome.finalStatus === "victory") {
      get().syncTeamStats(outcome.pTeam);

      // Track daily quests progress for battle victory
      const teamSnapshot = get().runTeam;
      get().incrementDailyQuestProgress("win_battles", 1);
      if (teamSnapshot.some((n) => n.chakraNature === "Fire")) get().incrementDailyQuestProgress("element_battle_fire", 1);
      if (teamSnapshot.some((n) => n.chakraNature === "Water")) get().incrementDailyQuestProgress("element_battle_water", 1);
      if (teamSnapshot.some((n) => n.chakraNature === "Wind")) get().incrementDailyQuestProgress("element_battle_wind", 1);
      if (teamSnapshot.some((n) => n.chakraNature === "Lightning")) get().incrementDailyQuestProgress("element_battle_lightning", 1);
      if (teamSnapshot.some((n) => n.chakraNature === "Earth")) get().incrementDailyQuestProgress("element_battle_earth", 1);

      if (isBoss) {
        get().incrementDailyQuestProgress("defeat_boss", 1);
        get().gainTeamLevels(5);
        set((s) => ({ currentRunScore: s.currentRunScore + 300 }));

        const currentTeam = get().runTeam;
        const activeConsumables = get().activeConsumableEffects;
        const lang = useLanguageStore.getState().language;
        const fullyHealedTeam = currentTeam.map((ninja) => {
          const effStats = getNinjaEffectiveStats(ninja, activeConsumables, currentTeam, lang);
          return {
            ...ninja,
            currentHp: effStats.hpMax.total,
            currentChakra: effStats.chakraMax.total,
          };
        });
        set({ runTeam: fullyHealedTeam });

        if (activeNode.opponents && activeNode.opponents[0]) {
          get().registerBossDefeat(activeNode.opponents[0]);
        }
        get().decrementConsumableEffectsOnBattle();
        get().resolveCurrentNode();
        get().advanceToNextLevel();
      } else {
        get().gainTeamLevels(2);
        set((s) => ({ currentRunScore: s.currentRunScore + 100 }));
        get().decrementConsumableEffectsOnBattle();
        get().resolveCurrentNode();
      }

      set({ availablePowerUpChoices: null });
      get().saveToCloud();
      get().saveGuestRunToLocalStorage();
    } else {
      get().syncTeamStats(outcome.pTeam);
      get().resolveCurrentNode();
      get().saveToCloud();
      get().saveGuestRunToLocalStorage();
    }
  },

  clearLocalSave: () => {
    isLoggingOut = true;
    if (typeof window !== "undefined") {
      localStorage.removeItem("totalRunsCount");
      localStorage.removeItem("classicRunsCount");
      localStorage.removeItem("shippudenRunsCount");
      localStorage.removeItem("towerRunsCount");
      localStorage.removeItem("totalScore");
      localStorage.removeItem("classicHighScore");
      localStorage.removeItem("shippudenHighScore");
      localStorage.removeItem("towerHighScore");
      localStorage.removeItem("towerMaxFloor");
      localStorage.removeItem("shippudenUnlocked");
      localStorage.removeItem("defeatedBosses");
      localStorage.removeItem("unlockedAchievementsMap");
      localStorage.removeItem("custom_keybindings");
      localStorage.removeItem("guest_coins_cache");
      localStorage.removeItem("pending_signup_coins");
      localStorage.removeItem("totalCoins");
      localStorage.removeItem("sessionCoins");
      localStorage.removeItem("narutolike_guest_run_save");
    }

    set({
      isRunActive: false,
      activeSagaId: null,
      playerTeam: [],
      runTeam: [],
      currentLevel: 1,
      currentRunScore: 0,
      totalScore: 0,
      classicHighScore: 0,
      shippudenHighScore: 0,
      towerHighScore: 0,
      towerMaxFloor: 0,
      currentNodeId: null,
      activeMap: [],
      startingChoices: null,
      sagaStarterChoices: {},
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      availableItemChoices: null,
      inventory: [],
      activeConsumableEffects: [],
      shippudenUnlocked: false,
      defeatedBosses: [],
      totalRunsCount: 0,
      classicRunsCount: 0,
      shippudenRunsCount: 0,
      towerRunsCount: 0,
      totalCoins: 0,
      sessionCoins: 0,
      unlockedAchievementsMap: {},
      newlyUnlockedTrophy: null,
      customKeybindings: DEFAULT_KEYBINDINGS,
    });

    setTimeout(() => {
      isLoggingOut = false;
    }, 1500);
  },
}));

let saveTimeout: NodeJS.Timeout;
useGameStore.subscribe((state) => {
  if (typeof window !== "undefined" && !isLoggingOut) {
    state.saveGuestRunToLocalStorage();
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && !isLoggingOut) {
          state.saveToCloud();
        }
      });
    }, 1000);
  }
});
