import React, { useState } from "react";
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

  const [activeTab, setActiveTab] = useState<"chakra" | "dropRates">("chakra");

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

  const rankDropRates = [
    {
      rank: "S",
      name: { it: "Rank S - Leggendario (Kage)", en: "Rank S - Legendary (Kage)" },
      chance: "3%",
      badgeClass: "bg-gradient-to-r from-amber-500 to-yellow-600 text-yellow-950 font-black border-yellow-300",
      cardClass: "border-yellow-400/70 bg-gradient-to-br from-yellow-950/40 via-amber-950/20 to-[#070b19]",
      textClass: "text-amber-300",
      desc: {
        it: "Ninja eccezionali e Kage con le statistiche più alte del gioco e mossa attiva devastante (es. Madara, Itachi, Jiraiya, Minato).",
        en: "Legendary ninjas & Kage with the highest base stats in the game and devastating jutsu (e.g., Madara, Itachi, Jiraiya, Minato)."
      }
    },
    {
      rank: "A",
      name: { it: "Rank A - Epico (Jonin)", en: "Rank A - Epic (Jonin)" },
      chance: "12%",
      badgeClass: "bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold border-purple-300",
      cardClass: "border-purple-500/70 bg-gradient-to-br from-purple-950/40 via-indigo-950/20 to-[#070b19]",
      textClass: "text-purple-300",
      desc: {
        it: "Jonin d'élite ed eroi del villaggio con elevate statistiche e abilità speciali avanzate (es. Kakashi, Guy, Gaara, Tsunade).",
        en: "Elite Jonin & village heroes with high base stats and advanced special abilities (e.g., Kakashi, Guy, Gaara, Tsunade)."
      }
    },
    {
      rank: "B",
      name: { it: "Rank B - Raro (Chunin)", en: "Rank B - Rare (Chunin)" },
      chance: "35%",
      badgeClass: "bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-bold border-cyan-300",
      cardClass: "border-cyan-500/70 bg-gradient-to-br from-cyan-950/40 via-blue-950/20 to-[#070b19]",
      textClass: "text-cyan-300",
      desc: {
        it: "Chunin ed abili guerrieri equilibrati, fondamentali per costruire sinergie di squadra (es. Neji, Lee, Shikamaru).",
        en: "Balanced Chunin & skilled warriors, essential for building team synergies (e.g., Neji, Lee, Shikamaru)."
      }
    },
    {
      rank: "C",
      name: { it: "Rank C - Comune (Genin)", en: "Rank C - Common (Genin)" },
      chance: "50%",
      badgeClass: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold border-emerald-300",
      cardClass: "border-emerald-500/70 bg-gradient-to-br from-emerald-950/40 via-green-950/20 to-[#070b19]",
      textClass: "text-emerald-300",
      desc: {
        it: "Reclute iniziali e Genin promettenti che formano l'ossatura del tuo esercito iniziale (es. Naruto Kid, Sakura, Kiba).",
        en: "Promising Genin & starter recruits forming the core of your initial squad (e.g., Naruto Kid, Sakura, Kiba)."
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
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
            📜 {lang === "it" ? "WIKI SHINOBI & GUIDA" : "SHINOBI WIKI & GUIDE"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "it"
              ? "Consulta l'efficacia dei Tipi di Chakra e le probabilità di evocazione dei Ninja in base al Rank."
              : "Consult Chakra Nature effectiveness and Ninja recruitment drop rate probabilities by Rank."}
          </p>

          {/* TAB NAVIGATION */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab("chakra")}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === "chakra"
                  ? "bg-[#ff9f1c] text-[#070b19] border-yellow-300 shadow-lg scale-105"
                  : "bg-[#070b19] text-gray-400 border-gray-800 hover:text-white"
              }`}
            >
              ☯️ {lang === "it" ? "Efficacia Chakra" : "Chakra Types"}
            </button>
            <button
              onClick={() => setActiveTab("dropRates")}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === "dropRates"
                  ? "bg-[#ff9f1c] text-[#070b19] border-yellow-300 shadow-lg scale-105"
                  : "bg-[#070b19] text-gray-400 border-gray-800 hover:text-white"
              }`}
            >
              🎲 {lang === "it" ? "Probabilità & Rank" : "Drop Rates & Ranks"}
            </button>
          </div>
        </header>

        {/* TAB 1: CHAKRA EFFECTIVENESS */}
        {activeTab === "chakra" && (
          <div className="space-y-6 animate-fade-in">
            {/* VISUAL CYCLE GRAPHIC IMAGE */}
            <div className="bg-[#070b19]/90 border border-[#ff9f1c]/40 rounded-2xl p-3 sm:p-4 shadow-inner text-center overflow-hidden">
              <h3 className="text-xs sm:text-sm text-[#ff9f1c] uppercase font-mono font-bold tracking-wider mb-3">
                ⚡ {lang === "it" ? "Grafico Ciclo Elementale (Vantaggio 1.5x Danno)" : "Elemental Affinity Cycle Graphic (1.5x Damage Advantage)"}
              </h3>

              <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-2xl flex items-center justify-center p-2">
                <img
                  src="/chakra_chart.png"
                  alt="Grafico Ciclo Elementale Chakra"
                  className="w-full max-h-[300px] object-contain rounded-lg filter drop-shadow-md hover:scale-[1.01] transition-transform"
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
                      className="bg-[#070b19]/90 border border-gray-800 hover:border-amber-500/50 rounded-2xl p-3.5 flex flex-col justify-between shadow-md transition-all space-y-2.5"
                    >
                      {/* HEADER: ELEMENT BADGE & 1.5x DAMAGE CHIP */}
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <div className="flex items-center gap-2">
                          <ChakraNatureBadge
                            nature={nat}
                            imgClassName="w-6 h-6 object-contain shrink-0"
                          />
                          <span className="text-[11px] font-mono text-gray-400">({cfg.name[lang]})</span>
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30 shrink-0">
                          1.5x Danno
                        </span>
                      </div>

                      {/* MIDDLE: SUPER EFFECTIVE VS TARGETS */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-gray-400 text-[11px] font-bold font-mono">
                          {lang === "it" ? "Super Efficace su:" : "Super Effective vs:"}
                        </span>
                        {targets.length > 0 ? (
                          targets.map((tgt) => (
                            <ChakraNatureBadge
                              key={tgt}
                              nature={tgt}
                              imgClassName="w-5 h-5 object-contain shrink-0"
                            />
                          ))
                        ) : (
                          <span className="text-gray-500 text-[11px] italic font-mono">-</span>
                        )}
                      </div>

                      {/* BOTTOM: SPECIAL EFFECT DESCRIPTION */}
                      <div className="text-[11px] text-gray-300 bg-black/50 p-2.5 rounded-xl border border-white/5 font-mono leading-relaxed">
                        <span className="font-extrabold text-amber-400">{cfg.effectName[lang]}:</span>{" "}
                        <span className="text-gray-300">{cfg.effectDescription[lang]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RARITY DROP RATES */}
        {activeTab === "dropRates" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#070b19]/90 border border-yellow-500/40 rounded-2xl p-4 text-center">
              <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider mb-1 font-mono">
                🎲 {lang === "it" ? "PROBABILITÀ DI ESTRAZIONE RECLUTE" : "RECRUITMENT DROP RATE PROBABILITIES"}
              </h3>
              <p className="text-xs text-gray-400">
                {lang === "it"
                  ? "Ogni volta che incontri un nodo Reclutamento o selezioni i ninja iniziali, le probabilità di apparizione sono distribuite per Rank:"
                  : "Every time you encounter a Recruitment node or select starter ninjas, drop chances are distributed by Rank:"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rankDropRates.map((item) => (
                <div
                  key={item.rank}
                  className={`p-4 rounded-2xl border-2 shadow-xl flex flex-col justify-between ${item.cardClass}`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs border shadow ${item.badgeClass}`}>
                        Rank {item.rank}
                      </span>
                      <span className={`font-bold text-xs ${item.textClass}`}>{item.name[lang]}</span>
                    </div>

                    <span className="text-sm font-extrabold font-mono bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 text-white shadow-inner">
                      {item.chance}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                    {item.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 border-t border-gray-800 pt-3 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 shadow-md cursor-pointer"
          >
            {lang === "it" ? "Chiudi Wiki" : "Close Wiki"}
          </button>
        </div>

      </div>
    </div>
  );
};
