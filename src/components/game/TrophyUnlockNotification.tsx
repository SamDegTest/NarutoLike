import React, { useEffect, useState } from "react";
import { Achievement } from "@/data/achievements";
import { useLanguageStore } from "@/store/useLanguageStore";

interface TrophyUnlockNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const TrophyUnlockNotification: React.FC<TrophyUnlockNotificationProps> = ({
  achievement,
  onDismiss,
}) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 500); // wait for fade out
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] transition-all duration-500 transform ${
        visible ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "translate-y-12 opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div
        onClick={onDismiss}
        className="bg-gradient-to-r from-amber-950/95 via-[#0f152d] to-yellow-950/95 border-2 border-yellow-400 p-4 rounded-2xl shadow-[0_0_35px_rgba(251,191,36,0.7)] flex items-center gap-4 max-w-sm sm:max-w-md w-full cursor-pointer relative overflow-hidden backdrop-blur-md"
      >
        {/* Pulsing Background Rays */}
        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />

        {/* Trophy Icon with Ring Glow */}
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-yellow-200 shrink-0 animate-pulse">
          🏆
        </div>

        {/* Info Text */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-extrabold font-mono text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>✨ {lang === "it" ? "TROFEO SBLOCCATO!" : "TROPHY UNLOCKED!"}</span>
            <span className="text-xs">✨</span>
          </div>
          <div className="text-sm font-extrabold text-white truncate mt-0.5">
            {achievement.name[lang]}
          </div>
          <div className="text-xs text-amber-200 font-mono font-bold mt-0.5 truncate">
            {lang === "it" ? "Titolo:" : "Title:"} <span className="underline">{achievement.title[lang]}</span>
          </div>
        </div>

        {/* Sparkle badge */}
        <div className="text-amber-400 text-xs font-mono font-bold bg-yellow-400/20 px-2 py-1 rounded-lg border border-yellow-400/40 shrink-0">
          +1 🏆
        </div>
      </div>
    </div>
  );
};
