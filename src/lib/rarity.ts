import { Ninja, NinjaRank } from "@/types/index";

export interface RarityConfig {
  rank: NinjaRank;
  label: string;
  dropRate: number; // percentage (e.g. 5 = 5%)
  cardBorder: string;
  cardBg: string;
  cardGlow: string;
  badgeBg: string;
  badgeTextColor: string;
  textColor: string;
  avatarRing: string;
  rankSymbol: string;
  cardStyle: React.CSSProperties;
}

export const RARITY_CONFIGS: Record<NinjaRank, RarityConfig> = {
  S: {
    rank: "S",
    label: "Rank S",
    rankSymbol: "★ S ★",
    dropRate: 3,
    cardBorder: "border-4 border-amber-400",
    cardBg: "bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950",
    cardGlow: "shadow-[0_0_25px_rgba(251,191,36,0.75)]",
    badgeBg: "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 ring-2 ring-yellow-300 animate-pulse",
    badgeTextColor: "text-black font-black tracking-widest",
    textColor: "text-amber-200 font-black drop-shadow",
    avatarRing: "ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-950 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    cardStyle: {
      background: "linear-gradient(180deg, #b45309 0%, #78350f 50%, #451a03 100%)",
      borderColor: "#fbbf24",
    },
  },
  A: {
    rank: "A",
    label: "Rank A",
    rankSymbol: "♦ A ♦",
    dropRate: 12,
    cardBorder: "border-4 border-purple-500",
    cardBg: "bg-gradient-to-b from-purple-700 via-purple-900 to-purple-950",
    cardGlow: "shadow-[0_0_20px_rgba(168,85,247,0.65)]",
    badgeBg: "bg-gradient-to-r from-purple-400 to-indigo-500 ring-1 ring-purple-300",
    badgeTextColor: "text-white font-bold tracking-wider",
    textColor: "text-purple-200 font-bold drop-shadow",
    avatarRing: "ring-2 ring-purple-500 ring-offset-2 ring-offset-purple-950 shadow-[0_0_8px_rgba(168,85,247,0.6)]",
    cardStyle: {
      background: "linear-gradient(180deg, #7e22ce 0%, #581c87 50%, #3b0764 100%)",
      borderColor: "#a855f7",
    },
  },
  B: {
    rank: "B",
    label: "Rank B",
    rankSymbol: "◆ B ◆",
    dropRate: 35,
    cardBorder: "border-4 border-cyan-400",
    cardBg: "bg-gradient-to-b from-cyan-600 via-sky-800 to-sky-950",
    cardGlow: "shadow-[0_0_18px_rgba(34,211,238,0.55)]",
    badgeBg: "bg-gradient-to-r from-cyan-400 to-blue-500",
    badgeTextColor: "text-black font-extrabold",
    textColor: "text-cyan-200 font-bold drop-shadow",
    avatarRing: "ring-2 ring-cyan-400 ring-offset-1 ring-offset-cyan-950",
    cardStyle: {
      background: "linear-gradient(180deg, #0284c7 0%, #0369a1 50%, #0c4a6e 100%)",
      borderColor: "#22d3ee",
    },
  },
  C: {
    rank: "C",
    label: "Rank C",
    rankSymbol: "• C •",
    dropRate: 50,
    cardBorder: "border-4 border-emerald-500",
    cardBg: "bg-gradient-to-b from-emerald-700 via-emerald-900 to-emerald-950",
    cardGlow: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    badgeTextColor: "text-white font-bold",
    textColor: "text-emerald-200 font-semibold drop-shadow",
    avatarRing: "ring-1 ring-emerald-500 ring-offset-1 ring-offset-emerald-950",
    cardStyle: {
      background: "linear-gradient(180deg, #047857 0%, #065f46 50%, #022c22 100%)",
      borderColor: "#10b981",
    },
  },
};

/**
 * Roll a random NinjaRank according to configured drop rates.
 * S: 3%, A: 12%, B: 35%, C: 50%
 */
export function rollRandomRank(): NinjaRank {
  const rand = Math.random() * 100; // 0 to 100
  if (rand < 3) return "S";   // 3%
  if (rand < 15) return "A";  // 12% (3 -> 15)
  if (rand < 50) return "B";  // 35% (15 -> 50)
  return "C";                 // 50% (50 -> 100)
}

/**
 * Get intelligent fallback search order based on the rolled rank.
 * Always searches closest adjacent ranks first instead of defaulting to S rank.
 */
function getFallbackRankOrder(rolledRank: NinjaRank): NinjaRank[] {
  switch (rolledRank) {
    case "S": return ["S", "A", "B", "C"];
    case "A": return ["A", "B", "C", "S"];
    case "B": return ["B", "C", "A", "S"];
    case "C": return ["C", "B", "A", "S"];
  }
}

/**
 * Given a candidate pool of Ninjas, sample `count` distinct ninjas using rarity weighted sampling.
 * Strictly respects the configured drop rates (S: 5%, A: 20%, B: 35%, C: 40%).
 */
export function sampleNinjasByRarity(pool: Ninja[], count: number = 3): Ninja[] {
  if (pool.length <= count) return [...pool];

  const selected: Ninja[] = [];
  const remainingPool = [...pool];

  while (selected.length < count && remainingPool.length > 0) {
    const rolledRank = rollRandomRank();
    const fallbackOrder = getFallbackRankOrder(rolledRank);

    let matchingInPool: Ninja[] = [];

    // Find available ninjas starting from rolled rank, falling back to closest adjacent rank
    for (const rank of fallbackOrder) {
      matchingInPool = remainingPool.filter((n) => n.rank === rank);
      if (matchingInPool.length > 0) break;
    }

    if (matchingInPool.length === 0) {
      matchingInPool = remainingPool;
    }

    // Pick one at random from matching rank
    const chosenIndexInMatching = Math.floor(Math.random() * matchingInPool.length);
    const chosenNinja = matchingInPool[chosenIndexInMatching];

    selected.push(chosenNinja);

    // Remove chosen ninja from remaining pool to ensure distinct picks
    const idxInRemaining = remainingPool.findIndex((n) => n.id === chosenNinja.id);
    if (idxInRemaining !== -1) {
      remainingPool.splice(idxInRemaining, 1);
    }
  }

  return selected;
}
