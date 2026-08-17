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
  imgClassName = "w-5 h-5 object-contain shrink-0",
}) => {
  const config = CHAKRA_NATURE_CONFIGS[nature] || CHAKRA_NATURE_CONFIGS.Taijutsu;
  const [imgError, setImgError] = useState(false);

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`${config.japaneseName} - ${config.effectName.it}: ${config.effectDescription.it}`}
    >
      {!imgError && config.image ? (
        <img
          src={config.image}
          loading="lazy"
          decoding="async"
          alt={config.japaneseName}
          onError={() => setImgError(true)}
          className={imgClassName}
        />
      ) : (
        <span className="text-sm">{config.icon}</span>
      )}
      {showText && (
        <span className="font-mono text-white text-xs font-extrabold tracking-wide">
          {config.japaneseName}
        </span>
      )}
    </span>
  );
};
