import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ACHIEVEMENTS, getUnlockedAchievements, Achievement } from "@/data/achievements";
import { supabase } from "@/lib/supabaseClient";

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const { totalRunsCount, classicRunsCount, shippudenRunsCount, currentLevel, defeatedBosses, unlockedAchievementsMap } = useGameStore();
  const { user } = useAuthStore();

  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const stats = {
    totalRuns: totalRunsCount,
    classicRuns: classicRunsCount,
    shippudenRuns: shippudenRunsCount,
    maxLevel: currentLevel,
    defeatedBosses: defeatedBosses || [],
  };

  const unlocked = getUnlockedAchievements(stats);
  const unlockedIds = unlocked.map((a) => a.id);

  useEffect(() => {
    async function loadTitle() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("selected_title")
          .eq("id", user.id)
          .single();
        if (data?.selected_title) {
          setSelectedTitle(data.selected_title);
        }
      }
    }
    loadTitle();
  }, [user]);

  const handleSelectTitle = async (titleText: string) => {
    setSelectedTitle(titleText);
    if (user) {
      await supabase
        .from("profiles")
        .upsert({ id: user.id, selected_title: titleText }, { onConflict: "id" });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500 rounded-3xl max-w-2xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[92dvh] flex flex-col text-white"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-amber-300 font-bold text-lg cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        <header className="text-center border-b-2 border-gray-800 pb-3 mb-4 shrink-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
            🎯 {lang === "it" ? "TROFEI & TITOLI SHINOBI" : "TROPHIES & SHINOBI TITLES"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "it"
              ? "Sblocca i trofei completando sfide di gioco ed equipaggia i tuoi Titoli speciali!"
              : "Unlock trophies by completing challenges and equip your custom Titles!"}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id) || !!unlockedAchievementsMap[ach.id];
            const titleText = ach.title[lang];
            const isEquipped = selectedTitle === titleText;
            const unlockTimestamp = unlockedAchievementsMap[ach.id];
            
            let formattedTimestamp: string | null = null;
            if (unlockTimestamp) {
              try {
                const dateObj = new Date(unlockTimestamp);
                const dStr = dateObj.toLocaleDateString(lang === "it" ? "it-IT" : "en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                });
                const tStr = dateObj.toLocaleTimeString(lang === "it" ? "it-IT" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                formattedTimestamp = `${dStr} ${lang === "it" ? "alle" : "at"} ${tStr}`;
              } catch (e) {}
            }

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? "bg-[#070b19] border-amber-500/50 shadow-md"
                    : "bg-[#070b19]/40 border-gray-850 opacity-50 filter grayscale"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl p-2 bg-black/40 rounded-xl border border-white/10 shrink-0">
                    {ach.icon}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-white">{ach.name[lang]}</span>
                      {isUnlocked ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-bold">
                          ✓ {lang === "it" ? "SBLOCCATO" : "UNLOCKED"}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                          🔒 {lang === "it" ? "BLOCCATO" : "LOCKED"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{ach.description[lang]}</p>
                    <div className="text-xs text-amber-300 font-mono font-bold mt-1">
                      {lang === "it" ? "Titolo:" : "Title:"} <span className="underline">{titleText}</span>
                    </div>
                    {isUnlocked && formattedTimestamp && (
                      <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                        <span>🕒</span>
                        <span>{lang === "it" ? `Sbloccato il ${formattedTimestamp}` : `Unlocked on ${formattedTimestamp}`}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isUnlocked && (
                  <button
                    onClick={() => handleSelectTitle(titleText)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shrink-0 ${
                      isEquipped
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                        : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/40"
                    }`}
                  >
                    {isEquipped
                      ? (lang === "it" ? "EQUIPAGGIATO ✓" : "EQUIPPED ✓")
                      : (lang === "it" ? "EQUIPAGGIAR" : "EQUIP")}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 border-t border-gray-800 pt-3 text-center shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-yellow-500 text-[#070b19] font-bold rounded-xl uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 shadow-md cursor-pointer"
          >
            {lang === "it" ? "Chiudi Trofei" : "Close Trophies"}
          </button>
        </div>

      </div>
    </div>
  );
};
