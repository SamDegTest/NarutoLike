import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DAILY_QUEST_DEFINITIONS,
  getTimeUntilNextDailyReset,
} from "@/data/dailyQuests";

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export function DailyQuestsModal({ isOpen, onClose, onOpenAuthModal }: DailyQuestsModalProps) {
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

  // Live countdown timer for midnight daily reset
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextDailyReset());
    }, 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const quests = dailyQuestsData?.quests || [];
  
  // Calculate total prize pool and earned coins
  let totalPoolCoins = 0;
  let earnedCoins = 0;
  let remainingCoins = 0;

  quests.forEach((q) => {
    const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
    const reward = def?.rewardCoins || 0;
    totalPoolCoins += reward;
    if (q.claimed) {
      earnedCoins += reward;
    } else {
      remainingCoins += reward;
    }
  });

  const completedCount = quests.filter((q) => q.completed).length;
  const claimedCount = quests.filter((q) => q.claimed).length;
  const unclaimedCount = quests.filter((q) => q.completed && !q.claimed).length;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "combat":
        return {
          text: lang === "it" ? "Combattimento" : "Combat",
          bg: "bg-red-500/20 text-red-300 border-red-500/40",
          icon: "/achievements/war_veteran.png",
        };
      case "bosses":
        return {
          text: lang === "it" ? "Boss di Capitolo" : "Chapter Boss",
          bg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: "/trophy.png",
        };
      case "team":
        return {
          text: lang === "it" ? "Squadra & Accademia" : "Team & Academy",
          bg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: "/academy.png",
        };
      case "items":
        return {
          text: lang === "it" ? "Strumenti & Oggetti" : "Items & Supplies",
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: "/backpack.png",
        };
      default:
        return {
          text: lang === "it" ? "Missione" : "Mission",
          bg: "bg-gray-500/20 text-gray-300 border-gray-500/40",
          icon: "/achievements/node_conqueror_1.png",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-amber-500 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center p-2 shadow-inner">
              <img
                src="/achievements/node_conqueror_1.png"
                alt="Sfide"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/trophy.png";
                }}
                className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(255,159,28,0.8)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 uppercase tracking-wider font-mono">
                  {lang === "it" ? "Sfide Giornaliere" : "Daily Missions"}
                </h2>
                {!user && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <img src="/chains.png" alt="Lock" className="w-3 h-3 object-contain" />
                    <span>{lang === "it" ? "Solo Utenti Loggati" : "Logged In Only"}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/80 font-mono">
                {lang === "it"
                  ? "Completa le 3 missioni giornaliere per incassare monete Ryo!"
                  : "Complete the 3 daily missions to claim valuable Ryo coins!"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* GUEST WARNING / LOGIN PROMPT (IF NOT LOGGED IN) */}
        {!user ? (
          <div className="bg-gradient-to-r from-amber-950/70 via-[#1b1509] to-amber-950/70 border-2 border-amber-500/60 rounded-2xl p-4 mb-4 text-center shrink-0 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center p-2 shrink-0 mt-0.5">
                  <img src="/chains.png" alt="Locked" className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-300 text-sm sm:text-base">
                    {lang === "it"
                      ? "Accesso Richiesto per Partecipare alle Sfide"
                      : "Sign In Required for Daily Missions"}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {lang === "it"
                      ? "Le Sfide Giornaliere sono un'esclusiva per gli account registrati. Accedi o registrati gratuitamente per sbloccare il tracciamento dei progressi e incassare fino a "
                      : "Daily Missions are reserved for registered accounts. Sign in or create a free account to track your mission progress and earn up to "}
                    <span className="inline-flex items-center gap-1 font-bold text-yellow-300">
                      <img src="/coin.png" alt="Ryo" className="w-3.5 h-3.5 object-contain inline-block" />
                      <span>+{totalPoolCoins} Ryo</span>
                    </span> {lang === "it" ? "al giorno!" : "per day!"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="w-full sm:w-auto py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-yellow-200 flex items-center justify-center gap-2"
              >
                <img src="/change_avatar.png" alt="Login" className="w-4 h-4 object-contain" />
                <span>{lang === "it" ? "Accedi / Registrati" : "Sign In / Register"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED-IN PRIZE POOL & RESET STATUS BAR */
          <div className="bg-[#070b19]/90 border border-amber-500/30 rounded-2xl p-3 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded-xl border border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {lang === "it" ? "Montepremi Oggi" : "Today's Prize"}
              </span>
              <span className="text-sm sm:text-base font-black text-yellow-300 flex items-center gap-1.5 font-mono">
                <img src="/coin.png" alt="Ryo" className="w-4 h-4 object-contain" />
                <span>+{totalPoolCoins} Ryo</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded-xl border border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {lang === "it" ? "Già Riscossi" : "Already Claimed"}
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-1.5 font-mono">
                <img src="/coin.png" alt="Ryo" className="w-4 h-4 object-contain" />
                <span>+{earnedCoins} Ryo</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded-xl border border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {lang === "it" ? "Completate" : "Completed"}
              </span>
              <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
                {completedCount} / {quests.length}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded-xl border border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {lang === "it" ? "Reset Tra" : "Resets In"}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1 font-mono">
                <span>⏱️</span>
                <span>{timeLeft.hours}h {timeLeft.minutes}m</span>
              </span>
            </div>
          </div>
        )}

        {/* QUEST LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
          {quests.map((q) => {
            const def = DAILY_QUEST_DEFINITIONS.find((d) => d.id === q.questId);
            if (!def) return null;

            const isDone = q.completed;
            const isClaimed = q.claimed;
            const progressVal = user ? q.progress : 0;
            const progressPercent = Math.min(100, Math.round((progressVal / def.targetCount) * 100));
            const remaining = Math.max(0, def.targetCount - progressVal);
            const categoryInfo = getCategoryLabel(def.category);

            return (
              <div
                key={q.questId}
                className={`bg-[#070b19]/85 border-2 rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 relative overflow-hidden ${
                  !user
                    ? "border-gray-800 opacity-80"
                    : isClaimed
                    ? "border-emerald-500/40 bg-emerald-950/15"
                    : isDone
                    ? "border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-amber-950/20 animate-pulse"
                    : "border-gray-800 hover:border-gray-700 hover:bg-[#0c1229]"
                }`}
              >
                {/* Left Side: Category, Image & Detailed Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center p-2 shrink-0 border-2 shadow-md ${
                      !user
                        ? "bg-gray-900 border-gray-700 opacity-60"
                        : isClaimed
                        ? "bg-emerald-950/50 border-emerald-500/50"
                        : isDone
                        ? "bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  >
                    <img
                      src={def.image}
                      alt={def.title[lang]}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".quest-fallback")) {
                          const span = document.createElement("span");
                          span.className = "quest-fallback text-2xl";
                          span.innerText = def.iconFallbackEmoji || "🎯";
                          parent.appendChild(span);
                        }
                      }}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.6)]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryInfo.bg}`}>
                        <img src={categoryInfo.icon} alt="" className="w-3 h-3 object-contain" />
                        <span>{categoryInfo.text}</span>
                      </span>
                      <h4 className="font-black text-sm sm:text-base text-amber-200 truncate">
                        {def.title[lang]}
                      </h4>
                      {/* PROMINENT REWARD PILL WITH COIN IMAGE */}
                      <span className="bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-xs font-mono font-black px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <img src="/coin.png" alt="Ryo" className="w-3.5 h-3.5 object-contain inline-block" />
                        <span>+{def.rewardCoins} Monete Ryo</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mb-1.5 leading-relaxed">
                      {def.description[lang]}
                    </p>

                    {/* STRATEGIC HINT / TIP */}
                    {def.tip && (
                      <div className="text-[11px] text-amber-300/80 flex items-center gap-1 mb-2">
                        <span className="text-amber-400 font-bold shrink-0">💡 {lang === "it" ? "Suggerimento:" : "Tip:"}</span>
                        <span className="italic">{def.tip[lang]}</span>
                      </div>
                    )}

                    {/* PROGRESS BAR & COUNTERS */}
                    {user ? (
                      <>
                        <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden border border-gray-700 flex items-center">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isClaimed
                                ? "bg-emerald-500"
                                : isDone
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
                          <span>
                            {lang === "it" ? "Avanzamento" : "Progress"}: <strong className="text-gray-200">{progressVal} / {def.targetCount}</strong>
                            {!isDone && remaining > 0 && (
                              <span className="text-amber-400 ml-1">({lang === "it" ? `Mancano ${remaining}` : `${remaining} left`})</span>
                            )}
                          </span>
                          <span className="font-bold text-gray-300">{progressPercent}%</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] font-mono text-gray-500 italic flex items-center gap-1">
                        <img src="/chains.png" alt="" className="w-3 h-3 object-contain inline-block opacity-70" />
                        <span>{lang === "it" ? "Accedi per iniziare questa sfida e tracciare l'avanzamento" : "Sign in to start this quest and track progress"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Claim / Status Button */}
                <div className="w-full sm:w-auto shrink-0 flex justify-end">
                  {!user ? (
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenAuthModal) onOpenAuthModal();
                      }}
                      className="w-full sm:w-44 py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <img src="/chains.png" alt="Lock" className="w-3.5 h-3.5 object-contain" />
                      <span>{lang === "it" ? "Sblocca con Login" : "Unlock with Login"}</span>
                    </button>
                  ) : isClaimed ? (
                    <span className="w-full sm:w-44 py-2.5 px-3 bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 select-none shadow-inner">
                      <span>✅</span>
                      <span>{lang === "it" ? `Riscossa (+${def.rewardCoins} Ryo)` : `Claimed (+${def.rewardCoins} Ryo)`}</span>
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => claimDailyQuestReward(q.questId)}
                      className="w-full sm:w-44 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-yellow-200"
                    >
                      <img src="/coin.png" alt="Ryo" className="w-4 h-4 object-contain" />
                      <span>{lang === "it" ? `Riscatta +${def.rewardCoins} Ryo` : `Claim +${def.rewardCoins} Ryo`}</span>
                    </button>
                  ) : (
                    <span className="w-full sm:w-44 py-2.5 px-3 bg-gray-900/80 border border-gray-800 text-gray-400 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1 select-none">
                      <span>⌛</span>
                      <span>{lang === "it" ? `In Corso (${progressVal}/${def.targetCount})` : `In Progress (${progressVal}/${def.targetCount})`}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL FOOTER */}
        <div className="mt-3 pt-3 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-gray-400 text-center sm:text-left">
            {lang === "it"
              ? "Le sfide si rinnovano automaticamente ogni giorno alle 00:00 con 3 nuovi incarichi."
              : "Quests refresh automatically every day at 00:00 with 3 new assignments."}
          </span>

          {user && unclaimedCount > 1 && (
            <button
              onClick={() => claimAllDailyQuestRewards()}
              className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-black text-xs font-mono uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 border border-yellow-200"
            >
              <img src="/coin.png" alt="Ryo" className="w-4 h-4 object-contain" />
              <span>{lang === "it" ? "Riscatta Tutte le Ricompense" : "Claim All Rewards"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
