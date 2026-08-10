import React from "react";
import { Ninja } from "@/types/index";
import { RARITY_CONFIGS } from "@/lib/rarity";
import { NinjaAvatar } from "./NinjaAvatar";
import { ChakraNatureBadge } from "./ChakraNatureBadge";

interface Props {
  ninja: Ninja;
  isOpponent?: boolean;
}

export function BattleParticipantCard({ ninja, isOpponent = false }: Props) {
  const config = RARITY_CONFIGS[ninja.rank || "C"];
  const level = (ninja as any).level || 1;

  return (
    <div
      style={config.cardStyle}
      className={`p-3 rounded-xl relative transition-all ${config.cardBorder} ${config.cardBg} ${config.cardGlow}`}
    >
      <div className="flex items-center gap-3">
        <NinjaAvatar
          src={ninja.sprite}
          name={ninja.name}
          rank={ninja.rank}
          className="w-12 h-12 object-contain bg-black/30 rounded-lg p-1 shrink-0 border border-white/10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <h4 className="font-bold text-sm text-white truncate">{ninja.name}</h4>
            <div className="flex items-center gap-1.5 shrink-0">
              <ChakraNatureBadge nature={ninja.chakraNature} />
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeTextColor} shrink-0`}>
                {config.rankSymbol}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#ff9f1c] uppercase tracking-widest font-mono mt-0.5">
            Lv. {level}
          </div>

          {/* STATS GRID */}
          <div className="mt-1.5 grid grid-cols-5 gap-1 text-[9px] font-mono text-gray-200 bg-black/40 p-1.5 rounded border border-white/10 text-center">
            <div>
              <span className="text-gray-400 block text-[8px]">HP</span>
              <span className="font-bold text-green-400">{ninja.baseStats.hp}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[8px]">CHK</span>
              <span className="font-bold text-blue-400">{ninja.baseStats.chakra}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[8px]">ATK</span>
              <span className="font-bold text-red-400">{ninja.baseStats.attack}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[8px]">DEF</span>
              <span className="font-bold text-amber-400">{ninja.baseStats.defense}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[8px]">SPD</span>
              <span className="font-bold text-purple-400">{ninja.baseStats.speed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
