import { create } from "zustand";
import { Ninja, RunNinja, MapNode, PowerUpItem, NodeType, GameItem, InventoryItem } from "@/types/index";
import { sampleRandomItems } from "@/data/items";
import { NINJA_MAP } from "@/data/ninjas";
import { sampleNinjasByRarity } from "@/lib/rarity";
import { useBattleStore } from "./useBattleStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { getUnlockedAchievements, getAchievementRewardCoins, Achievement } from "@/data/achievements";

interface GameState {
  playerRoster: Ninja[];
  playerTeam: Ninja[];
  runTeam: RunNinja[];
  currentLevel: number;
  activeMap: MapNode[];
  currentNodeId: string | null;
  isRunActive: boolean;
  activeSagaId: string | null; // "classic_naruto" | null
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
  currentRunScore: number;
  totalScore: number;
  classicHighScore: number;
  shippudenHighScore: number;
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

  // Actions
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
  moveNinjaUp: (index: number) => void;
  moveNinjaDown: (index: number) => void;
  setLeaderNinja: (index: number) => void;
  applyHealingAtCampfire: () => void;
  syncTeamStats: (updatedTeam: RunNinja[]) => void;
  advanceToNextLevel: () => void;
  endRun: () => void;
  abandonRun: () => void;
  registerBossDefeat: (bossId: string) => void;
  checkAndUnlockAchievements: () => void;
  dismissTrophyNotification: () => void;
  saveToCloud: () => Promise<void>;
  loadCloudSave: () => Promise<void>;
  clearLocalSave: () => void;
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
    "naruto_kid", "sasuke_kid", "sakura_kid", "gaara_kid", "kakashi_kid",
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
  } else {
    // Shippuden saga setup
    opponentsPool = [
      "naruto_shippuden", "sasuke_shippuden", "sakura_shippuden", "kakashi_shippuden",
      "gaara_shippuden", "lee_shippuden", "neji_shippuden", "shikamaru_shippuden",
      "hinata_shippuden", "sasuke_hebi", "tenten_shippuden", "choji_shippuden",
      "ino_shippuden", "kiba_shippuden", "shino_shippuden", "temari_shippuden",
      "kankuro_shippuden", "guy_shippuden", "minato_shippuden", "kurenai_shippuden",
      "asuma_shippuden", "hiruzen_shippuden", "konohamaru_kid", "konan_shippuden"
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
  }

  const getRandomOpponents = (stage: number) => {
    let count = 1;
    if (stage === 2) count = Math.random() > 0.5 ? 2 : 1;
    else if (stage === 3 || stage === 4 || stage === 5) count = 2;
    else if (stage === 6) count = Math.random() > 0.5 ? 3 : 2;

    return Array.from({ length: count }).map(() => opponentsPool[Math.floor(Math.random() * opponentsPool.length)]);
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
  currentRunScore: 0,
  totalScore: typeof window !== "undefined" ? Number(localStorage.getItem("totalScore")) || 0 : 0,
  classicHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("classicHighScore")) || 0 : 0,
  shippudenHighScore: typeof window !== "undefined" ? Number(localStorage.getItem("shippudenHighScore")) || 0 : 0,
  totalCoins: typeof window !== "undefined" ? Number(localStorage.getItem("totalCoins")) || 0 : 0,
  sessionCoins: typeof window !== "undefined" ? Number(localStorage.getItem("sessionCoins")) || 0 : 0,
  inventory: [],
  availableItemChoices: null,
  activeConsumableEffects: [],
  recruitRerollCost: 75,
  completedSagaVictory: null,
  dismissSagaVictory: () => set({ completedSagaVictory: null }),
  sagaStarterChoices: {},
  unlockedAchievementsMap: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("unlockedAchievementsMap") || "{}") : {},
  newlyUnlockedTrophy: null,

  hasCompletedTutorial: typeof window !== "undefined" 
    ? localStorage.getItem("narutolike_tutorial_completed") === "true" && (Number(localStorage.getItem("totalRunsCount")) || 0) > 0 
    : false,
  isTutorialActive: false,
  tutorialStep: 1,
  explainedNodeTypes: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("narutolike_explained_nodes") || "[]") : [],
  activeNodeTutorialPopup: null,

  dismissNodeTutorialPopup: () => set({ activeNodeTutorialPopup: null }),

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

  dismissTrophyNotification: () => {
    set({ newlyUnlockedTrophy: null });
  },

  checkAndUnlockAchievements: () => {
    const state = get();
    const stats = {
      totalRuns: state.totalRunsCount,
      classicRuns: state.classicRunsCount,
      shippudenRuns: state.shippudenRunsCount,
      maxLevel: state.currentLevel,
      totalScore: state.totalScore || 0,
      classicHighScore: state.classicHighScore || 0,
      shippudenHighScore: state.shippudenHighScore || 0,
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
      const updatedTotalCoins = state.totalCoins + addedCoins;
      const updatedSessionCoins = state.sessionCoins + addedCoins;

      set({
        unlockedAchievementsMap: currentMap,
        newlyUnlockedTrophy: newlyUnlocked ? newlyUnlocked : state.newlyUnlockedTrophy,
        totalCoins: updatedTotalCoins,
        sessionCoins: updatedSessionCoins,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("unlockedAchievementsMap", JSON.stringify(currentMap));
        localStorage.setItem("totalCoins", String(updatedTotalCoins));
        localStorage.setItem("sessionCoins", String(updatedSessionCoins));
      }

      state.saveToCloud();
    }
  },

  selectSaga: (sagaId) => {
    if (sagaId) {
      const { sagaStarterChoices } = get();
      let choices = sagaStarterChoices[sagaId];

      if (!choices || choices.length === 0) {
        const isShippuden = sagaId === "shippuden_naruto";
        const targetRoster = Array.from(NINJA_MAP.values()).filter((n) => {
          const isCorrectVersion = isShippuden ? n.version === "shippuden" : n.version === "kid";
          return isCorrectVersion && !ALL_BOSS_IDS.includes(n.id);
        });
        choices = sampleNinjasByRarity(targetRoster, 3);
      }

      set({
        activeSagaId: sagaId,
        startingChoices: choices,
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
        playerTeam: [],
      });
    }
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
    const { playerTeam, activeSagaId, totalRunsCount, classicRunsCount, shippudenRunsCount } = get();
    if (playerTeam.length === 0 || !activeSagaId) return;

    const newTotalRuns = totalRunsCount + 1;
    const isClassic = activeSagaId === "classic_naruto";
    const newClassicRuns = isClassic ? classicRunsCount + 1 : classicRunsCount;
    const newShippudenRuns = !isClassic ? shippudenRunsCount + 1 : shippudenRunsCount;

    if (typeof window !== "undefined") {
      localStorage.setItem("totalRunsCount", String(newTotalRuns));
      localStorage.setItem("classicRunsCount", String(newClassicRuns));
      localStorage.setItem("shippudenRunsCount", String(newShippudenRuns));
    }

    const runTeam: RunNinja[] = playerTeam.map((ninja) => ({
      ...ninja,
      level: 5,
      currentHp: ninja.baseStats.hp,
      currentChakra: ninja.baseStats.chakra,
    }));

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

  applyHealingAtCampfire: () => {
    const { runTeam, currentNodeId } = get();
    if (!currentNodeId) return;

    const updatedTeam = runTeam.map((ninja) => {
      return {
        ...ninja,
        currentHp: ninja.baseStats.hp,
        currentChakra: ninja.baseStats.chakra,
      };
    });

    set({ runTeam: updatedTeam });
    get().resolveCurrentNode();
  },

  syncTeamStats: (updatedTeam) => {
    set({ runTeam: updatedTeam });

    const isWiped = updatedTeam.every((n) => n.currentHp <= 0);
    if (isWiped) {
      get().endRun();
    }
  },

  chooseRecruit: (ninjaId, replaceNinjaId) => {
    const { runTeam, availableRecruitChoices } = get();
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
    if (replaceNinjaId) {
      updatedTeam = updatedTeam.map((n) => (n.id === replaceNinjaId ? newNinja : n));
    } else if (updatedTeam.length < 6) {
      updatedTeam.push(newNinja);
    }

    set({
      runTeam: updatedTeam,
      availableRecruitChoices: null,
    });

    get().resolveCurrentNode();
  },

  reviveAndContinueRun: (cost: number) => {
    const { totalCoins, sessionCoins, runTeam } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < cost) return false;

    const newCoins = currentCoins - cost;

    // Heal all team members back to full HP & Chakra
    const revivedTeam = runTeam.map((ninja) => ({
      ...ninja,
      currentHp: ninja.baseStats.hp,
      currentChakra: ninja.baseStats.chakra,
    }));

    if (user) {
      set({ totalCoins: newCoins, runTeam: revivedTeam });
      if (typeof window !== "undefined") {
        localStorage.setItem("totalCoins", String(newCoins));
      }
    } else {
      set({ sessionCoins: newCoins, runTeam: revivedTeam });
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionCoins", String(newCoins));
      }
    }

    get().resolveCurrentNode();
    get().saveToCloud();
    return true;
  },

  buyAndRecruitNinja: (ninjaId: string, cost: number, replaceNinjaId?: string) => {
    const { totalCoins, sessionCoins } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < cost) return false;

    const newCoins = currentCoins - cost;

    if (user) {
      set({ totalCoins: newCoins });
      if (typeof window !== "undefined") {
        localStorage.setItem("totalCoins", String(newCoins));
      }
    } else {
      set({ sessionCoins: newCoins });
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionCoins", String(newCoins));
      }
    }

    get().chooseRecruit(ninjaId, replaceNinjaId);
    get().saveToCloud();
    return true;
  },

  rerollRecruitChoices: () => {
    const { totalCoins, sessionCoins, recruitRerollCost, runTeam, defeatedBosses, activeSagaId } = get();
    const { user } = useAuthStore.getState();
    const currentCoins = user ? totalCoins : sessionCoins;

    if (currentCoins < recruitRerollCost) return false;

    const newCoins = currentCoins - recruitRerollCost;
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
        return defeatedBosses.includes(n.id);
      }
      return true;
    });

    const newChoices = sampleNinjasByRarity(pool, 3);
    const nextCost = recruitRerollCost + 25;

    if (user) {
      set({ totalCoins: newCoins, availableRecruitChoices: newChoices, recruitRerollCost: nextCost });
      if (typeof window !== "undefined") {
        localStorage.setItem("totalCoins", String(newCoins));
      }
    } else {
      set({ sessionCoins: newCoins, availableRecruitChoices: newChoices, recruitRerollCost: nextCost });
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionCoins", String(newCoins));
      }
    }

    get().saveToCloud();
    return true;
  },

  chooseItemFromNode: (item: GameItem) => {
    const { inventory } = get();
    const updatedInventory = [...inventory];

    if (item.type === "consumable") {
      const existingIndex = updatedInventory.findIndex((inv) => inv.item.id === item.id);
      if (existingIndex >= 0) {
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          quantity: updatedInventory[existingIndex].quantity + 1,
        };
      } else {
        updatedInventory.push({ item, quantity: 1 });
      }
    } else {
      // Assignable item
      updatedInventory.push({ item, quantity: 1 });
    }

    set({
      inventory: updatedInventory,
      availableItemChoices: null,
    });

    get().resolveCurrentNode();
    get().saveToCloud();
  },

  useConsumableItem: (itemId: string, targetNinjaId?: string) => {
    const { inventory, runTeam } = get();
    const invIndex = inventory.findIndex((inv) => inv.item.id === itemId && inv.item.type === "consumable");
    if (invIndex < 0) return;

    const gameItem = inventory[invIndex].item;
    let updatedTeam = [...runTeam];

    // Effect: Heal percent HP & Chakra
    if (gameItem.healPercent !== undefined || gameItem.healChakraPercent !== undefined) {
      updatedTeam = updatedTeam.map((ninja) => {
        let newHp = ninja.currentHp;
        let newChakra = ninja.currentChakra;

        if (gameItem.healPercent) {
          const boostHp = Math.round((ninja.baseStats.hp * gameItem.healPercent) / 100);
          newHp = Math.min(ninja.baseStats.hp, ninja.currentHp + boostHp);
        }
        if (gameItem.healChakraPercent) {
          const boostChakra = Math.round((ninja.baseStats.chakra * gameItem.healChakraPercent) / 100);
          newChakra = Math.min(ninja.baseStats.chakra, ninja.currentChakra + boostChakra);
        }

        return { ...ninja, currentHp: newHp, currentChakra: newChakra };
      });
    }

    // Effect: Jutsu level upgrade (Forbidden Scroll)
    if (gameItem.jutsuLevelUpgrade && targetNinjaId) {
      set({ pendingJutsuToLearn: "UPGRADE" });
      get().learnJutsu(targetNinjaId);
    }

    // Register active battle boost effect if consumable grants temporary fight boosts
    const { activeConsumableEffects } = get();
    let updatedActiveEffects = [...activeConsumableEffects];

    let durationFights = 0;
    if (gameItem.teamBattleStatBoost || gameItem.singleNinjaBattleStatBoost) {
      durationFights = 1;
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
    const { inventory, runTeam } = get();
    const invIndex = inventory.findIndex((inv) => inv.item.id === itemId && inv.item.type === "assignable");
    if (invIndex < 0) return;

    const gameItem = inventory[invIndex].item;
    const ninjaIndex = runTeam.findIndex((n) => n.id === targetNinjaId);
    if (ninjaIndex < 0) return;

    const updatedTeam = [...runTeam];
    const targetNinja = updatedTeam[ninjaIndex];

    // If ninja already had an item equipped, return old item back to inventory
    const updatedInventory = [...inventory];
    if (targetNinja.equippedItem) {
      updatedInventory.push({ item: targetNinja.equippedItem, quantity: 1 });
    }

    // Remove newly equipped item from inventory
    updatedInventory.splice(invIndex, 1);

    // Equip item on target ninja
    updatedTeam[ninjaIndex] = {
      ...targetNinja,
      equippedItem: gameItem,
    };

    set({
      runTeam: updatedTeam,
      inventory: updatedInventory,
    });

    get().saveToCloud();
  },

  unequipItemFromNinja: (targetNinjaId: string) => {
    const { inventory, runTeam } = get();
    const ninjaIndex = runTeam.findIndex((n) => n.id === targetNinjaId);
    if (ninjaIndex < 0) return;

    const targetNinja = runTeam[ninjaIndex];
    if (!targetNinja.equippedItem) return;

    const equipped = targetNinja.equippedItem;
    const updatedTeam = [...runTeam];
    updatedTeam[ninjaIndex] = {
      ...targetNinja,
      equippedItem: null,
    };

    const updatedInventory = [...inventory, { item: equipped, quantity: 1 }];

    set({
      runTeam: updatedTeam,
      inventory: updatedInventory,
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

  advanceToNextLevel: () => {
    const { currentLevel, activeSagaId, currentRunScore } = get();
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
    const { currentRunScore, totalScore, classicHighScore, shippudenHighScore, activeSagaId, classicRunsCount, shippudenRunsCount, totalRunsCount, totalCoins, sessionCoins } = get();

    // Earn coins equal to 1% of points earned in this completed run (win or lose)
    const earnedCoins = Math.floor(currentRunScore * 0.01);
    const newTotalCoins = totalCoins + earnedCoins;
    const newSessionCoins = sessionCoins + earnedCoins;

    // Accumulate current run score into total cumulative score if points were scored
    if (currentRunScore > 0) {
      const newTotalScore = totalScore + currentRunScore;
      let newClassicHigh = classicHighScore;
      let newShippudenHigh = shippudenHighScore;
      let newClassicRuns = classicRunsCount;
      let newShippudenRuns = shippudenRunsCount;
      let newTotalRuns = totalRunsCount + 1;

      if (activeSagaId === "classic_naruto") {
        newClassicHigh = Math.max(classicHighScore, currentRunScore);
        newClassicRuns += 1;
      } else if (activeSagaId === "shippuden_naruto") {
        newShippudenHigh = Math.max(shippudenHighScore, currentRunScore);
        newShippudenRuns += 1;
      }

      set({
        totalScore: newTotalScore,
        classicHighScore: newClassicHigh,
        shippudenHighScore: newShippudenHigh,
        classicRunsCount: newClassicRuns,
        shippudenRunsCount: newShippudenRuns,
        totalRunsCount: newTotalRuns,
        totalCoins: newTotalCoins,
        sessionCoins: newSessionCoins,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("totalScore", String(newTotalScore));
        localStorage.setItem("classicHighScore", String(newClassicHigh));
        localStorage.setItem("shippudenHighScore", String(newShippudenHigh));
        localStorage.setItem("classicRunsCount", String(newClassicRuns));
        localStorage.setItem("shippudenRunsCount", String(newShippudenRuns));
        localStorage.setItem("totalRunsCount", String(newTotalRuns));
        localStorage.setItem("totalCoins", String(newTotalCoins));
        localStorage.setItem("sessionCoins", String(newSessionCoins));
      }
    } else {
      set({
        totalCoins: newTotalCoins,
        sessionCoins: newSessionCoins,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("totalCoins", String(newTotalCoins));
        localStorage.setItem("sessionCoins", String(newSessionCoins));
      }
    }

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
    });

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
    });

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

    // 1. Save active game save state
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
      inventory: state.inventory,
      defeated_bosses: state.defeatedBosses
    });

    // 2. Fetch existing profile stats using maybeSingle()
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("total_runs, classic_runs, shippuden_runs, max_level_reached, total_score, classic_high_score, shippuden_high_score, total_coins")
      .eq("id", session.user.id)
      .maybeSingle();

    const dbTotal = existingProfile?.total_runs ?? 0;
    const dbClassic = existingProfile?.classic_runs ?? 0;
    const dbShippuden = existingProfile?.shippuden_runs ?? 0;
    const dbMaxLevel = existingProfile?.max_level_reached ?? 1;
    const dbTotalScore = existingProfile?.total_score ?? 0;
    const dbClassicHigh = existingProfile?.classic_high_score ?? 0;
    const dbShippudenHigh = existingProfile?.shippuden_high_score ?? 0;

    // Strict non-decreasing calculation
    const finalTotal = Math.max(dbTotal, state.totalRunsCount);
    const finalClassic = Math.max(dbClassic, state.classicRunsCount);
    const finalShippuden = Math.max(dbShippuden, state.shippudenRunsCount);
    const finalMaxLevel = Math.max(dbMaxLevel, state.shippudenUnlocked ? 6 : state.currentLevel);
    const finalTotalScore = Math.max(dbTotalScore, state.totalScore);
    const finalClassicHigh = Math.max(dbClassicHigh, state.classicHighScore);
    const finalShippudenHigh = Math.max(dbShippudenHigh, state.shippudenHighScore);

    // State totalCoins holds the true current balance (reflecting earnings and expenditures)
    const finalCoins = state.totalCoins;

    // Keep store synchronized
    set({
      totalRunsCount: finalTotal,
      classicRunsCount: finalClassic,
      shippudenRunsCount: finalShippuden,
      totalScore: finalTotalScore,
      classicHighScore: finalClassicHigh,
      shippudenHighScore: finalShippudenHigh,
      totalCoins: finalCoins,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("totalRunsCount", String(finalTotal));
      localStorage.setItem("classicRunsCount", String(finalClassic));
      localStorage.setItem("shippudenRunsCount", String(finalShippuden));
      localStorage.setItem("totalScore", String(finalTotalScore));
      localStorage.setItem("classicHighScore", String(finalClassicHigh));
      localStorage.setItem("shippudenHighScore", String(finalShippudenHigh));
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
      total_score: finalTotalScore,
      classic_high_score: finalClassicHigh,
      shippuden_high_score: finalShippudenHigh,
      total_coins: finalCoins,
      unlocked_achievements: state.unlockedAchievementsMap,
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

      set({
        activeSagaId: save.active_saga_id || null,
        currentLevel: save.current_level || 1,
        currentNodeId: save.currentNodeId || save.current_node_id || null,
        isRunActive: isRunActive,
        runTeam: loadedRunTeam,
        playerTeam: isRunActive ? loadedRunTeam : [],
        activeMap: loadedMap,
        activePowerUps: save.active_power_ups || [],
        inventory: isRunActive ? (save.inventory || []) : [],
        activeConsumableEffects: isRunActive ? (get().activeConsumableEffects || []) : [],
        defeatedBosses: loadedBosses,
        shippudenUnlocked: (profile?.max_level_reached || 0) >= 5 || false
      });

      if (typeof window !== "undefined" && loadedBosses.length > 0) {
        localStorage.setItem("defeatedBosses", JSON.stringify(loadedBosses));
      }
    }
    if (profile) {
      const dbTotal = profile.total_runs ?? 0;
      const dbClassic = profile.classic_runs ?? 0;
      const dbShippuden = profile.shippuden_runs ?? 0;
      const maxLevel = profile.max_level_reached ?? 1;
      const dbTotalScore = profile.total_score ?? 0;
      const dbClassicHigh = profile.classic_high_score ?? 0;
      const dbShippudenHigh = profile.shippuden_high_score ?? 0;
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

      set({
        totalRunsCount: dbTotal,
        classicRunsCount: dbClassic,
        shippudenRunsCount: dbShippuden,
        totalScore: dbTotalScore,
        classicHighScore: dbClassicHigh,
        shippudenHighScore: dbShippudenHigh,
        totalCoins: dbCoins,
        shippudenUnlocked: maxLevel >= 5,
        unlockedAchievementsMap: loadedAchievementsMap,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("totalRunsCount", String(dbTotal));
        localStorage.setItem("classicRunsCount", String(dbClassic));
        localStorage.setItem("shippudenRunsCount", String(dbShippuden));
        localStorage.setItem("totalScore", String(dbTotalScore));
        localStorage.setItem("classicHighScore", String(dbClassicHigh));
        localStorage.setItem("shippudenHighScore", String(dbShippudenHigh));
        localStorage.setItem("totalCoins", String(dbCoins));
        localStorage.setItem("shippudenUnlocked", String(maxLevel >= 5));
        localStorage.setItem("unlockedAchievementsMap", JSON.stringify(loadedAchievementsMap));
      }
    }

    get().checkAndUnlockAchievements();
  },

  clearLocalSave: () => {
    isLoggingOut = true;
    if (typeof window !== "undefined") {
      localStorage.removeItem("totalRunsCount");
      localStorage.removeItem("classicRunsCount");
      localStorage.removeItem("shippudenRunsCount");
      localStorage.removeItem("totalScore");
      localStorage.removeItem("classicHighScore");
      localStorage.removeItem("shippudenHighScore");
      localStorage.removeItem("shippudenUnlocked");
      localStorage.removeItem("defeatedBosses");
      localStorage.removeItem("unlockedAchievementsMap");
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
      unlockedAchievementsMap: {},
      newlyUnlockedTrophy: null,
    });

    setTimeout(() => {
      isLoggingOut = false;
    }, 1500);
  },
}));

let saveTimeout: NodeJS.Timeout;
useGameStore.subscribe((state) => {
  if (typeof window !== "undefined" && !isLoggingOut) {
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
