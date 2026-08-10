import React, { useState } from "react";
import { ChakraNature } from "@/types/index";
import { CHAKRA_NATURE_CONFIGS } from "@/lib/chakraNatures";

interface ChakraNatureBadgeProps {
  nature: ChakraNature;
  showText?: boolean;
  className?: string;
  imgClassName?: string;
}

export const ChakraNatureBadge: React.FC<ChakraNatureBadgeProps> = ({
  nature,
  showText = true,
  className = "",
  imgClassName = "w-3.5 h-3.5 object-contain shrink-0",
}) => {
  const config = CHAKRA_NATURE_CONFIGS[nature] || CHAKRA_NATURE_CONFIGS.Taijutsu;
  const [imgError, setImgError] = useState(false);

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border shadow-sm ${config.badgeBg} ${config.badgeBorder} ${config.badgeTextColor} ${className}`}
      title={`${config.japaneseName} - ${config.effectName.it}: ${config.effectDescription.it}`}
    >
      {!imgError && config.image ? (
        <img
          src={config.image}
          alt={config.japaneseName}
          onError={() => setImgError(true)}
          className={imgClassName}
        />
      ) : (
        <span>{config.icon}</span>
      )}
      {showText && <span>{config.japaneseName}</span>}
    </span>
  );
};
