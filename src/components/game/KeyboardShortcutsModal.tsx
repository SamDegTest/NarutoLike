import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  const { language: lang } = useLanguageStore();

  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ["Spazio", "Invio"],
      separator: " / ",
      title: lang === "it" ? "Avanzamento Rapido & Azioni" : "Fast Advance & Actions",
      description:
        lang === "it"
          ? "Naviga la mappa alla tappa successiva, conferma il Ristoro Ichiraku, applica i Rotoli Proibiti, recluta ninja o salta le animazioni di battaglia."
          : "Advance to next map stage, confirm Ichiraku healing, apply scrolls, recruit ninjas or skip battle animations.",
    },
    {
      keys: ["C"],
      title: lang === "it" ? "Grafico Nature del Chakra" : "Chakra Natures Chart",
      description:
        lang === "it"
          ? "Apri o chiudi la tabella delle affinità e debolezze elementali del Chakra."
          : "Open or close the elemental Chakra affinities and weaknesses chart.",
    },
    {
      keys: ["M"],
      title: lang === "it" ? "Menu di Gioco" : "Game Menu",
      description:
        lang === "it"
          ? "Apri o chiudi il menu principale con impostazioni, salvataggio e opzioni della corsa."
          : "Open or close the main menu with settings, save options, and run controls.",
    },
    {
      keys: ["Esc"],
      title: lang === "it" ? "Chiudi Finestre" : "Close Windows",
      description:
        lang === "it"
          ? "Chiudi le finestre modali o i pannelli informativi attivi."
          : "Close active modal windows or information panels.",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500/80 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative flex flex-col my-auto font-sans"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400">
              {lang === "it" ? "Scorciatoie da Tastiera" : "Keyboard Shortcuts"}
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              {lang === "it" ? "Controlli rapidi per velocizzare il gioco" : "Quick controls to speed up gameplay"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white font-bold flex items-center justify-center transition-all cursor-pointer border border-gray-700 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* SHORTCUTS LIST */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="bg-black/50 p-3 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:border-amber-500/40"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                  {sc.title}
                </h4>
                <p className="text-[10px] text-gray-300 font-mono leading-tight">
                  {sc.description}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-start sm:self-center">
                {sc.keys.map((k, kIdx) => (
                  <React.Fragment key={kIdx}>
                    {kIdx > 0 && (
                      <span className="text-xs text-amber-400/90 font-mono font-bold px-0.5">
                        {sc.separator || " / "}
                      </span>
                    )}
                    <kbd className="bg-gray-900 border-2 border-gray-700 text-amber-300 text-xs font-extrabold font-mono px-2.5 py-1 rounded-lg shadow-[0_2px_0_0_rgba(255,255,255,0.1)] min-w-[32px] text-center">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER TIP */}
        <div className="mt-4 pt-3 border-t border-gray-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold border border-amber-500/40 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            {lang === "it" ? "Ho Capito" : "Got It"}
          </button>
        </div>
      </div>
    </div>
  );
}
