import { RunNinja } from "@/types/index";

export interface SynergyMemberRequirement {
  characterId: string;
  name: { it: string; en: string };
  sprite: string;
}

export interface SynergyTier {
  requiredCount: number;
  levelName: { it: string; en: string };
  description: { it: string; en: string };
  statBonus: {
    atkMultiplier?: number;
    defMultiplier?: number;
    hpMultiplier?: number;
    critChanceAdd?: number;
    healBonusMultiplier?: number;
  };
}

export interface SynergyConfig {
  id: string;
  name: { it: string; en: string };
  icon: string; // Emoji fallback
  image: string; // Image path (e.g. /synergies/team7.png)
  colorClass: string;
  borderClass: string;
  members: SynergyMemberRequirement[]; // Default / Shippuden members
  membersKid?: SynergyMemberRequirement[]; // Kid Saga variant members
  matchType: "characterIds" | "clan" | "faction";
  clanOrFactionKey?: string;
  tiers: SynergyTier[];
}

export function getSynergyDisplayMembers(syn: SynergyConfig, sagaId?: string | null): SynergyMemberRequirement[] {
  if (sagaId === "naruto_classic" && syn.membersKid && syn.membersKid.length > 0) {
    return syn.membersKid;
  }
  return syn.members;
}

export const SYNERGIES: SynergyConfig[] = [
  // ==========================================
  // 1. TEAM 7 LEGGENDARIO (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "team7",
    name: { it: "Team 7 (Leggendario)", en: "Team 7 (Legendary)" },
    icon: "🍥",
    image: "/synergies/team7.png",
    colorClass: "bg-[#ff9f1c]/20 text-amber-300",
    borderClass: "border-amber-500/50 shadow-[0_0_10px_rgba(255,159,28,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki", en: "Naruto Uzumaki" }, sprite: "/sprites/naruto_shippuden.png" },
      { characterId: "sasuke", name: { it: "Sasuke Uchiha", en: "Sasuke Uchiha" }, sprite: "/sprites/sasuke_shippuden.png" },
      { characterId: "sakura", name: { it: "Sakura Haruno", en: "Sakura Haruno" }, sprite: "/sprites/sakura_shippuden.png" },
    ],
    membersKid: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki (Kid)", en: "Naruto Uzumaki (Kid)" }, sprite: "/sprites/naruto_kid.png" },
      { characterId: "sasuke", name: { it: "Sasuke Uchiha (Kid)", en: "Sasuke Uchiha (Kid)" }, sprite: "/sprites/sasuke_kid.png" },
      { characterId: "sakura", name: { it: "Sakura Haruno (Kid)", en: "Sakura Haruno (Kid)" }, sprite: "/sprites/sakura_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 membri del Team 7: +12% Attacco e +12% Efficacia Cure!",
          en: "2 Team 7 members: +12% Attack & +12% Healing!"
        },
        statBonus: { atkMultiplier: 1.12, healBonusMultiplier: 1.12 }
      },
      {
        requiredCount: 3,
        levelName: { it: "Livello ORO (3 Ninja)", en: "GOLD Level (3 Ninjas)" },
        description: {
          it: "Team 7 Completo (Naruto+Sasuke+Sakura): +25% Attacco e +25% Efficacia Cure!",
          en: "Full Team 7 (Naruto+Sasuke+Sakura): +25% Attack & +25% Healing!"
        },
        statBonus: { atkMultiplier: 1.25, healBonusMultiplier: 1.25 }
      }
    ]
  },

  // ==========================================
  // 2. TRIO INO-SHIKA-CHO (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "ino_shika_cho",
    name: { it: "Trio Ino-Shika-Cho", en: "Ino-Shika-Cho Trio" },
    icon: "📜",
    image: "/synergies/ino_shika_cho.png",
    colorClass: "bg-emerald-950/40 text-emerald-300",
    borderClass: "border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "shikamaru", name: { it: "Shikamaru Nara", en: "Shikamaru Nara" }, sprite: "/sprites/shikamaru_shippuden.png" },
      { characterId: "choji", name: { it: "Choji Akimichi", en: "Choji Akimichi" }, sprite: "/sprites/choji_shippuden.png" },
      { characterId: "ino", name: { it: "Ino Yamanaka", en: "Ino Yamanaka" }, sprite: "/sprites/ino_shippuden.png" },
    ],
    membersKid: [
      { characterId: "shikamaru", name: { it: "Shikamaru Nara (Kid)", en: "Shikamaru Nara (Kid)" }, sprite: "/sprites/shikamaru_kid.png" },
      { characterId: "choji", name: { it: "Choji Akimichi (Kid)", en: "Choji Akimichi (Kid)" }, sprite: "/sprites/choji_kid.png" },
      { characterId: "ino", name: { it: "Ino Yamanaka (Kid)", en: "Ino Yamanaka (Kid)" }, sprite: "/sprites/ino_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 membri Ino-Shika-Cho: +12% Attacco e +15% Difesa!",
          en: "2 Ino-Shika-Cho members: +12% Attack & +15% Defense!"
        },
        statBonus: { atkMultiplier: 1.12, defMultiplier: 1.15 }
      },
      {
        requiredCount: 3,
        levelName: { it: "Livello ORO (3 Ninja)", en: "GOLD Level (3 Ninjas)" },
        description: {
          it: "Shikamaru + Choji + Ino: +28% Attacco, +28% Difesa e +20% Cure!",
          en: "Shikamaru + Choji + Ino: +28% Attack, +28% Defense & +20% Healing!"
        },
        statBonus: { atkMultiplier: 1.28, defMultiplier: 1.28, healBonusMultiplier: 1.20 }
      }
    ]
  },

  // ==========================================
  // 3. FRATELLI DELLA SABBIA (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "sand_siblings",
    name: { it: "Fratelli della Sabbia", en: "Sand Siblings" },
    icon: "⏳",
    image: "/synergies/sand_siblings.png",
    colorClass: "bg-amber-950/40 text-amber-200",
    borderClass: "border-amber-600/50 shadow-[0_0_10px_rgba(217,119,6,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "gaara", name: { it: "Gaara della Sabbia", en: "Gaara of the Sand" }, sprite: "/sprites/gaara_shippuden.png" },
      { characterId: "temari", name: { it: "Temari", en: "Temari" }, sprite: "/sprites/temari_shippuden.png" },
      { characterId: "kankuro", name: { it: "Kankuro", en: "Kankuro" }, sprite: "/sprites/kankuro_shippuden.png" },
    ],
    membersKid: [
      { characterId: "gaara", name: { it: "Gaara (Kid)", en: "Gaara (Kid)" }, sprite: "/sprites/gaara_kid.png" },
      { characterId: "temari", name: { it: "Temari (Kid)", en: "Temari (Kid)" }, sprite: "/sprites/temari_kid.png" },
      { characterId: "kankuro", name: { it: "Kankuro (Kid)", en: "Kankuro (Kid)" }, sprite: "/sprites/kankuro_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 membri della Sabbia: +12% Difesa e +12% Attacco!",
          en: "2 Sand members: +12% Defense & +12% Attack!"
        },
        statBonus: { defMultiplier: 1.12, atkMultiplier: 1.12 }
      },
      {
        requiredCount: 3,
        levelName: { it: "Livello ORO (3 Ninja)", en: "GOLD Level (3 Ninjas)" },
        description: {
          it: "Gaara + Temari + Kankuro: +28% Difesa, +28% Attacco e +15% HP Max!",
          en: "Gaara + Temari + Kankuro: +28% Defense, +28% Attack & +15% Max HP!"
        },
        statBonus: { defMultiplier: 1.28, atkMultiplier: 1.28, hpMultiplier: 1.15 }
      }
    ]
  },

  // ==========================================
  // 4. TEAM GUY (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "team_guy",
    name: { it: "Team Guy", en: "Team Guy" },
    icon: "👊",
    image: "/synergies/team_guy.png",
    colorClass: "bg-emerald-950/40 text-emerald-300",
    borderClass: "border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "guy", name: { it: "Might Guy", en: "Might Guy" }, sprite: "/sprites/guy_shippuden.png" },
      { characterId: "lee", name: { it: "Rock Lee", en: "Rock Lee" }, sprite: "/sprites/lee_shippuden.png" },
      { characterId: "neji", name: { it: "Neji Hyuga", en: "Neji Hyuga" }, sprite: "/sprites/neji_shippuden.png" },
      { characterId: "tenten", name: { it: "Tenten", en: "Tenten" }, sprite: "/sprites/tenten_shippuden.png" },
    ],
    membersKid: [
      { characterId: "guy", name: { it: "Might Guy", en: "Might Guy" }, sprite: "/sprites/guy_shippuden.png" },
      { characterId: "lee", name: { it: "Rock Lee (Kid)", en: "Rock Lee (Kid)" }, sprite: "/sprites/lee_kid.png" },
      { characterId: "neji", name: { it: "Neji Hyuga (Kid)", en: "Neji Hyuga (Kid)" }, sprite: "/sprites/neji_kid.png" },
      { characterId: "tenten", name: { it: "Tenten (Kid)", en: "Tenten (Kid)" }, sprite: "/sprites/tenten_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 membri del Team Guy: +12% Attacco e +12% Velocità!",
          en: "2 Team Guy members: +12% Attack & +12% Speed!"
        },
        statBonus: { atkMultiplier: 1.12 }
      },
      {
        requiredCount: 4,
        levelName: { it: "Livello ORO (4 Ninja)", en: "GOLD Level (4 Ninjas)" },
        description: {
          it: "Team Guy Completo (Guy+Lee+Neji+Tenten): +30% Attacco, +20% Critico e +15% Difesa!",
          en: "Full Team Guy: +30% Attack, +20% Crit & +15% Defense!"
        },
        statBonus: { atkMultiplier: 1.30, critChanceAdd: 0.20, defMultiplier: 1.15 }
      }
    ]
  },

  // ==========================================
  // 5. GIOVINEZZA SUPREMA (GUY & LEE) (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "guy_lee",
    name: { it: "Giovinezza Suprema (Guy & Lee)", en: "Supreme Youth (Guy & Lee)" },
    icon: "🔥",
    image: "/synergies/guy_lee.png",
    colorClass: "bg-emerald-950/50 text-emerald-300",
    borderClass: "border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "guy", name: { it: "Might Guy", en: "Might Guy" }, sprite: "/sprites/guy_shippuden.png" },
      { characterId: "lee", name: { it: "Rock Lee", en: "Rock Lee" }, sprite: "/sprites/lee_shippuden.png" },
    ],
    membersKid: [
      { characterId: "guy", name: { it: "Might Guy", en: "Might Guy" }, sprite: "/sprites/guy_shippuden.png" },
      { characterId: "lee", name: { it: "Rock Lee (Kid)", en: "Rock Lee (Kid)" }, sprite: "/sprites/lee_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "Guy + Rock Lee: +25% Attacco e +25% Probabilità Critico!",
          en: "Guy + Rock Lee: +25% Attack & +25% Crit Chance!"
        },
        statBonus: { atkMultiplier: 1.25, critChanceAdd: 0.25 }
      }
    ]
  },

  // ==========================================
  // 6. LEGAME MAESTRO (NARUTO & IRUKA) (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "iruka_naruto",
    name: { it: "Legame Maestro (Naruto & Iruka)", en: "Master Bond (Naruto & Iruka)" },
    icon: "🍜",
    image: "/synergies/iruka_naruto.png",
    colorClass: "bg-orange-950/40 text-orange-300",
    borderClass: "border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki", en: "Naruto Uzumaki" }, sprite: "/sprites/naruto_shippuden.png" },
      { characterId: "iruka", name: { it: "Iruka Umino", en: "Iruka Umino" }, sprite: "/sprites/iruka_kid.png" },
    ],
    membersKid: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki (Kid)", en: "Naruto Uzumaki (Kid)" }, sprite: "/sprites/naruto_kid.png" },
      { characterId: "iruka", name: { it: "Iruka Umino", en: "Iruka Umino" }, sprite: "/sprites/iruka_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "Naruto + Iruka: +20% HP Max e +20% Efficacia Cure per la squadra!",
          en: "Naruto + Iruka: +20% Max HP & +20% Healing Effectiveness for squad!"
        },
        statBonus: { hpMultiplier: 1.20, healBonusMultiplier: 1.20 }
      }
    ]
  },

  // ==========================================
  // 7. CLAN HYUGA (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "clan_hyuga",
    name: { it: "Clan Hyuga (Byakugan Assoluto)", en: "Hyuga Clan (Absolute Byakugan)" },
    icon: "👁️",
    image: "/synergies/clan_hyuga.png",
    colorClass: "bg-blue-950/40 text-blue-300",
    borderClass: "border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    matchType: "clan",
    clanOrFactionKey: "Hyuga",
    members: [
      { characterId: "neji", name: { it: "Neji Hyuga", en: "Neji Hyuga" }, sprite: "/sprites/neji_shippuden.png" },
      { characterId: "hinata", name: { it: "Hinata Hyuga", en: "Hinata Hyuga" }, sprite: "/sprites/hinata_shippuden.png" },
    ],
    membersKid: [
      { characterId: "neji", name: { it: "Neji Hyuga (Kid)", en: "Neji Hyuga (Kid)" }, sprite: "/sprites/neji_kid.png" },
      { characterId: "hinata", name: { it: "Hinata Hyuga (Kid)", en: "Hinata Hyuga (Kid)" }, sprite: "/sprites/hinata_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "2 Ninja Hyuga: +25% Difesa per la squadra!",
          en: "2 Hyuga Ninjas: +25% Defense for squad!"
        },
        statBonus: { defMultiplier: 1.25 }
      }
    ]
  },

  // ==========================================
  // 8. CLAN UZUMAKI (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "clan_uzumaki",
    name: { it: "Clan Uzumaki (Vitalità Infinita)", en: "Uzumaki Clan (Endless Vitality)" },
    icon: "🌀",
    image: "/synergies/clan_uzumaki.png",
    colorClass: "bg-amber-950/40 text-amber-300",
    borderClass: "border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    matchType: "clan",
    clanOrFactionKey: "Uzumaki",
    members: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki", en: "Naruto Uzumaki" }, sprite: "/sprites/naruto_shippuden.png" },
      { characterId: "pain", name: { it: "Pain / Nagato", en: "Pain / Nagato" }, sprite: "/sprites/pain_boss.png" },
    ],
    membersKid: [
      { characterId: "naruto", name: { it: "Naruto Uzumaki (Kid)", en: "Naruto Uzumaki (Kid)" }, sprite: "/sprites/naruto_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "2 Ninja Uzumaki: +25% HP Max per la squadra!",
          en: "2 Uzumaki Ninjas: +25% Max HP for squad!"
        },
        statBonus: { hpMultiplier: 1.25 }
      }
    ]
  },

  // ==========================================
  // 9. CLAN UCHIHA (KID & SHIPPUDEN)
  // ==========================================
  {
    id: "clan_uchiha",
    name: { it: "Clan Uchiha (Sharingan)", en: "Uchiha Clan (Sharingan)" },
    icon: "🔥",
    image: "/synergies/clan_uchiha.png",
    colorClass: "bg-red-950/40 text-red-300",
    borderClass: "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    matchType: "clan",
    clanOrFactionKey: "Uchiha",
    members: [
      { characterId: "sasuke", name: { it: "Sasuke Uchiha", en: "Sasuke Uchiha" }, sprite: "/sprites/sasuke_shippuden.png" },
      { characterId: "itachi", name: { it: "Itachi Uchiha", en: "Itachi Uchiha" }, sprite: "/sprites/itachi_shippuden.png" },
      { characterId: "obito", name: { it: "Obito Uchiha", en: "Obito Uchiha" }, sprite: "/sprites/obito_boss.png" },
      { characterId: "madara", name: { it: "Madara Uchiha", en: "Madara Uchiha" }, sprite: "/sprites/madara_boss.png" },
    ],
    membersKid: [
      { characterId: "sasuke", name: { it: "Sasuke Uchiha (Kid)", en: "Sasuke Uchiha (Kid)" }, sprite: "/sprites/sasuke_kid.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 Ninja Uchiha: +15% Critico e +10% Attacco!",
          en: "2 Uchiha Ninjas: +15% Crit & +10% Attack!"
        },
        statBonus: { critChanceAdd: 0.15, atkMultiplier: 1.10 }
      },
      {
        requiredCount: 4,
        levelName: { it: "Livello ORO (4 Ninja)", en: "GOLD Level (4 Ninjas)" },
        description: {
          it: "4 Ninja Uchiha (Esercito Sharingan): +35% Critico e +30% Attacco!",
          en: "4 Uchiha Ninjas (Sharingan Army): +35% Crit & +30% Attack!"
        },
        statBonus: { critChanceAdd: 0.35, atkMultiplier: 1.30 }
      }
    ]
  },

  // ==========================================
  // 10. KAKASHI & OBITO (SHIPPUDEN)
  // ==========================================
  {
    id: "kakashi_obito",
    name: { it: "Kakashi & Obito (Sharingan Condiviso)", en: "Kakashi & Obito (Shared Sharingan)" },
    icon: "👁️‍🗨️",
    image: "/synergies/kakashi_obito.png",
    colorClass: "bg-indigo-950/50 text-indigo-300",
    borderClass: "border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "kakashi", name: { it: "Kakashi Hatake", en: "Kakashi Hatake" }, sprite: "/sprites/kakashi_shippuden.png" },
      { characterId: "obito", name: { it: "Obito Uchiha", en: "Obito Uchiha" }, sprite: "/sprites/obito_boss.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "Kakashi + Obito nello stesso team: +20% Attacco, +15% Difesa e +20% Probabilità Critico!",
          en: "Kakashi + Obito in squad: +20% Attack, +15% Defense & +20% Crit Chance!"
        },
        statBonus: { atkMultiplier: 1.20, defMultiplier: 1.15, critChanceAdd: 0.20 }
      }
    ]
  },

  // ==========================================
  // 11. FRATELLI UCHIHA (ITACHI & SASUKE) (SHIPPUDEN)
  // ==========================================
  {
    id: "brothers_uchiha",
    name: { it: "Legame di Sangue (Itachi & Sasuke)", en: "Bloodline Bond (Itachi & Sasuke)" },
    icon: "🩸",
    image: "/synergies/brothers_uchiha.png",
    colorClass: "bg-rose-950/40 text-rose-300",
    borderClass: "border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "itachi", name: { it: "Itachi Uchiha", en: "Itachi Uchiha" }, sprite: "/sprites/itachi_shippuden.png" },
      { characterId: "sasuke", name: { it: "Sasuke Uchiha", en: "Sasuke Uchiha" }, sprite: "/sprites/sasuke_shippuden.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ORO (2 Ninja)", en: "GOLD Level (2 Ninjas)" },
        description: {
          it: "Itachi + Sasuke: +25% Attacco e +25% Probabilità Critico!",
          en: "Itachi + Sasuke: +25% Attack & +25% Crit Chance!"
        },
        statBonus: { atkMultiplier: 1.25, critChanceAdd: 0.25 }
      }
    ]
  },

  // ==========================================
  // 12. TEAM MINATO (SHIPPUDEN / FLASHBACK)
  // ==========================================
  {
    id: "team_minato",
    name: { it: "Team Minato", en: "Team Minato" },
    icon: "⚡",
    image: "/synergies/team_minato.png",
    colorClass: "bg-yellow-950/40 text-yellow-300",
    borderClass: "border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "minato", name: { it: "Minato Namikaze", en: "Minato Namikaze" }, sprite: "/sprites/minato_shippuden.png" },
      { characterId: "kakashi", name: { it: "Kakashi Hatake", en: "Kakashi Hatake" }, sprite: "/sprites/kakashi_shippuden.png" },
      { characterId: "obito", name: { it: "Obito Uchiha", en: "Obito Uchiha" }, sprite: "/sprites/obito_boss.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 membri del Team Minato: +12% Attacco e +12% Difesa!",
          en: "2 Team Minato members: +12% Attack & +12% Defense!"
        },
        statBonus: { atkMultiplier: 1.12, defMultiplier: 1.12 }
      },
      {
        requiredCount: 3,
        levelName: { it: "Livello ORO (3 Ninja)", en: "GOLD Level (3 Ninjas)" },
        description: {
          it: "Minato + Kakashi + Obito: +30% Attacco, +20% Difesa e +15% Critico!",
          en: "Minato + Kakashi + Obito: +30% Attack, +20% Defense & +15% Crit!"
        },
        statBonus: { atkMultiplier: 1.30, defMultiplier: 1.20, critChanceAdd: 0.15 }
      }
    ]
  },

  // ==========================================
  // 13. I 3 SANNIN LEGGENDARI (SHIPPUDEN)
  // ==========================================
  {
    id: "sannin",
    name: { it: "I 3 Ninja Leggendari (Sannin)", en: "The 3 Legendary Sannin" },
    icon: "🐸",
    image: "/synergies/sannin.png",
    colorClass: "bg-purple-950/40 text-purple-300",
    borderClass: "border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    matchType: "characterIds",
    members: [
      { characterId: "jiraiya", name: { it: "Jiraiya", en: "Jiraiya" }, sprite: "/sprites/jiraiya_shippuden.png" },
      { characterId: "tsunade", name: { it: "Tsunade", en: "Tsunade" }, sprite: "/sprites/tsunade_shippuden.png" },
      { characterId: "orochimaru", name: { it: "Orochimaru", en: "Orochimaru" }, sprite: "/sprites/orochimaru_shippuden.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello ARGENTO (2 Ninja)", en: "SILVER Level (2 Ninjas)" },
        description: {
          it: "2 Sannin Leggendari: +12% HP Max e +12% Attacco!",
          en: "2 Legendary Sannin: +12% Max HP & +12% Attack!"
        },
        statBonus: { hpMultiplier: 1.12, atkMultiplier: 1.12 }
      },
      {
        requiredCount: 3,
        levelName: { it: "Livello ORO (3 Ninja)", en: "GOLD Level (3 Ninjas)" },
        description: {
          it: "Tutti e 3 i Sannin Leggendari: +30% HP Max, +30% Attacco e +15% Cure!",
          en: "All 3 Legendary Sannin: +30% Max HP, +30% Attack & +15% Healing!"
        },
        statBonus: { hpMultiplier: 1.30, atkMultiplier: 1.30, healBonusMultiplier: 1.15 }
      }
    ]
  },

  // ==========================================
  // 14. FORZA PORTANTE (JINCHURIKI) (SHIPPUDEN)
  // ==========================================
  {
    id: "jinchuriki",
    name: { it: "Forza Portante (Jinchūriki)", en: "Jinchūriki Vessels" },
    icon: "🦊",
    image: "/synergies/jinchuriki.png",
    colorClass: "bg-[#ff9f1c]/30 text-amber-300",
    borderClass: "border-amber-500/60 shadow-[0_0_12px_rgba(255,159,28,0.4)]",
    matchType: "characterIds",
    members: [
      { characterId: "naruto", name: { it: "Naruto (Nove Code)", en: "Naruto (Nine-Tails)" }, sprite: "/sprites/naruto_shippuden.png" },
      { characterId: "gaara", name: { it: "Gaara (Monocoda)", en: "Gaara (One-Tail)" }, sprite: "/sprites/gaara_shippuden.png" },
      { characterId: "pain", name: { it: "Pain / Nagato", en: "Pain / Nagato" }, sprite: "/sprites/pain_boss.png" },
      { characterId: "obito", name: { it: "Obito (Decacoda)", en: "Obito (Ten-Tails)" }, sprite: "/sprites/obito_tt.png" },
      { characterId: "madara", name: { it: "Madara (Decacoda)", en: "Madara (Ten-Tails)" }, sprite: "/sprites/madara_tt.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello BRONZO (2 Ninja)", en: "BRONZE Level (2 Ninjas)" },
        description: {
          it: "2 Forze Portanti: +15% HP Max e +10% Attacco!",
          en: "2 Jinchūriki Vessels: +15% Max HP & +10% Attack!"
        },
        statBonus: { hpMultiplier: 1.15, atkMultiplier: 1.10 }
      },
      {
        requiredCount: 4,
        levelName: { it: "Livello ARGENTO (4 Ninja)", en: "SILVER Level (4 Ninjas)" },
        description: {
          it: "4 Forze Portanti: +30% HP Max e +20% Attacco!",
          en: "4 Jinchūriki Vessels: +30% Max HP & +20% Attack!"
        },
        statBonus: { hpMultiplier: 1.30, atkMultiplier: 1.20 }
      },
      {
        requiredCount: 5,
        levelName: { it: "Livello ORO (5 Ninja)", en: "GOLD Level (5 Ninjas)" },
        description: {
          it: "5 Forze Portanti (Aura dei Cercoteri): +50% HP Max, +35% Attacco e +25% Cure!",
          en: "5 Jinchūriki Vessels (Tailed Beast Aura): +50% Max HP, +35% Attack & +25% Healing!"
        },
        statBonus: { hpMultiplier: 1.50, atkMultiplier: 1.35, healBonusMultiplier: 1.25 }
      }
    ]
  },

  // ==========================================
  // 15. ORGANIZZAZIONE AKATSUKI (SHIPPUDEN)
  // ==========================================
  {
    id: "akatsuki",
    name: { it: "Organizzazione Akatsuki", en: "Akatsuki Organization" },
    icon: "☁️",
    image: "/synergies/akatsuki.png",
    colorClass: "bg-gray-900 text-red-400",
    borderClass: "border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.4)]",
    matchType: "faction",
    clanOrFactionKey: "Akatsuki",
    members: [
      { characterId: "itachi", name: { it: "Itachi Uchiha", en: "Itachi Uchiha" }, sprite: "/sprites/itachi_shippuden.png" },
      { characterId: "kisame", name: { it: "Kisame Hoshigaki", en: "Kisame Hoshigaki" }, sprite: "/sprites/kisame_shippuden.png" },
      { characterId: "deidara", name: { it: "Deidara", en: "Deidara" }, sprite: "/sprites/deidara_boss.png" },
      { characterId: "sasori", name: { it: "Sasori", en: "Sasori" }, sprite: "/sprites/sasori_boss.png" },
      { characterId: "hidan", name: { it: "Hidan", en: "Hidan" }, sprite: "/sprites/hidan_boss.png" },
      { characterId: "kakuzu", name: { it: "Kakuzu", en: "Kakuzu" }, sprite: "/sprites/kakuzu_boss.png" },
      { characterId: "pain", name: { it: "Pain", en: "Pain" }, sprite: "/sprites/pain_boss.png" },
      { characterId: "konan", name: { it: "Konan", en: "Konan" }, sprite: "/sprites/konan_shippuden.png" },
    ],
    tiers: [
      {
        requiredCount: 2,
        levelName: { it: "Livello BRONZO (2 Ninja)", en: "BRONZE Level (2 Ninjas)" },
        description: {
          it: "2 Membri Akatsuki: +12% Attacco e +10% Difesa!",
          en: "2 Akatsuki Members: +12% Attack & +10% Defense!"
        },
        statBonus: { atkMultiplier: 1.12, defMultiplier: 1.10 }
      },
      {
        requiredCount: 4,
        levelName: { it: "Livello ARGENTO (4 Ninja)", en: "SILVER Level (4 Ninjas)" },
        description: {
          it: "4 Membri Akatsuki: +22% Attacco, +18% Difesa e +10% Critico!",
          en: "4 Akatsuki Members: +22% Attack, +18% Defense & +10% Crit!"
        },
        statBonus: { atkMultiplier: 1.22, defMultiplier: 1.18, critChanceAdd: 0.10 }
      },
      {
        requiredCount: 6,
        levelName: { it: "Livello ORO (6 Ninja)", en: "GOLD Level (6 Ninjas)" },
        description: {
          it: "6 Membri Akatsuki (Dominio dei Nuvolati): +40% Attacco, +30% Difesa e +20% Critico!",
          en: "6 Akatsuki Members (Clouded Supremacy): +40% Attack, +30% Defense & +20% Crit!"
        },
        statBonus: { atkMultiplier: 1.40, defMultiplier: 1.30, critChanceAdd: 0.20 }
      }
    ]
  }
];

export interface ActiveSynergyResult {
  synergy: SynergyConfig;
  tier: SynergyTier;
  tierIndex: number;
  maxTierIndex: number;
  isMaxTier: boolean;
  activeCount: number;
  totalMembersCount: number;
}

export function getActiveSynergies(team: RunNinja[]): ActiveSynergyResult[] {
  if (!team || team.length === 0) return [];

  const results: ActiveSynergyResult[] = [];

  SYNERGIES.forEach((syn) => {
    let activeCount = 0;

    if (syn.matchType === "characterIds") {
      const teamCharIds = team.map((n) => n.characterId);
      syn.members.forEach((mem) => {
        if (teamCharIds.includes(mem.characterId)) {
          activeCount++;
        }
      });
    } else if (syn.matchType === "clan" && syn.clanOrFactionKey) {
      activeCount = team.filter(
        (n) =>
          n.clan === syn.clanOrFactionKey ||
          (syn.clanOrFactionKey === "Uchiha" && (n.characterId.includes("sasuke") || n.characterId.includes("itachi") || n.characterId.includes("madara") || n.characterId.includes("obito"))) ||
          (syn.clanOrFactionKey === "Uzumaki" && (n.characterId.includes("naruto") || n.characterId.includes("kushina") || n.characterId.includes("nagato") || n.characterId.includes("karin"))) ||
          (syn.clanOrFactionKey === "Hyuga" && (n.characterId.includes("neji") || n.characterId.includes("hinata")))
      ).length;
    } else if (syn.matchType === "faction" && syn.clanOrFactionKey) {
      activeCount = team.filter(
        (n) =>
          n.teamGroup === syn.clanOrFactionKey ||
          (syn.clanOrFactionKey === "Akatsuki" &&
            (n.characterId.includes("itachi") ||
              n.characterId.includes("kisame") ||
              n.characterId.includes("pain") ||
              n.characterId.includes("konan") ||
              n.characterId.includes("deidara") ||
              n.characterId.includes("sasori") ||
              n.characterId.includes("hidan") ||
              n.characterId.includes("kakuzu")))
      ).length;
    }

    // Check if activeCount satisfies at least Tier 1 (tiers[0].requiredCount)
    if (syn.tiers.length > 0 && activeCount >= syn.tiers[0].requiredCount) {
      // Find highest tier matched
      let matchedTierIndex = 0;
      for (let i = syn.tiers.length - 1; i >= 0; i--) {
        if (activeCount >= syn.tiers[i].requiredCount) {
          matchedTierIndex = i;
          break;
        }
      }

      const activeTier = syn.tiers[matchedTierIndex];
      const maxTierIndex = syn.tiers.length - 1;

      results.push({
        synergy: syn,
        tier: activeTier,
        tierIndex: matchedTierIndex,
        maxTierIndex,
        isMaxTier: matchedTierIndex === maxTierIndex,
        activeCount,
        totalMembersCount: syn.members.length,
      });
    }
  });

  return results;
}

export function getSynergyStatMultipliers(team: RunNinja[]) {
  const activeResults = getActiveSynergies(team);
  let atkMult = 1;
  let defMult = 1;
  let hpMult = 1;
  let critAdd = 0;
  let healMult = 1;

  activeResults.forEach((res) => {
    const bonus = res.tier.statBonus;
    if (bonus.atkMultiplier) atkMult *= bonus.atkMultiplier;
    if (bonus.defMultiplier) defMult *= bonus.defMultiplier;
    if (bonus.hpMultiplier) hpMult *= bonus.hpMultiplier;
    if (bonus.critChanceAdd) critAdd += bonus.critChanceAdd;
    if (bonus.healBonusMultiplier) healMult *= bonus.healBonusMultiplier;
  });

  return { atkMult, defMult, hpMult, critAdd, healMult };
}

export interface CandidateSynergyMatch {
  synergy: SynergyConfig;
  status: "activates" | "upgrades";
  label: { it: string; en: string };
  tierName?: { it: string; en: string };
}

export function getSynergiesUnlockedByCandidate(
  currentTeam: RunNinja[],
  candidate: { id: string; characterId: string; clan?: string; teamGroup?: string }
): CandidateSynergyMatch[] {
  if (!candidate || !currentTeam) return [];

  const activeNow = getActiveSynergies(currentTeam);
  const activeNowMap = new Map<string, number>();
  activeNow.forEach((a) => activeNowMap.set(a.synergy.id, a.tierIndex));

  // Create temporary mock RunNinja for candidate simulation
  const mockNinja = {
    id: candidate.id,
    characterId: candidate.characterId,
    clan: candidate.clan,
    teamGroup: candidate.teamGroup,
  } as RunNinja;

  const simulatedTeam = [...currentTeam, mockNinja];
  const activeWithCandidate = getActiveSynergies(simulatedTeam);

  const matches: CandidateSynergyMatch[] = [];

  activeWithCandidate.forEach((res) => {
    const prevTierIndex = activeNowMap.get(res.synergy.id);

    if (prevTierIndex === undefined) {
      // Candidate ACTIVATES a brand new synergy!
      matches.push({
        synergy: res.synergy,
        status: "activates",
        label: {
          it: `✨ ATTIVA: ${res.synergy.name.it}`,
          en: `✨ ACTIVATES: ${res.synergy.name.en}`,
        },
        tierName: res.tier.levelName,
      });
    } else if (res.tierIndex > prevTierIndex) {
      // Candidate UPGRADES an existing synergy to a HIGHER TIER!
      matches.push({
        synergy: res.synergy,
        status: "upgrades",
        label: {
          it: `⬆️ POTENZIA: ${res.synergy.name.it}`,
          en: `⬆️ UPGRADES: ${res.synergy.name.en}`,
        },
        tierName: res.tier.levelName,
      });
    }
  });

  return matches;
}
