import { Ninja, ChaosDraftPackage, GameItem } from "@/types/index";
import { NINJA_MAP } from "@/data/ninjas";
import { ALL_ITEMS } from "@/data/items";

export interface ChaosDistortion {
  id: string;
  name: { it: string; en: string };
  description: { it: string; en: string };
  icon: string;
  effectType: "swap_ninja" | "stat_buff" | "free_item" | "curse_buff";
  statBoost?: { attack?: number; defense?: number; hpMax?: number; speed?: number };
}

export function generateChaosDraftPackages(): ChaosDraftPackage[] {
  const allNinjas = Array.from(NINJA_MAP.values());

  const sampleUnique = (pool: Ninja[], count: number): Ninja[] => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Package 1: Chaos Syndicate / Akatsuki / Villains
  const villains = allNinjas.filter(
    (n) => n.teamGroup === "Akatsuki" || n.clan === "Uchiha" || n.name.toLowerCase().includes("orochimaru") || n.name.toLowerCase().includes("kabuto")
  );
  const p1Ninjas = villains.length >= 3 ? sampleUnique(villains, 3) : sampleUnique(allNinjas, 3);

  // Package 2: Will of Fire / Legends & Heroes
  const heroes = allNinjas.filter(
    (n) => n.teamGroup === "Team7" || n.teamGroup === "Sannin" || n.clan === "Uzumaki" || n.clan === "Hatake" || n.clan === "Senju"
  );
  const p2Ninjas = heroes.length >= 3 ? sampleUnique(heroes, 3) : sampleUnique(allNinjas, 3);

  // Package 3: Pure Random Chaos / Wild Roster
  const p3Ninjas = sampleUnique(allNinjas, 3);

  return [
    {
      id: "pkg_syndicate",
      packageName: {
        it: "Alleanza delle Ombre",
        en: "Shadow Syndicate",
      },
      theme: {
        it: "Potenza distruttiva, Genjutsu e abilità proibite.",
        en: "Destructive might, Genjutsu, and forbidden arts.",
      },
      ninjas: p1Ninjas,
      bonusItem: ALL_ITEMS.find((i: GameItem) => i.id === "iron_shield_talisman"),
    },
    {
      id: "pkg_heroes",
      packageName: {
        it: "Volontà del Fuoco",
        en: "Will of Fire",
      },
      theme: {
        it: "Grandi riserve di chakra, sinergie di squadra e resilienza.",
        en: "Vast chakra reserves, team synergies, and resilience.",
      },
      ninjas: p2Ninjas,
      bonusItem: ALL_ITEMS.find((i: GameItem) => i.id === "secret_elixir"),
    },
    {
      id: "pkg_chaos",
      packageName: {
        it: "Distorsione Astrale dello Tsukuyomi",
        en: "Astral Tsukuyomi Distortion",
      },
      theme: {
        it: "Combinazione imprevedibile di ninja pescati dal continuum spazio-temporale.",
        en: "Unpredictable combination of shinobi plucked from the space-time rift.",
      },
      ninjas: p3Ninjas,
      bonusItem: ALL_ITEMS.find((i: GameItem) => i.id === "anbu_mask"),
    },
  ];
}

export const CHAOS_DISTORTIONS: ChaosDistortion[] = [
  {
    id: "chakra_surge",
    name: {
      it: "Iper-Flusso di Chakra",
      en: "Chakra Hyper-Surge",
    },
    description: {
      it: "Tutti i membri della squadra ottengono +25% Attacco e +20% Velocità, ma perdono il 10% di HP massimi.",
      en: "All team members gain +25% Attack and +20% Speed, but lose 10% Max HP.",
    },
    icon: "/elements/fulmine.png",
    effectType: "curse_buff",
    statBoost: { attack: 1.25, speed: 1.2, hpMax: 0.9 },
  },
  {
    id: "susanoo_blessing",
    name: {
      it: "Benedizione del Susanoo",
      en: "Blessing of Susanoo",
    },
    description: {
      it: "Armatura eterea: la difesa della squadra aumenta del +30%.",
      en: "Ethereal armor: Team defense permanently increases by +30%.",
    },
    icon: "/items/iron_shield_talisman.png",
    effectType: "stat_buff",
    statBoost: { defense: 1.3 },
  },
  {
    id: "astral_exchange",
    name: {
      it: "Scambio Astrale dello Tsukuyomi",
      en: "Tsukuyomi Astral Swap",
    },
    description: {
      it: "Scegli un membro della squadra da scambiare con un ninja a sorpresa di Grado Leggendario o Epico.",
      en: "Choose a squad member to swap with a surprise Legendary or Epic ninja.",
    },
    icon: "/academy.png",
    effectType: "swap_ninja",
  },
  {
    id: "forbidden_relic",
    name: {
      it: "Reliquia del Saggio delle Sei Vie",
      en: "Sage of Six Paths Relic",
    },
    description: {
      it: "Ottieni istantaneamente 1 Rotolo Proibito e 50 Monete Ryo.",
      en: "Instantly obtain 1 Forbidden Scroll and 50 Ryo Coins.",
    },
    icon: "/items/forbidden_jutsu_scroll.png",
    effectType: "free_item",
  },
];
