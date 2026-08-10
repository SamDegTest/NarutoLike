import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";
import { CHAKRA_NATURE_CONFIGS, ELEMENTAL_ADVANTAGES } from "@/lib/chakraNatures";
import { ChakraNatureBadge } from "@/components/game/ChakraNatureBadge";
import { ChakraNature } from "@/types/index";

interface ChakraChartModalProps {
  onClose: () => void;
}

export const ChakraChartModal: React.FC<ChakraChartModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  const allNatures: ChakraNature[] = [
    "Fire",
    "Wind",
    "Lightning",
    "Earth",
    "Water",
    "Ice",
    "Taijutsu",
    "YinYang",
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-3xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[92dvh] overflow-y-auto text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        <header className="text-center border-b-2 border-gray-800 pb-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#ff9f1c] uppercase tracking-wider">
            ☯️ {lang === "it" ? "GRAFICO EFFICACIA CHAKRA" : "CHAKRA EFFECTIVENESS CHART"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "it"
              ? "Ogni Natura di Chakra ha una particolare efficacia elementale contro altre. Gli attacchi Super Efficaci infliggono il 150% dei Danni (1.5x)!"
              : "Each Chakra Nature has elemental advantage against specific types. Super Effective attacks deal 150% Damage (1.5x)!"}
          </p>
        </header>

        {/* VISUAL CYCLE GRAPHIC IMAGE */}
        <div className="bg-[#070b19]/90 border border-[#ff9f1c]/40 rounded-2xl p-3 sm:p-4 mb-6 shadow-inner text-center overflow-hidden">
          <h3 className="text-xs sm:text-sm text-[#ff9f1c] uppercase font-mono font-bold tracking-wider mb-3">
            ⚡ {lang === "it" ? "Grafico Ciclo Elementale (Vantaggio 1.5x Danno)" : "Elemental Affinity Cycle Graphic (1.5x Damage Advantage)"}
          </h3>

          <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-2xl flex items-center justify-center p-2">
            <img
              src="/chakra_chart.png"
              alt="Grafico Ciclo Elementale Chakra"
              className="w-full max-h-[320px] object-contain rounded-lg filter drop-shadow-md hover:scale-[1.01] transition-transform"
            />
          </div>
        </div>

        {/* DETAILED TYPE GRID MATRIX */}
        <div className="space-y-3">
          <h3 className="text-xs text-[#ff9f1c] uppercase font-mono font-bold tracking-wider mb-2">
            📋 {lang === "it" ? "Dettaglio Tipi & Effetti Speciali" : "Type Details & Special Effects"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allNatures.map((nat) => {
              const cfg = CHAKRA_NATURE_CONFIGS[nat];
              const targets = ELEMENTAL_ADVANTAGES[nat] || [];

              return (
                <div
                  key={nat}
                  className="bg-[#070b19] border border-gray-800 hover:border-[#ff9f1c]/40 rounded-xl p-3 flex flex-col justify-between shadow-md transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-850 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <ChakraNatureBadge nature={nat} />
                      <span className="text-xs font-mono text-gray-400">({cfg.japaneseName})</span>
                    </div>

                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      ⚡ 1.5x Danno
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {/* Super Effective Against Targets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-400 text-[11px] font-semibold">
                        {lang === "it" ? "Super Efficace su:" : "Super Effective vs:"}
                      </span>
                      {targets.map((tgt) => (
                        <ChakraNatureBadge key={tgt} nature={tgt} />
                      ))}
                    </div>

                    {/* Effect description */}
                    <div className="text-[11px] text-gray-300 bg-gray-950/60 p-2 rounded border border-white/5 mt-1">
                      <span className="font-bold text-[#ff9f1c]">{cfg.effectName[lang]}:</span>{" "}
                      <span className="text-gray-400">{cfg.effectDescription[lang]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 border-t border-gray-800 pt-3 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 shadow-md cursor-pointer"
          >
            {lang === "it" ? "Ho Capito" : "Got It"}
          </button>
        </div>

      </div>
    </div>
  );
};
