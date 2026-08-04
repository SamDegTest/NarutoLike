import { create } from "zustand";
import { Ninja, RunNinja, Jutsu } from "@/types/index";
import { JUTSU_MAP } from "@/data/jutsus";
import { useGameStore } from "./useGameStore";

export interface BattleStep {
  playerTeam: RunNinja[];
  opponentTeam: RunNinja[];
  log: string;
  attackerId: string;
  targetId: string;
  attackerName: string;
  targetName: string;
  actionText: string;
  damage: number;
  isHealing: boolean;
  elementSymbol: string;
  isPlayerAttacking: boolean;
}

interface BattleState {
  isBattleActive: boolean;
  playerTeam: RunNinja[];
  opponentTeam: RunNinja[];
  battleLogs: string[];
  battleStatus: "victory" | "defeat" | null;
  battleSteps: BattleStep[];

  // Actions
  startBattle: (players: RunNinja[], opponents: Ninja[]) => void;
  claimVictory: () => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  isBattleActive: false,
  playerTeam: [],
  opponentTeam: [],
  battleLogs: [],
  battleStatus: null,
  battleSteps: [],

  startBattle: (players, opponents) => {
    // Deep copy to prevent side effects during dry run simulation
    const pTeam: RunNinja[] = players.map((p) => ({ ...p }));
    const activeNodeId = useGameStore.getState().currentNodeId;
    const activeMap = useGameStore.getState().activeMap;
    const currentNode = activeMap.find((n) => n.id === activeNodeId);
    const stage = currentNode?.stage || 1;
    const isBoss = currentNode?.type === "boss";

    const avgPlayerLevel = players.reduce((sum, n) => sum + n.level, 0) / players.length;
    const gameLevel = useGameStore.getState().currentLevel; // 1 to 5
    
    // Gradual difficulty scaling: increases both with current level (chapter) and node stage
    let oppLevel = Math.max(5, Math.floor(avgPlayerLevel * (0.65 + (gameLevel * 0.1) + (stage * 0.07))));
    if (isBoss) {
      oppLevel = Math.max(8, Math.floor(avgPlayerLevel * (1.15 + (gameLevel * 0.12))));
    }

    const oppTeam: RunNinja[] = opponents.map((opp) => {
      const diff = oppLevel - 5;
      const stats = { ...opp.baseStats };
      stats.hp += diff * 10;
      stats.chakra += diff * 5;
      stats.attack += diff * 2;
      stats.defense += diff * 1;
      stats.speed += diff * 1;

      return {
        ...opp,
        level: oppLevel,
        baseStats: stats,
        currentHp: stats.hp,
        currentChakra: stats.chakra,
      };
    });

    const getNinjaElementSymbol = (characterId: string): string => {
      switch (characterId) {
        case "naruto":
          return "🌪️";
        case "sasuke":
          return "⚡";
        case "sakura":
          return "🪨";
        case "kakashi":
          return "⚡";
        case "gaara":
          return "⏳";
        case "haku":
          return "❄️";
        case "zabuza":
          return "💧";
        case "mizuki":
          return "🌪️";
        case "itachi":
          return "🔥";
        case "jiraiya":
          return "🔥";
        case "tsunade":
          return "👊";
        case "orochimaru":
          return "🐍";
        default:
          return "👊";
      }
    };

    const logs: string[] = ["⚡ Scontro automatico iniziato!"];
    const steps: BattleStep[] = [
      {
        playerTeam: pTeam.map((p) => ({ ...p })),
        opponentTeam: oppTeam.map((o) => ({ ...o })),
        log: "⚡ Scontro iniziato!",
        attackerId: "",
        targetId: "",
        attackerName: "",
        targetName: "",
        actionText: "",
        damage: 0,
        isHealing: false,
        elementSymbol: "",
        isPlayerAttacking: false,
      },
    ];

    let round = 1;
    // Auto-battle loop
    while (pTeam.some((p) => p.currentHp > 0) && oppTeam.some((o) => o.currentHp > 0) && round <= 50) {
      logs.push(`--- Round ${round} ---`);

      // Combine and sort alive fighters by speed
      const fighters = [
        ...pTeam.map((p) => ({ ref: p, isPlayer: true })),
        ...oppTeam.map((o) => ({ ref: o, isPlayer: false })),
      ]
        .filter((f) => f.ref.currentHp > 0)
        .sort((a, b) => b.ref.baseStats.speed - a.ref.baseStats.speed);

      for (const fighter of fighters) {
        if (fighter.ref.currentHp <= 0) continue;

        // Check if battle already finished
        const allOpponentsDead = oppTeam.every((o) => o.currentHp <= 0);
        const allPlayersDead = pTeam.every((p) => p.currentHp <= 0);
        if (allOpponentsDead || allPlayersDead) break;

        if (fighter.isPlayer) {
          // Player attack choice
          const target = oppTeam.find((o) => o.currentHp > 0);
          if (!target) break;

          const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);
          if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
            // Execute Jutsu
            fighter.ref.currentChakra -= jutsu.chakraCost;
            if (jutsu.power < 0) {
              // Healing
              const healVal = Math.abs(jutsu.power);
              const lowestHpTeammate = pTeam
                .filter((p) => p.currentHp > 0)
                .sort((a, b) => a.currentHp - b.currentHp)[0];
              if (lowestHpTeammate) {
                lowestHpTeammate.currentHp = Math.min(lowestHpTeammate.baseStats.hp, lowestHpTeammate.currentHp + healVal);
                const actionMsg = `usa ${jutsu.name} e cura ${lowestHpTeammate.name} di ${healVal} HP!`;
                const stepLog = `🟢 ${fighter.ref.name} ${actionMsg}`;
                logs.push(stepLog);
                steps.push({
                  playerTeam: pTeam.map((p) => ({ ...p })),
                  opponentTeam: oppTeam.map((o) => ({ ...o })),
                  log: stepLog,
                  attackerId: fighter.ref.id,
                  targetId: lowestHpTeammate.id,
                  attackerName: fighter.ref.name,
                  targetName: lowestHpTeammate.name,
                  actionText: jutsu.name,
                  damage: healVal,
                  isHealing: true,
                  elementSymbol: "🟢",
                  isPlayerAttacking: true,
                });
              }
            } else {
              // Damage
              const damage = Math.max(5, Math.floor(jutsu.power * (fighter.ref.baseStats.attack / target.baseStats.defense)));
              target.currentHp = Math.max(0, target.currentHp - damage);
              const actionMsg = `usa ${jutsu.name} infliggendo ${damage} danni a ${target.name}!`;
              const stepLog = `🔥 ${fighter.ref.name} ${actionMsg}`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: target.id,
                attackerName: fighter.ref.name,
                targetName: target.name,
                actionText: jutsu.name,
                damage: damage,
                isHealing: false,
                elementSymbol: getNinjaElementSymbol(fighter.ref.characterId),
                isPlayerAttacking: true,
              });
            }
          } else {
            // Basic Physical Attack
            const damage = Math.max(5, Math.floor(15 * (fighter.ref.baseStats.attack / target.baseStats.defense)));
            target.currentHp = Math.max(0, target.currentHp - damage);
            const stepLog = `⚔️ ${fighter.ref.name} usa Attacco Fisico infliggendo ${damage} danni a ${target.name}!`;
            logs.push(stepLog);
            steps.push({
              playerTeam: pTeam.map((p) => ({ ...p })),
              opponentTeam: oppTeam.map((o) => ({ ...o })),
              log: stepLog,
              attackerId: fighter.ref.id,
              targetId: target.id,
              attackerName: fighter.ref.name,
              targetName: target.name,
              actionText: "Attacco Fisico",
              damage: damage,
              isHealing: false,
              elementSymbol: "👊",
              isPlayerAttacking: true,
            });
          }
        } else {
          // Opponent Attack Choice
          const target = pTeam.find((p) => p.currentHp > 0);
          if (!target) break;

          const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);
          if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
            // Execute Jutsu
            fighter.ref.currentChakra -= jutsu.chakraCost;
            if (jutsu.power < 0) {
              // Healing
              const healVal = Math.abs(jutsu.power);
              fighter.ref.currentHp = Math.min(fighter.ref.baseStats.hp, fighter.ref.currentHp + healVal);
              const stepLog = `🟢 ${fighter.ref.name} usa ${jutsu.name} curandosi di ${healVal} HP!`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: fighter.ref.id,
                attackerName: fighter.ref.name,
                targetName: fighter.ref.name,
                actionText: jutsu.name,
                damage: healVal,
                isHealing: true,
                elementSymbol: "🟢",
                isPlayerAttacking: false,
              });
            } else {
              // Damage
              const damage = Math.max(5, Math.floor(jutsu.power * (fighter.ref.baseStats.attack / target.baseStats.defense)));
              target.currentHp = Math.max(0, target.currentHp - damage);
              const actionMsg = `usa ${jutsu.name} infliggendo ${damage} danni a ${target.name}!`;
              const stepLog = `🔴 ${fighter.ref.name} ${actionMsg}`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: target.id,
                attackerName: fighter.ref.name,
                targetName: target.name,
                actionText: jutsu.name,
                damage: damage,
                isHealing: false,
                elementSymbol: getNinjaElementSymbol(fighter.ref.characterId),
                isPlayerAttacking: false,
              });
            }
          } else {
            // Basic Physical Attack
            const damage = Math.max(5, Math.floor(15 * (fighter.ref.baseStats.attack / target.baseStats.defense)));
            target.currentHp = Math.max(0, target.currentHp - damage);
            const stepLog = `⚔️ ${fighter.ref.name} usa Attacco Fisico infliggendo ${damage} danni a ${target.name}!`;
            logs.push(stepLog);
            steps.push({
              playerTeam: pTeam.map((p) => ({ ...p })),
              opponentTeam: oppTeam.map((o) => ({ ...o })),
              log: stepLog,
              attackerId: fighter.ref.id,
              targetId: target.id,
              attackerName: fighter.ref.name,
              targetName: target.name,
              actionText: "Attacco Fisico",
              damage: damage,
              isHealing: false,
              elementSymbol: "👊",
              isPlayerAttacking: false,
            });
          }
        }
      }
      round++;
    }

    const allOpponentsDefeated = oppTeam.every((o) => o.currentHp <= 0);
    const allPlayersDefeated = pTeam.every((p) => p.currentHp <= 0);

    let finalStatus: "victory" | "defeat" = "defeat";
    if (allOpponentsDefeated) {
      finalStatus = "victory";
      const victoryLog = "🎉 Vittoria! Tutti gli avversari sono stati sconfitti.";
      logs.push(victoryLog);
      steps.push({
        playerTeam: pTeam.map((p) => ({ ...p })),
        opponentTeam: oppTeam.map((o) => ({ ...o })),
        log: victoryLog,
        attackerId: "",
        targetId: "",
        attackerName: "",
        targetName: "",
        actionText: "",
        damage: 0,
        isHealing: false,
        elementSymbol: "",
        isPlayerAttacking: false,
      });
    } else if (allPlayersDefeated) {
      finalStatus = "defeat";
      const defeatLog = "💀 Sconfitta! Tutta la tua squadra è andata K.O.";
      logs.push(defeatLog);
      steps.push({
        playerTeam: pTeam.map((p) => ({ ...p })),
        opponentTeam: oppTeam.map((o) => ({ ...o })),
        log: defeatLog,
        attackerId: "",
        targetId: "",
        attackerName: "",
        targetName: "",
        actionText: "",
        damage: 0,
        isHealing: false,
        elementSymbol: "",
        isPlayerAttacking: false,
      });
    } else {
      finalStatus = "defeat";
      const drawLog = "⏳ Scontro in stallo oltre i limiti consentiti.";
      logs.push(drawLog);
      steps.push({
        playerTeam: pTeam.map((p) => ({ ...p })),
        opponentTeam: oppTeam.map((o) => ({ ...o })),
        log: drawLog,
        attackerId: "",
        targetId: "",
        attackerName: "",
        targetName: "",
        actionText: "",
        damage: 0,
        isHealing: false,
        elementSymbol: "",
        isPlayerAttacking: false,
      });
    }

    set({
      isBattleActive: true,
      playerTeam: pTeam,
      opponentTeam: oppTeam,
      battleLogs: logs,
      battleStatus: finalStatus,
      battleSteps: steps,
    });
  },

  claimVictory: () => {
    const { playerTeam, battleStatus } = get();
    if (battleStatus !== "victory") return;

    // Sync updated player team stats back to the main game store
    useGameStore.getState().syncTeamStats(playerTeam);

    // Apply level ups based on node type
    const activeNodeId = useGameStore.getState().currentNodeId;
    const activeMap = useGameStore.getState().activeMap;
    const currentNode = activeMap.find((n) => n.id === activeNodeId);

    if (currentNode?.type === "boss") {
      useGameStore.getState().gainTeamLevels(5);
      // Fully heal team after boss defeat
      const currentTeam = useGameStore.getState().runTeam;
      const fullyHealedTeam = currentTeam.map((ninja) => ({
        ...ninja,
        currentHp: ninja.baseStats.hp,
        currentChakra: ninja.baseStats.chakra,
      }));
      useGameStore.setState({ runTeam: fullyHealedTeam });

      if (currentNode.opponents && currentNode.opponents[0]) {
        useGameStore.getState().registerBossDefeat(currentNode.opponents[0]);
      }
      useGameStore.getState().resolveCurrentNode();
      useGameStore.getState().advanceToNextLevel();
    } else if (currentNode?.type === "battle") {
      useGameStore.getState().gainTeamLevels(2);
      useGameStore.getState().resolveCurrentNode();
    }

    useGameStore.setState({
      availablePowerUpChoices: null,
    });

    set({
      isBattleActive: false,
      battleStatus: null,
      playerTeam: [],
      opponentTeam: [],
    });
  },

  resetBattle: () => {
    set({
      isBattleActive: false,
      battleStatus: null,
      playerTeam: [],
      opponentTeam: [],
      battleLogs: [],
    });
  },
}));
