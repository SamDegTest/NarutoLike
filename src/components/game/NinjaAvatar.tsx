import React, { useState } from "react";
import { NinjaRank } from "@/types/index";
import { RARITY_CONFIGS } from "@/lib/rarity";

interface Props {
  src: string;
  name: string;
  rank?: NinjaRank;
  className?: string;
}

export function NinjaAvatar({ src, name, rank, className = "" }: Props) {
  const [hasError, setHasError] = useState(false);
  const rankRingClass = rank ? RARITY_CONFIGS[rank].avatarRing : "";

  if (hasError || !src) {
    const initial = name.charAt(0);
    return (
      <div 
        className={`${className} ${rankRingClass} bg-orange-600/20 border border-orange-500/50 flex items-center justify-center font-bold text-orange-400 text-xl select-none`}
        style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      alt={name}
      className={`${className} ${rankRingClass}`}
    />
  );
}
