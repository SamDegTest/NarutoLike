import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-[#ff9f1c] text-center uppercase tracking-wider mb-6">
          {t.creditsTitle}
        </h2>

        <div className="space-y-6 text-sm text-gray-300">
          <div>
            <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-1.5">
              💻 {t.creditsDev}
            </h3>
            <p className="leading-relaxed bg-[#070b19]/80 border border-gray-800 p-3 rounded-xl">
              {t.creditsTextDev}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-1.5">
              🎨 {t.creditsSprites}
            </h3>
            <p className="leading-relaxed bg-[#070b19]/80 border border-gray-800 p-3 rounded-xl">
              {t.creditsTextSprites}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-1.5">
              🍥 {t.creditsInspiration}
            </h3>
            <p className="leading-relaxed bg-[#070b19]/80 border border-gray-800 p-3 rounded-xl">
              {t.creditsTextInspiration}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-1.5">
              ❤️ {t.creditsThanks}
            </h3>
            <p className="leading-relaxed bg-[#070b19]/80 border border-gray-800 p-3 rounded-xl">
              {lang === "it"
                ? "Grazie a Masashi Kishimoto per l'opera originale di Naruto, e a tutti i fan ed amanti degli anime per il supporto!"
                : "Special thanks to Masashi Kishimoto for creating the original Naruto series, and to all anime fans and enthusiasts for supporting this demo!"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 cursor-pointer"
        >
          {lang === "it" ? "Chiudi" : "Close"}
        </button>

      </div>
    </div>
  );
};
