import { create } from "zustand";
import { Ninja, RunNinja, Jutsu } from "@/types/index";
import { JUTSU_MAP } from "@/data/jutsus";
import { useGameStore } from "./useGameStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS, JUTSU_TRANSLATIONS, translateNinjaName } from "@/data/translations";

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

    const lang = useLanguageStore.getState().language;
    const t = TRANSLATIONS[lang];

    const logs: string[] = [t.battleLogStart];
    const steps: BattleStep[] = [
      {
        playerTeam: pTeam.map((p) => ({ ...p })),
        opponentTeam: oppTeam.map((o) => ({ ...o })),
        log: t.battleLogStart,
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
      logs.push(t.battleLogRound.replace("{round}", round.toString()));

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

        const fighterName = translateNinjaName(fighter.ref.id, fighter.ref.name, lang);

        if (fighter.isPlayer) {
          // Player attack choice
          const target = oppTeam.find((o) => o.currentHp > 0);
          if (!target) break;

          const targetName = translateNinjaName(target.id, target.name, lang);
          const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);

          if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
            // Execute Jutsu
            fighter.ref.currentChakra -= jutsu.chakraCost;
            const jutsuName = JUTSU_TRANSLATIONS[jutsu.id]?.name[lang] || jutsu.name;

            if (jutsu.power < 0) {
              // Healing
              const healVal = Math.abs(jutsu.power);
              const lowestHpTeammate = pTeam
                .filter((p) => p.currentHp > 0)
                .sort((a, b) => a.currentHp - b.currentHp)[0];
              if (lowestHpTeammate) {
                const teammateName = translateNinjaName(lowestHpTeammate.id, lowestHpTeammate.name, lang);
                lowestHpTeammate.currentHp = Math.min(lowestHpTeammate.baseStats.hp, lowestHpTeammate.currentHp + healVal);
                
                const actionMsg = t.battleLogAttacks
                  .replace("{attacker}", fighterName)
                  .replace("{target}", teammateName)
                  .replace("{jutsu}", jutsuName) + " " +
                  t.battleLogHeal.replace("{target}", teammateName).replace("{heal}", healVal.toString());

                const stepLog = `🟢 ${actionMsg}`;
                logs.push(stepLog);
                steps.push({
                  playerTeam: pTeam.map((p) => ({ ...p })),
                  opponentTeam: oppTeam.map((o) => ({ ...o })),
                  log: stepLog,
                  attackerId: fighter.ref.id,
                  targetId: lowestHpTeammate.id,
                  attackerName: fighterName,
                  targetName: teammateName,
                  actionText: jutsuName,
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

              const actionMsg = t.battleLogAttacks
                .replace("{attacker}", fighterName)
                .replace("{target}", targetName)
                .replace("{jutsu}", jutsuName) + " " +
                t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString());

              const stepLog = `🔥 ${actionMsg}`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: target.id,
                attackerName: fighterName,
                targetName: targetName,
                actionText: jutsuName,
                damage: damage,
                isHealing: false,
                elementSymbol: getNinjaElementSymbol(fighter.ref.characterId),
                isPlayerAttacking: true,
              });

              if (target.currentHp <= 0) {
                const deathLog = `💀 ${t.battleLogDefeated.replace("{target}", targetName)}`;
                logs.push(deathLog);
                steps.push({
                  playerTeam: pTeam.map((p) => ({ ...p })),
                  opponentTeam: oppTeam.map((o) => ({ ...o })),
                  log: deathLog,
                  attackerId: "",
                  targetId: target.id,
                  attackerName: "",
                  targetName: targetName,
                  actionText: "",
                  damage: 0,
                  isHealing: false,
                  elementSymbol: "",
                  isPlayerAttacking: true,
                });
              }
            }
          } else {
            // Basic Physical Attack
            const damage = Math.max(5, Math.floor(15 * (fighter.ref.baseStats.attack / target.baseStats.defense)));
            target.currentHp = Math.max(0, target.currentHp - damage);
            const jutsuName = lang === "it" ? "Attacco Fisico" : "Physical Attack";

            const actionMsg = t.battleLogAttacks
              .replace("{attacker}", fighterName)
              .replace("{target}", targetName)
              .replace("{jutsu}", jutsuName) + " " +
              t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString());

            const stepLog = `⚔️ ${actionMsg}`;
            logs.push(stepLog);
            steps.push({
              playerTeam: pTeam.map((p) => ({ ...p })),
              opponentTeam: oppTeam.map((o) => ({ ...o })),
              log: stepLog,
              attackerId: fighter.ref.id,
              targetId: target.id,
              attackerName: fighterName,
              targetName: targetName,
              actionText: jutsuName,
              damage: damage,
              isHealing: false,
              elementSymbol: "👊",
              isPlayerAttacking: true,
            });

            if (target.currentHp <= 0) {
              const deathLog = `💀 ${t.battleLogDefeated.replace("{target}", targetName)}`;
              logs.push(deathLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: deathLog,
                attackerId: "",
                targetId: target.id,
                attackerName: "",
                targetName: targetName,
                actionText: "",
                damage: 0,
                isHealing: false,
                elementSymbol: "",
                isPlayerAttacking: true,
              });
            }
          }
        } else {
          // Opponent Attack Choice
          const target = pTeam.find((p) => p.currentHp > 0);
          if (!target) break;

          const targetName = translateNinjaName(target.id, target.name, lang);
          const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);

          if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
            // Execute Jutsu
            fighter.ref.currentChakra -= jutsu.chakraCost;
            const jutsuName = JUTSU_TRANSLATIONS[jutsu.id]?.name[lang] || jutsu.name;

            if (jutsu.power < 0) {
              // Healing
              const healVal = Math.abs(jutsu.power);
              fighter.ref.currentHp = Math.min(fighter.ref.baseStats.hp, fighter.ref.currentHp + healVal);

              const actionMsg = t.battleLogAttacks
                .replace("{attacker}", fighterName)
                .replace("{target}", fighterName)
                .replace("{jutsu}", jutsuName) + " " +
                t.battleLogHeal.replace("{target}", fighterName).replace("{heal}", healVal.toString());

              const stepLog = `🟢 ${actionMsg}`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: fighter.ref.id,
                attackerName: fighterName,
                targetName: fighterName,
                actionText: jutsuName,
                damage: healVal,
                isHealing: true,
                elementSymbol: "🟢",
                isPlayerAttacking: false,
              });
            } else {
              // Damage
              const damage = Math.max(5, Math.floor(jutsu.power * (fighter.ref.baseStats.attack / target.baseStats.defense)));
              target.currentHp = Math.max(0, target.currentHp - damage);

              const actionMsg = t.battleLogAttacks
                .replace("{attacker}", fighterName)
                .replace("{target}", targetName)
                .replace("{jutsu}", jutsuName) + " " +
                t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString());

              const stepLog = `🔴 ${actionMsg}`;
              logs.push(stepLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: stepLog,
                attackerId: fighter.ref.id,
                targetId: target.id,
                attackerName: fighterName,
                targetName: targetName,
                actionText: jutsuName,
                damage: damage,
                isHealing: false,
                elementSymbol: getNinjaElementSymbol(fighter.ref.characterId),
                isPlayerAttacking: false,
              });

              if (target.currentHp <= 0) {
                const deathLog = `💀 ${t.battleLogDefeated.replace("{target}", targetName)}`;
                logs.push(deathLog);
                steps.push({
                  playerTeam: pTeam.map((p) => ({ ...p })),
                  opponentTeam: oppTeam.map((o) => ({ ...o })),
                  log: deathLog,
                  attackerId: "",
                  targetId: target.id,
                  attackerName: "",
                  targetName: targetName,
                  actionText: "",
                  damage: 0,
                  isHealing: false,
                  elementSymbol: "",
                  isPlayerAttacking: false,
                });
              }
            }
          } else {
            // Basic Physical Attack
            const damage = Math.max(5, Math.floor(15 * (fighter.ref.baseStats.attack / target.baseStats.defense)));
            target.currentHp = Math.max(0, target.currentHp - damage);
            const jutsuName = lang === "it" ? "Attacco Fisico" : "Physical Attack";

            const actionMsg = t.battleLogAttacks
              .replace("{attacker}", fighterName)
              .replace("{target}", targetName)
              .replace("{jutsu}", jutsuName) + " " +
              t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString());

            const stepLog = `⚔️ ${actionMsg}`;
            logs.push(stepLog);
            steps.push({
              playerTeam: pTeam.map((p) => ({ ...p })),
              opponentTeam: oppTeam.map((o) => ({ ...o })),
              log: stepLog,
              attackerId: fighter.ref.id,
              targetId: target.id,
              attackerName: fighterName,
              targetName: targetName,
              actionText: jutsuName,
              damage: damage,
              isHealing: false,
              elementSymbol: "👊",
              isPlayerAttacking: false,
            });

            if (target.currentHp <= 0) {
              const deathLog = `💀 ${t.battleLogDefeated.replace("{target}", targetName)}`;
              logs.push(deathLog);
              steps.push({
                playerTeam: pTeam.map((p) => ({ ...p })),
                opponentTeam: oppTeam.map((o) => ({ ...o })),
                log: deathLog,
                attackerId: "",
                targetId: target.id,
                attackerName: "",
                targetName: targetName,
                actionText: "",
                damage: 0,
                isHealing: false,
                elementSymbol: "",
                isPlayerAttacking: false,
              });
            }
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
      const victoryLog = t.battleLogVictory;
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
      const defeatLog = t.battleLogDefeat;
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
      const drawLog = lang === "it" ? "⏳ Scontro in stallo oltre i limiti consentiti." : "⏳ Battle stalled beyond allowed limit.";
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
