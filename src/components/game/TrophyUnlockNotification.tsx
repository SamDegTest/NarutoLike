import React, { useEffect, useState } from "react";
import { Achievement, getAchievementIconSrc, getAchievementRewardCoins } from "@/data/achievements";
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
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-300 shrink-0 animate-pulse overflow-hidden p-1">
          <img
            src={getAchievementIconSrc(achievement)}
            alt={achievement.name[lang]}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) parent.innerText = achievement.icon;
            }}
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          />
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

        {/* Sparkle & Coin reward badge */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-amber-400 text-xs font-mono font-bold bg-yellow-400/20 px-2 py-0.5 rounded-lg border border-yellow-400/40">
            +1 🏆
          </div>
          <div className="text-yellow-300 text-[10px] font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-yellow-500/40 flex items-center gap-1">
            <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3 h-3 object-contain" />
            <span>+{getAchievementRewardCoins(achievement)} ryo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
