import { ChakraNature } from "@/types/index";

export interface ChakraNatureConfig {
  nature: ChakraNature;
  name: { it: string; en: string };
  japaneseName: string;
  icon: string;
  image: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  effectName: { it: string; en: string };
  effectDescription: { it: string; en: string };
}

export const CHAKRA_NATURE_CONFIGS: Record<ChakraNature, ChakraNatureConfig> = {
  Fire: {
    nature: "Fire",
    name: { it: "Fuoco", en: "Fire" },
    japaneseName: "Katon",
    icon: "🔥",
    image: "/elements/fuoco.png",
    badgeBg: "bg-gradient-to-r from-orange-600 to-red-700",
    badgeBorder: "border-orange-400",
    badgeTextColor: "text-orange-100",
    effectName: { it: "Bruciatura", en: "Burn" },
    effectDescription: {
      it: "Infligge l'8% HP max a fine turno per 2 turni.",
      en: "Inflicts 8% max HP damage at round end for 2 turns."
    }
  },
  Water: {
    nature: "Water",
    name: { it: "Acqua", en: "Water" },
    japaneseName: "Suiton",
    icon: "💧",
    image: "/elements/acqua.png",
    badgeBg: "bg-gradient-to-r from-blue-600 to-cyan-700",
    badgeBorder: "border-cyan-400",
    badgeTextColor: "text-cyan-100",
    effectName: { it: "Prosciugamento", en: "Chakra Drain" },
    effectDescription: {
      it: "Sottrae 15 Chakra al nemico e li converte all'attaccante.",
      en: "Steals 15 Chakra from enemy and converts to attacker."
    }
  },
  Wind: {
    nature: "Wind",
    name: { it: "Vento", en: "Wind" },
    japaneseName: "Fuuton",
    icon: "🌪️",
    image: "/elements/vento.png",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-700",
    badgeBorder: "border-emerald-400",
    badgeTextColor: "text-emerald-100",
    effectName: { it: "Taglio Perforante", en: "Armor Pierce" },
    effectDescription: {
      it: "Ignora il 30% della difesa bersaglio durante l'attacco.",
      en: "Ignores 30% of target defense during attack."
    }
  },
  Lightning: {
    nature: "Lightning",
    name: { it: "Fulmine", en: "Lightning" },
    japaneseName: "Raiton",
    icon: "⚡",
    image: "/elements/fulmine.png",
    badgeBg: "bg-gradient-to-r from-yellow-500 to-amber-600",
    badgeBorder: "border-yellow-300",
    badgeTextColor: "text-yellow-100",
    effectName: { it: "Paralisi", en: "Paralysis" },
    effectDescription: {
      it: "25% probabilità di paralizzare il bersaglio e far saltare il turno.",
      en: "25% chance to paralyze target and skip turn."
    }
  },
  Earth: {
    nature: "Earth",
    name: { it: "Terra", en: "Earth" },
    japaneseName: "Doton",
    icon: "🪨",
    image: "/elements/terra.png",
    badgeBg: "bg-gradient-to-r from-stone-600 to-amber-900",
    badgeBorder: "border-amber-600",
    badgeTextColor: "text-amber-100",
    effectName: { it: "Scudo di Roccia", en: "Stone Shield" },
    effectDescription: {
      it: "Riduce tutti i danni subiti del 20%.",
      en: "Reduces all incoming damage by 20%."
    }
  },
  Ice: {
    nature: "Ice",
    name: { it: "Ghiaccio", en: "Ice" },
    japaneseName: "Hyoton",
    icon: "❄️",
    image: "/elements/ghiaccio.png",
    badgeBg: "bg-gradient-to-r from-sky-400 to-indigo-600",
    badgeBorder: "border-sky-300",
    badgeTextColor: "text-sky-100",
    effectName: { it: "Congelamento", en: "Freeze" },
    effectDescription: {
      it: "30% probabilità di congelare l'avversario per 1 turno.",
      en: "30% chance to freeze enemy for 1 turn."
    }
  },
  Taijutsu: {
    nature: "Taijutsu",
    name: { it: "Fisico", en: "Taijutsu" },
    japaneseName: "Taijutsu",
    icon: "👊",
    image: "/elements/taijutsu.png",
    badgeBg: "bg-gradient-to-r from-red-600 to-rose-800",
    badgeBorder: "border-rose-400",
    badgeTextColor: "text-rose-100",
    effectName: { it: "Colpo Critico", en: "Critical Hit" },
    effectDescription: {
      it: "25% probabilità di infliggere +50% danni critici.",
      en: "25% chance to deal +50% critical damage."
    }
  },
  YinYang: {
    nature: "YinYang",
    name: { it: "Yin-Yang", en: "Yin-Yang" },
    japaneseName: "Yin-Yang",
    icon: "☯️",
    image: "/elements/yin_yang.png",
    badgeBg: "bg-gradient-to-r from-purple-600 to-slate-800",
    badgeBorder: "border-purple-400",
    badgeTextColor: "text-purple-100",
    effectName: { it: "Rigenerazione", en: "Regeneration" },
    effectDescription: {
      it: "Rigenera il 5% HP ad ogni turno di combattimento.",
      en: "Regenerates 5% HP every battle round."
    }
  }
};

export const ELEMENTAL_ADVANTAGES: Record<ChakraNature, ChakraNature[]> = {
  Fire: ["Wind"],
  Wind: ["Lightning"],
  Lightning: ["Earth"],
  Earth: ["Water"],
  Water: ["Fire"],
  Ice: ["Earth", "Water"],
  Taijutsu: ["YinYang"],
  YinYang: ["Ice", "Taijutsu"],
};

export function isSuperEffective(attackerNature?: ChakraNature, defenderNature?: ChakraNature): boolean {
  if (!attackerNature || !defenderNature) return false;
  const advantages = ELEMENTAL_ADVANTAGES[attackerNature];
  return advantages ? advantages.includes(defenderNature) : false;
}
