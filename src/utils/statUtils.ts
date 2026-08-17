import { RunNinja, GameItem } from "@/types/index";
import { getSynergyStatMultipliers } from "@/lib/synergies";

export interface StatSource {
  name: string;
  bonusText: string;
  type: "item" | "consumable" | "synergy";
}

export interface EffectiveStat {
  base: number;
  bonus: number;
  multiplier: number;
  total: number;
  isBoosted: boolean;
  sources: StatSource[];
}

export interface NinjaEffectiveStats {
  hpMax: EffectiveStat;
  chakraMax: EffectiveStat;
  attack: EffectiveStat;
  defense: EffectiveStat;
  speed: EffectiveStat;
}

export function getNinjaEffectiveStats(
  ninja: RunNinja,
  activeConsumableEffects: { item: GameItem; remainingBattles: number }[] = [],
  team: RunNinja[] = [ninja],
  lang: "it" | "en" = "it"
): NinjaEffectiveStats {
  const item = ninja.equippedItem;

  // 1. Equipped Item flat bonuses
  const equipHp = item?.equipStats?.hpMax || 0;
  const equipChakra = item?.equipStats?.chakraMax || 0;
  const equipAtk = item?.equipStats?.attack || 0;
  const equipDef = item?.equipStats?.defense || 0;
  const equipSpd = item?.equipStats?.speed || 0;

  // 2. Consumable multipliers
  let consumableAtkMult = 1;
  let consumableDefMult = 1;
  let consumableSpdMult = 1;

  const consumableSourcesAtk: StatSource[] = [];
  const consumableSourcesDef: StatSource[] = [];
  const consumableSourcesSpd: StatSource[] = [];

  activeConsumableEffects.forEach((eff) => {
    if (eff.item.teamBattleStatBoost) {
      if (eff.item.teamBattleStatBoost.attackMultiplier) {
        const mult = eff.item.teamBattleStatBoost.attackMultiplier;
        consumableAtkMult *= mult;
        const pct = Math.round((mult - 1) * 100);
        const battlesStr = lang === "it" ? "lotta rimasta" : "fight left";
        const battlesPlural = lang === "it" ? "lotte rimaste" : "fights left";
        const battlesText = eff.remainingBattles === 1 ? battlesStr : battlesPlural;
        consumableSourcesAtk.push({
          name: eff.item.name[lang],
          bonusText: `+${pct}% ATK (${eff.remainingBattles} ${battlesText})`,
          type: "consumable",
        });
      }
      if (eff.item.teamBattleStatBoost.defenseMultiplier) {
        const mult = eff.item.teamBattleStatBoost.defenseMultiplier;
        consumableDefMult *= mult;
        const pct = Math.round((mult - 1) * 100);
        const battlesStr = lang === "it" ? "lotta rimasta" : "fight left";
        const battlesPlural = lang === "it" ? "lotte rimaste" : "fights left";
        const battlesText = eff.remainingBattles === 1 ? battlesStr : battlesPlural;
        consumableSourcesDef.push({
          name: eff.item.name[lang],
          bonusText: `+${pct}% DEF (${eff.remainingBattles} ${battlesText})`,
          type: "consumable",
        });
      }
    }
  });

  // 3. Team Synergies multipliers
  const { atkMult: synAtkMult, defMult: synDefMult, hpMult: synHpMult } = getSynergyStatMultipliers(team);

  // HP
  const hpBase = ninja.baseStats.hp;
  const hpSources: StatSource[] = [];
  if (equipHp > 0 && item) {
    hpSources.push({
      name: item.name[lang],
      bonusText: `+${equipHp} HP`,
      type: "item",
    });
  }
  const hpTotal = Math.round((hpBase + equipHp) * synHpMult);

  // CHAKRA
  const chakraBase = ninja.baseStats.chakra;
  const chakraSources: StatSource[] = [];
  if (equipChakra > 0 && item) {
    chakraSources.push({
      name: item.name[lang],
      bonusText: `+${equipChakra} CHK`,
      type: "item",
    });
  }
  const chakraTotal = chakraBase + equipChakra;

  // ATTACK
  const atkBase = ninja.baseStats.attack;
  const atkSources: StatSource[] = [];
  if (equipAtk > 0 && item) {
    atkSources.push({
      name: item.name[lang],
      bonusText: `+${equipAtk} ATK`,
      type: "item",
    });
  }
  atkSources.push(...consumableSourcesAtk);
  if (synAtkMult > 1) {
    atkSources.push({
      name: lang === "it" ? "Sinergia Squadra" : "Team Synergy",
      bonusText: `+${Math.round((synAtkMult - 1) * 100)}% ATK`,
      type: "synergy",
    });
  }
  const atkTotal = Math.round((atkBase + equipAtk) * consumableAtkMult * synAtkMult);

  // DEFENSE
  const defBase = ninja.baseStats.defense;
  const defSources: StatSource[] = [];
  if (equipDef > 0 && item) {
    defSources.push({
      name: item.name[lang],
      bonusText: `+${equipDef} DEF`,
      type: "item",
    });
  }
  defSources.push(...consumableSourcesDef);
  if (synDefMult > 1) {
    defSources.push({
      name: lang === "it" ? "Sinergia Squadra" : "Team Synergy",
      bonusText: `+${Math.round((synDefMult - 1) * 100)}% DEF`,
      type: "synergy",
    });
  }
  const defTotal = Math.round((defBase + equipDef) * consumableDefMult * synDefMult);

  // SPEED
  const spdBase = ninja.baseStats.speed;
  const spdSources: StatSource[] = [];
  if (equipSpd > 0 && item) {
    spdSources.push({
      name: item.name[lang],
      bonusText: `+${equipSpd} SPD`,
      type: "item",
    });
  }
  spdSources.push(...consumableSourcesSpd);
  const spdTotal = Math.round((spdBase + equipSpd) * consumableSpdMult);

  return {
    hpMax: {
      base: hpBase,
      bonus: hpTotal - hpBase,
      multiplier: synHpMult,
      total: hpTotal,
      isBoosted: hpTotal > hpBase,
      sources: hpSources,
    },
    chakraMax: {
      base: chakraBase,
      bonus: chakraTotal - chakraBase,
      multiplier: 1,
      total: chakraTotal,
      isBoosted: chakraTotal > chakraBase,
      sources: chakraSources,
    },
    attack: {
      base: atkBase,
      bonus: atkTotal - atkBase,
      multiplier: consumableAtkMult * synAtkMult,
      total: atkTotal,
      isBoosted: atkTotal > atkBase,
      sources: atkSources,
    },
    defense: {
      base: defBase,
      bonus: defTotal - defBase,
      multiplier: consumableDefMult * synDefMult,
      total: defTotal,
      isBoosted: defTotal > defBase,
      sources: defSources,
    },
    speed: {
      base: spdBase,
      bonus: spdTotal - spdBase,
      multiplier: consumableSpdMult,
      total: spdTotal,
      isBoosted: spdTotal > spdBase,
      sources: spdSources,
    },
  };
}
