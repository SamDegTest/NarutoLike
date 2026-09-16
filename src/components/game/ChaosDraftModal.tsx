import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ChaosDraftPackage } from "@/types/index";

export function ChaosDraftModal() {
  const lang = useLanguageStore((state) => state.language) || "it";
  const {
    activeSagaId,
    availableChaosPackages,
    selectChaosDraftPackage,
    selectSaga,
    isRunActive,
  } = useGameStore();

  if (activeSagaId !== "chaos_draft" || isRunActive || !availableChaosPackages || availableChaosPackages.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-3 animate-fade-in select-none overflow-y-auto">
      <div className="bg-[#090d1f] border-4 border-purple-500/70 rounded-3xl p-4 sm:p-6 max-w-5xl w-full shadow-[0_0_60px_rgba(168,85,247,0.35)] flex flex-col gap-4 text-center relative my-auto">
        
        {/* TOP GLOW & DECORATION */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-24 bg-purple-500/25 blur-3xl pointer-events-none rounded-full" />

        {/* HEADER */}
        <div className="flex items-center justify-between gap-2 border-b border-purple-500/30 pb-3">
          <button
            onClick={() => selectSaga(null)}
            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-700 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            {lang === "it" ? "← Indietro alle Saghe" : "← Back to Sagas"}
          </button>

          <div className="text-center flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-purple-300 uppercase tracking-wider font-mono drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
              {lang === "it" ? "Draft Caotico dello Tsukuyomi" : "Tsukuyomi Chaos Draft"}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {lang === "it"
                ? "Scegli una squadra iniziale di 3 ninja per iniziare la distorsione dello spazio-tempo:"
                : "Choose a starting squad of 3 shinobi to enter the space-time distortion:"}
            </p>
          </div>

          <div className="w-16 hidden sm:block" />
        </div>

        {/* 3 DRAFT PACKAGES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {availableChaosPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => selectChaosDraftPackage(pkg.id)}
              className="bg-gradient-to-b from-[#120d2b] to-[#080516] border-2 border-purple-500/40 hover:border-purple-400 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-98 transition-all shadow-xl group hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
            >
              <div>
                {/* Package Title & Theme */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-black text-purple-200 group-hover:text-purple-300 font-mono uppercase tracking-wider">
                    {pkg.packageName[lang]}
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded-full">
                    3 Ninja
                  </span>
                </div>

                <p className="text-[10px] text-gray-400 mb-3 leading-tight italic">
                  {pkg.theme[lang]}
                </p>

                {/* 3 Ninjas In Package */}
                <div className="space-y-2 mb-3">
                  {pkg.ninjas.map((ninja) => (
                    <div
                      key={ninja.id}
                      className="bg-black/60 border border-purple-500/20 rounded-xl p-2 flex items-center gap-2.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                        <img
                          src={ninja.sprite}
                          alt={ninja.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/icon.png";
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-black font-mono px-1 rounded ${
                              ninja.rank === "S"
                                ? "bg-red-500/30 text-red-300 border border-red-500/40"
                                : ninja.rank === "A"
                                ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                                : ninja.rank === "B"
                                ? "bg-blue-500/30 text-blue-300 border border-blue-500/40"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {ninja.rank}
                          </span>
                          <span className="text-[11px] font-bold text-gray-100 truncate">
                            {ninja.name}
                          </span>
                        </div>

                        <div className="text-[9px] font-mono text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>❤️ {ninja.baseStats.hp}</span>
                          <span>⚔️ {ninja.baseStats.attack}</span>
                          <span>💨 {ninja.baseStats.speed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bonus Starting Item */}
                {pkg.bonusItem && (
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-2 flex items-center gap-2 mb-4">
                    <img
                      src={`/items/${pkg.bonusItem.id}.png`}
                      alt={pkg.bonusItem.name[lang]}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/ramen.png";
                      }}
                      className="w-6 h-6 object-contain shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9.5px] font-bold text-yellow-300 truncate">
                        🎁 {pkg.bonusItem.name[lang]}
                      </div>
                      <div className="text-[8.5px] text-gray-400 truncate">
                        {pkg.bonusItem.description[lang]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] cursor-pointer"
              >
                {lang === "it" ? "Inizia con questo Team" : "Start with this Squad"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
