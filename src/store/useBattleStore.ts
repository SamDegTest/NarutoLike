import { create } from "zustand";
import { Ninja, RunNinja, Jutsu } from "@/types/index";
import { JUTSU_MAP } from "@/data/jutsus";
import { useGameStore } from "./useGameStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS, JUTSU_TRANSLATIONS, translateNinjaName } from "@/data/translations";
import { CHAKRA_NATURE_CONFIGS, isSuperEffective } from "@/lib/chakraNatures";
import { getSynergyStatMultipliers } from "@/lib/synergies";
import { getNinjaEffectiveStats } from "@/utils/statUtils";

const getNinjaElementSymbol = (nature?: string): string => {
  if (!nature) return "👊";
  const cfg = CHAKRA_NATURE_CONFIGS[nature as keyof typeof CHAKRA_NATURE_CONFIGS];
  return cfg ? cfg.icon : "👊";
};

// Calculate damage and apply chakra nature status effects
function executeElementalAttack(
  attacker: RunNinja,
  target: RunNinja,
  basePower: number,
  atkMult: number = 1,
  defMult: number = 1,
  critAddChance: number = 0
): { damage: number; statusMsg: string } {
  const nature = attacker.chakraNature || "Taijutsu";
  const targetNature = target.chakraNature || "Taijutsu";

  // Incorporate equipped item stats into attack and defense calculations
  const attackerEquipAtk = attacker.equippedItem?.equipStats?.attack || 0;
  const targetEquipDef = target.equippedItem?.equipStats?.defense || 0;

  let attackerAttack = (attacker.baseStats.attack + attackerEquipAtk) * atkMult;
  let targetDefense = (target.baseStats.defense + targetEquipDef) * defMult;
  let attackPower = basePower;
  let statusMsg = "";

  // 0. Super Effective Check (x1.5 damage multiplier)
  const isAdvantageous = isSuperEffective(nature, targetNature);
  if (isAdvantageous) {
    const lang = useLanguageStore.getState().language;
    statusMsg += lang === "it" ? " 💥[SUPER EFFICACE! x1.5]" : " 💥[SUPER EFFECTIVE! x1.5]";
  }

  // 1. Wind (Fuuton 🌪️): Armor Pierce (ignores 30% target defense)
  if (nature === "Wind") {
    targetDefense = Math.max(1, Math.floor(targetDefense * 0.70));
    statusMsg += " 🌪️[Fuuton: Taglio Perforante]";
  }

  // 2. Earth (Doton 🪨): Stone Armor (reduces incoming damage by 20%)
  if (targetNature === "Earth") {
    targetDefense = Math.floor(targetDefense * 1.25);
  }

  // 3. Taijutsu (👊) or Sharingan Crit (25% + critAddChance)
  if ((nature === "Taijutsu" || critAddChance > 0) && Math.random() < (0.25 + critAddChance)) {
    attackPower = Math.floor(attackPower * 1.50);
    statusMsg += " 👊[CRITICO!]";
  }

  // Calculate damage
  let damage = Math.max(5, Math.floor(attackPower * (attackerAttack / targetDefense)));

  // Apply Super Effective multiplier
  if (isAdvantageous) {
    damage = Math.max(8, Math.floor(damage * 1.50));
  }

  // 4. Suiton (Acqua 💧): Chakra Drain (steals 15 Chakra)
  if (nature === "Water") {
    const drainVal = Math.min(15, target.currentChakra);
    target.currentChakra -= drainVal;
    attacker.currentChakra = Math.min(attacker.baseStats.chakra, attacker.currentChakra + drainVal);
    if (drainVal > 0) {
      statusMsg += ` 💧[Suiton: -${drainVal} Chakra]`;
    }
  }

  // 5. Fire (Katon 🔥): Burn (extra 8% target HP damage)
  if (nature === "Fire") {
    const burnDamage = Math.max(3, Math.floor(target.baseStats.hp * 0.08));
    damage += burnDamage;
    statusMsg += ` 🔥[Katon: Bruciatura +${burnDamage}]`;
  }

  // 6. Lightning (Raiton ⚡): Paralysis (25% chance of bonus shock)
  if (nature === "Lightning" && Math.random() < 0.25) {
    const shockDamage = Math.max(4, Math.floor(target.baseStats.hp * 0.06));
    damage += shockDamage;
    statusMsg += ` ⚡[Raiton: Paralisi +${shockDamage}]`;
  }

  // 7. Ice (Hyoton ❄️): Freeze (30% chance of frost damage)
  if (nature === "Ice" && Math.random() < 0.30) {
    const frostDamage = Math.max(5, Math.floor(target.baseStats.hp * 0.10));
    damage += frostDamage;
    statusMsg += ` ❄️[Hyoton: Congelamento +${frostDamage}]`;
  }

  return { damage, statusMsg };
}

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
  restartBattleKeepOpponents: (players: RunNinja[]) => void;
  claimVictory: () => void;
  resetBattle: () => void;
}

function executeBattleSimulation(pTeam: RunNinja[], oppTeam: RunNinja[]) {
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

  const activeConsumableEffects = useGameStore.getState().activeConsumableEffects;
  let consumableAtkMult = 1;
  let consumableDefMult = 1;

  activeConsumableEffects.forEach((eff) => {
    if (eff.item.teamBattleStatBoost) {
      if (eff.item.teamBattleStatBoost.attackMultiplier) {
        consumableAtkMult *= eff.item.teamBattleStatBoost.attackMultiplier;
      }
      if (eff.item.teamBattleStatBoost.defenseMultiplier) {
        consumableDefMult *= eff.item.teamBattleStatBoost.defenseMultiplier;
      }
    }
  });

  const getFighterSpeed = (n: RunNinja) => {
    let spd = n.baseStats.speed;
    if (n.equippedItem?.equipStats?.speed) {
      spd += n.equippedItem.equipStats.speed;
    }
    return spd;
  };

  let round = 1;
  while (pTeam.some((p) => p.currentHp > 0) && oppTeam.some((o) => o.currentHp > 0) && round <= 50) {
    logs.push(t.battleLogRound.replace("{round}", round.toString()));

    const { atkMult: synAtkMult, defMult: synDefMult, critAdd, healMult } = getSynergyStatMultipliers(pTeam);
    const atkMult = synAtkMult * consumableAtkMult;
    const defMult = synDefMult * consumableDefMult;

    const fighters = [
      ...pTeam.map((p) => ({ ref: p, isPlayer: true })),
      ...oppTeam.map((o) => ({ ref: o, isPlayer: false })),
    ]
      .filter((f) => f.ref.currentHp > 0)
      .sort((a, b) => getFighterSpeed(b.ref) - getFighterSpeed(a.ref));

    for (const fighter of fighters) {
      if (fighter.ref.currentHp <= 0) continue;

      const allOpponentsDead = oppTeam.every((o) => o.currentHp <= 0);
      const allPlayersDead = pTeam.every((p) => p.currentHp <= 0);
      if (allOpponentsDead || allPlayersDead) break;

      const fighterName = translateNinjaName(fighter.ref.id, fighter.ref.name, lang);

      if (fighter.isPlayer) {
        const target = oppTeam.find((o) => o.currentHp > 0);
        if (!target) break;

        const targetName = translateNinjaName(target.id, target.name, lang);
        const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);

        if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
          fighter.ref.currentChakra -= jutsu.chakraCost;
          const jutsuName = JUTSU_TRANSLATIONS[jutsu.id]?.name[lang] || jutsu.name;

          if (jutsu.power < 0) {
            const healVal = Math.floor(Math.abs(jutsu.power) * healMult);
            const lowestHpTeammate = pTeam
              .filter((p) => p.currentHp > 0)
              .sort((a, b) => a.currentHp - b.currentHp)[0];
            if (lowestHpTeammate) {
              const teammateName = translateNinjaName(lowestHpTeammate.id, lowestHpTeammate.name, lang);
              const teammateEffMaxHp = getNinjaEffectiveStats(lowestHpTeammate, activeConsumableEffects, pTeam, lang).hpMax.total;
              lowestHpTeammate.currentHp = Math.min(teammateEffMaxHp, lowestHpTeammate.currentHp + healVal);

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
            const { damage, statusMsg } = executeElementalAttack(fighter.ref, target, jutsu.power, atkMult, 1, critAdd);
            target.currentHp = Math.max(0, target.currentHp - damage);

            const actionMsg = t.battleLogAttacks
              .replace("{attacker}", fighterName)
              .replace("{target}", targetName)
              .replace("{jutsu}", jutsuName) + " " +
              t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString()) +
              statusMsg;

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
              elementSymbol: getNinjaElementSymbol(fighter.ref.chakraNature),
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
          const { damage, statusMsg } = executeElementalAttack(fighter.ref, target, 15, atkMult, 1, critAdd);
          target.currentHp = Math.max(0, target.currentHp - damage);
          const jutsuName = lang === "it" ? "Attacco Fisico" : "Physical Attack";

          const actionMsg = t.battleLogAttacks
            .replace("{attacker}", fighterName)
            .replace("{target}", targetName)
            .replace("{jutsu}", jutsuName) + " " +
            t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString()) +
            statusMsg;

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
            elementSymbol: getNinjaElementSymbol(fighter.ref.chakraNature),
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
        const target = pTeam.find((p) => p.currentHp > 0);
        if (!target) break;

        const targetName = translateNinjaName(target.id, target.name, lang);
        const jutsu = JUTSU_MAP.get(fighter.ref.activeJutsuId);

        if (jutsu && fighter.ref.currentChakra >= jutsu.chakraCost) {
          fighter.ref.currentChakra -= jutsu.chakraCost;
          const jutsuName = JUTSU_TRANSLATIONS[jutsu.id]?.name[lang] || jutsu.name;

          if (jutsu.power < 0) {
            const healVal = Math.abs(jutsu.power);
            const fighterEffMaxHp = getNinjaEffectiveStats(fighter.ref, activeConsumableEffects, fighter.isPlayer ? pTeam : oppTeam, lang).hpMax.total;
            fighter.ref.currentHp = Math.min(fighterEffMaxHp, fighter.ref.currentHp + healVal);

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
            const { damage, statusMsg } = executeElementalAttack(fighter.ref, target, jutsu.power, 1, defMult, 0);
            target.currentHp = Math.max(0, target.currentHp - damage);

            const actionMsg = t.battleLogAttacks
              .replace("{attacker}", fighterName)
              .replace("{target}", targetName)
              .replace("{jutsu}", jutsuName) + " " +
              t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString()) +
              statusMsg;

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
              elementSymbol: getNinjaElementSymbol(fighter.ref.chakraNature),
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
          const { damage, statusMsg } = executeElementalAttack(fighter.ref, target, 15, 1, defMult, 0);
          target.currentHp = Math.max(0, target.currentHp - damage);
          const jutsuName = lang === "it" ? "Attacco Fisico" : "Physical Attack";

          const actionMsg = t.battleLogAttacks
            .replace("{attacker}", fighterName)
            .replace("{target}", targetName)
            .replace("{jutsu}", jutsuName) + " " +
            t.battleLogDamage.replace("{target}", targetName).replace("{damage}", damage.toString()) +
            statusMsg;

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
      attackerId: "", targetId: "", attackerName: "", targetName: "", actionText: "", damage: 0, isHealing: false, elementSymbol: "", isPlayerAttacking: false,
    });
  } else if (allPlayersDefeated) {
    finalStatus = "defeat";
    const defeatLog = t.battleLogDefeat;
    logs.push(defeatLog);
    steps.push({
      playerTeam: pTeam.map((p) => ({ ...p })),
      opponentTeam: oppTeam.map((o) => ({ ...o })),
      log: defeatLog,
      attackerId: "", targetId: "", attackerName: "", targetName: "", actionText: "", damage: 0, isHealing: false, elementSymbol: "", isPlayerAttacking: false,
    });
  } else {
    finalStatus = "defeat";
    const drawLog = lang === "it" ? "⏳ Scontro in stallo oltre i limiti consentiti." : "⏳ Battle stalled beyond allowed limit.";
    logs.push(drawLog);
    steps.push({
      playerTeam: pTeam.map((p) => ({ ...p })),
      opponentTeam: oppTeam.map((o) => ({ ...o })),
      log: drawLog,
      attackerId: "", targetId: "", attackerName: "", targetName: "", actionText: "", damage: 0, isHealing: false, elementSymbol: "", isPlayerAttacking: false,
    });
  }

  return { pTeam, oppTeam, logs, steps, finalStatus };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  isBattleActive: false,
  playerTeam: [],
  opponentTeam: [],
  battleLogs: [],
  battleStatus: null,
  battleSteps: [],

  startBattle: (players, opponents) => {
    const lang = useLanguageStore.getState().language;
    const activeConsumableEffects = useGameStore.getState().activeConsumableEffects;

    const pTeam: RunNinja[] = players.map((p) => {
      const effStats = getNinjaEffectiveStats(p, activeConsumableEffects, players, lang);
      const isFallen = p.currentHp <= 0;
      return {
        ...p,
        currentHp: isFallen ? effStats.hpMax.total : Math.min(effStats.hpMax.total, p.currentHp),
        currentChakra: isFallen ? effStats.chakraMax.total : Math.min(effStats.chakraMax.total, p.currentChakra),
      };
    });
    const activeNodeId = useGameStore.getState().currentNodeId;
    const activeMap = useGameStore.getState().activeMap;
    const currentNode = activeMap.find((n) => n.id === activeNodeId);
    const stage = currentNode?.stage || 1;
    const isBoss = currentNode?.type === "boss";

    const avgPlayerLevel = players.reduce((sum, n) => sum + n.level, 0) / players.length;
    const gameLevel = useGameStore.getState().currentLevel;
    
    let oppLevel = Math.max(5, Math.floor(avgPlayerLevel * (0.70 + (gameLevel * 0.08) + (stage * 0.05))));
    if (isBoss) {
      oppLevel = Math.max(8, Math.floor(avgPlayerLevel * (1.15 + (gameLevel * 0.08))));
    }

    const oppTeam: RunNinja[] = opponents.map((opp) => {
      const diff = oppLevel - 5;
      const stats = { ...opp.baseStats };
      stats.hp += diff * 10;
      stats.chakra += diff * 5;
      stats.attack += diff * 2;
      stats.defense += diff * 1;
      stats.speed += diff * 1;

      if (isBoss) {
        stats.hp = Math.floor(stats.hp * 1.20);
        stats.attack = Math.floor(stats.attack * 1.12);
        stats.defense = Math.floor(stats.defense * 1.10);
        stats.speed = Math.floor(stats.speed * 1.05);
      }

      return {
        ...opp,
        level: oppLevel,
        baseStats: stats,
        currentHp: stats.hp,
        currentChakra: stats.chakra,
      };
    });

    const res = executeBattleSimulation(pTeam, oppTeam);

    set({
      isBattleActive: true,
      playerTeam: res.pTeam,
      opponentTeam: res.oppTeam,
      battleLogs: res.logs,
      battleStatus: res.finalStatus,
      battleSteps: res.steps,
    });
  },

  restartBattleKeepOpponents: (players) => {
    const lang = useLanguageStore.getState().language;
    const activeConsumableEffects = useGameStore.getState().activeConsumableEffects;
    const existingOpponents = get().opponentTeam;

    const pTeam: RunNinja[] = players.map((p) => {
      const effStats = getNinjaEffectiveStats(p, activeConsumableEffects, players, lang);
      return {
        ...p,
        currentHp: effStats.hpMax.total,
        currentChakra: effStats.chakraMax.total,
      };
    });

    const oppTeam: RunNinja[] = existingOpponents.map((o) => ({ ...o }));

    const res = executeBattleSimulation(pTeam, oppTeam);

    set({
      isBattleActive: true,
      playerTeam: res.pTeam,
      opponentTeam: res.oppTeam,
      battleLogs: res.logs,
      battleStatus: res.finalStatus,
      battleSteps: res.steps,
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
      // Award 300 points for defeating a boss
      useGameStore.setState((state) => ({ currentRunScore: state.currentRunScore + 300 }));
      // Fully heal team to 100% effective HP & Chakra (base + items + synergies) after boss defeat
      const currentTeam = useGameStore.getState().runTeam;
      const activeConsumables = useGameStore.getState().activeConsumableEffects;
      const lang = useLanguageStore.getState().language;
      const fullyHealedTeam = currentTeam.map((ninja) => {
        const effStats = getNinjaEffectiveStats(ninja, activeConsumables, currentTeam, lang);
        return {
          ...ninja,
          currentHp: effStats.hpMax.total,
          currentChakra: effStats.chakraMax.total,
        };
      });
      useGameStore.setState({ runTeam: fullyHealedTeam });

      if (currentNode.opponents && currentNode.opponents[0]) {
        useGameStore.getState().registerBossDefeat(currentNode.opponents[0]);
      }
      useGameStore.getState().decrementConsumableEffectsOnBattle();
      useGameStore.getState().resolveCurrentNode();
      useGameStore.getState().advanceToNextLevel();
    } else if (currentNode?.type === "battle") {
      useGameStore.getState().gainTeamLevels(2);
      // Award 100 points for winning a battle
      useGameStore.setState((state) => ({ currentRunScore: state.currentRunScore + 100 }));
      useGameStore.getState().decrementConsumableEffectsOnBattle();
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
