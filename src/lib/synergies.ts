import { RunNinja, NinjaClan, NinjaTeamGroup } from "@/types/index";

export interface SynergyConfig {
  id: string;
  name: { it: string; en: string };
  icon: string;
  colorClass: string;
  borderClass: string;
  description: { it: string; en: string };
  check: (team: RunNinja[]) => boolean;
  statBonus: {
    atkMultiplier?: number;
    defMultiplier?: number;
    hpMultiplier?: number;
    critChanceAdd?: number;
    healBonusMultiplier?: number;
  };
}

export const SYNERGIES: SynergyConfig[] = [
  {
    id: "team7",
    name: { it: "Team 7 (Leggendario)", en: "Team 7 (Legendary)" },
    icon: "🍥",
    colorClass: "bg-[#ff9f1c]/20 text-amber-300",
    borderClass: "border-amber-500/50 shadow-[0_0_10px_rgba(255,159,28,0.3)]",
    description: {
      it: "Naruto + Sasuke + Sakura nello stesso team: +15% Attacco e +15% Efficacia Cure!",
      en: "Naruto + Sasuke + Sakura in squad: +15% Attack & +15% Healing Effectiveness!"
    },
    check: (team) => {
      const ids = team.map((n) => n.characterId);
      return ids.includes("naruto") && ids.includes("sasuke") && ids.includes("sakura");
    },
    statBonus: { atkMultiplier: 1.15, healBonusMultiplier: 1.15 }
  },
  {
    id: "sannin",
    name: { it: "I 3 Ninja Leggendari", en: "The 3 Legendary Sannin" },
    icon: "🐸",
    colorClass: "bg-purple-950/40 text-purple-300",
    borderClass: "border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    description: {
      it: "Jiraiya + Tsunade + Orochimaru: +20% HP Max e +20% Attacco per la squadra!",
      en: "Jiraiya + Tsunade + Orochimaru: +20% Max HP & +20% Attack for the squad!"
    },
    check: (team) => {
      const ids = team.map((n) => n.characterId);
      return ids.includes("jiraiya") && ids.includes("tsunade") && ids.includes("orochimaru");
    },
    statBonus: { hpMultiplier: 1.20, atkMultiplier: 1.20 }
  },
  {
    id: "clan_uchiha",
    name: { it: "Clan Uchiha (Sharingan)", en: "Uchiha Clan (Sharingan)" },
    icon: "🔥",
    colorClass: "bg-red-950/40 text-red-300",
    borderClass: "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    description: {
      it: "2+ Ninja Uchiha: +20% Probabilità di Colpo Critico (Sharingan)!",
      en: "2+ Uchiha Ninjas: +20% Critical Hit Chance (Sharingan)!"
    },
    check: (team) => {
      const count = team.filter((n) => n.clan === "Uchiha" || n.characterId.includes("sasuke") || n.characterId.includes("itachi") || n.characterId.includes("madara") || n.characterId.includes("obito")).length;
      return count >= 2;
    },
    statBonus: { critChanceAdd: 0.20, atkMultiplier: 1.10 }
  },
  {
    id: "clan_uzumaki",
    name: { it: "Clan Uzumaki (Vitalità)", en: "Uzumaki Clan (Vitality)" },
    icon: "🌀",
    colorClass: "bg-amber-950/40 text-amber-300",
    borderClass: "border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    description: {
      it: "2+ Ninja Uzumaki: +25% HP Max per la squadra!",
      en: "2+ Uzumaki Ninjas: +25% Max HP for squad!"
    },
    check: (team) => {
      const count = team.filter((n) => n.clan === "Uzumaki" || n.characterId.includes("naruto") || n.characterId.includes("kushina") || n.characterId.includes("nagato") || n.characterId.includes("karin")).length;
      return count >= 2;
    },
    statBonus: { hpMultiplier: 1.25 }
  },
  {
    id: "clan_hyuga",
    name: { it: "Clan Hyuga (Byakugan)", en: "Hyuga Clan (Byakugan)" },
    icon: "👁️",
    colorClass: "bg-blue-950/40 text-blue-300",
    borderClass: "border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    description: {
      it: "2+ Ninja Hyuga: +20% Difesa per la squadra!",
      en: "2+ Hyuga Ninjas: +20% Defense for squad!"
    },
    check: (team) => {
      const count = team.filter((n) => n.clan === "Hyuga" || n.characterId.includes("neji") || n.characterId.includes("hinata")).length;
      return count >= 2;
    },
    statBonus: { defMultiplier: 1.20 }
  },
  {
    id: "akatsuki",
    name: { it: "Organizzazione Akatsuki", en: "Akatsuki Organization" },
    icon: "☁️",
    colorClass: "bg-gray-900 text-red-400",
    borderClass: "border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.4)]",
    description: {
      it: "2+ Membri Akatsuki: +15% Attacco e +10% Difesa!",
      en: "2+ Akatsuki Members: +15% Attack & +10% Defense!"
    },
    check: (team) => {
      const count = team.filter((n) => n.teamGroup === "Akatsuki" || n.characterId.includes("itachi") || n.characterId.includes("kisame") || n.characterId.includes("pain") || n.characterId.includes("konan") || n.characterId.includes("deidara") || n.characterId.includes("sasori") || n.characterId.includes("hidan") || n.characterId.includes("kakuzu")).length;
      return count >= 2;
    },
    statBonus: { atkMultiplier: 1.15, defMultiplier: 1.10 }
  }
];

export function getActiveSynergies(team: RunNinja[]): SynergyConfig[] {
  if (!team || team.length === 0) return [];
  return SYNERGIES.filter((syn) => syn.check(team));
}

export function getSynergyStatMultipliers(team: RunNinja[]) {
  const active = getActiveSynergies(team);
  let atkMult = 1;
  let defMult = 1;
  let hpMult = 1;
  let critAdd = 0;
  let healMult = 1;

  active.forEach((syn) => {
    if (syn.statBonus.atkMultiplier) atkMult *= syn.statBonus.atkMultiplier;
    if (syn.statBonus.defMultiplier) defMult *= syn.statBonus.defMultiplier;
    if (syn.statBonus.hpMultiplier) hpMult *= syn.statBonus.hpMultiplier;
    if (syn.statBonus.critChanceAdd) critAdd += syn.statBonus.critChanceAdd;
    if (syn.statBonus.healBonusMultiplier) healMult *= syn.statBonus.healBonusMultiplier;
  });

  return { atkMult, defMult, hpMult, critAdd, healMult };
}
