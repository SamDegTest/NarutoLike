"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useBattleStore } from "@/store/useBattleStore";
import { NINJA_MAP } from "@/data/ninjas";
import { JUTSU_MAP } from "@/data/jutsus";
import { Ninja, MapNode } from "@/types/index";
import { BattleScreen } from "@/components/game/BattleScreen";
import { NinjaAvatar } from "@/components/game/NinjaAvatar";
import { ChakraNatureBadge } from "@/components/game/ChakraNatureBadge";
import { RARITY_CONFIGS } from "@/lib/rarity";
import { CHAKRA_NATURE_CONFIGS } from "@/lib/chakraNatures";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS, translateNodeLabel, translateNinjaName, JUTSU_TRANSLATIONS } from "@/data/translations";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/game/AuthModal";
import { CreditsModal } from "@/components/game/CreditsModal";
import { PatchNotesModal } from "@/components/game/PatchNotesModal";
import { PrivacyModal } from "@/components/game/PrivacyModal";
import { ChakraChartModal } from "@/components/game/ChakraChartModal";
import { UserProfileBadge } from "@/components/game/UserProfileBadge";
import { UserProfileModal } from "@/components/game/UserProfileModal";
import { LeaderboardModal } from "@/components/game/LeaderboardModal";
import { AchievementsModal } from "@/components/game/AchievementsModal";
import { TrophyUnlockNotification } from "@/components/game/TrophyUnlockNotification";
import { SealedSagaOverlay } from "@/components/game/SealedSagaOverlay";
import { getActiveSynergies } from "@/lib/synergies";
import { getUnlockedAchievements, Achievement } from "@/data/achievements";

export default function Home() {
  const {
    playerRoster,
    playerTeam,
    runTeam,
    currentLevel,
    activeMap,
    currentNodeId,
    isRunActive,
    activeSagaId,
    startingChoices,
    activePowerUps,
    availablePowerUpChoices,
    pendingJutsuToLearn,
    availableRecruitChoices,
    shippudenUnlocked,
    addNinjaToTeam,
    removeNinjaFromTeam,
    startRun,
    selectNode,
    applyHealingAtCampfire,
    choosePowerUp,
    learnJutsu,
    chooseRecruit,
    skipRecruit,
    selectSaga,
    selectStartingCharacter,
    endRun,
    defeatedBosses,
    moveNinjaUp,
    moveNinjaDown,
    setLeaderNinja,
    totalRunsCount,
    classicRunsCount,
    shippudenRunsCount,
  } = useGameStore();

  const { startBattle, isBattleActive } = useBattleStore();

  const { user, username, avatarUrl, initialize: initAuth, signOut: logOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showPatchNotesModal, setShowPatchNotesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showChakraChartModal, setShowChakraChartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { newlyUnlockedTrophy, dismissTrophyNotification } = useGameStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  const { language: storeLang, setLanguage } = useLanguageStore();
  const lang = mounted ? storeLang : "it";
  const t = TRANSLATIONS[lang];

  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [pendingRecruitId, setPendingRecruitId] = useState<string | null>(null);

  const isTeamFull = playerTeam.length >= 2;
  const isShippudenUnlocked = mounted ? shippudenUnlocked : false;

  // Active node details
  const currentNode = activeMap.find((n) => n.id === currentNodeId);

  // Determine if a node can be selected by the player
  const isNodeSelectable = (node: MapNode) => {
    if (node.resolved) return false;
    if (currentNodeId === null) {
      return node.stage === 0;
    }
    const current = activeMap.find((n) => n.id === currentNodeId);
    if (!current) return false;
    if (!current.resolved) return false; // Must resolve current node first
    return current.connections.includes(node.id);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keyboard shortcuts listener (Spacebar/Enter for map node advance, C for Chakra chart, M for menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

      if (e.code === "Space" || e.code === "Enter") {
        if (isRunActive && !isBattleActive) {
          const selectable = activeMap.filter((n) => isNodeSelectable(n));
          if (selectable.length > 0) {
            e.preventDefault();
            selectNode(selectable[0].id);
          }
        }
      }

      if (e.key === "c" || e.key === "C") {
        setShowChakraChartModal((prev) => !prev);
      }

      if (e.key === "m" || e.key === "M") {
        setIsMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunActive, isBattleActive, activeMap, currentNodeId]);

  // BFS to compute which nodes are reachable from the current state
  const getReachableNodeIds = () => {
    const reachable = new Set<string>();

    activeMap.forEach((n) => {
      if (n.resolved || n.id === currentNodeId) {
        reachable.add(n.id);
      }
    });

    let queue: string[] = [];
    if (currentNodeId === null) {
      activeMap.filter((n) => n.stage === 0).forEach((n) => queue.push(n.id));
    } else {
      const current = activeMap.find((n) => n.id === currentNodeId);
      if (current) {
        if (current.resolved) {
          queue.push(...current.connections);
        } else {
          queue.push(current.id);
        }
      }
    }

    const visited = new Set<string>();
    while (queue.length > 0) {
      const currId = queue.shift()!;
      if (visited.has(currId)) continue;
      visited.add(currId);
      reachable.add(currId);

      const node = activeMap.find((n) => n.id === currId);
      if (node) {
        queue.push(...node.connections);
      }
    }

    return reachable;
  };

  const handleStartNodeAction = () => {
    if (!currentNode) return;
    if (currentNode.type === "battle" || currentNode.type === "boss") {
      const opponents = (currentNode.opponents || [])
        .map((id) => NINJA_MAP.get(id))
        .filter((n): n is Ninja => n !== undefined);
      startBattle(runTeam, opponents);
    }
  };

  const nodePositions: { [key: string]: { left: string; top: string; x: number; y: number } } = {
    "0_start": { left: "50%", top: "6%", x: 50, y: 6 },
    "1_A": { left: "35%", top: "18%", x: 35, y: 18 },
    "1_B": { left: "65%", top: "18%", x: 65, y: 18 },
    "2_A": { left: "20%", top: "30%", x: 20, y: 30 },
    "2_B": { left: "50%", top: "30%", x: 50, y: 30 },
    "2_C": { left: "80%", top: "30%", x: 80, y: 30 },
    "3_A": { left: "15%", top: "42%", x: 15, y: 42 },
    "3_B": { left: "38%", top: "42%", x: 38, y: 42 },
    "3_C": { left: "62%", top: "42%", x: 62, y: 42 },
    "3_D": { left: "85%", top: "42%", x: 85, y: 42 },
    "4_A": { left: "20%", top: "54%", x: 20, y: 54 },
    "4_B": { left: "50%", top: "54%", x: 50, y: 54 },
    "4_C": { left: "80%", top: "54%", x: 80, y: 54 },
    "5_A": { left: "20%", top: "66%", x: 20, y: 66 },
    "5_B": { left: "50%", top: "66%", x: 50, y: 66 },
    "5_C": { left: "80%", top: "66%", x: 80, y: 66 },
    "6_heal": { left: "35%", top: "78%", x: 35, y: 78 },
    "6_B": { left: "65%", top: "78%", x: 65, y: 78 },
    "7_boss": { left: "50%", top: "90%", x: 50, y: 90 },
  };

  // Badges lists based on story progression
  const sagaBadges = [
    { name: "Accademia", acquired: currentLevel > 1, desc: "Campanelli di Kakashi" },
    { name: "Chūnin", acquired: currentLevel > 2, desc: "Sabbia di Gaara" },
    { name: "Destino", acquired: currentLevel > 3, desc: "Valle della Fine" },
  ];

  const reachableNodeIds = getReachableNodeIds();

  return (
    <main
      className="bg-[#070b19] text-white select-none flex flex-col items-center justify-between h-screen h-[100dvh] w-screen max-h-[100dvh] overflow-hidden p-2 sm:p-3"
      style={{
        backgroundImage: `linear-gradient(rgba(7, 11, 25, 0.85), rgba(7, 11, 25, 0.85)), url('/backgrounds/homepage.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ACTIVE BATTLE SCREEN OVERLAY */}
      {isBattleActive && <BattleScreen />}
      {/* ABANDON CONFIRMATION MODAL */}
      {showAbandonConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f152d] border-4 border-red-500 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-fade-in">
            <span className="text-4xl mb-3 block">⚠️</span>
            <h3 className="text-xl font-bold text-red-400 mb-2 uppercase tracking-wider">
              {t.abandonConfirmTitle}
            </h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              {t.abandonConfirmDesc}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  endRun();
                  setShowAbandonConfirm(false);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors border-b-4 border-red-950"
              >
                {t.yesAbandon}
              </button>
              <button
                onClick={() => setShowAbandonConfirm(false)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors border border-gray-700"
              >
                {t.noCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`text-center border-b-2 sm:border-b-4 border-[#ff9f1c] w-full max-w-6xl shrink-0 relative ${isRunActive ? "mb-1 pb-1" : "mb-2 sm:mb-3 pb-1.5 sm:pb-2"}`}>
        {/* TOP LEFT CONTROLS: TROPHIES & LEADERBOARD BUTTONS */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 z-40">
          {mounted && (
            <>
              <button
                onClick={() => setShowAchievementsModal(true)}
                className="h-14 min-h-[56px] px-4 sm:px-5 flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-amber-300 bg-[#0f152d]/90 backdrop-blur-md border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title={lang === "it" ? "Trofei & Obiettivi" : "Trophies & Achievements"}
              >
                <img
                  src="/trophy.png"
                  alt="Trofei"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith("/trophy.png")) {
                      target.src = "/trophies.png";
                    } else {
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".trophy-fallback")) {
                        const span = document.createElement("span");
                        span.className = "trophy-fallback text-base";
                        span.innerText = "🏆";
                        parent.insertBefore(span, target);
                      }
                    }
                  }}
                  className="h-7 w-auto object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)] transition-transform hover:scale-110"
                />
                <span className="hidden md:inline">{lang === "it" ? "Trofei" : "Trophies"}</span>
              </button>

              <button
                onClick={() => setShowLeaderboardModal(true)}
                className="h-14 min-h-[56px] px-4 sm:px-5 flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-amber-300 bg-[#0f152d]/90 backdrop-blur-md border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title={lang === "it" ? "Classifica Globale Online" : "Global Online Leaderboard"}
              >
                <img
                  src="/leaderboard.png"
                  alt="Classifica"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith("/leaderboard.png")) {
                      target.src = "/rank.png";
                    } else {
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".leaderboard-fallback")) {
                        const span = document.createElement("span");
                        span.className = "leaderboard-fallback text-base";
                        span.innerText = "📊";
                        parent.insertBefore(span, target);
                      }
                    }
                  }}
                  className="h-7 w-auto object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)] transition-transform hover:scale-110"
                />
                <span className="hidden md:inline">{lang === "it" ? "Classifica" : "Leaderboard"}</span>
              </button>
            </>
          )}
        </div>

        {/* TOP RIGHT CONTROLS: USER PROFILE WIDGET & HAMBURGER MENU BUTTON */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 z-40">
          <UserProfileBadge
            onOpenAuthModal={() => setShowAuthModal(true)}
            onOpenProfileModal={() => setShowProfileModal(true)}
          />
          {mounted && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-14 w-14 min-h-[56px] min-w-[56px] flex items-center justify-center text-2xl text-[#ff9f1c] hover:text-yellow-300 focus:outline-none transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#0f152d]/90 backdrop-blur-md border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl shadow-2xl shrink-0"
              title="Menu"
            >
              ☰
            </button>
          )}
        </div>

        {/* HAMBURGER SIDE DRAWER */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
            />
            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-80 bg-[#0f152d] border-l-4 border-[#ff9f1c] shadow-2xl z-50 p-6 flex flex-col justify-between animate-slide-in">
              <div>
                <div className="flex justify-between items-center border-b-2 border-gray-800 pb-3 mb-6">
                  <h2 className="text-xl font-extrabold text-[#ff9f1c] tracking-wider font-mono">
                    {t.menuTitle}
                  </h2>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-400 hover:text-red-400 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Auth Section */}
                  <div className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl flex flex-col gap-3 text-left">
                    {user ? (
                      <div>
                        <div className="text-sm font-bold text-amber-300 font-mono truncate mb-3 flex items-center gap-3 bg-[#0f152d] p-2.5 rounded-xl border border-amber-500/40">
                          <img
                            src={avatarUrl || "/default_avatar.png"}
                            alt="Profile"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/default_avatar.png";
                            }}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-amber-400/80 shadow-inner"
                          />
                          <span className="truncate text-sm font-extrabold">{username || user?.user_metadata?.username || user?.email?.split("@")[0] || "Ninja"}</span>
                        </div>
                        <button
                          onClick={() => {
                            logOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 font-bold border border-red-500/20 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {t.authSignOut}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[11px] text-gray-400 mb-3">
                          {lang === "it" 
                            ? "Accedi per sincronizzare i salvataggi ed i progressi in cloud."
                            : "Sign in to synchronize your active saves and progression to the cloud."}
                        </p>
                        <button
                          onClick={() => {
                            setShowAuthModal(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full py-2 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {t.authCloudSaves}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Run Statistics Box */}
                  <div className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl text-left space-y-2">
                    <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-2">
                      📊 {t.runStatsTitle}
                    </h3>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">{t.totalRuns}:</span>
                      <span className="font-bold text-[#ff9f1c]">{totalRunsCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">{t.classicRuns}:</span>
                      <span className="font-bold text-green-400">{classicRunsCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">{t.shippudenRuns}:</span>
                      <span className="font-bold text-blue-400">{shippudenRunsCount}</span>
                    </div>
                  </div>

                  {/* Settings Item: Language */}
                  <div className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl text-left">
                    <h3 className="text-xs text-[#ff9f1c]/90 uppercase font-mono font-bold tracking-widest mb-3">
                      ⚙️ {t.menuSettings}
                    </h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-300">
                        {lang === "it" ? "Lingua Gioco" : "Game Language"}
                      </span>
                      <button 
                        onClick={() => setLanguage(lang === "it" ? "en" : "it")}
                        className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-[#ff9f1c] font-extrabold rounded border border-[#ff9f1c]/30 uppercase tracking-widest transition-all cursor-pointer"
                      >
                        🌐 {lang === "it" ? "IT" : "EN"}
                      </button>
                    </div>
                  </div>

                  {/* Credits Link */}
                  <button
                    onClick={() => {
                      setShowCreditsModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-gray-300 font-bold transition-all cursor-pointer"
                  >
                    <span>🍥 {t.menuCredits}</span>
                    <span className="text-[#ff9f1c]">➔</span>
                  </button>

                  {/* Patch Notes Link */}
                  <button
                    onClick={() => {
                      setShowPatchNotesModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-gray-300 font-bold transition-all cursor-pointer"
                  >
                    <span>📜 {t.menuPatchNotes}</span>
                    <span className="text-[#ff9f1c]">➔</span>
                  </button>

                  {/* Chakra Chart Link */}
                  <button
                    onClick={() => {
                      setShowChakraChartModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-gray-300 font-bold transition-all cursor-pointer"
                  >
                    <span>📜 {lang === "it" ? "Wiki Shinobi & Guida" : "Shinobi Wiki & Guide"}</span>
                    <span className="text-[#ff9f1c]">➔</span>
                  </button>

                </div>
              </div>

              {/* Version Footer */}
              <div className="text-center text-[10px] text-gray-600 font-mono border-t border-gray-850 pt-4">
                NarutoLike v1.1.0 © 2026
              </div>
            </div>
          </>
        )}



        <div className="flex items-center justify-center">
          <img
            src="/logo.png"
            alt="NarutoLike"
            onError={(e) => {
              // Fallback to stylized text if logo image is not yet placed in public/
              (e.target as HTMLElement).style.display = "none";
              const parent = (e.target as HTMLElement).parentElement;
              if (parent && !parent.querySelector(".logo-fallback")) {
                const fallback = document.createElement("h1");
                fallback.className = `logo-fallback font-extrabold text-[#ff9f1c] tracking-widest drop-shadow-md uppercase ${isRunActive ? "text-2xl sm:text-3xl md:text-4xl" : "text-3xl sm:text-4xl md:text-5xl"}`;
                fallback.innerText = "NARUTOLIKE";
                parent.appendChild(fallback);
              }
            }}
            className={`object-contain transition-all drop-shadow-[0_0_25px_rgba(255,159,28,0.6)] ${
              isRunActive ? "h-10 sm:h-12 md:h-14" : "h-14 sm:h-18 md:h-20"
            }`}
          />
        </div>
        {!isRunActive && (
          <p className="text-gray-400 mt-0.5 sm:mt-1 text-xs sm:text-sm tracking-wide">
            {t.subtitle}
          </p>
        )}
      </header>

      {/* GAME VIEW STATE MACHINE */}
      {!isRunActive ? (
        !activeSagaId ? (
          /* ==================== SAGA MODE SELECTION VIEW ==================== */
          <div className="max-w-4xl w-full flex-1 min-h-0 flex flex-col justify-center animate-fade-in py-1 sm:py-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#ff9f1c] border-b-2 border-gray-800 pb-2 mb-3 text-center uppercase tracking-wider shrink-0">
              {t.selectSaga}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 max-h-[460px] py-1">
              {/* UNLOCKED SAGA */}
              <div
                onClick={() => selectSaga("classic_naruto")}
                className="relative bg-[#0f152d] border-4 border-[#ff9f1c] hover:border-yellow-400 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all flex flex-col justify-end shadow-2xl h-full min-h-[220px] max-h-[420px] overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 21, 45, 0.1), rgba(15, 21, 45, 0.95)), url('/backgrounds/classic_naruto.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Status & Run Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <span className="bg-[#070b19]/90 text-[#ff9f1c] text-[10px] px-2 py-1 rounded font-bold font-mono border border-[#ff9f1c]/30 shadow-md flex items-center gap-1.5">
                    <img
                      src="/run.png"
                      alt="Run"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.endsWith("/run.png")) {
                          target.src = "/icon.png";
                        } else {
                          target.style.display = "none";
                        }
                      }}
                      className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{t.totalRuns}: {mounted ? classicRunsCount : 0}</span>
                  </span>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-bold shadow-md border border-green-500/30">{t.active}</span>
                </div>

                {/* Description and button below */}
                <div className="p-4 sm:p-5 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-12 sm:pt-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#ff9f1c] mb-1.5 drop-shadow-md">{t.sagaClassicTitle}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 drop-shadow pb-1">
                    {t.sagaClassicDesc}
                  </p>
                  <button className="w-full py-2.5 sm:py-3 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs sm:text-sm transition-all border-b-4 border-amber-700">
                    {t.startClassicButton}
                  </button>
                </div>
              </div>

              {/* SHIPPUDEN SAGA CHOICE */}
              <div
                onClick={isShippudenUnlocked ? () => selectSaga("shippuden_naruto") : undefined}
                className={`relative bg-[#0f152d] border-4 rounded-2xl flex flex-col justify-end h-full min-h-[220px] max-h-[420px] overflow-hidden shadow-2xl transition-all ${
                  isShippudenUnlocked 
                    ? "border-[#ff9f1c] hover:border-yellow-400 cursor-pointer hover:scale-[1.01]" 
                    : "border-amber-900/60 cursor-not-allowed"
                }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 21, 45, 0.1), rgba(15, 21, 45, 0.95)), url('/backgrounds/shippuden_naruto.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Status & Run Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <span className="bg-[#070b19]/90 text-[#ff9f1c] text-[10px] px-2 py-1 rounded font-bold font-mono border border-[#ff9f1c]/30 shadow-md flex items-center gap-1.5">
                    <img
                      src="/run.png"
                      alt="Run"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.endsWith("/run.png")) {
                          target.src = "/icon.png";
                        } else {
                          target.style.display = "none";
                        }
                      }}
                      className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{t.totalRuns}: {mounted ? shippudenRunsCount : 0}</span>
                  </span>
                  {isShippudenUnlocked ? (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-bold shadow-md border border-green-500/30">{t.unlocked}</span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded font-bold shadow-md border border-red-500/30">{t.locked}</span>
                  )}
                </div>

                {/* Description and button below */}
                <div className="p-4 sm:p-5 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-12 sm:pt-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#ff9f1c] mb-1.5 drop-shadow-md">{t.sagaShippudenTitle}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 drop-shadow pb-1">
                    {t.sagaShippudenDesc}
                  </p>
                  <button 
                    disabled={!isShippudenUnlocked}
                    className={`w-full py-2.5 sm:py-3 font-bold rounded-lg uppercase tracking-wider text-xs sm:text-sm transition-all ${
                      isShippudenUnlocked 
                        ? "bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] border-b-4 border-amber-700 cursor-pointer" 
                        : "bg-gray-800/80 text-gray-400 border border-gray-700 cursor-not-allowed"
                    }`}
                  >
                    {isShippudenUnlocked ? t.startShippudenButton : t.lockMessageClassicButton}
                  </button>
                </div>

                {/* OVERLAY CATENE 3D E SIGILLO UZUMAKI SE BLOCCATO */}
                {!isShippudenUnlocked && (
                  <SealedSagaOverlay
                    sagaName="NARUTO SHIPPUDEN"
                    requirementText={t.lockMessageClassic}
                    onClickLocked={() => {
                      setToastMessage(lang === "it" ? "🔒 Completa Naruto Classic per spezzare il sigillo!" : "🔒 Complete Naruto Classic to break the seal!");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (!startingChoices || startingChoices.length === 0) ? (
          /* Fallback if starting choices not generated */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-10">
            <p className="text-gray-300 text-sm">{lang === "it" ? "Seleziona una saga per iniziare la partita." : "Select a saga to start the game."}</p>
            <button
              onClick={() => selectSaga(null)}
              className="px-6 py-3 bg-[#ff9f1c] hover:bg-yellow-400 text-[#070b19] font-extrabold rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all border-b-4 border-amber-700"
            >
              {t.backToSagas}
            </button>
          </div>
        ) : (
          /* ==================== STARTING CHARACTER CHOICE VIEW ==================== */
          <div className="max-w-5xl w-full flex-1 min-h-0 flex flex-col justify-between animate-fade-in text-center py-1 sm:py-2 px-1">
            <div className="shrink-0 mb-1 flex items-center justify-between">
              <button
                onClick={() => selectSaga(null)}
                className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-[#ff9f1c] font-bold rounded border-2 border-gray-700 transition-colors text-xs"
              >
                {t.backToSagas}
              </button>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-mono">
                {t.activeSaga}: {activeSagaId === "classic_naruto" ? t.sagaClassicName : t.sagaShippudenName} • {t.runCountLabel} #{(activeSagaId === "classic_naruto" ? classicRunsCount : shippudenRunsCount) + 1}
              </div>
            </div>

            <div className="shrink-0 space-y-1 my-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#ff9f1c] uppercase tracking-wider">{t.chooseStarterTitle}</h2>
              <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm line-clamp-2">
                {t.chooseStarterDesc}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => setShowChakraChartModal(true)}
                  className="bg-[#070b19]/90 border border-[#ff9f1c]/50 hover:border-[#ff9f1c] text-[#ff9f1c] hover:text-yellow-300 rounded-lg py-1 px-3.5 text-xs font-mono font-bold shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  📜 {lang === "it" ? "Wiki Shinobi (Tipi Chakra & Probabilità Rank)" : "Shinobi Wiki (Chakra & Drop Rates)"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-1 min-h-0 py-1 my-auto max-h-[480px]">
              {startingChoices?.map((ninja) => {
                const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                const translatedVersion = t[ninja.version as keyof typeof t] || ninja.version;
                const rarity = RARITY_CONFIGS[ninja.rank || "C"];

                return (
                  <div
                    key={ninja.id}
                    onClick={() => selectStartingCharacter(ninja.id)}
                    style={rarity.cardStyle}
                    className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between h-full min-h-0 ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow}`}
                  >
                    {/* Rank Badge */}
                    <span className={`absolute top-3 right-3 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full ${rarity.badgeBg} ${rarity.badgeTextColor} shadow-md uppercase tracking-wider z-10`}>
                      {rarity.rankSymbol}
                    </span>

                    <div className="flex flex-col items-center flex-1 justify-center min-h-0">
                      <NinjaAvatar
                        src={ninja.sprite}
                        name={translatedName}
                        rank={ninja.rank}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-black/30 rounded-xl sm:rounded-2xl border-2 border-white/10 p-1 mb-1 mt-1 shadow-inner shrink-0"
                      />
                      <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-0.5 ${rarity.textColor}`}>{translatedName}</h3>
                      
                      <div className="flex items-center gap-1.5 mb-2 shrink-0">
                        <ChakraNatureBadge nature={ninja.chakraNature} />
                        <span className="text-[10px] bg-gray-900/80 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                          {translatedVersion}
                        </span>
                      </div>

                      {/* STATS OVERVIEW */}
                      <div className="w-full text-[10px] sm:text-xs text-gray-300 border-t border-gray-800/80 pt-1.5 space-y-1">
                        <div className="flex justify-between font-mono">
                          <span>{t.statHp}</span>
                          <span className="font-bold text-green-400">{ninja.baseStats.hp}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>{t.statChakra}</span>
                          <span className="font-bold text-blue-400">{ninja.baseStats.chakra}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>{t.statAttack}</span>
                          <span className="font-bold text-red-400">{ninja.baseStats.attack}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>{t.statDefense}</span>
                          <span className="font-bold text-amber-400">{ninja.baseStats.defense}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span>{t.statSpeed}</span>
                          <span className="font-bold text-purple-400">{ninja.baseStats.speed}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-2 sm:mt-3 py-2 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 shadow-md shrink-0">
                      {t.chooseShinobi}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        /* ==================== POKEROGUE-STYLE ACTIVE RUN VIEW ==================== */
        <div className="flex-1 min-h-0 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">

          {/* LEFT SIDEBAR: TEAM */}
          <aside className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-2xl p-3 shadow-xl flex flex-col gap-2 h-full min-h-0">
            <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 text-[#ff9f1c] uppercase tracking-wider shrink-0">
              {t.team} ({runTeam.length} / 6)
            </h2>

            {/* ACTIVE TEAM SYNERGIES */}
            {(() => {
              const activeSyns = getActiveSynergies(runTeam);
              if (activeSyns.length === 0) return null;
              return (
                <div className="bg-[#070b19]/90 border border-amber-500/30 p-2 rounded-xl shrink-0 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center justify-between">
                    <span>🌀 {lang === "it" ? "Sinergie Attive" : "Active Synergies"}</span>
                    <span className="text-emerald-400">+{activeSyns.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSyns.map((syn) => (
                      <div
                        key={syn.id}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${syn.colorClass} ${syn.borderClass}`}
                        title={syn.description[lang]}
                      >
                        <span>{syn.icon}</span>
                        <span>{syn.name[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {runTeam.map((ninja, index) => {
                const hpPercent = (ninja.currentHp / ninja.baseStats.hp) * 100;
                const chakraPercent = (ninja.currentChakra / ninja.baseStats.chakra) * 100;
                const isDefeated = ninja.currentHp <= 0;

                const currentIndex = ninja.jutsuList.indexOf(ninja.activeJutsuId);
                const isMax = currentIndex >= ninja.jutsuList.length - 1;
                const canUpgrade = pendingJutsuToLearn && !isMax && !isDefeated;
                const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                const rarity = RARITY_CONFIGS[ninja.rank || "C"];

                return (
                  <div
                    key={ninja.id}
                    onClick={() => {
                      if (canUpgrade) {
                        learnJutsu(ninja.id);
                      }
                    }}
                    style={!isDefeated && !canUpgrade ? rarity.cardStyle : undefined}
                    className={`p-3 rounded-xl transition-all ${isDefeated
                        ? "border-2 border-red-900 opacity-40 bg-[#070b19]"
                        : canUpgrade
                          ? "border-2 border-green-500 cursor-pointer hover:border-green-400 hover:scale-[1.02] shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse bg-[#070b19]"
                          : `${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow}`
                      }`}
                  >
                    <div className="flex gap-2 items-center mb-1.5">
                      {/* Position Turn Order Badge */}
                      <span className="text-xs font-black font-mono text-[#ff9f1c] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 shrink-0">
                        #{index + 1}
                      </span>

                      <NinjaAvatar
                        src={ninja.sprite}
                        name={translatedName}
                        rank={ninja.rank}
                        className="w-11 h-11 object-contain bg-black/30 rounded border border-white/10 p-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className={`text-xs sm:text-sm font-extrabold truncate ${rarity.textColor}`}>{translatedName}</div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${rarity.badgeBg} ${rarity.badgeTextColor} shrink-0`}>
                            {rarity.rankSymbol}
                          </span>
                        </div>
                        <div className="text-xs text-[#ff9f1c] font-semibold font-mono flex items-center justify-between mt-0.5">
                          <div className="flex items-center gap-1.5">
                            <span>Lv. {ninja.level}</span>
                            <ChakraNatureBadge nature={ninja.chakraNature} showText={false} />
                          </div>
                          {pendingJutsuToLearn && (
                            isMax ? (
                              <span className="text-red-400 font-extrabold text-xs">{t.maxTech}</span>
                            ) : (
                              <span className="text-green-400 font-extrabold text-xs animate-pulse">{t.useScroll}</span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Reorder Team Turn Order Controls */}
                      {runTeam.length > 1 && (
                        <div className="flex flex-col gap-0.5 ml-0.5 shrink-0">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLeaderNinja(index);
                                showToast(lang === "it" ? "Ninja impostato come Leader 👑!" : "Ninja set as Team Leader 👑!");
                              }}
                              className="w-5 h-4 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded flex items-center justify-center transition-all cursor-pointer border border-amber-500/40 active:scale-95 mb-0.5"
                              title={lang === "it" ? "Imposta come Primo Ninja (Frontliner 👑)" : "Set as Team Leader (Slot 1 👑)"}
                            >
                              👑
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveNinjaUp(index);
                            }}
                            className="w-5 h-4 text-[10px] font-bold bg-black/50 hover:bg-black/80 text-amber-300 rounded flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer border border-white/10 active:scale-95"
                            title={lang === "it" ? "Sposta in alto (Ordine Turno)" : "Move Up (Turn Order)"}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === runTeam.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveNinjaDown(index);
                            }}
                            className="w-5 h-4 text-[10px] font-bold bg-black/50 hover:bg-black/80 text-amber-300 rounded flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer border border-white/10 active:scale-95"
                            title={lang === "it" ? "Sposta in basso (Ordine Turno)" : "Move Down (Turn Order)"}
                          >
                            ▼
                          </button>
                        </div>
                      )}
                    </div>

                    {/* HP BAR */}
                    <div className="mb-1.5">
                      <div className="flex justify-between text-xs text-gray-200 font-bold font-mono mb-0.5">
                        <span className="text-gray-400">HP</span>
                        <span>{ninja.currentHp} / {ninja.baseStats.hp}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2.5 rounded-sm overflow-hidden border border-gray-700">
                        <div
                          className={`h-full transition-all duration-300 ${hpPercent > 50 ? "bg-green-500" : hpPercent > 20 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* CHAKRA BAR */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-200 font-bold font-mono mb-0.5">
                        <span className="text-gray-400">CHAKRA</span>
                        <span>{ninja.currentChakra} / {ninja.baseStats.chakra}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2.5 rounded-sm overflow-hidden border border-gray-700">
                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${chakraPercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowAbandonConfirm(true)}
              className="w-full py-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 font-bold border-2 border-red-500/20 rounded-lg text-xs uppercase tracking-wider transition-colors mt-2"
            >
              {t.abandonRun}
            </button>
          </aside>

          {/* MIDDLE COLUMN: POKEROGUE MAP */}
          <div className="lg:col-span-2 flex flex-col items-center h-full min-h-0 relative w-full">
            {/* THE RETRO MAP CONTAINER */}
            <div className="flex-1 w-full max-w-[650px] bg-[#3a5a40] border-4 border-[#ff9f1c] rounded-2xl relative overflow-hidden shadow-2xl flex flex-col min-h-0">

              {/* QUICK AUTO-ADVANCE MAP BUTTON */}
              {(() => {
                const selectable = activeMap.filter((n) => isNodeSelectable(n));
                if (selectable.length === 0) return null;
                const targetNode = selectable[0];
                const targetLabel = translateNodeLabel(targetNode.label, lang);

                return (
                  <button
                    onClick={() => selectNode(targetNode.id)}
                    className="absolute top-2 right-10 z-20 bg-[#ff9f1c] hover:bg-yellow-400 text-[#070b19] font-extrabold px-3 py-1 rounded-lg text-xs uppercase tracking-wider shadow-xl border border-yellow-300 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 font-mono"
                    title={lang === "it" ? "Avanza al prossimo nodo (Spazio/Invio)" : "Advance to next node (Spacebar/Enter)"}
                  >
                    <span>⚡ {lang === "it" ? "Prossimo" : "Next"}: {targetLabel}</span>
                    <span className="text-[10px] bg-black/20 px-1 rounded text-[#070b19]">↵</span>
                  </button>
                );
              })()}

              {/* TREE BORDERS */}
              <div className="absolute inset-y-0 left-0 w-8 bg-[repeating-linear-gradient(#2d6a4f,#2d6a4f_20px,#1b4332_20px,#1b4332_40px)] flex flex-col justify-around text-center select-none text-xs border-r border-[#ff9f1c]/10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="filter grayscale opacity-25">🌲</span>
                ))}
              </div>
              <div className="absolute inset-y-0 right-0 w-8 bg-[repeating-linear-gradient(#2d6a4f,#2d6a4f_20px,#1b4332_20px,#1b4332_40px)] flex flex-col justify-around text-center select-none text-xs border-l border-[#ff9f1c]/10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="filter grayscale opacity-25">🌲</span>
                ))}
              </div>

              {/* VERTICAL MAP PATHS (SVG lines drawn dynamically) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {activeMap.map((node) => {
                  const pos1 = nodePositions[node.id];
                  if (!pos1) return null;

                  return node.connections.map((connId) => {
                    const childNode = activeMap.find((n) => n.id === connId);
                    if (!childNode) return null;

                    const pos2 = nodePositions[childNode.id];
                    if (!pos2) return null;

                    const isVisited = (node.resolved || node.id === currentNodeId) &&
                      (childNode.resolved || childNode.id === currentNodeId);
                    const isLineReachable = reachableNodeIds.has(node.id) && reachableNodeIds.has(childNode.id);

                    return (
                      <line
                        key={`${node.id}-${childNode.id}`}
                        x1={pos1.left}
                        y1={pos1.top}
                        x2={pos2.left}
                        y2={pos2.top}
                        stroke={isVisited ? "#ff9f1c" : "#070b19"}
                        strokeWidth={isVisited ? "4" : "3"}
                        strokeDasharray={isVisited ? undefined : "5 5"}
                        opacity={isVisited ? "1" : isLineReachable ? "0.6" : "0.1"}
                        className="transition-all duration-500"
                      />
                    );
                  });
                })}
              </svg>

              {/* INTERACTIVE NODES */}
              {activeMap.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const selectable = isNodeSelectable(node);
                const isCurrent = node.id === currentNodeId;
                const isReachable = reachableNodeIds.has(node.id);

                let statusClass = "border-gray-800 bg-gray-900/60 text-gray-500 opacity-60";
                let disabledClass = "cursor-not-allowed pointer-events-none";

                if (node.resolved) {
                  statusClass = "border-[#ff9f1c] bg-[#ff9f1c]/10 text-[#ff9f1c] shadow-[0_0_10px_rgba(255,159,28,0.4)]";
                  disabledClass = "cursor-default pointer-events-none";
                } else if (selectable) {
                  const isPositiveNode = node.type === "recruit" || node.type === "powerup" || node.type === "heal";
                  statusClass = isPositiveNode
                    ? "border-green-500 bg-green-950/40 text-green-400 hover:bg-green-900/30 hover:scale-110 shadow-[0_0_12px_rgba(34,197,94,0.4)] animate-pulse"
                    : "border-red-500 bg-red-950/40 text-red-400 hover:bg-red-900/30 hover:scale-110 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse";
                  disabledClass = "cursor-pointer";
                } else if (isCurrent) {
                  statusClass = "border-orange-500 bg-[#ff9f1c]/25 text-orange-400 font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.6)]";
                  disabledClass = "cursor-default pointer-events-none";
                }

                let iconSymbol = "⚔️";
                const customLabel = translateNodeLabel(node.label, lang);

                // Opponents and first enemy Chakra Nature information for battle/boss nodes
                const oppNinjas = (node.opponents || [])
                  .map((id) => NINJA_MAP.get(id))
                  .filter((n): n is Ninja => n !== undefined);
                const firstOppNinja = oppNinjas[0];

                const oppDetails = oppNinjas
                  .map((n) => `${translateNinjaName(n.id, n.name, lang)} (${CHAKRA_NATURE_CONFIGS[n.chakraNature]?.name[lang] || n.chakraNature})`)
                  .join(" | ");

                const fullTooltip = oppDetails
                  ? `${customLabel} - ${lang === "it" ? "Nemici" : "Enemies"}: ${oppDetails}`
                  : customLabel;

                return (
                  <div
                    key={node.id}
                    onClick={() => selectable && selectNode(node.id)}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all ${statusClass} ${disabledClass}`}
                    title={isReachable ? fullTooltip : `${fullTooltip} (${lang === "it" ? "Non Raggiungibile" : "Unreachable"})`}
                  >
                    {node.type === "powerup" && (
                      <img
                        src="/sprites/jutsus/Scrolls.png"
                        alt="Tecnica"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    {node.type === "recruit" && (
                      <img
                        src="/academy.png"
                        alt="Recluta"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    {node.type === "heal" && (
                      <img
                        src="/ramen.png"
                        alt="Ramen"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    {(node.type === "battle" || node.type === "boss") && (() => {
                      const oppId = node.opponents?.[0];
                      const oppNinja = oppId ? NINJA_MAP.get(oppId) : null;
                      if (oppNinja) {
                        const translatedName = translateNinjaName(oppNinja.id, oppNinja.name, lang);
                        return (
                          <img
                            src={oppNinja.sprite}
                            alt={translatedName}
                            className="w-full h-full object-contain rounded-full bg-gray-950 p-0.5"
                          />
                        );
                      }
                      return iconSymbol;
                    })()}
                    {node.type !== "powerup" && node.type !== "recruit" && node.type !== "heal" && node.type !== "battle" && node.type !== "boss" && iconSymbol}

                    {/* FIRST ENEMY CHAKRA NATURE BADGE OVERLAY */}
                    {(node.type === "battle" || node.type === "boss") && firstOppNinja && (
                      <div className="absolute -bottom-1 -right-1 z-20 pointer-events-none bg-black/80 p-0.5 rounded-full border border-yellow-500/50 shadow-lg">
                        <ChakraNatureBadge
                          nature={firstOppNinja.chakraNature}
                          showText={false}
                          className="scale-110"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* START INDICATOR (TOP) */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] bg-[#ff9f1c] text-[#070b19] px-2 py-0.5 rounded font-bold font-mono">
                START
              </div>

              {/* BOSS INDICATOR (BOTTOM) */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] bg-red-650 text-white px-2 py-0.5 rounded font-bold font-mono">
                BOSS
              </div>

              {/* ==================== OVERLAYS INSIDE MAP ==================== */}

              {/* OVERLAY: JUTSU LEARN TARGET SELECTOR */}
              {pendingJutsuToLearn && (
                <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-5 text-center animate-fade-in">
                  <div className="bg-green-950/40 border-4 border-green-500 rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-pulse">
                    <h3 className="text-xl font-bold text-green-400 mb-2 uppercase tracking-wider">
                      {lang === "it" ? "ROTOLO PROIBITO ATTIVO" : "ACTIVE FORBIDDEN SCROLL"} ⚡
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {lang === "it" ? "Seleziona il ninja direttamente dalla tua squadra a sinistra per potenziarne la mossa ed avanzare." : "Select the ninja directly from your team on the left to upgrade their move and advance."}
                    </p>
                  </div>
                </div>
              )}

              {/* OVERLAY: NINJA RECRUIT CHOICE PANEL */}
              {availableRecruitChoices && (
                <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-5 animate-fade-in overflow-y-auto">
                  <div className="bg-[#0f152d] border-4 border-green-500 rounded-2xl p-5 shadow-2xl w-full max-w-md my-auto">
                    {pendingRecruitId ? (
                      <div>
                        <h3 className="text-lg font-bold text-green-400 mb-1 uppercase tracking-wider">
                          {lang === "it" ? "SOSTITUISCI UN MEMBRO" : "REPLACE A MEMBER"}
                        </h3>
                        <p className="text-[11px] text-gray-400 mb-4">
                          {lang === "it" ? "Squadra al completo (6/6). Seleziona chi congedare per far posto al nuovo ninja." : "Team is full (6/6). Select who to dismiss to make room for the new ninja."}
                        </p>
                        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto mb-4 pr-1">
                          {runTeam.map((ninja) => {
                            const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                            const rarity = RARITY_CONFIGS[ninja.rank || "C"];
                            return (
                              <button
                                key={ninja.id}
                                onClick={() => {
                                  chooseRecruit(pendingRecruitId, ninja.id);
                                  setPendingRecruitId(null);
                                }}
                                style={rarity.cardStyle}
                                className={`flex justify-between items-center ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow} rounded-xl p-2.5 text-left transition-all w-full cursor-pointer hover:scale-[1.01] shadow-md`}
                              >
                                <div className="flex gap-2.5 items-center">
                                  <NinjaAvatar
                                    src={ninja.sprite}
                                    name={translatedName}
                                    rank={ninja.rank}
                                    className="w-9 h-9 object-contain bg-black/30 rounded border border-white/10 p-0.5 shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h4 className={`font-bold text-xs truncate ${rarity.textColor}`}>{translatedName}</h4>
                                      <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${rarity.badgeBg} ${rarity.badgeTextColor} shrink-0`}>
                                        {rarity.rankSymbol}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-mono">Lv. {ninja.level} • HP {ninja.baseStats.hp}</p>
                                  </div>
                                </div>
                                <span className="text-red-400 font-bold text-xs uppercase tracking-wider hover:text-red-300 bg-red-950/60 border border-red-500/30 px-2 py-1 rounded">
                                  {lang === "it" ? "Congeda" : "Dismiss"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setPendingRecruitId(null)}
                          className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded text-xs uppercase tracking-wider border border-gray-750 transition-colors"
                        >
                          {t.noCancel}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-green-400 mb-1 uppercase tracking-wider">
                          {lang === "it" ? "RECLUTA UN NUOVO NINJA" : "RECRUIT A NEW NINJA"}
                        </h3>
                        <p className="text-[11px] text-gray-400 mb-4">
                          {lang === "it" ? "Scegli 1 ninja da aggiungere alla tua squadra" : "Choose 1 ninja to add to your team"} (Lv. {runTeam[0]?.level || 5}).
                        </p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {availableRecruitChoices.map((ninja) => {
                            const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                            const rarity = RARITY_CONFIGS[ninja.rank || "C"];
                            return (
                              <div
                                key={ninja.id}
                                onClick={() => {
                                  if (runTeam.length >= 6) {
                                    setPendingRecruitId(ninja.id);
                                  } else {
                                    chooseRecruit(ninja.id);
                                  }
                                }}
                                style={rarity.cardStyle}
                                className={`relative p-2.5 rounded-xl cursor-pointer transition-all hover:scale-105 flex flex-col justify-between ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow}`}
                              >
                                <span className={`absolute top-1 right-1 text-[8px] px-1.5 py-0.2 rounded-full ${rarity.badgeBg} ${rarity.badgeTextColor}`}>
                                  {rarity.rankSymbol}
                                </span>
                                <NinjaAvatar
                                  src={ninja.sprite}
                                  name={translatedName}
                                  rank={ninja.rank}
                                  className="w-12 h-12 object-contain mx-auto mb-1 mt-2 bg-black/30 rounded p-1 border border-white/10"
                                />
                                <h4 className={`font-bold text-[10px] truncate text-center ${rarity.textColor}`}>{translatedName}</h4>
                                <div className="flex justify-center my-1">
                                  <ChakraNatureBadge nature={ninja.chakraNature} showText={false} />
                                </div>
                                <div className="text-[8px] text-gray-300 font-mono grid grid-cols-2 gap-1 bg-black/40 p-1 rounded text-center border border-white/10">
                                  <div>HP: {ninja.baseStats.hp}</div>
                                  <div>ATK: {ninja.baseStats.attack}</div>
                                  <div>DEF: {ninja.baseStats.defense}</div>
                                  <div>SPD: {ninja.baseStats.speed}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {runTeam.length >= 6 && (
                          <button
                            onClick={() => {
                              skipRecruit();
                              setPendingRecruitId(null);
                            }}
                            className="w-full py-2.5 bg-[#070b19] hover:bg-gray-900 text-yellow-400 font-bold rounded-xl text-xs uppercase tracking-wider border-2 border-yellow-500/50 hover:border-yellow-400 transition-all cursor-pointer shadow-md"
                          >
                            ⚡ {lang === "it" ? "Salta Reclutamento (Mantieni Squadra Attuale)" : "Skip Recruitment (Keep Current Team)"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OVERLAY: CAMPFIRE HEALING ACTION */}
              {currentNode && currentNode.type === "heal" && !currentNode.resolved && (
                <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-5 animate-fade-in">
                  <div className="bg-[#0f152d] border-4 border-green-500 rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center">
                    <img src="/ramen.png" alt="Ramen" className="w-16 h-16 object-contain mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-green-400 mb-2 uppercase tracking-wider">
                      {lang === "it" ? "RAMEN ICHIRAKU" : "ICHIRAKU RAMEN"} 🍜
                    </h3>
                    <p className="text-xs text-gray-300 mb-5 leading-relaxed">
                      {t.actionReadyCampfire}
                    </p>
                    <button
                      onClick={applyHealingAtCampfire}
                      className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow transition-all uppercase tracking-wider text-sm border-b-4 border-green-950"
                    >
                      {t.actionCampfireBtn}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDEBAR: ITEMS & BADGES */}
          <aside className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-2xl p-3 shadow-xl flex flex-col gap-4 h-full min-h-0">
            {/* POTENZIAMENTI BOX */}
            <div className="flex-1 min-h-0 flex flex-col">
              <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 text-[#ff9f1c] uppercase tracking-wider mb-2 shrink-0">
                {lang === "it" ? "POTENZIAMENTI" : "POWER-UPS"}
              </h2>
              <div className="flex-1 overflow-y-auto pr-1">
                {activePowerUps.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {activePowerUps.map((p, idx) => {
                      const targetNinja = runTeam.find((n) => n.id === p.usedOnNinjaId);
                      const oldJutsu = p.oldJutsuId ? JUTSU_MAP.get(p.oldJutsuId) : null;
                      const newJutsu = p.newJutsuId ? JUTSU_MAP.get(p.newJutsuId) : null;

                      const pName = p.id === "jutsu_upgrade" ? t.powerupForbiddenScroll : p.name;
                      const pDesc = p.id === "jutsu_upgrade" ? t.powerupForbiddenScrollDesc : p.description;
                      const targetName = targetNinja ? translateNinjaName(targetNinja.id, targetNinja.name, lang) : (lang === "it" ? "Squadra" : "Team");

                      return (
                        <div
                          key={idx}
                          className="bg-[#070b19] p-2.5 rounded-xl border border-gray-800 flex items-center gap-3 hover:border-green-500/40 transition-colors"
                          title={pDesc}
                        >
                          {targetNinja && (
                            <img
                              src={targetNinja.sprite}
                              alt={targetName}
                              className="w-12 h-12 object-contain bg-gray-900 rounded-lg p-1 border border-gray-800 shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-green-400 truncate text-sm">{pName}</div>
                            <p className="text-xs text-gray-400 font-semibold truncate leading-normal">{targetName}</p>
                            {oldJutsu && newJutsu && (
                              <div className="text-[10px] text-gray-500 leading-none flex items-center gap-1 mt-0.5">
                                <span className="line-through truncate max-w-[85px] cursor-help" title={`Mossa Precedente: ${JUTSU_TRANSLATIONS[oldJutsu.id]?.name[lang] || oldJutsu.name}`}>{JUTSU_TRANSLATIONS[oldJutsu.id]?.name[lang] || oldJutsu.name}</span>
                                <span className="text-gray-600">→</span>
                                <span className="text-green-300 font-bold truncate max-w-[95px] cursor-help" title={`Mossa Potenziata: ${JUTSU_TRANSLATIONS[newJutsu.id]?.name[lang] || newJutsu.name}`}>{JUTSU_TRANSLATIONS[newJutsu.id]?.name[lang] || newJutsu.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">{lang === "it" ? "Nessun potenziamento attivo" : "No active power-ups"}</p>
                )}
              </div>
            </div>

            {/* BOSS SCONFITTI BOX */}
            <div className="shrink-0">
              <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 text-[#ff9f1c] uppercase tracking-wider mb-2">
                {lang === "it" ? "BOSS SCONFITTI" : "DEFEATED BOSSES"}
              </h2>
              <div className="grid grid-cols-5 gap-1.5">
                {(() => {
                  const sagaBosses = activeSagaId === "classic_naruto" ? [
                    { id: "mizuki", name: "Mizuki" },
                    { id: "haku", name: "Haku" },
                    { id: "zabuza", name: "Zabuza" },
                    { id: "orochimaru_shippuden", name: "Orochimaru" },
                    { id: "gaara_kid", name: "Gaara" },
                  ] : [
                    { id: "deidara_boss", name: "Deidara" },
                    { id: "hidan_boss", name: "Hidan" },
                    { id: "itachi_shippuden", name: "Itachi" },
                    { id: "kisame_shippuden", name: "Kisame" },
                    { id: "pain_boss", name: "Pain" },
                    { id: "kabuto_shippuden", name: "Kabuto" },
                    { id: "obito_boss", name: "Tobi" },
                    { id: "madara_boss", name: "Madara" },
                    { id: "obito_tt", name: "Obito 10T" },
                    { id: "madara_tt", name: "Madara 10T" },
                  ];

                  return (
                    <div className="flex justify-around items-center gap-1 w-full py-1">
                      {sagaBosses.map((boss) => {
                        const isDefeated = defeatedBosses.includes(boss.id);
                        const bossDisplayName = boss.name;
                        const tooltipText = isDefeated
                          ? (lang === "it" ? `Sconfitto: ${bossDisplayName}` : `Defeated: ${bossDisplayName}`)
                          : (lang === "it" ? `Boss da sconfiggere: ${bossDisplayName}` : `Boss to defeat: ${bossDisplayName}`);

                        return (
                          <div key={boss.id} className="flex flex-col items-center gap-1">
                            <div
                              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-md ${isDefeated
                                ? "border-green-500 bg-green-500/10"
                                : "border-dashed border-gray-700 bg-gray-950/40 text-gray-500"
                                }`}
                              title={tooltipText}
                            >
                              {isDefeated ? (
                                <img
                                  src={`/bosses/${boss.id}.png`}
                                  onError={(e) => {
                                    const opp = NINJA_MAP.get(boss.id);
                                    if (opp) {
                                      e.currentTarget.src = opp.sprite;
                                    }
                                  }}
                                  alt={bossDisplayName}
                                  className="w-full h-full object-cover rounded-full absolute inset-0 bg-gray-950 p-0.5"
                                />
                              ) : (
                                <span className="text-xs font-mono font-bold">?</span>
                              )}
                            </div>
                            <span className="text-[7px] text-gray-400 truncate max-w-[44px] text-center font-semibold">{bossDisplayName}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </aside>

        </div>
      )}

      {!isRunActive && (
        <footer className="w-full max-w-4xl text-center py-1.5 sm:py-2 shrink-0 border-t border-gray-800/40 text-[10px] text-gray-500 space-y-1">
          <div>
            <button 
              onClick={() => setShowPrivacyModal(true)} 
              className="underline hover:text-[#ff9f1c] font-semibold transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
          <p className="max-w-2xl mx-auto leading-normal px-2 text-[9px] sm:text-[10px] line-clamp-2">
            {lang === "it"
              ? "Progetto amatoriale (Fan-made). Non affiliato, approvato o sponsorizzato da Masashi Kishimoto, Shueisha, Studio Pierrot o Bandai Namco. Tutti i nomi, personaggi e sprite di Naruto sono di proprietà dei rispettivi detentori dei diritti."
              : "Fan-made project. Not affiliated with, endorsed by, or sponsored by Masashi Kishimoto, Shueisha, Studio Pierrot, or Bandai Namco. All Naruto names, characters, and sprites are property of their respective owners."}
          </p>
        </footer>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}
      {showPatchNotesModal && <PatchNotesModal onClose={() => setShowPatchNotesModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showChakraChartModal && <ChakraChartModal onClose={() => setShowChakraChartModal(false)} />}
      {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
      {showLeaderboardModal && <LeaderboardModal onClose={() => setShowLeaderboardModal(false)} />}
      {showAchievementsModal && <AchievementsModal onClose={() => setShowAchievementsModal(false)} />}
      <TrophyUnlockNotification achievement={newlyUnlockedTrophy} onDismiss={dismissTrophyNotification} />

      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-[#ff9f1c] text-[#070b19] font-extrabold px-4 py-2 rounded-xl shadow-2xl z-50 animate-bounce text-xs uppercase tracking-wider border-2 border-yellow-300 pointer-events-none">
          ⚡ {toastMessage}
        </div>
      )}
    </main>
  );
}