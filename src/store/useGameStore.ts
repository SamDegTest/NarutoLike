import { create } from "zustand";
import { Ninja, RunNinja, MapNode, PowerUpItem, NodeType } from "@/types/index";
import { NINJA_MAP } from "@/data/ninjas";
import { useBattleStore } from "./useBattleStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";
import { supabase } from "@/lib/supabaseClient";

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

  // Actions
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
  applyHealingAtCampfire: () => void;
  syncTeamStats: (updatedTeam: RunNinja[]) => void;
  advanceToNextLevel: () => void;
  endRun: () => void;
  registerBossDefeat: (bossId: string) => void;
  saveToCloud: () => Promise<void>;
  loadCloudSave: () => Promise<void>;
  clearLocalSave: () => void;
}

const ALL_BOSS_IDS = ["mizuki", "haku", "zabuza", "orochimaru_shippuden", "itachi_shippuden", "itachi_susanoo", "jiraiya_shippuden", "jiraiya_sage", "tsunade_shippuden", "gaara_kid"];

const POWER_UP_POOL: PowerUpItem[] = [
  { id: "jutsu_upgrade", name: "Rotolo Proibito", description: "Migliora la mossa attiva di uno dei tuoi ninja", isJutsuUpgrade: true },
];

function generateLevelMap(sagaId: string, level: number): MapNode[] {
  let bossId = "mizuki";
  let bossLabel = "Il Tradimento di Mizuki";
  let opponentsPool = ["naruto_kid", "sasuke_kid", "sakura_kid", "gaara_kid", "kakashi_kid", "lee_kid", "neji_kid", "shikamaru_kid", "hinata_kid"];

  if (sagaId === "classic_naruto") {
    if (level === 1) {
      bossId = "mizuki";
      bossLabel = "Il Tradimento di Mizuki";
    } else if (level === 2) {
      bossId = "haku";
      bossLabel = "Specchi Diabolici: Haku";
    } else if (level === 3) {
      bossId = "zabuza";
      bossLabel = "Il Demone della Nebbia: Zabuza";
    } else if (level === 4) {
      bossId = "orochimaru_shippuden";
      bossLabel = "L'invasione della Foglia: Orochimaru";
    } else if (level === 5) {
      bossId = "gaara_kid";
      bossLabel = "Il Risveglio dello Shukaku: Gaara (Boss Finale)";
    }
  } else {
    // Shippuden saga setup
    opponentsPool = [
      "naruto_shippuden", "sasuke_shippuden", "sakura_shippuden", "kakashi_shippuden",
      "gaara_shippuden", "lee_shippuden", "neji_shippuden", "shikamaru_shippuden",
      "hinata_shippuden", "sasuke_hebi"
    ];
    if (level === 1) {
      bossId = "itachi_shippuden";
      bossLabel = "Il Destino degli Uchiha: Itachi";
    } else if (level === 2) {
      bossId = "jiraiya_shippuden";
      bossLabel = "Infiltrazione alla Pioggia: Jiraiya";
    } else if (level === 3) {
      bossId = "orochimaru_shippuden";
      bossLabel = "Scontro dei Sannin: Orochimaru";
    } else if (level === 4) {
      bossId = "sasuke_susanoo";
      bossLabel = "La vendetta degli Uchiha: Sasuke Susanoo";
    } else if (level === 5) {
      bossId = "naruto_kcm";
      bossLabel = "Il Controllo del Chakra: Naruto KCM";
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
    if (type === "powerup") suffix = " (Tecnica)";
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

    // Remaining 13 middle nodes (Row 2 to 5) are generated from the remaining pool:
    // 3 recruits total - 1 used = 2 recruits remaining
    // 3 powerups total - 0 used = 3 powerups remaining
    // 9 battles total - 1 used = 8 battles remaining
    const nodePool: NodeType[] = [
      "recruit", "recruit",
      "powerup", "powerup", "powerup",
      "battle", "battle", "battle", "battle", "battle", "battle", "battle", "battle"
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
        type: "powerup",
        label: "Rotolo di Benvenuto",
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
        opponents: [bossId],
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
  shippudenUnlocked: typeof window !== "undefined" ? localStorage.getItem("shippudenUnlocked") === "true" : false,
  defeatedBosses: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("defeatedBosses") || "[]") : [],

  selectSaga: (sagaId) => {
    if (sagaId) {
      const isShippuden = sagaId === "shippuden_naruto";
      const targetRoster = Array.from(NINJA_MAP.values()).filter((n) => {
        const isCorrectVersion = isShippuden ? n.version === "shippuden" : n.version === "kid";
        return isCorrectVersion && !ALL_BOSS_IDS.includes(n.id);
      });
      const shuffled = targetRoster.sort(() => 0.5 - Math.random());
      set({
        activeSagaId: sagaId,
        startingChoices: shuffled.slice(0, 3),
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
    const { playerTeam, activeSagaId } = get();
    if (playerTeam.length === 0 || !activeSagaId) return;

    const runTeam: RunNinja[] = playerTeam.map((ninja) => ({
      ...ninja,
      level: 5,
      currentHp: ninja.baseStats.hp,
      currentChakra: ninja.baseStats.chakra,
    }));

    set({
      runTeam,
      currentLevel: 1,
      activeMap: generateLevelMap(activeSagaId, 1),
      currentNodeId: null,
      isRunActive: true,
      activePowerUps: [],
      availablePowerUpChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      defeatedBosses: [],
    });
  },

  selectNode: (nodeId) => {
    const { activeMap } = get();
    const node = activeMap.find((n) => n.id === nodeId);
    if (!node || node.resolved) return;

    set({ currentNodeId: nodeId });

    if (node.type === "powerup") {
      const { activePowerUps } = get();
      const powerUp = POWER_UP_POOL[0];
      set({ 
        activePowerUps: [...activePowerUps, powerUp],
        pendingJutsuToLearn: "UPGRADE",
        availablePowerUpChoices: null,
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

      const shuffled = pool.sort(() => 0.5 - Math.random());
      set({ availableRecruitChoices: shuffled.slice(0, 3) });
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
    if (!availableRecruitChoices) return;

    if (runTeam.length >= 6 && !replaceNinjaId) return;

    const chosen = availableRecruitChoices.find((n) => n.id === ninjaId);
    if (!chosen) return;

    const teamLevel = runTeam[0]?.level || 5;
    const N = teamLevel - 5;
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

    if (replaceNinjaId) {
      const updatedTeam = runTeam.map((n) => (n.id === replaceNinjaId ? newNinja : n));
      set({
        runTeam: updatedTeam,
        availableRecruitChoices: null,
      });
    } else {
      set({
        runTeam: [...runTeam, newNinja],
        availableRecruitChoices: null,
      });
    }

    get().resolveCurrentNode();
  },

  advanceToNextLevel: () => {
    const { currentLevel, activeSagaId } = get();
    if (!activeSagaId) return;

    const nextLevel = currentLevel + 1;
    if (nextLevel > 5) {
      const lang = useLanguageStore.getState().language;
      const t = TRANSLATIONS[lang];
      if (activeSagaId === "classic_naruto") {
        set({ shippudenUnlocked: true });
        if (typeof window !== "undefined") {
          localStorage.setItem("shippudenUnlocked", "true");
        }
        alert(t.alertVictoryClassic);
      } else {
        alert(t.alertVictoryShippuden);
      }
      get().endRun();
      return;
    }

    set({
      currentLevel: nextLevel,
      activeMap: generateLevelMap(activeSagaId, nextLevel),
      currentNodeId: null,
      availablePowerUpChoices: null,
      availableRecruitChoices: null,
    });
  },

  endRun: () => {
    set({
      isRunActive: false,
      currentNodeId: null,
      activeMap: [],
      playerTeam: [],
      activeSagaId: null,
      startingChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
    });
  },

  registerBossDefeat: (bossId) => {
    const { defeatedBosses } = get();
    if (defeatedBosses.includes(bossId)) return;

    const updated = [...defeatedBosses, bossId];
    set({ defeatedBosses: updated });
    if (typeof window !== "undefined") {
      localStorage.setItem("defeatedBosses", JSON.stringify(updated));
    }
  },

  saveToCloud: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const state = get();
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
      defeated_bosses: state.defeatedBosses
    });

    await supabase.from("profiles").upsert({
      id: session.user.id,
      max_level_reached: state.shippudenUnlocked ? 6 : state.currentLevel,
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
      .single();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (save) {
      set({
        activeSagaId: save.active_saga_id || null,
        currentLevel: save.current_level || 1,
        currentNodeId: save.currentNodeId || null,
        isRunActive: save.is_run_active || false,
        runTeam: save.run_team || [],
        activeMap: save.active_map || [],
        activePowerUps: save.active_power_ups || [],
        defeatedBosses: save.defeated_bosses || [],
        shippudenUnlocked: profile?.max_level_reached >= 5 || false
      });
    }
  },

  clearLocalSave: () => {
    set({
      isRunActive: false,
      currentNodeId: null,
      activeMap: [],
      playerTeam: [],
      activeSagaId: null,
      startingChoices: null,
      pendingJutsuToLearn: null,
      availableRecruitChoices: null,
      defeatedBosses: [],
      shippudenUnlocked: false
    });
  },
}));

// Auto-sync store subscription
let saveTimeout: NodeJS.Timeout;
useGameStore.subscribe((state) => {
  if (typeof window !== "undefined") {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      state.saveToCloud();
    }, 1000);
  }
});
