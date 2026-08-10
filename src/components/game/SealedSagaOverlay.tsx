import React, { useState } from "react";

interface SealedSagaOverlayProps {
  requirementText: string;
  sagaName: string;
  onClickLocked?: () => void;
}

export const SealedSagaOverlay: React.FC<SealedSagaOverlayProps> = ({
  requirementText,
  sagaName,
  onClickLocked,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    if (onClickLocked) onClickLocked();
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute inset-0 z-20 rounded-2xl flex flex-col items-center justify-between p-3 sm:p-4 cursor-not-allowed select-none overflow-hidden transition-transform ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px) rotate(-1deg); }
          40%, 80% { transform: translateX(6px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes chainGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 159, 28, 0.9)) drop-shadow(0 4px 12px rgba(0,0,0,0.9)); }
          50% { filter: drop-shadow(0 0 22px rgba(239, 68, 68, 1)) drop-shadow(0 6px 16px rgba(0,0,0,0.95)); }
        }
        .animate-chain-glow {
          animation: chainGlow 2.5s ease-in-out infinite;
        }
        .chain-link-3d {
          background: linear-gradient(135deg, #fef08a 0%, #eab308 40%, #b45309 70%, #451a03 100%);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.8);
        }
      `}</style>

      {/* USER'S CUSTOM UZUMAKI ADAMANTINE CHAINS IMAGE LAYER (100% ADAPTED TO CARD BOUNDARIES) */}
      {!imgError ? (
        <img
          src="/chains.png"
          alt="Catene Adamantine Sigillo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith("/chains.png")) {
              target.src = "/chain.png";
            } else if (target.src.endsWith("/chain.png")) {
              target.src = "/sealing_chains.png";
            } else {
              setImgError(true);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-none filter drop-shadow-[0_0_20px_rgba(255,159,28,0.8)] scale-105"
        />
      ) : (
        /* FALLBACK PROCEDURAL 3D DIAGONAL CHAINS */
        <div className="absolute inset-0 pointer-events-none overflow-hidden animate-chain-glow">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-10 rotate-[32deg] flex items-center justify-center gap-1.5 opacity-95">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="chain-link-3d w-8 h-10 rounded-full border-2 border-yellow-300 relative flex items-center justify-center shrink-0"
              >
                <div className="w-4 h-6 bg-black/80 rounded-full border border-amber-900/60 shadow-inner" />
              </div>
            ))}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-10 -rotate-[32deg] flex items-center justify-center gap-1.5 opacity-95">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="chain-link-3d w-8 h-10 rounded-full border-2 border-yellow-300 relative flex items-center justify-center shrink-0"
              >
                <div className="w-4 h-6 bg-black/80 rounded-full border border-amber-900/60 shadow-inner" />
              </div>
            ))}
          </div>
        </div>
      )}



      {/* BOTTOM REQUIREMENT BANNER */}
      <div className="relative z-30 w-full bg-[#070b19]/95 border-2 border-amber-500/60 rounded-xl p-2.5 sm:p-3 text-center shadow-2xl backdrop-blur-md pointer-events-none mt-auto">
        <div className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider mb-0.5">
          📜 {sagaName} - REQUISITO SBLOCCO
        </div>
        <div className="text-xs sm:text-sm font-extrabold text-gray-200">
          {requirementText}
        </div>
      </div>
    </div>
  );
};
