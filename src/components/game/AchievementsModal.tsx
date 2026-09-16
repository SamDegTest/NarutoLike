import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  ACHIEVEMENTS, 
  getUnlockedAchievements, 
  Achievement, 
  AchievementCategory, 
  CATEGORY_LABELS,
  getAchievementIconSrc,
  getAchievementRewardCoins
} from "@/data/achievements";
import { supabase } from "@/lib/supabaseClient";

interface AchievementsModalProps {
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose, onOpenAuthModal }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const { 
    totalRunsCount, 
    classicRunsCount, 
    shippudenRunsCount, 
    towerRunsCount,
    towerMaxFloor,
    towerHighScore,
    currentLevel, 
    totalScore,
    classicHighScore,
    shippudenHighScore,
    defeatedBosses, 
    unlockedAchievementsMap 
  } = useGameStore();
  const { user } = useAuthStore();

  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "locked">("all");

  const stats = {
    totalRuns: totalRunsCount,
    classicRuns: classicRunsCount,
    shippudenRuns: shippudenRunsCount,
    towerRuns: towerRunsCount,
    maxLevel: currentLevel,
    totalScore: totalScore || 0,
    classicHighScore: classicHighScore || 0,
    shippudenHighScore: shippudenHighScore || 0,
    towerMaxFloor: towerMaxFloor || 0,
    towerHighScore: towerHighScore || 0,
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
    useAuthStore.setState({ selectedTitle: titleText });
    if (user) {
      await supabase
        .from("profiles")
        .upsert({ id: user.id, selected_title: titleText }, { onConflict: "id" });
    }
  };

  const totalUnlockedCount = ACHIEVEMENTS.filter(
    (a) => unlockedIds.includes(a.id) || !!unlockedAchievementsMap[a.id]
  ).length;

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    // 1. Category filter
    if (activeCategory !== "all" && ach.category !== activeCategory) {
      return false;
    }

    // 2. Status filter
    const meetsCondition = unlockedIds.includes(ach.id) || !!unlockedAchievementsMap[ach.id];
    if (statusFilter === "unlocked" && !meetsCondition) {
      return false;
    }
    if (statusFilter === "locked" && meetsCondition) {
      return false;
    }

    // 3. Search query filter (search across title, name, description in both it and en)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameIt = ach.name.it.toLowerCase();
      const nameEn = ach.name.en.toLowerCase();
      const titleIt = ach.title.it.toLowerCase();
      const titleEn = ach.title.en.toLowerCase();
      const descIt = ach.description.it.toLowerCase();
      const descEn = ach.description.en.toLowerCase();
      const catIt = CATEGORY_LABELS[ach.category]?.it?.toLowerCase() || "";
      const catEn = CATEGORY_LABELS[ach.category]?.en?.toLowerCase() || "";

      const match =
        nameIt.includes(q) ||
        nameEn.includes(q) ||
        titleIt.includes(q) ||
        titleEn.includes(q) ||
        descIt.includes(q) ||
        descEn.includes(q) ||
        catIt.includes(q) ||
        catEn.includes(q);

      if (!match) return false;
    }

    return true;
  });

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || activeCategory !== "all" || statusFilter !== "all";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500 rounded-3xl max-w-4xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[92dvh] flex flex-col text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-amber-300 font-bold text-lg cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        <header className="text-center border-b-2 border-gray-800 pb-3 mb-3 shrink-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
            <img
              src="/achievements_header.png"
              alt="Trofei"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".achievements-header-fallback")) {
                  const span = document.createElement("span");
                  span.className = "achievements-header-fallback";
                  span.innerText = "🎯";
                  parent.insertBefore(span, target);
                }
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 filter drop-shadow-[0_0_10px_rgba(255,159,28,0.8)]"
            />
            <span>{lang === "it" ? "TROFEI & TITOLI SHINOBI" : "TROPHIES & SHINOBI TITLES"}</span>
          </h2>
          <p className="text-xs text-amber-400 font-mono font-bold mt-1">
            {lang === "it" 
              ? `Progresso Totale: ${totalUnlockedCount} / ${ACHIEVEMENTS.length} Trofei Sbloccati` 
              : `Total Progress: ${totalUnlockedCount} / ${ACHIEVEMENTS.length} Trophies Unlocked`}
          </p>
        </header>

        {/* Guest User Banner Warning */}
        {!user && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-3 mb-3 flex items-center justify-between gap-3 text-left shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {lang === "it" ? "Modalità Ospite (Profilo Non Registrato)" : "Guest Mode (Unregistered Profile)"}
                </div>
                <div className="text-[11px] text-gray-300 leading-tight mt-0.5">
                  {lang === "it"
                    ? "Raggiungi gli obiettivi in partita ma registrati per sbloccare ufficialmente i Trofei, salvare i Titoli ed equipaggiarli!"
                    : "Reach goals in-game but sign up to officially claim Trophies, save Titles, and equip them!"}
                </div>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 bg-[#ff9f1c] hover:bg-yellow-400 text-[#070b19] font-black text-xs uppercase tracking-wider rounded-xl transition-all border-b-2 border-amber-700 shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
              >
                <img src="/cloud.png" alt="Cloud" className="w-4 h-4 object-contain shrink-0" />
                <span>{lang === "it" ? "Registrati" : "Register"}</span>
              </button>
            )}
          </div>
        )}

        {/* Search Bar & Status Filter Section */}
        <div className="space-y-2 mb-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <svg
                className="w-4 h-4 text-amber-400 absolute left-3 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "it"
                    ? "Cerca per nome, titolo shinobi o descrizione..."
                    : "Search by name, shinobi title, or description..."
                }
                className="w-full bg-[#070b19] border border-amber-500/40 focus:border-amber-400 text-white rounded-xl py-2 pl-9 pr-8 text-xs sm:text-sm font-mono outline-none transition-all placeholder:text-gray-500 focus:shadow-[0_0_12px_rgba(255,159,28,0.25)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-xs text-gray-400 hover:text-white p-1 cursor-pointer"
                  title={lang === "it" ? "Cancella ricerca" : "Clear search"}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Toggle Pills */}
            <div className="flex bg-[#070b19] p-1 rounded-xl border border-gray-800 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-amber-500 text-[#070b19] shadow-md font-black"
                    : "text-gray-400 hover:text-amber-300"
                }`}
              >
                {lang === "it" ? "Tutti" : "All"} ({ACHIEVEMENTS.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("unlocked")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === "unlocked"
                    ? "bg-emerald-500 text-[#070b19] shadow-md font-black"
                    : "text-gray-400 hover:text-emerald-300"
                }`}
              >
                <span>✓</span>
                <span>{lang === "it" ? "Sbloccati" : "Unlocked"} ({totalUnlockedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("locked")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === "locked"
                    ? "bg-gray-700 text-amber-300 shadow-md font-black"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>🔒</span>
                <span>{lang === "it" ? "Bloccati" : "Locked"} ({ACHIEVEMENTS.length - totalUnlockedCount})</span>
              </button>
            </div>
          </div>

          {/* Category Tabs & Active Filter Reset */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all shrink-0 cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-amber-500 text-[#070b19] shadow-md font-black scale-105"
                    : "bg-[#070b19] text-gray-400 hover:text-amber-300 border border-gray-800"
                }`}
              >
                🌟 {lang === "it" ? "Tutte le Categorie" : "All Categories"}
              </button>
              
              {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((catKey) => {
                const catInfo = CATEGORY_LABELS[catKey];
                const catCount = ACHIEVEMENTS.filter((a) => a.category === catKey).length;
                const catUnlocked = ACHIEVEMENTS.filter(
                  (a) => a.category === catKey && (unlockedIds.includes(a.id) || !!unlockedAchievementsMap[a.id])
                ).length;
                
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setActiveCategory(catKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      activeCategory === catKey
                        ? "bg-amber-500 text-[#070b19] shadow-md font-black scale-105"
                        : "bg-[#070b19] text-gray-400 hover:text-amber-300 border border-gray-800"
                    }`}
                  >
                    <span>{catInfo.icon}</span>
                    <span>{catInfo[lang]} ({catUnlocked}/{catCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Results counter & Reset button */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 ml-auto">
              <span>
                {lang === "it"
                  ? `${filteredAchievements.length} trovati`
                  : `${filteredAchievements.length} found`}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer text-[11px] font-bold"
                >
                  {lang === "it" ? "Azzera Filtri" : "Reset Filters"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Achievements Grid List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredAchievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#070b19]/60 border border-gray-800 rounded-2xl animate-fade-in">
              <svg
                className="w-12 h-12 text-amber-500/60 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              <h3 className="text-base font-bold text-amber-300 font-mono">
                {lang === "it" ? "Nessun trofeo o titolo trovato" : "No trophies or titles found"}
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                {lang === "it"
                  ? "Nessun obiettivo corrisponde ai criteri di ricerca o ai filtri impostati."
                  : "No achievements match your current search query or active filters."}
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-yellow-400 text-[#070b19] font-bold font-mono text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                {lang === "it" ? "Azzera Ricerca e Filtri" : "Reset Search & Filters"}
              </button>
            </div>
          ) : (
            filteredAchievements.map((ach) => {
              const meetsCondition = unlockedIds.includes(ach.id) || !!unlockedAchievementsMap[ach.id];
              const isFullyUnlocked = !!user && meetsCondition;
              const isGuestCompleted = !user && meetsCondition;
              const titleText = ach.title[lang];
              const isEquipped = user && selectedTitle === titleText;
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
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isFullyUnlocked
                      ? "bg-[#070b19] border-amber-500/50 shadow-md"
                      : isGuestCompleted
                      ? "bg-[#070b19]/80 border-amber-500/30"
                      : "bg-[#070b19]/40 border-gray-850 opacity-50 filter grayscale"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-13 h-13 sm:w-16 sm:h-16 p-1 bg-black/50 rounded-2xl border-2 border-amber-500/40 shrink-0 flex items-center justify-center shadow-lg">
                      <img
                        src={getAchievementIconSrc(ach)}
                        alt={ach.name[lang]}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerText = ach.icon;
                          }
                        }}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.5)]"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white">{ach.name[lang]}</span>
                        {isFullyUnlocked ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-bold">
                            ✓ {lang === "it" ? "SBLOCCATO" : "UNLOCKED"}
                          </span>
                        ) : isGuestCompleted ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
                            ⚠️ {lang === "it" ? "COMPLETATO (REGISTRATI PER SALVARE)" : "COMPLETED (REGISTER TO SAVE)"}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                            🔒 {lang === "it" ? "BLOCCATO" : "LOCKED"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{ach.description[lang]}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="text-xs text-amber-300 font-mono font-bold">
                          {lang === "it" ? "Titolo:" : "Title:"} <span className="underline">{titleText}</span>
                        </div>
                        <div className="text-[10px] font-mono font-bold text-yellow-400 bg-black/60 px-2 py-0.5 rounded border border-yellow-500/40 flex items-center gap-1">
                          <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3 h-3 object-contain" />
                          <span>+{getAchievementRewardCoins(ach)} ryo</span>
                        </div>
                      </div>
                      {isFullyUnlocked && formattedTimestamp && (
                        <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                          <span>🕒</span>
                          <span>{lang === "it" ? `Sbloccato il ${formattedTimestamp}` : `Unlocked on ${formattedTimestamp}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equip Title Button */}
                  <div className="shrink-0">
                    {isFullyUnlocked ? (
                      <button
                        onClick={() => handleSelectTitle(titleText)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          isEquipped
                            ? "bg-amber-500 text-[#070b19] border border-amber-400 shadow-md scale-105"
                            : "bg-gray-800 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {isEquipped ? (lang === "it" ? "✓ EQUIPAGGIATO" : "✓ EQUIPPED") : (lang === "it" ? "EQUIPAGGIA" : "EQUIP")}
                      </button>
                    ) : isGuestCompleted ? (
                      <button
                        onClick={onOpenAuthModal}
                        title={lang === "it" ? "Crea o accedi a un account per riscattare ed equipaggiare questo titolo!" : "Create or log in to an account to claim and equip this title!"}
                        className="text-[11px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-xl font-mono font-bold inline-flex items-center gap-1.5 justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md"
                      >
                        <img
                          src="/cloud.png"
                          alt="Akatsuki Cloud"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.display = "none";
                          }}
                          className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
                        />
                        <span>{lang === "it" ? "REGISTRATI" : "REGISTER"}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600 font-mono">🔒</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
