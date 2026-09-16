import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DAILY_QUEST_DEFINITIONS,
  getTimeUntilNextDailyReset,
} from "@/data/dailyQuests";

interface DailyQuestsHomepageWidgetProps {
  onOpenAuthModal: () => void;
}

export function DailyQuestsHomepageWidget({ onOpenAuthModal }: DailyQuestsHomepageWidgetProps) {
  const lang = useLanguageStore((state) => state.language) || "it";
  const { user } = useAuthStore();
  const {
    dailyQuestsData,
    claimDailyQuestReward,
    claimAllDailyQuestRewards,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number }>(
    getTimeUntilNextDailyReset()
  );

  // Live countdown timer for midnight reset
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextDailyReset());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const quests = dailyQuestsData?.quests || [];

  // Calculate total prize pool
  let totalPoolCoins = 0;
  quests.forEach((q) => {
    const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
    totalPoolCoins += def?.rewardCoins || 0;
  });

  const completedCount = quests.filter((q) => q.completed).length;
  const unclaimedCount = quests.filter((q) => q.completed && !q.claimed).length;

  return (
    <div className="w-full bg-[#090d1f]/95 border-2 border-amber-500/60 rounded-3xl p-3.5 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl relative overflow-hidden flex flex-col select-none">
      {/* HEADER: ICON + TITLE + RESET + PRIZE POOL + MULTI-CLAIM ACTION */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-500/30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center p-1 shrink-0 shadow-inner">
            <img
              src="/achievements/node_conqueror_1.png"
              alt="Sfide"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/trophy.png";
              }}
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider font-mono truncate leading-none">
              {lang === "it" ? "Sfide Giornaliere Shinobi" : "Daily Shinobi Missions"}
            </h3>
            <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-2">
              <span>⏱️ {lang === "it" ? "Reset tra" : "Reset in"}: <strong className="text-gray-300">{timeLeft.hours}h {timeLeft.minutes}m</strong></span>
              <span>•</span>
              <span>{lang === "it" ? "Completate" : "Completed"}: <strong className="text-amber-300">{completedCount}/{quests.length}</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT ACTIONS: PRIZE POOL CHIP & CLAIM ALL */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-black/60 border border-amber-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-mono text-xs shadow-inner">
            <img src="/coin.png" alt="Ryo" className="w-4 h-4 object-contain" />
            <span className="text-[10px] text-gray-400 uppercase hidden sm:inline">{lang === "it" ? "Montepremi" : "Prize Pool"}:</span>
            <span className="font-black text-yellow-300">+{totalPoolCoins} Ryo</span>
          </div>

          {user && unclaimedCount > 1 && (
            <button
              onClick={() => claimAllDailyQuestRewards()}
              className="py-1 px-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-gray-950 font-black text-[10px] sm:text-xs font-mono uppercase rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 border border-yellow-200 hover:scale-105 active:scale-95 transition-all"
            >
              <img src="/coin.png" alt="Ryo" className="w-3.5 h-3.5 object-contain" />
              <span>{lang === "it" ? "Riscatta Tutte" : "Claim All"}</span>
            </button>
          )}
        </div>
      </div>

      {/* GUEST BANNER */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-950/60 to-gray-900/90 border border-amber-500/40 rounded-xl p-2 mb-3 flex items-center justify-between gap-2 text-xs text-gray-200 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <img src="/chains.png" alt="Lock" className="w-4 h-4 object-contain shrink-0" />
            <span className="truncate">{lang === "it" ? "Accedi per progredire e riscattare le monete delle sfide giornaliere" : "Sign in to complete missions and earn Ryo daily"}</span>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="py-1 px-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-gray-950 font-black text-[10px] font-mono uppercase rounded-lg shadow cursor-pointer shrink-0"
          >
            {lang === "it" ? "Accedi / Registrati" : "Sign In / Register"}
          </button>
        </div>
      )}

      {/* 3 HORIZONTAL / GRID QUEST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
        {quests.map((q) => {
          const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
          if (!def) return null;

          const isDone = q.completed;
          const isClaimed = q.claimed;
          const progressVal = user ? q.progress : 0;
          const progressPercent = Math.min(100, Math.round((progressVal / def.targetCount) * 100));

          return (
            <div
              key={q.questId}
              className={`bg-[#050814]/90 border-2 rounded-2xl p-2.5 sm:p-3 transition-all flex flex-col justify-between gap-2 ${
                !user
                  ? "border-gray-800 opacity-80"
                  : isClaimed
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : isDone
                  ? "border-amber-400/80 bg-amber-950/25 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "border-gray-800/90 hover:border-gray-700"
              }`}
            >
              {/* Row 1: Icon, Title & Bounty */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center p-1 shrink-0">
                  <img
                    src={def.image}
                    alt={def.title[lang]}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(255,159,28,0.6)]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-amber-200 truncate leading-none">
                      {def.title[lang]}
                    </h4>
                    <span className="text-[10px] font-mono font-black text-yellow-300 flex items-center gap-0.5 shrink-0 bg-yellow-500/10 border border-yellow-500/30 px-1.5 py-0.5 rounded-md">
                      <img src="/coin.png" alt="" className="w-3 h-3 object-contain inline-block" />
                      <span>+{def.rewardCoins}</span>
                    </span>
                  </div>
                  <p className="text-[9.5px] text-gray-400 line-clamp-1 mt-0.5 font-mono">
                    {def.description[lang]}
                  </p>
                </div>
              </div>

              {/* Row 2: Progress bar + Status / Claim */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-800/80">
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-700 mb-0.5">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isClaimed
                          ? "bg-emerald-500"
                          : isDone
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[8.5px] font-mono text-gray-400 flex justify-between leading-none font-semibold">
                    <span>{progressVal}/{def.targetCount}</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                {user ? (
                  <div className="shrink-0">
                    {isClaimed ? (
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 rounded-lg flex items-center gap-0.5 shadow-sm">
                        ✅ {lang === "it" ? "Riscossa" : "Claimed"}
                      </span>
                    ) : isDone ? (
                      <button
                        onClick={() => claimDailyQuestReward(q.questId)}
                        className="py-1 px-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-gray-950 font-black text-[9.5px] font-mono uppercase rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 border border-yellow-200"
                      >
                        <img src="/coin.png" alt="" className="w-2.5 h-2.5 object-contain" />
                        <span>{lang === "it" ? "Riscatta" : "Claim"}</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-900/90 border border-gray-800 px-2 py-1 rounded-lg">
                        ⌛ {lang === "it" ? "In Corso" : "Active"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-[9px] font-mono text-gray-500 italic flex items-center gap-0.5">
                    <img src="/chains.png" alt="" className="w-2.5 h-2.5 object-contain opacity-60" />
                    <span>{lang === "it" ? "Bloccato" : "Locked"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
