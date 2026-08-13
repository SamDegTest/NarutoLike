import React, { useState } from "react";

interface Props {
  src: string;
  name: string;
  className?: string;
}

export function JutsuIcon({ src, name, className = "" }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const initial = name.charAt(0);
    return (
      <div 
        className={`${className} bg-blue-600/20 border border-blue-500/50 flex items-center justify-center font-bold text-blue-400 text-sm select-none shrink-0`}
        style={{ minWidth: "2rem", minHeight: "2rem" }}
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
      className={className}
    />
  );
}
