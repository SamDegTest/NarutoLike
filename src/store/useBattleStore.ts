import { create } from "zustand";
import { Ninja, RunNinja, Jutsu } from "@/types/index";
import { JUTSU_MAP } from "@/data/jutsus";
import { useGameStore } from "./useGameStore";
import { useLanguageStore } from "./useLanguageStore";
import { TRANSLATIONS, JUTSU_TRANSLATIONS, translateNinjaName } from "@/data/translations";
import { CHAKRA_NATURE_CONFIGS, isSuperEffective } from "@/lib/chakraNatures";
import { getSynergyStatMultipliers } from "@/lib/synergies";
import { getNinjaEffectiveStats } from "@/utils/statUtils";
import { getSurvivalWaveInfo, getSurvivalSupplyChoices } from "@/data/survivalWaves";

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

  const towerModifier = useGameStore.getState().activeTowerModifier;

  // Genjutsu Fog: 15% dodge chance
  if (towerModifier?.id === "genjutsu_fog" && Math.random() < 0.15) {
    const lang = useLanguageStore.getState().language;
    return {
      damage: 0,
      statusMsg: lang === "it" ? " 🌫️[SCHIVATO / GENJUTSU!]" : " 🌫️[DODGED / GENJUTSU!]",
    };
  }

  // Incorporate equipped item stats into attack and defense calculations
  const attackerEquipAtk = attacker.equippedItem?.equipStats?.attack || 0;
  const targetEquipDef = target.equippedItem?.equipStats?.defense || 0;

  let attackerAttack = (attacker.baseStats.attack + attackerEquipAtk) * atkMult;
  let targetDefense = (target.baseStats.defense + targetEquipDef) * defMult;

  // Will of Fire: buff when HP < 35%
  if (towerModifier?.id === "will_of_fire") {
    if (attacker.currentHp / Math.max(1, attacker.baseStats.hp) < 0.35) {
      attackerAttack = Math.floor(attackerAttack * 1.20);
    }
    if (target.currentHp / Math.max(1, target.baseStats.hp) < 0.35) {
      targetDefense = Math.floor(targetDefense * 1.30);
    }
  }

  let attackPower = basePower;
  let statusMsg = "";

  // 0. Super Effective Check
  const isAdvantageous = isSuperEffective(nature, targetNature);
  if (isAdvantageous) {
    const lang = useLanguageStore.getState().language;
    statusMsg += towerModifier?.id === "elemental_resonance"
      ? (lang === "it" ? " 💥[RISONANZA ELEMENTALE! x2.2]" : " 💥[ELEMENTAL RESONANCE! x2.2]")
      : (lang === "it" ? " 💥[SUPER EFFICACE! x1.65]" : " 💥[SUPER EFFECTIVE! x1.65]");
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
  const critMultiplier = towerModifier?.id === "blood_moon" ? 1.85 : 1.50;
  if ((nature === "Taijutsu" || critAddChance > 0) && Math.random() < (0.25 + critAddChance)) {
    attackPower = Math.floor(attackPower * critMultiplier);
    statusMsg += towerModifier?.id === "blood_moon" ? " 🌕[CRITICO CREMISI!]" : " 👊[CRITICO!]";
  }

  // Calculate damage
  let damage = Math.max(5, Math.floor(attackPower * (attackerAttack / targetDefense)));

  // Apply Super Effective multiplier
  if (isAdvantageous) {
    const superMult = towerModifier?.id === "elemental_resonance" ? 2.20 : 1.65;
    damage = Math.max(8, Math.floor(damage * superMult));
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

  const towerModifier = useGameStore.getState().activeTowerModifier;

  const getFighterSpeed = (n: RunNinja, isPlayer: boolean) => {
    let spd = n.baseStats.speed;
    if (n.equippedItem?.equipStats?.speed) {
      spd += n.equippedItem.equipStats.speed;
    }
    if (isPlayer && towerModifier?.id === "swift_wind") {
      spd = Math.floor(spd * 1.20);
    }
    return spd;
  };

  let round = 1;
  while (pTeam.some((p) => p.currentHp > 0) && oppTeam.some((o) => o.currentHp > 0) && round <= 50) {
    logs.push(t.battleLogRound.replace("{round}", round.toString()));

    const { atkMult: synAtkMult, defMult: synDefMult, critAdd, healMult: rawHealMult } = getSynergyStatMultipliers(pTeam);
    const healMult = towerModifier?.id === "blood_moon" ? rawHealMult * 0.75 : rawHealMult;
    const atkMult = synAtkMult * consumableAtkMult;
    const defMult = synDefMult * consumableDefMult;

    const fighters = [
      ...pTeam.map((p) => ({ ref: p, isPlayer: true })),
      ...oppTeam.map((o) => ({ ref: o, isPlayer: false })),
    ]
      .filter((f) => f.ref.currentHp > 0)
      .sort((a, b) => getFighterSpeed(b.ref, b.isPlayer) - getFighterSpeed(a.ref, a.isPlayer));

    for (const fighter of fighters) {
      if (fighter.ref.currentHp <= 0) continue;

      const allOpponentsDead = oppTeam.every((o) => o.currentHp <= 0);
      const allPlayersDead = pTeam.every((p) => p.currentHp <= 0);
      if (allOpponentsDead || allPlayersDead) break;

      // Divine Tree Sap: passive recovery upon action
      if (towerModifier?.id === "divine_tree_vitality" && fighter.isPlayer && fighter.ref.currentHp > 0) {
        const regenHp = Math.max(2, Math.floor(fighter.ref.baseStats.hp * 0.05));
        fighter.ref.currentHp = Math.min(fighter.ref.baseStats.hp, fighter.ref.currentHp + regenHp);
      }

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
    const activeSaga = useGameStore.getState().activeSagaId;
    const isTower = activeSaga === "endless_tower";
    const isSurvival = activeSaga === "survival_war";
    
    let oppLevel = Math.max(5, Math.floor(avgPlayerLevel * (0.85 + (gameLevel * 0.10) + (stage * 0.06))));
    if (isBoss) {
      oppLevel = Math.max(8, Math.floor(avgPlayerLevel * (1.25 + (gameLevel * 0.10))));
    }

    if (isTower) {
      oppLevel = Math.max(5, Math.floor(avgPlayerLevel * (0.85 + (gameLevel * 0.05) + (stage * 0.05)) + gameLevel * 0.4));
      if (isBoss) {
        oppLevel = Math.max(10, Math.floor(avgPlayerLevel * (1.20 + (gameLevel * 0.06)) + gameLevel * 0.8));
      }
    } else if (isSurvival) {
      oppLevel = Math.max(5, Math.floor(avgPlayerLevel * 0.9 + gameLevel * 0.6));
      if (isBoss) {
        oppLevel = Math.max(10, Math.floor(avgPlayerLevel * 1.25 + gameLevel * 1.0));
      }
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
        stats.hp = Math.floor(stats.hp * 1.45);
        stats.attack = Math.floor(stats.attack * 1.25);
        stats.defense = Math.floor(stats.defense * 1.20);
        stats.speed = Math.floor(stats.speed * 1.10);
      }

      if (isTower && gameLevel > 5) {
        const scale = 1 + Math.min(1.2, (gameLevel - 5) * 0.025);
        stats.hp = Math.floor(stats.hp * scale);
        stats.attack = Math.floor(stats.attack * scale);
        stats.defense = Math.floor(stats.defense * scale);
      } else if (isSurvival && gameLevel > 5) {
        const scale = 1 + Math.min(1.5, (gameLevel - 5) * 0.035);
        stats.hp = Math.floor(stats.hp * scale);
        stats.attack = Math.floor(stats.attack * scale);
        stats.defense = Math.floor(stats.defense * scale);
      }

      return {
        ...opp,
        level: oppLevel,
        baseStats: stats,
        currentHp: stats.hp,
        currentChakra: stats.chakra,
      };
    });

    const towerMod = useGameStore.getState().activeTowerModifier;
    if (towerMod?.id === "chakra_surge") {
      pTeam.forEach((p) => { p.currentChakra = Math.min(p.baseStats.chakra, p.currentChakra + 25); });
      oppTeam.forEach((o) => { o.currentChakra = Math.min(o.baseStats.chakra, o.currentChakra + 25); });
    }

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

    // Track daily quests progress for battle victory
    const currentTeamSnapshot = useGameStore.getState().runTeam;
    useGameStore.getState().incrementDailyQuestProgress("win_battles", 1);
    if (currentTeamSnapshot.some((n) => n.chakraNature === "Fire")) useGameStore.getState().incrementDailyQuestProgress("element_battle_fire", 1);
    if (currentTeamSnapshot.some((n) => n.chakraNature === "Water")) useGameStore.getState().incrementDailyQuestProgress("element_battle_water", 1);
    if (currentTeamSnapshot.some((n) => n.chakraNature === "Wind")) useGameStore.getState().incrementDailyQuestProgress("element_battle_wind", 1);
    if (currentTeamSnapshot.some((n) => n.chakraNature === "Lightning")) useGameStore.getState().incrementDailyQuestProgress("element_battle_lightning", 1);
    if (currentTeamSnapshot.some((n) => n.chakraNature === "Earth")) useGameStore.getState().incrementDailyQuestProgress("element_battle_earth", 1);

    // Apply level ups based on node type
    const activeNodeId = useGameStore.getState().currentNodeId;
    const activeMap = useGameStore.getState().activeMap;
    const currentNode = activeMap.find((n) => n.id === activeNodeId);

    if (currentNode?.type === "boss") {
      useGameStore.getState().incrementDailyQuestProgress("defeat_boss", 1);
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

      const isSurvival = useGameStore.getState().activeSagaId === "survival_war";
      if (isSurvival) {
        const wave = useGameStore.getState().currentLevel;
        const waveInfo = getSurvivalWaveInfo(wave);
        const newScore = useGameStore.getState().currentRunScore + waveInfo.rewardScore;
        const newCoins = useGameStore.getState().totalCoins + waveInfo.rewardCoins;
        const newSession = useGameStore.getState().sessionCoins + waveInfo.rewardCoins;
        const newMaxWave = Math.max(useGameStore.getState().survivalMaxWave, wave);

        useGameStore.setState({
          currentRunScore: newScore,
          totalCoins: newCoins,
          sessionCoins: newSession,
          survivalMaxWave: newMaxWave,
          isSurvivalCampActive: true,
          availableSurvivalSupplies: getSurvivalSupplyChoices(wave),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("survivalMaxWave", String(newMaxWave));
          localStorage.setItem("totalCoins", String(newCoins));
        }
        useGameStore.getState().saveToCloud();
      } else {
        useGameStore.getState().advanceToNextLevel();
      }
    } else if (currentNode?.type === "battle") {
      useGameStore.getState().gainTeamLevels(2);
      // Award 100 points for winning a battle
      useGameStore.setState((state) => ({ currentRunScore: state.currentRunScore + 100 }));
      useGameStore.getState().decrementConsumableEffectsOnBattle();
      useGameStore.getState().resolveCurrentNode();

      const isSurvival = useGameStore.getState().activeSagaId === "survival_war";
      if (isSurvival) {
        const wave = useGameStore.getState().currentLevel;
        const waveInfo = getSurvivalWaveInfo(wave);
        const newScore = useGameStore.getState().currentRunScore + waveInfo.rewardScore;
        const newCoins = useGameStore.getState().totalCoins + waveInfo.rewardCoins;
        const newSession = useGameStore.getState().sessionCoins + waveInfo.rewardCoins;
        const newMaxWave = Math.max(useGameStore.getState().survivalMaxWave, wave);

        useGameStore.setState({
          currentRunScore: newScore,
          totalCoins: newCoins,
          sessionCoins: newSession,
          survivalMaxWave: newMaxWave,
          isSurvivalCampActive: true,
          availableSurvivalSupplies: getSurvivalSupplyChoices(wave),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("survivalMaxWave", String(newMaxWave));
          localStorage.setItem("totalCoins", String(newCoins));
        }
        useGameStore.getState().saveToCloud();
      }
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

export function simulateAndResolveBattle(
  players: RunNinja[],
  opponents: Ninja[],
  isBoss: boolean,
  currentLevel: number
): { finalStatus: "victory" | "defeat"; pTeam: RunNinja[]; oppTeam: RunNinja[] } {
  const lang = useLanguageStore.getState().language;
  const activeConsumableEffects = useGameStore.getState().activeConsumableEffects;

  const pTeam: RunNinja[] = players.map((p) => {
    const effStats = getNinjaEffectiveStats(p, activeConsumableEffects, players, lang);
    return {
      ...p,
      currentHp: p.currentHp > 0 ? p.currentHp : effStats.hpMax.total,
      currentChakra: p.currentChakra > 0 ? p.currentChakra : effStats.chakraMax.total,
    };
  });

  let avgPlayerLevel = 1;
  if (pTeam.length > 0) {
    avgPlayerLevel = Math.max(1, Math.floor(pTeam.reduce((acc, curr) => acc + curr.level, 0) / pTeam.length));
  }

  const activeSaga = useGameStore.getState().activeSagaId;
  const isTower = activeSaga === "endless_tower";
  const isSurvival = activeSaga === "survival_war";

  let oppLevel = Math.max(1, Math.floor(avgPlayerLevel * 0.95 + (currentLevel * 0.15)));
  if (isBoss) {
    oppLevel = Math.max(8, Math.floor(avgPlayerLevel * (1.25 + (currentLevel * 0.10))));
  }

  if (isTower) {
    oppLevel = Math.max(5, Math.floor(avgPlayerLevel * (0.85 + (currentLevel * 0.05)) + currentLevel * 0.4));
    if (isBoss) {
      oppLevel = Math.max(10, Math.floor(avgPlayerLevel * (1.20 + (currentLevel * 0.06)) + currentLevel * 0.8));
    }
  } else if (isSurvival) {
    oppLevel = Math.max(5, Math.floor(avgPlayerLevel * 0.9 + currentLevel * 0.6));
    if (isBoss) {
      oppLevel = Math.max(10, Math.floor(avgPlayerLevel * 1.25 + currentLevel * 1.0));
    }
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
      stats.hp = Math.floor(stats.hp * 1.45);
      stats.attack = Math.floor(stats.attack * 1.25);
      stats.defense = Math.floor(stats.defense * 1.20);
      stats.speed = Math.floor(stats.speed * 1.10);
    }

    if (isTower && currentLevel > 5) {
      const scale = 1 + Math.min(1.2, (currentLevel - 5) * 0.025);
      stats.hp = Math.floor(stats.hp * scale);
      stats.attack = Math.floor(stats.attack * scale);
      stats.defense = Math.floor(stats.defense * scale);
    } else if (isSurvival && currentLevel > 5) {
      const scale = 1 + Math.min(1.5, (currentLevel - 5) * 0.035);
      stats.hp = Math.floor(stats.hp * scale);
      stats.attack = Math.floor(stats.attack * scale);
      stats.defense = Math.floor(stats.defense * scale);
    }

    return {
      ...opp,
      level: oppLevel,
      baseStats: stats,
      currentHp: stats.hp,
      currentChakra: stats.chakra,
    };
  });

  const towerMod = useGameStore.getState().activeTowerModifier;
  if (towerMod?.id === "chakra_surge") {
    pTeam.forEach((p) => { p.currentChakra = Math.min(p.baseStats.chakra, p.currentChakra + 25); });
    oppTeam.forEach((o) => { o.currentChakra = Math.min(o.baseStats.chakra, o.currentChakra + 25); });
  }

  const res = executeBattleSimulation(pTeam, oppTeam);
  const status: "victory" | "defeat" =
    res.finalStatus || (res.pTeam.some((p) => p.currentHp > 0) ? "victory" : "defeat");

  return {
    finalStatus: status,
    pTeam: res.pTeam,
    oppTeam: res.oppTeam,
  };
}
