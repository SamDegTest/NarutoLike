import React, { useState } from "react";

interface Props {
  src: string;
  name: string;
  className?: string;
}

export function NinjaAvatar({ src, name, className = "" }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const initial = name.charAt(0);
    return (
      <div 
        className={`${className} bg-orange-600/20 border border-orange-500/50 flex items-center justify-center font-bold text-orange-400 text-xl select-none`}
        style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      onError={() => setHasError(true)}
      alt={name}
      className={className}
    />
  );
}
