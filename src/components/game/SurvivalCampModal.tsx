import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { SurvivalSupplyChoice } from "@/types/index";

export function SurvivalCampModal() {
  const lang = useLanguageStore((state) => state.language) || "it";
  const {
    isSurvivalCampActive,
    availableSurvivalSupplies,
    chooseSurvivalSupply,
    currentLevel,
    runTeam,
  } = useGameStore();

  if (!isSurvivalCampActive || !availableSurvivalSupplies || availableSurvivalSupplies.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-fade-in select-none">
      <div className="bg-[#090d1f] border-4 border-amber-500/70 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col gap-4 text-center relative overflow-hidden">
        
        {/* TOP GLOW & DECORATION */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-20 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* HEADER */}
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-950/70 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1.5 shadow-md">
            <span>⚔️</span>
            <span>{lang === "it" ? `Ondata ${currentLevel} Superata!` : `Wave ${currentLevel} Cleared!`}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#ff9f1c] uppercase tracking-wider font-mono drop-shadow-[0_0_12px_rgba(255,159,28,0.7)]">
            {lang === "it" ? "Accampamento di Rifornimento" : "Alliance Supply Camp"}
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            {lang === "it"
              ? "Scegli un rifornimento strategico per curare, potenziare o equipaggiare la squadra prima della prossima ondata:"
              : "Choose a tactical supply to heal, empower, or equip your squad before the next wave begins:"}
          </p>
        </div>

        {/* TEAM HP/CHAKRA STATUS STRIP */}
        <div className="bg-black/60 border border-gray-800 rounded-2xl p-2.5 flex items-center justify-around gap-2 flex-wrap">
          {runTeam.map((ninja) => {
            const isFallen = ninja.currentHp <= 0;
            const hpPct = Math.max(0, Math.min(100, Math.round((ninja.currentHp / ninja.baseStats.hp) * 100)));
            const chakraPct = Math.max(0, Math.min(100, Math.round((ninja.currentChakra / ninja.baseStats.chakra) * 100)));

            return (
              <div
                key={ninja.id}
                className={`flex items-center gap-2 bg-[#0d132b] border rounded-xl p-1.5 min-w-[120px] sm:min-w-[140px] ${
                  isFallen ? "border-red-500/50 opacity-60" : "border-amber-500/30"
                }`}
              >
                <img
                  src={ninja.sprite}
                  alt={ninja.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/icon.png";
                  }}
                  className="w-8 h-8 object-contain rounded-lg bg-gray-900 border border-gray-700 shrink-0"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-[10px] font-bold text-amber-200 truncate leading-none mb-1">
                    {ninja.name.split(" ")[0]}
                  </div>
                  {/* Mini HP bar */}
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden mb-0.5">
                    <div
                      className={`h-full ${isFallen ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${hpPct}%` }}
                    />
                  </div>
                  <div className="text-[8px] font-mono text-gray-400 leading-none">
                    {isFallen ? "K.O." : `${ninja.currentHp}/${ninja.baseStats.hp}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 SUPPLY CHOICES CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableSurvivalSupplies.map((choice) => (
            <div
              key={choice.id}
              onClick={() => chooseSurvivalSupply(choice.id)}
              className="bg-gradient-to-b from-[#0f1738] to-[#070b1b] border-2 border-amber-500/40 hover:border-yellow-400 rounded-2xl p-3.5 flex flex-col justify-between items-center text-center cursor-pointer hover:scale-[1.03] active:scale-98 transition-all shadow-xl group hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-black/60 border border-amber-500/40 p-2 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
                <img
                  src={choice.icon}
                  alt={choice.title[lang]}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/ramen.png";
                  }}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                />
              </div>

              <div className="min-w-0 mb-3">
                <h4 className="font-black text-xs sm:text-sm text-amber-300 group-hover:text-yellow-300 transition-colors uppercase font-mono mb-1 leading-snug">
                  {choice.title[lang]}
                </h4>
                <p className="text-[10px] text-gray-300 leading-tight">
                  {choice.description[lang]}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg group-hover:shadow-[0_0_12px_rgba(255,159,28,0.6)] cursor-pointer"
              >
                {lang === "it" ? "Scegli Rifornimento" : "Select Supply"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
