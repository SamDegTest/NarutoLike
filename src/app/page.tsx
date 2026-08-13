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
import { ResetPasswordModal } from "@/components/game/ResetPasswordModal";
import { CreditsModal } from "@/components/game/CreditsModal";
import { PatchNotesModal } from "@/components/game/PatchNotesModal";
import { PrivacyModal } from "@/components/game/PrivacyModal";
import { ChakraChartModal } from "@/components/game/ChakraChartModal";
import { UserProfileBadge } from "@/components/game/UserProfileBadge";
import { UserProfileModal } from "@/components/game/UserProfileModal";
import { InviteFriendModal } from "@/components/game/InviteFriendModal";
import { LeaderboardModal } from "@/components/game/LeaderboardModal";
import { AchievementsModal } from "@/components/game/AchievementsModal";
import { TrophyUnlockNotification } from "@/components/game/TrophyUnlockNotification";
import { SealedSagaOverlay } from "@/components/game/SealedSagaOverlay";
import { TutorialOverlay } from "@/components/game/TutorialOverlay";
import { getActiveSynergies } from "@/lib/synergies";
import { getUnlockedAchievements, Achievement } from "@/data/achievements";
import { preloadImagesBatch } from "@/lib/imagePreloader";
import { GAME_ITEMS_CATALOG } from "@/data/items";

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
    selectSaga: rawSelectSaga,
    selectStartingCharacter,
    endRun,
    defeatedBosses,
    moveNinjaUp,
    moveNinjaDown,
    setLeaderNinja,
    totalRunsCount,
    classicRunsCount,
    shippudenRunsCount,
    totalScore,
    totalCoins,
    sessionCoins,
    abandonRun,
    buyAndRecruitNinja,
    recruitRerollCost,
    rerollRecruitChoices,
    inventory,
    availableItemChoices,
    activeConsumableEffects,
    chooseItemFromNode,
    useConsumableItem,
    equipItemToNinja,
    unequipItemFromNinja,
    completedSagaVictory,
    dismissSagaVictory,
    hasCompletedTutorial,
    startTutorial,
    resetTutorial,
  } = useGameStore();

  const [showBackpackModal, setShowBackpackModal] = useState(false);
  const [equipTargetItemId, setEquipTargetItemId] = useState<string | null>(null);

  const selectSaga = (sagaId: string | null) => {
    rawSelectSaga(sagaId);
    if (sagaId) {
      // Preload critical assets for active saga
      preloadImagesBatch([
        "/ramen.png",
        "/academy.png",
        "/sprites/jutsus/Scrolls.png",
        "/cloud.png",
        "/elements/fuoco.png",
        "/elements/acqua.png",
        "/elements/vento.png",
        "/elements/fulmine.png",
        "/elements/terra.png",
      ]);
    }
    if (sagaId && !hasCompletedTutorial) {
      startTutorial();
    }
  };

  const { startBattle, isBattleActive } = useBattleStore();

  const { user, username, avatarUrl, selectedTitle, initialize: initAuth, signOut: logOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRegisterMode, setAuthModalRegisterMode] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showPatchNotesModal, setShowPatchNotesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showChakraChartModal, setShowChakraChartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"map" | "team" | "items">("map");
  const [recruitTab, setRecruitTab] = useState<"random" | "shop">("random");

  const { newlyUnlockedTrophy, dismissTrophyNotification } = useGameStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    initAuth();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      if (
        params.get("resetPassword") === "true" ||
        params.get("type") === "recovery" ||
        hash.includes("type=recovery")
      ) {
        setShowResetPasswordModal(true);
      } else if (
        params.get("signup") === "true" ||
        params.get("register") === "true" ||
        params.get("action") === "signup" ||
        params.get("invite") === "true"
      ) {
        setAuthModalRegisterMode(true);
        setShowAuthModal(true);
      }
    }
  }, [initAuth]);

  // Preload team & enemy sprites dynamically when run is active
  useEffect(() => {
    if (isRunActive && runTeam.length > 0) {
      const teamSprites = runTeam.map((n) => n.sprite);
      const opponentSprites: string[] = [];
      activeMap.forEach((node) => {
        if (node.opponents) {
          node.opponents.forEach((oppId) => {
            const oppNinja = NINJA_MAP.get(oppId);
            if (oppNinja?.sprite) {
              opponentSprites.push(oppNinja.sprite);
            }
          });
        }
      });
      preloadImagesBatch([...teamSprites, ...opponentSprites]);
    }
  }, [isRunActive, runTeam, activeMap]);

  const isTutorialActive = useGameStore((state) => state.isTutorialActive);

  useEffect(() => {
    if (activeSagaId && !hasCompletedTutorial && !isTutorialActive) {
      startTutorial();
    }
  }, [activeSagaId, hasCompletedTutorial, isTutorialActive, startTutorial]);

  const { language: storeLang, setLanguage } = useLanguageStore();
  const lang = mounted ? storeLang : "it";
  const t = TRANSLATIONS[lang];

  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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

  interface ToastData {
    text: string;
    itemImg?: string;
    ninjaImg?: string;
    itemEmoji?: string;
  }

  const [toastData, setToastData] = useState<ToastData | null>(null);

  const showToast = (text: string, itemImg?: string, ninjaImg?: string, itemEmoji?: string) => {
    setToastData({ text, itemImg, ninjaImg, itemEmoji });
    setTimeout(() => setToastData(null), 3000);
  };

  // Keyboard shortcuts listener (Spacebar/Enter for endless map progression)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

      if (e.code === "Space" || e.code === "Enter") {
        if (!isRunActive || isBattleActive) return;

        // 1. Handle Power-up Jutsu Scroll Overlay
        if (pendingJutsuToLearn) {
          e.preventDefault();
          const eligibleNinja =
            runTeam.find(
              (n) => n.currentHp > 0 && n.jutsuList.indexOf(n.activeJutsuId) < n.jutsuList.length - 1
            ) ||
            runTeam.find((n) => n.currentHp > 0) ||
            runTeam[0];

          if (eligibleNinja) {
            learnJutsu(eligibleNinja.id);
          }
          return;
        }

        // 2. Handle Recruitment Choice Overlay
        if (availableRecruitChoices) {
          e.preventDefault();
          if (pendingRecruitId) {
            if (runTeam.length > 0) {
              chooseRecruit(pendingRecruitId, runTeam[0].id);
              setPendingRecruitId(null);
            }
          } else {
            if (runTeam.length >= 6) {
              skipRecruit();
              setPendingRecruitId(null);
            } else if (availableRecruitChoices.length > 0) {
              chooseRecruit(availableRecruitChoices[0].id);
            }
          }
          return;
        }

        // 3. Handle Campfire (Ramen Ichiraku) Overlay
        const current = activeMap.find((n) => n.id === currentNodeId);
        if (current && current.type === "heal" && !current.resolved) {
          e.preventDefault();
          applyHealingAtCampfire();
          return;
        }

        // 4. Standard Map Navigation: select next node
        const selectable = activeMap.filter((n) => isNodeSelectable(n));
        if (selectable.length > 0) {
          e.preventDefault();
          selectNode(selectable[0].id);
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
  }, [
    isRunActive,
    isBattleActive,
    activeMap,
    currentNodeId,
    pendingJutsuToLearn,
    availableRecruitChoices,
    pendingRecruitId,
    runTeam,
    learnJutsu,
    chooseRecruit,
    skipRecruit,
    applyHealingAtCampfire,
    selectNode,
  ]);

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
                  abandonRun();
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

      {/* TOAST MESSAGE OVERLAY */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-amber-900/90 border-2 border-amber-400 text-amber-100 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md font-medium text-xs sm:text-sm animate-bounce text-center max-w-md">
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className={`w-full shrink-0 relative flex flex-col items-center ${isRunActive ? "mb-1 pb-1" : "mb-2 sm:mb-3 pb-1 sm:pb-2"}`}>

        {/* RESPONSIVE TOP TOOLBAR CONTAINER */}
        <div className="w-full flex items-center justify-between gap-1 px-1 sm:px-2 z-40 mb-1 lg:mb-0 lg:absolute lg:left-0 lg:right-0 lg:top-1 pointer-events-none">

          {/* TOP LEFT CONTROLS: HAMBURGER MENU, TROPHIES & LEADERBOARD */}
          <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
            {mounted && (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="h-9 sm:h-11 lg:h-14 w-9 sm:w-11 lg:w-14 flex items-center justify-center text-base sm:text-lg lg:text-xl text-[#ff9f1c] hover:text-yellow-300 focus:outline-none transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#0f152d]/90 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 rounded-xl lg:rounded-2xl shadow-xl shrink-0"
                  title="Menu"
                >
                  ☰
                </button>

                <button
                  onClick={() => setShowAchievementsModal(true)}
                  className="h-9 sm:h-11 lg:h-14 px-2 sm:px-3 lg:px-4 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-mono font-extrabold uppercase tracking-wider text-amber-300 bg-[#0f152d]/90 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 rounded-xl lg:rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
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
                          span.className = "trophy-fallback text-xs sm:text-base";
                          span.innerText = "🏆";
                          parent.insertBefore(span, target);
                        }
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                  />
                  <span className="hidden sm:inline">{lang === "it" ? "Trofei" : "Trophies"}</span>
                </button>

                <button
                  onClick={() => setShowLeaderboardModal(true)}
                  className="h-9 sm:h-11 lg:h-14 px-2 sm:px-3 lg:px-4 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-mono font-extrabold uppercase tracking-wider text-amber-300 bg-[#0f152d]/90 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 rounded-xl lg:rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
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
                          span.className = "leaderboard-fallback text-xs sm:text-base";
                          span.innerText = "📊";
                          parent.insertBefore(span, target);
                        }
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                  />
                  <span className="hidden sm:inline">{lang === "it" ? "Classifica" : "Leaderboard"}</span>
                </button>
              </>
            )}
          </div>

          {/* TOP RIGHT CONTROLS: TOTAL CUMULATIVE SCORE, GAME COINS & USER PROFILE */}
          <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
            {mounted && (
              <>
                {/* TOTAL SCORE BOX */}
                <div
                  className="h-9 sm:h-11 lg:h-14 px-2 sm:px-3 lg:px-4 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-mono font-extrabold text-amber-300 bg-[#0f152d]/90 backdrop-blur-md border border-amber-500/50 rounded-xl lg:rounded-2xl shadow-xl shrink-0 select-none"
                >
                  <img
                    src="/score_icon.png"
                    alt="Punti"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".header-score-fallback")) {
                        const span = document.createElement("span");
                        span.className = "header-score-fallback text-xs sm:text-base";
                        span.innerText = "🏆";
                        parent.insertBefore(span, target);
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                  />
                  <div className="text-left flex flex-col justify-center leading-tight">
                    <span className="text-[7px] sm:text-[9px] text-amber-400 uppercase tracking-widest font-mono hidden sm:inline">Punti Totali</span>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-black text-amber-300 font-mono">
                      {totalScore.toLocaleString()} <span className="text-[8px] sm:text-[9px] font-normal">pts</span>
                    </span>
                  </div>
                </div>

                {/* GAME COINS BOX */}
                <div
                  className="h-9 sm:h-11 lg:h-14 px-2 sm:px-3 lg:px-4 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-mono font-extrabold text-yellow-400 bg-[#0f152d]/90 backdrop-blur-md border border-yellow-500/50 rounded-xl lg:rounded-2xl shadow-xl shrink-0 select-none"
                >
                  <img
                    src="/coin.png"
                    alt="Monete"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".header-coin-fallback")) {
                        const span = document.createElement("span");
                        span.className = "header-coin-fallback text-xs sm:text-base";
                        span.innerText = "🪙";
                        parent.insertBefore(span, target);
                      }
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                  />
                  <div className="text-left flex flex-col justify-center leading-tight">
                    <span className="text-[7px] sm:text-[9px] text-yellow-300 uppercase tracking-widest font-mono hidden sm:inline">
                      {user ? "Monete Ryo" : "Monete"}
                    </span>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-black text-yellow-400 font-mono">
                      {(user ? totalCoins : sessionCoins).toLocaleString()} <span className="text-[8px] sm:text-[9px] font-normal">ryo</span>
                    </span>
                  </div>
                </div>
              </>
            )}

            <UserProfileBadge
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenProfileModal={() => setShowProfileModal(true)}
              onOpenInviteModal={() => setShowInviteModal(true)}
            />
          </div>
        </div>

        {/* LOGO & SUBTITLE (CENTERED IN HEADER) */}
        <div className="flex flex-col items-center justify-center pt-1 z-30 pointer-events-auto">
          <img
            src="/logo.png"
            alt="NarutoLike"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
              const parent = (e.target as HTMLElement).parentElement;
              if (parent && !parent.querySelector(".logo-fallback")) {
                const fallback = document.createElement("h1");
                fallback.className = `logo-fallback font-extrabold text-[#ff9f1c] tracking-widest drop-shadow-[0_0_20px_rgba(255,159,28,0.8)] uppercase ${isRunActive ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"}`;
                fallback.innerText = "NARUTOLIKE";
                parent.appendChild(fallback);
              }
            }}
            className={`object-contain transition-all drop-shadow-[0_0_25px_rgba(255,159,28,0.7)] ${isRunActive ? "h-10 sm:h-12 lg:h-16" : "h-14 sm:h-20 lg:h-26"
              }`}
          />
          {!isRunActive && (
            <p className="text-gray-400 mt-0.5 text-[11px] sm:text-xs lg:text-sm tracking-wide font-mono text-center">
              {t.subtitle}
            </p>
          )}
        </div>
      </header>

      {/* GAME VIEW STATE MACHINE */}
      {!isRunActive ? (
        !activeSagaId ? (
          /* ==================== SAGA MODE SELECTION VIEW ==================== */
          <div className="max-w-5xl w-full flex-1 min-h-0 flex flex-col justify-center animate-fade-in py-2 sm:py-4 px-2">
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#ff9f1c] border-b-2 border-gray-800 pb-2 mb-4 text-center uppercase tracking-wider shrink-0 font-mono">
              {t.selectSaga}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 flex-1 min-h-0 overflow-y-auto max-h-[560px] py-2 px-1">
              {/* CLASSIC NARUTO SAGA CARD */}
              <div
                onClick={() => selectSaga("classic_naruto")}
                className="relative bg-[#0f152d] border-4 border-[#ff9f1c] hover:border-yellow-400 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-end shadow-2xl w-full sm:w-[380px] md:w-[420px] min-h-[340px] max-h-[430px] overflow-hidden group shrink-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 21, 45, 0.1), rgba(15, 21, 45, 0.96)), url('/backgrounds/classic_naruto.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Top Status & Run Badges */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                  <span className="bg-[#070b19]/90 text-[#ff9f1c] text-xs px-2.5 py-1 rounded-xl font-bold font-mono border border-[#ff9f1c]/40 shadow-md flex items-center gap-1.5 backdrop-blur-md">
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
                  <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-xl font-bold shadow-md border border-green-500/40 backdrop-blur-md">{t.active}</span>
                </div>

                {/* Card Content & Key Essential Info */}
                <div className="p-5 sm:p-6 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-12">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md">
                      Saga 1
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md">
                      {lang === "it" ? "5 Boss Principali" : "5 Main Bosses"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#ff9f1c] mb-2 drop-shadow-md group-hover:text-yellow-300 transition-colors">{t.sagaClassicTitle}</h3>

                  {/* Key Stats Chips */}
                  <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
                    <div className="bg-[#070b19]/90 border border-amber-500/30 p-2 rounded-xl flex items-center gap-2.5">
                      <img
                        src="/sprites/gaara_kid.png"
                        alt="Gaara"
                        className="w-8 h-8 object-contain bg-gray-900/90 rounded-lg p-0.5 border border-amber-500/40 shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.5)]"
                      />
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">{lang === "it" ? "Boss Finale" : "Final Boss"}</div>
                        <div className="font-bold text-amber-300">Gaara</div>
                      </div>
                    </div>
                    <div className="bg-[#070b19]/90 border border-amber-500/30 p-2 rounded-xl flex items-center gap-2">
                      <span className="text-lg">🗺️</span>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">{lang === "it" ? "Fasi Mappa" : "Map Stages"}</div>
                        <div className="font-bold text-amber-300">5 {lang === "it" ? "Capitoli" : "Chapters"}</div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-black rounded-xl uppercase tracking-wider text-xs sm:text-sm transition-all border-b-4 border-amber-700 active:translate-y-0.5 shadow-lg">
                    {t.startClassicButton}
                  </button>
                </div>
              </div>

              {/* SHIPPUDEN SAGA CARD */}
              <div
                onClick={isShippudenUnlocked ? () => selectSaga("shippuden_naruto") : undefined}
                className={`relative bg-[#0f152d] border-4 rounded-3xl flex flex-col justify-end w-full sm:w-[380px] md:w-[420px] min-h-[340px] max-h-[430px] overflow-hidden shadow-2xl transition-all group shrink-0 ${isShippudenUnlocked
                  ? "border-[#ff9f1c] hover:border-yellow-400 cursor-pointer hover:scale-[1.02]"
                  : "border-amber-900/60 cursor-not-allowed"
                  }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 21, 45, 0.1), rgba(15, 21, 45, 0.96)), url('/backgrounds/shippuden_naruto.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Top Status & Run Badges */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                  <span className="bg-[#070b19]/90 text-[#ff9f1c] text-xs px-2.5 py-1 rounded-xl font-bold font-mono border border-[#ff9f1c]/40 shadow-md flex items-center gap-1.5 backdrop-blur-md">
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
                    <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-xl font-bold shadow-md border border-green-500/40 backdrop-blur-md">{t.unlocked}</span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-xl font-bold shadow-md border border-red-500/40 backdrop-blur-md">{t.locked}</span>
                  )}
                </div>

                {/* Card Content & Key Essential Info */}
                <div className="p-5 sm:p-6 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-12">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md">
                      Saga 2
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-md">
                      {lang === "it" ? "10 Boss Leggendari" : "10 Legendary Bosses"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#ff9f1c] mb-2 drop-shadow-md group-hover:text-yellow-300 transition-colors">{t.sagaShippudenTitle}</h3>

                  {/* Key Stats Chips */}
                  <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
                    <div className="bg-[#070b19]/90 border border-amber-500/30 p-2 rounded-xl flex items-center gap-2.5">
                      <img
                        src="/sprites/madara_tt.png"
                        alt="Madara 10T"
                        className="w-8 h-8 object-contain bg-gray-900/90 rounded-lg p-0.5 border border-red-500/40 shrink-0 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                      />
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">{lang === "it" ? "Boss Finale" : "Final Boss"}</div>
                        <div className="font-bold text-red-400">Madara 10T</div>
                      </div>
                    </div>
                    <div className="bg-[#070b19]/90 border border-amber-500/30 p-2 rounded-xl flex items-center gap-2">
                      <span className="text-lg">🗺️</span>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">{lang === "it" ? "Fasi Mappa" : "Map Stages"}</div>
                        <div className="font-bold text-amber-300">10 {lang === "it" ? "Capitoli" : "Chapters"}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!isShippudenUnlocked}
                    className={`w-full py-3 font-black rounded-xl uppercase tracking-wider text-xs sm:text-sm transition-all shadow-lg ${isShippudenUnlocked
                      ? "bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] border-b-4 border-amber-700 cursor-pointer active:translate-y-0.5"
                      : "bg-gray-800/80 text-gray-400 border border-gray-700 cursor-not-allowed"
                      }`}
                  >
                    {isShippudenUnlocked ? t.startShippudenButton : t.lockMessageClassicButton}
                  </button>
                </div>

                {/* OVERLAY CATENE 3D E SIGILLO UZUMAKI SE BLOCCATO */}
                {!isShippudenUnlocked && (
                  <SealedSagaOverlay
                    sagaName={t.sagaShippudenTitle}
                    requirementText={t.sagaShippudenDesc}
                    onClickLocked={() => {
                      setToastMessage(t.lockMessageClassicButton || (lang === "it" ? "Sconfiggi Gaara nella Saga Classica per sbloccare Shippuden!" : "Defeat Gaara in the Classic Saga to unlock Shippuden!"));
                      setTimeout(() => setToastMessage(null), 3500);
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

            <div data-tutorial="starter-selection" className="flex flex-col md:grid md:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto py-2 w-full px-1 max-w-4xl mx-auto">
              {startingChoices?.map((ninja) => {
                const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                const translatedVersion = t[ninja.version as keyof typeof t] || ninja.version;
                const rarity = RARITY_CONFIGS[ninja.rank || "C"];

                return (
                  <div
                    key={ninja.id}
                    onClick={() => selectStartingCharacter(ninja.id)}
                    style={rarity.cardStyle}
                    className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between h-auto md:h-full w-full shrink-0 border-2 ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow}`}
                  >
                    {/* Rank Badge */}
                    <span className={`absolute top-3 right-3 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full ${rarity.badgeBg} ${rarity.badgeTextColor} shadow-md uppercase tracking-wider z-10 font-bold`}>
                      {rarity.rankSymbol}
                    </span>

                    <div className="flex flex-col items-center flex-1 justify-center">
                      <NinjaAvatar
                        src={ninja.sprite}
                        name={translatedName}
                        rank={ninja.rank}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-black/40 rounded-xl sm:rounded-2xl border-2 border-white/10 p-1 mb-2 mt-1 shadow-inner shrink-0"
                      />
                      <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-1 ${rarity.textColor}`}>{translatedName}</h3>

                      <div className="flex items-center gap-1.5 mb-3 shrink-0">
                        <ChakraNatureBadge nature={ninja.chakraNature} />
                        <span className="text-[10px] bg-gray-900/80 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                          {translatedVersion}
                        </span>
                      </div>

                      {/* STATS OVERVIEW */}
                      <div className="w-full text-xs text-gray-300 border-t border-gray-800/80 pt-2 space-y-1 bg-black/30 p-2 rounded-xl border border-white/5">
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

                    <button className="w-full mt-3 py-2.5 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-black rounded-xl uppercase tracking-wider text-xs sm:text-sm transition-all border-b-4 border-amber-700 shadow-md shrink-0 cursor-pointer active:translate-y-0.5">
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
        <div className="flex-1 min-h-0 w-full max-w-6xl flex flex-col items-center">

          {/* MOBILE VIEWPORT TAB SWITCHER (< lg) */}
          <div className="flex lg:hidden w-full max-w-md mb-2 bg-[#0f152d] p-1 rounded-xl border border-amber-500/40 shadow-lg justify-between shrink-0">
            <button
              type="button"
              onClick={() => setMobileActiveTab("map")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mobileActiveTab === "map"
                ? "bg-[#ff9f1c] text-[#070b19] shadow-md font-black"
                : "text-gray-300 hover:text-amber-300"
                }`}
            >
              <span>🗺️</span>
              <span>{lang === "it" ? "Mappa" : "Map"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveTab("team")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mobileActiveTab === "team"
                ? "bg-[#ff9f1c] text-[#070b19] shadow-md font-black"
                : "text-gray-300 hover:text-amber-300"
                }`}
            >
              <span>🛡️</span>
              <span>{lang === "it" ? "Squadra" : "Team"} ({runTeam.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveTab("items")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mobileActiveTab === "items"
                ? "bg-[#ff9f1c] text-[#070b19] shadow-md font-black"
                : "text-gray-300 hover:text-amber-300"
                }`}
            >
              <span>📜</span>
              <span>{lang === "it" ? "Info & Boss" : "Items & Bosses"}</span>
            </button>
          </div>

          <div className="w-full h-full min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4 items-stretch">

            {/* LEFT SIDEBAR: TEAM */}
            <aside data-tutorial="team-panel" className={`bg-[#0f152d] border-4 border-[#ff9f1c] rounded-2xl p-3 shadow-xl flex-col gap-2 h-full min-h-0 ${mobileActiveTab === "team" ? "flex" : "hidden lg:flex"}`}>
              <div className="flex items-center justify-between border-b-2 border-gray-800 pb-1 shrink-0">
                <h2 className="text-lg font-bold text-[#ff9f1c] uppercase tracking-wider">
                  {t.team} ({runTeam.length} / 6)
                </h2>
                <div className="text-xs font-bold text-amber-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                  🏆 {useGameStore.getState().currentRunScore.toLocaleString()} pts
                </div>
              </div>

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

                          {/* EQUIPPED ITEM COMPACT SLOT DISPLAY */}
                          {ninja.equippedItem && (
                            <div className="mt-1 flex items-center">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const itemToUnequip = ninja.equippedItem;
                                  unequipItemFromNinja(ninja.id);
                                  showToast(
                                    lang === "it" ? `Rimosso ${itemToUnequip?.name[lang]} da ${translatedName}` : `Unequipped ${itemToUnequip?.name[lang]} from ${translatedName}`,
                                    itemToUnequip ? `/items/${itemToUnequip.id}.png` : undefined,
                                    ninja.sprite,
                                    itemToUnequip?.iconEmoji
                                  );
                                }}
                                className="bg-[#070b19]/90 border border-purple-500/60 rounded-lg p-1 flex items-center gap-1 cursor-pointer hover:border-purple-400 hover:scale-105 transition-all shadow-md group/item"
                                title={`${ninja.equippedItem.name[lang]}\n${ninja.equippedItem.description[lang]}\n(${lang === "it" ? "Clicca per rimuovere dallo shinobi" : "Click to unequip from shinobi"})`}
                              >
                                <img
                                  src={`/items/${ninja.equippedItem.id}.png`}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = "none";
                                    const parent = (e.currentTarget as HTMLElement).parentElement;
                                    if (parent && !parent.querySelector(".item-emoji-icon")) {
                                      const span = document.createElement("span");
                                      span.className = "item-emoji-icon text-xs";
                                      span.innerText = ninja.equippedItem?.iconEmoji || "🛡️";
                                      parent.appendChild(span);
                                    }
                                  }}
                                  alt={ninja.equippedItem.name[lang]}
                                  className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]"
                                />
                                <span className="text-[9px] text-red-400 font-extrabold group-hover/item:text-red-300">✕</span>
                              </div>
                            </div>
                          )}
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
            <div data-tutorial="map-section" className={`lg:col-span-2 flex-col items-center h-full min-h-0 relative w-full ${mobileActiveTab === "map" ? "flex" : "hidden lg:flex"}`}>
              {/* TOP HEADER NAVIGATION CONTROL BAR (Placed outside map box so it NEVER covers nodes) */}
              {(() => {
                const selectable = activeMap.filter((n) => isNodeSelectable(n));
                if (selectable.length === 0) return null;
                const targetNode = selectable[0];
                const targetLabel = translateNodeLabel(targetNode.label, lang);

                return (
                  <div className="w-full max-w-[650px] mb-2 flex items-center justify-between bg-[#0f152d] border-2 border-[#ff9f1c]/60 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-lg shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-extrabold text-[#ff9f1c] truncate">
                      <span className="text-sm sm:text-base">⚡</span>
                      <span className="hidden xs:inline">{lang === "it" ? "Prossima Tappa:" : "Next Stage:"}</span>
                      <span className="text-white font-black bg-[#070b19] px-2 py-0.5 rounded-xl border border-amber-500/40 text-xs sm:text-sm">
                        {targetLabel}
                      </span>
                    </div>

                    <button
                      data-tutorial="map-advance-btn"
                      onClick={() => selectNode(targetNode.id)}
                      className="bg-[#ff9f1c] hover:bg-yellow-400 text-[#070b19] font-black px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-md border-b-2 border-amber-700 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 shrink-0"
                      title={lang === "it" ? "Avanza alla prossima tappa (Premi Spazio o Invio sulla tastiera)" : "Advance to next stage (Press Spacebar or Enter on keyboard)"}
                    >
                      <span>{lang === "it" ? "Avanza" : "Advance"}</span>
                      <span className="hidden sm:inline-block bg-[#070b19]/20 px-1.5 py-0.5 rounded text-[10px] border border-black/20 font-mono">SPAZIO / ↵</span>
                    </button>
                  </div>
                );
              })()}

              {/* THE RETRO MAP CONTAINER */}
              <div data-tutorial="map-nodes" className="flex-1 w-full max-w-[650px] bg-[#3a5a40] border-4 border-[#ff9f1c] rounded-2xl relative overflow-hidden shadow-2xl flex flex-col min-h-[360px] lg:min-h-0">

                {/* TREE BORDERS */}
                <div className="absolute inset-y-0 left-0 w-6 sm:w-8 bg-[repeating-linear-gradient(#2d6a4f,#2d6a4f_20px,#1b4332_20px,#1b4332_40px)] flex flex-col justify-around text-center select-none text-[10px] sm:text-xs border-r border-[#ff9f1c]/10">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="filter grayscale opacity-25">🌲</span>
                  ))}
                </div>
                <div className="absolute inset-y-0 right-0 w-6 sm:w-8 bg-[repeating-linear-gradient(#2d6a4f,#2d6a4f_20px,#1b4332_20px,#1b4332_40px)] flex flex-col justify-around text-center select-none text-[10px] sm:text-xs border-l border-[#ff9f1c]/10">
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

                  let statusClass = "opacity-35 grayscale filter transition-all";
                  let disabledClass = "cursor-not-allowed pointer-events-none";

                  if (node.resolved) {
                    statusClass = "opacity-90 filter drop-shadow-[0_0_8px_rgba(255,159,28,0.7)] transition-all";
                    disabledClass = "cursor-default pointer-events-none";
                  } else if (selectable) {
                    const isPositiveNode = node.type === "recruit" || node.type === "powerup" || node.type === "heal";
                    statusClass = isPositiveNode
                      ? "hover:scale-125 filter drop-shadow-[0_0_14px_rgba(34,197,94,0.9)] animate-pulse transition-all"
                      : "hover:scale-125 filter drop-shadow-[0_0_14px_rgba(239,68,68,0.9)] animate-pulse transition-all";
                    disabledClass = "cursor-pointer z-10";
                  } else if (isCurrent) {
                    statusClass = "scale-125 filter drop-shadow-[0_0_16px_rgba(249,115,22,1)] transition-all";
                    disabledClass = "cursor-default pointer-events-none z-10";
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
                      data-tutorial={
                        node.type === "powerup"
                          ? "node-powerup"
                          : node.type === "heal"
                            ? "node-heal"
                            : node.type === "boss"
                              ? "node-boss"
                              : node.type === "recruit"
                                ? "node-recruit"
                                : "node-battle"
                      }
                      onClick={() => selectable && selectNode(node.id)}
                      style={{ left: pos.left, top: pos.top }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center font-bold text-lg sm:text-xl ${statusClass} ${disabledClass}`}
                      title={isReachable ? fullTooltip : `${fullTooltip} (${lang === "it" ? "Non Raggiungibile" : "Unreachable"})`}
                    >
                      {(node.type === "item" || node.type === "powerup") && (
                        <img
                          src="/items.png"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                          alt="Oggetto"
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                      )}
                      {node.type === "recruit" && (
                        <img
                          src="/academy.png"
                          alt="Recluta"
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                      )}
                      {node.type === "heal" && (
                        <img
                          src="/ramen.png"
                          alt="Ramen"
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
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
                              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]"
                            />
                          );
                        }
                        return iconSymbol;
                      })()}
                      {node.type !== "item" && node.type !== "powerup" && node.type !== "recruit" && node.type !== "heal" && node.type !== "battle" && node.type !== "boss" && iconSymbol}

                      {/* FIRST ENEMY CHAKRA NATURE BADGE OVERLAY */}
                      {(node.type === "battle" || node.type === "boss") && firstOppNinja && (
                        <div className="absolute -bottom-1 -right-1 z-20 pointer-events-none bg-black/80 p-0.5 rounded-full border border-yellow-500/50 shadow-lg">
                          <ChakraNatureBadge
                            nature={firstOppNinja.chakraNature}
                            showText={false}
                            className="scale-90 sm:scale-100"
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

                {/* OVERLAY: ITEM SELECTION CHOICE PANEL (CHOOSE 1 OF 3 ITEMS) */}
                {availableItemChoices && (
                  <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
                    <div className="bg-[#0f152d] border-4 border-amber-400 rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-lg my-auto text-center relative overflow-hidden">
                      <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1">
                        📦 {lang === "it" ? "NODO OGGETTI DISPONIBILI" : "ITEM NODE AVAILABLE"}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-yellow-400 mb-1 uppercase tracking-wider">
                        {lang === "it" ? "SCEGLI 1 OGGETTO PER LO ZAINO" : "CHOOSE 1 ITEM FOR BACKPACK"}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-300 mb-4">
                        {lang === "it"
                          ? "Scegli un oggetto da aggiungere allo Zaino della tua squadra."
                          : "Choose an item to add to your squad's Backpack."}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        {availableItemChoices.map((item) => {
                          const isConsumable = item.type === "consumable";
                          return (
                            <div
                              key={item.id}
                              onClick={() => chooseItemFromNode(item)}
                              className={`p-3 rounded-2xl border cursor-pointer transition-all hover:scale-105 flex flex-col justify-between items-center bg-black/40 ${isConsumable
                                  ? "border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                  : "border-purple-500/50 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                }`}
                            >
                              <div className="w-14 h-14 p-1.5 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center mb-2 shrink-0">
                                <img
                                  src={`/items/${item.id}.png`}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = "none";
                                    const parent = (e.currentTarget as HTMLElement).parentElement;
                                    if (parent && !parent.querySelector(".emoji-fallback")) {
                                      const span = document.createElement("span");
                                      span.className = "emoji-fallback text-2xl";
                                      span.innerText = item.iconEmoji;
                                      parent.appendChild(span);
                                    }
                                  }}
                                  alt={item.name[lang]}
                                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                                />
                              </div>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase mb-1.5 ${isConsumable
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                  }`}
                              >
                                {isConsumable
                                  ? (lang === "it" ? "Consumabile" : "Consumable")
                                  : (lang === "it" ? "Assegnabile" : "Assignable")}
                              </span>
                              <h4 className="font-extrabold text-xs text-white mb-1 leading-tight">{item.name[lang]}</h4>
                              <p className="text-[10px] text-gray-300 leading-snug whitespace-pre-line font-mono mb-2 font-semibold text-left">{item.description[lang]}</p>
                              <button
                                type="button"
                                className={`w-full py-1.5 rounded-xl font-bold font-mono text-[10px] uppercase tracking-wider transition-all border ${isConsumable
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400"
                                    : "bg-purple-600 hover:bg-purple-500 text-white border-purple-400"
                                  }`}
                              >
                                {lang === "it" ? "Raccogli" : "Collect"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* OVERLAY: NINJA RECRUIT CHOICE PANEL */}
                {availableRecruitChoices && (
                  <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
                    <div data-tutorial="recruit-modal" className="bg-[#0f152d] border-4 border-green-500 rounded-2xl p-4 sm:p-5 shadow-2xl w-full max-w-md my-auto">
                      {pendingRecruitId ? (
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-green-400 mb-1 uppercase tracking-wider">
                            {lang === "it" ? "SOSTITUISCI UN MEMBRO" : "REPLACE A MEMBER"}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-gray-400 mb-3 sm:mb-4">
                            {lang === "it" ? "Squadra al completo (6/6). Seleziona chi congedare per far posto al nuovo ninja." : "Team is full (6/6). Select who to dismiss to make room for the new ninja."}
                          </p>
                          <div className="flex flex-col gap-2 max-h-[200px] sm:max-h-[220px] overflow-y-auto mb-3 sm:mb-4 pr-1">
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
                                  className={`flex justify-between items-center ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow} rounded-xl p-2 sm:p-2.5 text-left transition-all w-full cursor-pointer hover:scale-[1.01] shadow-md`}
                                >
                                  <div className="flex gap-2 items-center">
                                    <NinjaAvatar
                                      src={ninja.sprite}
                                      name={translatedName}
                                      rank={ninja.rank}
                                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain bg-black/30 rounded border border-white/10 p-0.5 shrink-0"
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
                                  <span className="text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:text-red-300 bg-red-950/60 border border-red-500/30 px-2 py-0.5 sm:py-1 rounded">
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
                          {/* TAB SWITCHER: 3 CASUALI VS NEGOZIO RYO */}
                          <div className="flex bg-[#070b19] p-1 rounded-xl border border-gray-800 mb-3 gap-1">
                            <button
                              type="button"
                              onClick={() => setRecruitTab("random")}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${recruitTab === "random"
                                  ? "bg-green-600 text-white shadow-md font-black"
                                  : "text-gray-400 hover:text-gray-200"
                                }`}
                            >
                              <span>🎲</span>
                              <span>{lang === "it" ? "3 Casuali (Gratis)" : "3 Random (Free)"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRecruitTab("shop")}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${recruitTab === "shop"
                                  ? "bg-yellow-500 text-gray-950 shadow-md font-black"
                                  : "text-yellow-400/70 hover:text-yellow-300"
                                }`}
                            >
                              <span>🛒</span>
                              <span>{lang === "it" ? "Negozio Ryo" : "Ryo Shop"}</span>
                            </button>
                          </div>

                          {recruitTab === "random" ? (
                            <>
                              <h3 className="text-sm font-bold text-green-400 mb-1 uppercase tracking-wider text-center">
                                {lang === "it" ? "SELEZIONA UN NINJA CASUALE" : "SELECT A RANDOM NINJA"}
                              </h3>
                              <p className="text-[10px] text-gray-400 mb-2 text-center">
                                {lang === "it" ? "Scegli 1 ninja da aggiungere alla squadra" : "Choose 1 ninja for your squad"} (Lv. {runTeam[0]?.level || 5}).
                              </p>
                              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
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
                                      className={`relative p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all hover:scale-105 flex flex-col justify-between ${rarity.cardBorder} ${rarity.cardBg} ${rarity.cardGlow}`}
                                    >
                                      <span className={`absolute top-1 right-1 text-[8px] px-1 py-0.2 rounded-full ${rarity.badgeBg} ${rarity.badgeTextColor}`}>
                                        {rarity.rankSymbol}
                                      </span>
                                      <NinjaAvatar
                                        src={ninja.sprite}
                                        name={translatedName}
                                        rank={ninja.rank}
                                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain mx-auto mb-1 mt-1 sm:mt-2 bg-black/30 rounded p-1 border border-white/10"
                                      />
                                      <h4 className={`font-bold text-[9px] sm:text-[10px] truncate text-center ${rarity.textColor}`}>{translatedName}</h4>
                                      <div className="flex justify-center my-0.5 sm:my-1">
                                        <ChakraNatureBadge nature={ninja.chakraNature} showText={false} />
                                      </div>
                                      <div className="text-[7px] sm:text-[8px] text-gray-300 font-mono grid grid-cols-2 gap-0.5 sm:gap-1 bg-black/40 p-0.5 sm:p-1 rounded text-center border border-white/10">
                                        <div>HP:{ninja.baseStats.hp}</div>
                                        <div>ATK:{ninja.baseStats.attack}</div>
                                        <div>DEF:{ninja.baseStats.defense}</div>
                                        <div>SPD:{ninja.baseStats.speed}</div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* REROLL CASUALI BUTTON WITH PROGRESSIVE COST */}
                              {(() => {
                                const currentCoins = user ? totalCoins : sessionCoins;
                                const canAffordReroll = currentCoins >= recruitRerollCost;
                                return (
                                  <button
                                    onClick={() => {
                                      if (canAffordReroll) {
                                        rerollRecruitChoices();
                                      }
                                    }}
                                    disabled={!canAffordReroll}
                                    className={`w-full py-2 px-3 mb-2 rounded-xl font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${canAffordReroll
                                        ? "bg-gradient-to-r from-[#070b19] via-[#0f152d] to-[#070b19] hover:border-yellow-400 text-yellow-300 border-yellow-500/50 cursor-pointer shadow-md hover:scale-[1.01]"
                                        : "bg-gray-900/60 text-gray-500 border-gray-800 cursor-not-allowed opacity-60"
                                      }`}
                                  >
                                    <span>🎲 {lang === "it" ? "Reroll Scelte" : "Reroll Choices"}</span>
                                    <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-yellow-500/30 text-[10px] text-yellow-400">
                                      <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3.5 h-3.5 object-contain" />
                                      <span>{recruitRerollCost} ryo</span>
                                    </div>
                                  </button>
                                );
                              })()}
                            </>
                          ) : (
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                                  🛒 {lang === "it" ? "NEGOZIO NINJA RYO" : "RYO NINJA SHOP"}
                                </h3>
                                <div className="text-[10px] font-mono text-yellow-300 bg-black/60 px-2 py-0.5 rounded border border-yellow-500/40 flex items-center gap-1">
                                  <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3.5 h-3.5 object-contain" />
                                  <span>{(user ? totalCoins : sessionCoins).toLocaleString()} ryo</span>
                                </div>
                              </div>
                              <div className="max-h-[270px] overflow-y-auto mb-3 pr-1 space-y-3">
                                {(() => {
                                  const isShippuden = activeSagaId === "shippuden_naruto";
                                  const teamCharIds = runTeam.map((n) => n.characterId);
                                  const shopNinjas = Array.from(NINJA_MAP.values()).filter((n) => {
                                    if (teamCharIds.includes(n.characterId)) return false;
                                    return isShippuden ? n.version === "shippuden" : n.version === "kid";
                                  });

                                  const PRICE_BY_RANK: Record<string, number> = {
                                    S: 300,
                                    A: 150,
                                    B: 50,
                                    C: 25,
                                  };

                                  const currentCoins = user ? totalCoins : sessionCoins;
                                  const ranks: Array<"S" | "A" | "B" | "C"> = ["S", "A", "B", "C"];

                                  return ranks.map((rankKey) => {
                                    const rankNinjas = shopNinjas.filter((n) => (n.rank || "C") === rankKey);
                                    if (rankNinjas.length === 0) return null;

                                    const price = PRICE_BY_RANK[rankKey];
                                    const rarity = RARITY_CONFIGS[rankKey];

                                    return (
                                      <div key={rankKey} className="space-y-1.5">
                                        {/* RANK CATEGORY HEADER / SEPARATOR */}
                                        <div className="flex items-center gap-2 border-b border-gray-800 pb-1 pt-1">
                                          <span className={`text-xs px-2 py-0.5 rounded-md font-extrabold ${rarity.badgeBg} ${rarity.badgeTextColor}`}>
                                            RANK {rankKey}
                                          </span>
                                          <span className="text-[10px] font-mono text-yellow-300 font-bold bg-black/50 px-1.5 py-0.5 rounded border border-yellow-500/30">
                                            {price} ryo
                                          </span>
                                          <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-800 to-transparent" />
                                        </div>

                                        {/* NINJA CARDS GRID FOR THIS RANK */}
                                        <div className="grid grid-cols-3 gap-2">
                                          {rankNinjas.map((ninja) => {
                                            const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                                            const canAfford = currentCoins >= price;

                                            return (
                                              <div
                                                key={ninja.id}
                                                onClick={() => {
                                                  if (!canAfford) return;
                                                  if (runTeam.length >= 6) {
                                                    setPendingRecruitId(ninja.id);
                                                  } else {
                                                    buyAndRecruitNinja(ninja.id, price);
                                                  }
                                                }}
                                                style={rarity.cardStyle}
                                                className={`relative p-2 rounded-xl transition-all flex flex-col justify-between ${canAfford ? "cursor-pointer hover:scale-105" : "opacity-50 cursor-not-allowed"
                                                  } ${rarity.cardBorder} ${rarity.cardBg}`}
                                              >
                                                <NinjaAvatar
                                                  src={ninja.sprite}
                                                  name={translatedName}
                                                  rank={ninja.rank}
                                                  className="w-9 h-9 object-contain mx-auto mb-1 mt-1 bg-black/30 rounded p-0.5 border border-white/10"
                                                />
                                                <h4 className={`font-bold text-[9px] truncate text-center ${rarity.textColor}`}>{translatedName}</h4>
                                                <div className="mt-1 flex items-center justify-center gap-1 bg-black/70 py-0.5 px-1 rounded border border-yellow-500/40 text-[9px] font-mono font-bold text-yellow-300">
                                                  <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3 h-3 object-contain" />
                                                  <span>{price} ryo</span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          )}

                          {runTeam.length >= 6 && (
                            <button
                              onClick={() => {
                                skipRecruit();
                                setPendingRecruitId(null);
                              }}
                              className="w-full py-2 sm:py-2.5 bg-[#070b19] hover:bg-gray-900 text-yellow-400 font-bold rounded-xl text-xs uppercase tracking-wider border-2 border-yellow-500/50 hover:border-yellow-400 transition-all cursor-pointer shadow-md mt-1"
                            >
                              ⚡ {lang === "it" ? "Salta Reclutamento" : "Skip Recruitment"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* OVERLAY: CAMPFIRE HEALING ACTION */}
                {currentNode && currentNode.type === "heal" && !currentNode.resolved && (
                  <div className="absolute inset-0 bg-black/85 z-30 flex items-center justify-center p-4 sm:p-5 animate-fade-in">
                    <div className="bg-[#0f152d] border-4 border-green-500 rounded-3xl p-5 sm:p-8 shadow-2xl w-full max-w-sm text-center">
                      <img src="/ramen.png" alt="Ramen" className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto mb-3 sm:mb-4 filter drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-bounce" />
                      <h3 className="text-xl sm:text-3xl font-black text-green-400 mb-2 uppercase tracking-wider">
                        {lang === "it" ? "RAMEN ICHIRAKU" : "ICHIRAKU RAMEN"}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-4 sm:mb-6">
                        {lang === "it"
                          ? "Ripristina il 100% di HP e Chakra a tutta la squadra!"
                          : "Restores 100% HP & Chakra for the entire team!"}
                      </p>
                      <button
                        onClick={applyHealingAtCampfire}
                        className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold rounded-2xl shadow-xl transition-all uppercase tracking-wider text-sm sm:text-base border-b-4 border-green-950 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {lang === "it" ? "MANGIA RAMEN" : "EAT RAMEN"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT SIDEBAR: ITEMS & BADGES */}
            <aside className={`bg-[#0f152d] border-4 border-[#ff9f1c] rounded-2xl p-3 shadow-xl flex-col gap-4 h-full min-h-0 ${mobileActiveTab === "items" ? "flex" : "hidden lg:flex"}`}>
              {/* ZAINO DEGLI OGGETTI BOX (SOSTITUISCE POTENZIAMENTI) */}
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between border-b-2 border-gray-800 pb-1.5 mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <img
                      src="/backpack.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                      alt="Zaino"
                      className="w-6 h-6 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(255,159,28,0.8)]"
                    />
                    <h2 className="text-base sm:text-lg font-bold text-[#ff9f1c] uppercase tracking-wider">
                      {lang === "it" ? "ZAINO" : "BACKPACK"}
                    </h2>
                  </div>
                  <span className="bg-black/60 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-yellow-500/40">
                    {inventory.reduce((sum, inv) => sum + inv.quantity, 0)} {lang === "it" ? "oggetti" : "items"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                  {inventory.length > 0 ? (
                    inventory.map((invItem) => {
                      const item = invItem.item;
                      const isConsumable = item.type === "consumable";

                      return (
                        <div
                          key={item.id}
                          className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 bg-[#070b19] ${isConsumable ? "border-emerald-500/40" : "border-purple-500/40"
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-9 h-9 p-1 bg-black/60 rounded-xl border border-white/10 shrink-0 flex items-center justify-center relative">
                              <img
                                src={`/items/${item.id}.png`}
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                  const parent = (e.currentTarget as HTMLElement).parentElement;
                                  if (parent && !parent.querySelector(".emoji-fallback")) {
                                    const span = document.createElement("span");
                                    span.className = "emoji-fallback text-base";
                                    span.innerText = item.iconEmoji;
                                    parent.appendChild(span);
                                  }
                                }}
                                alt={item.name[lang]}
                                className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                              />
                              {invItem.quantity > 1 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-gray-950 text-[8px] font-black font-mono px-1 py-0.2 rounded-full border border-amber-300">
                                  x{invItem.quantity}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="font-extrabold text-xs text-white leading-tight mb-0.5">{item.name[lang]}</div>
                              <div className="text-[9px] text-gray-300 whitespace-pre-line font-mono font-semibold leading-snug">{item.description[lang]}</div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isConsumable ? (
                              <button
                                onClick={() => {
                                  useConsumableItem(item.id);
                                  showToast(
                                    lang === "it" ? `Usato: ${item.name[lang]}` : `Used: ${item.name[lang]}`,
                                    `/items/${item.id}.png`,
                                    undefined,
                                    item.iconEmoji
                                  );
                                }}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer border border-emerald-400 shadow-sm"
                              >
                                {t.useBtn}
                              </button>
                            ) : (
                              <button
                                onClick={() => setEquipTargetItemId(item.id)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold font-mono bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer border border-purple-400 shadow-sm"
                              >
                                {t.equipBtn}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-gray-400 font-mono text-xs flex flex-col items-center justify-center gap-1.5 border border-dashed border-gray-800 rounded-2xl bg-[#070b19]/40">
                      <img src="/backpack.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Empty" className="w-8 h-8 object-contain opacity-50" />
                      <p className="text-[11px] leading-tight text-gray-400 max-w-[180px]">
                        {lang === "it" ? "Lo zaino è vuoto. Raccogli oggetti sulla mappa!" : "Backpack is empty. Pick items on map!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* EFFETTI CONSUMABILI ATTIVI BOX (SEMPRE VISIBILE) */}
              <div className="shrink-0 bg-[#070b19]/90 border border-emerald-500/40 p-2.5 rounded-xl space-y-1.5 shadow-md">
                <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between border-b border-emerald-500/20 pb-1">
                  <span>✨ {lang === "it" ? "EFFETTI ATTIVI" : "ACTIVE EFFECTS"}</span>
                  <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-emerald-500/40">
                    {activeConsumableEffects.length}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
                  {activeConsumableEffects.length > 0 ? (
                    activeConsumableEffects.map((eff) => (
                      <div
                        key={eff.item.id}
                        className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-emerald-500/30 hover:border-emerald-400 cursor-help transition-all"
                        title={eff.item.description[lang]}
                      >
                        <div className="w-7 h-7 p-0.5 bg-black/60 rounded-md border border-emerald-400/40 shrink-0 flex items-center justify-center">
                          <img
                            src={`/items/${eff.item.id}.png`}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                            alt={eff.item.name[lang]}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-[10px] text-emerald-300 truncate">{eff.item.name[lang]}</div>
                          <div className="text-[9px] text-gray-300 font-mono leading-tight">
                            ⌛ {eff.remainingBattles} {lang === "it" ? (eff.remainingBattles === 1 ? "battaglia" : "battaglie") : (eff.remainingBattles === 1 ? "battle" : "battles")}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-gray-500 font-mono italic text-center py-1">
                      {lang === "it" ? "Nessun effetto di lotta attivo" : "No active battle effects"}
                    </div>
                  )}
                </div>
              </div>

              {/* BOSS SCONFITTI BOX */}
              <div className="shrink-0">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 text-[#ff9f1c] uppercase tracking-wider mb-2">
                  {lang === "it" ? "BOSS SCONFITTI" : "DEFEATED BOSSES"}
                </h2>
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
                    <div className="grid grid-cols-5 gap-y-3 gap-x-1.5 py-1 w-full">
                      {sagaBosses.map((boss) => {
                        const isDefeated = defeatedBosses.includes(boss.id);
                        const bossDisplayName = boss.name;
                        const tooltipText = isDefeated
                          ? (lang === "it" ? `Sconfitto: ${bossDisplayName}` : `Defeated: ${bossDisplayName}`)
                          : (lang === "it" ? `Boss da sconfiggere: ${bossDisplayName}` : `Boss to defeat: ${bossDisplayName}`);

                        return (
                          <div key={boss.id} className="flex flex-col items-center gap-1 min-w-0">
                            <div
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-md shrink-0 ${isDefeated
                                ? "border-green-500 bg-green-500/10 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
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
                            <span
                              className={`text-[9px] font-mono leading-tight truncate text-center w-full ${isDefeated ? "text-green-400 font-bold" : "text-gray-400"
                                }`}
                              title={bossDisplayName}
                            >
                              {bossDisplayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </aside>

          </div>
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

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setAuthModalRegisterMode(false);
          }}
          initialRegister={authModalRegisterMode}
        />
      )}
      {showResetPasswordModal && (
        <ResetPasswordModal onClose={() => setShowResetPasswordModal(false)} />
      )}
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}
      {showPatchNotesModal && <PatchNotesModal onClose={() => setShowPatchNotesModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showChakraChartModal && <ChakraChartModal onClose={() => setShowChakraChartModal(false)} />}
      {/* ==================== BACKPACK MODAL (ZAINO DEGLI OGGETTI) ==================== */}
      {showBackpackModal && (
        <div
          onClick={() => setShowBackpackModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f152d] border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[90dvh] flex flex-col text-white"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowBackpackModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-amber-300 font-bold text-lg cursor-pointer transition-colors z-10"
            >
              ✕
            </button>

            {/* Header with backpack.png */}
            <header className="text-center border-b-2 border-gray-800 pb-3 mb-3 shrink-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2.5">
                <img
                  src="/backpack.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                  alt="Backpack"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 filter drop-shadow-[0_0_10px_rgba(255,159,28,0.8)]"
                />
                <span>{lang === "it" ? "ZAINO DEGLI OGGETTI" : "OBJECT BACKPACK"}</span>
              </h2>
              <p className="text-xs text-amber-400 font-mono font-bold mt-1">
                {inventory.length === 0
                  ? (lang === "it" ? "Lo zaino è vuoto! Visita i nodi Oggetto sulla mappa." : "Your backpack is empty! Visit Item nodes on map.")
                  : (lang === "it" ? `Oggetti Totali nello Zaino: ${inventory.reduce((s, i) => s + i.quantity, 0)}` : `Total Items in Backpack: ${inventory.reduce((s, i) => s + i.quantity, 0)}`)}
              </p>
            </header>

            {/* Inventory Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {inventory.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl opacity-50">🎒</span>
                  <p>{t.backpackEmpty}</p>
                </div>
              ) : (
                inventory.map((invItem) => {
                  const item = invItem.item;
                  const isConsumable = item.type === "consumable";

                  return (
                    <div
                      key={item.id}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-[#070b19] ${isConsumable ? "border-emerald-500/40" : "border-purple-500/40"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 p-1.5 bg-black/60 rounded-2xl border border-white/10 shrink-0 flex items-center justify-center relative">
                          <img
                            src={`/items/${item.id}.png`}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                              const parent = (e.currentTarget as HTMLElement).parentElement;
                              if (parent && !parent.querySelector(".emoji-fallback")) {
                                const span = document.createElement("span");
                                span.className = "emoji-fallback text-2xl";
                                span.innerText = item.iconEmoji;
                                parent.appendChild(span);
                              }
                            }}
                            alt={item.name[lang]}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                          />
                          {invItem.quantity > 1 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-gray-950 text-[10px] font-black font-mono px-1.5 py-0.2 rounded-full border border-amber-300">
                              x{invItem.quantity}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-white">{item.name[lang]}</span>
                            <span
                              className={`text-[9px] px-2 py-0.2 rounded-full font-mono font-bold uppercase ${isConsumable
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                }`}
                            >
                              {isConsumable
                                ? (lang === "it" ? "Consumabile" : "Consumable")
                                : (lang === "it" ? "Assegnabile" : "Assignable")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1 leading-snug whitespace-pre-line font-mono font-semibold text-left">{item.description[lang]}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isConsumable ? (
                          <button
                            onClick={() => {
                              useConsumableItem(item.id);
                              showToast(
                                lang === "it" ? `Usato: ${item.name[lang]}` : `Used: ${item.name[lang]}`,
                                `/items/${item.id}.png`,
                                undefined,
                                item.iconEmoji
                              );
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer border border-emerald-400 shadow-md hover:scale-105 active:scale-95"
                          >
                            {t.useBtn}
                          </button>
                        ) : (
                          <button
                            onClick={() => setEquipTargetItemId(item.id)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer border border-purple-400 shadow-md hover:scale-105 active:scale-95"
                          >
                            {t.equipBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EQUIP ASSIGNABLE ITEM TO SQUAD NINJA */}
      {equipTargetItemId && (
        <div
          onClick={() => setEquipTargetItemId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f152d] border-4 border-purple-500 rounded-3xl max-w-md w-full p-5 sm:p-6 text-center relative shadow-2xl"
          >
            <h3 className="text-lg font-black text-purple-300 uppercase tracking-wider mb-1">
              {lang === "it" ? "ASSEGNA STRUMENTO A UN NINJA" : "ASSIGN ITEM TO NINJA"}
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              {lang === "it"
                ? "Seleziona a quale membro della tua squadra equipaggiare questo strumento."
                : "Select which team member to equip this item to."}
            </p>

            <div className="space-y-2 mb-4 max-h-[260px] overflow-y-auto pr-1">
              {runTeam.map((ninja) => {
                const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
                const rarity = RARITY_CONFIGS[ninja.rank || "C"];

                return (
                  <div
                    key={ninja.id}
                    onClick={() => {
                      const itemToEquip = GAME_ITEMS_CATALOG.find((i) => i.id === equipTargetItemId);
                      equipItemToNinja(equipTargetItemId, ninja.id);
                      setEquipTargetItemId(null);
                      showToast(
                        lang === "it" ? `Equipaggiato su ${translatedName}!` : `Equipped to ${translatedName}!`,
                        itemToEquip ? `/items/${itemToEquip.id}.png` : undefined,
                        ninja.sprite,
                        itemToEquip?.iconEmoji
                      );
                    }}
                    style={rarity.cardStyle}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all hover:scale-105 flex items-center justify-between gap-3 border ${rarity.cardBorder} ${rarity.cardBg}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <NinjaAvatar
                        src={ninja.sprite}
                        name={translatedName}
                        rank={ninja.rank}
                        className="w-10 h-10 object-contain bg-black/30 rounded border border-white/10 p-0.5 shrink-0"
                      />
                      <div className="text-left min-w-0">
                        <div className={`font-bold text-xs truncate ${rarity.textColor}`}>{translatedName}</div>
                        <div className="text-[10px] text-gray-300 font-mono font-semibold leading-tight mt-0.5">
                          {ninja.equippedItem
                            ? (lang === "it" ? `Attuale: ${ninja.equippedItem.name[lang]}` : `Equipped: ${ninja.equippedItem.name[lang]}`)
                            : (lang === "it" ? "Nessuno strumento" : "No item")}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl font-bold font-mono text-xs bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 shrink-0"
                    >
                      {t.equipBtn}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setEquipTargetItemId(null)}
              className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-xs uppercase tracking-wider border border-gray-700 transition-colors"
            >
              {t.noCancel}
            </button>
          </div>
        </div>
      )}
      {showInviteModal && <InviteFriendModal onClose={() => setShowInviteModal(false)} />}
      {showLeaderboardModal && <LeaderboardModal onClose={() => setShowLeaderboardModal(false)} />}
      {showAchievementsModal && (
        <AchievementsModal
          onClose={() => setShowAchievementsModal(false)}
          onOpenAuthModal={() => {
            setShowAchievementsModal(false);
            setAuthModalRegisterMode(true);
            setShowAuthModal(true);
          }}
        />
      )}

      {/* SAGA COMPLETION VICTORY CELEBRATION MODAL */}
      {completedSagaVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-[#1a233d] via-[#0f152d] to-[#070b19] border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_60px_rgba(255,159,28,0.5)] relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-yellow-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="relative mb-4 flex items-center justify-center">
              <img
                src="/victory.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/trophy.png";
                }}
                alt="Saga Cleared"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] animate-bounce"
              />
            </div>

            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
              <span>✦</span> 🏆 {lang === "it" ? "SAGA COMPLETATA CON SUCCESSO" : "SAGA CLEARED SUCCESSFULLY"} <span>✦</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
              {completedSagaVictory.sagaId === "classic_naruto"
                ? (lang === "it" ? "Complimenti, hai vinto la Saga Classica!" : "Congratulations, you beat the Classic Saga!")
                : (lang === "it" ? "Complimenti, hai vinto la Saga Shippuden!" : "Congratulations, you beat the Shippuden Saga!")}
            </h2>
            <p className="text-xs text-slate-300 mb-5 font-medium leading-relaxed">
              {completedSagaVictory.sagaId === "classic_naruto"
                ? (lang === "it"
                  ? "Hai sconfitto tutti i boss e sbloccato la Saga Shippuden!"
                  : "You defeated all bosses and unlocked the Shippuden Saga!")
                : (lang === "it"
                  ? "Sei diventato il ninja supremo del mondo Shinobi!"
                  : "You became the ultimate ninja of the Shinobi world!")}
            </p>

            <div className="w-full bg-black/60 border border-amber-500/40 rounded-2xl p-4 mb-6 font-mono grid grid-cols-2 gap-2 shadow-inner">
              <div className="flex flex-col items-center justify-center">
                <div className="text-[10px] text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <img src="/score_icon.png" alt="Punti" className="w-4 h-4 object-contain" />
                  <span>{lang === "it" ? "Punti Run" : "Run Score"}</span>
                </div>
                <div className="text-lg font-black text-amber-300">
                  +{completedSagaVictory.scoreGained.toLocaleString()} pts
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-amber-500/20">
                <div className="text-[10px] text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Monete" className="w-4 h-4 object-contain" />
                  <span>{lang === "it" ? "Monete Ryo" : "Ryo Coins"}</span>
                </div>
                <div className="text-lg font-black text-yellow-400">
                  +{completedSagaVictory.coinsGained.toLocaleString()} ryo
                </div>
              </div>
            </div>

            <button
              onClick={dismissSagaVictory}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-black text-sm sm:text-base rounded-xl shadow-xl uppercase tracking-wider transition-all duration-200 transform hover:scale-[1.02] border-b-4 border-amber-700 cursor-pointer"
            >
              ⚡ {lang === "it" ? "RITORNA ALLA HOME" : "RETURN TO HOME"}
            </button>
          </div>
        </div>
      )}
      <TrophyUnlockNotification achievement={newlyUnlockedTrophy} onDismiss={dismissTrophyNotification} />
      <TutorialOverlay />

      {/* HAMBURGER SIDE DRAWER */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
          />
          {/* Drawer (Opens from Left) */}
          <div className="fixed top-0 left-0 h-full w-80 bg-[#0f152d] border-r-4 border-[#ff9f1c] shadow-2xl z-50 p-6 flex flex-col justify-between animate-slide-in overflow-y-auto">
            <div>
              <div className="flex justify-between items-center border-b-2 border-gray-800 pb-3 mb-6">
                <h2 className="text-xl font-extrabold text-[#ff9f1c] tracking-wider">
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
                      <div className="mb-3 flex items-center gap-3 bg-[#0f152d] p-2.5 rounded-xl border border-amber-500/40">
                        <img
                          src={avatarUrl || "/default_avatar.png"}
                          alt={username || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500"
                        />
                        <div className="min-w-0">
                          <span className="font-extrabold text-[#ff9f1c] text-sm block truncate">
                            {username || user?.user_metadata?.username || user?.email?.split("@")[0] || "Shinobi"}
                          </span>
                          <span className="text-xs text-slate-300 font-medium block truncate mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-2 bg-red-950/60 hover:bg-red-900/60 text-red-400 font-bold border border-red-500/30 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {lang === "it" ? "Disconnetti" : "Sign Out"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-300 font-medium mb-3">
                        {lang === "it"
                          ? "Accedi per sincronizzare i salvataggi ed i progressi in cloud."
                          : "Sign in to synchronize your active saves and progression to the cloud."}
                      </p>
                      <button
                        onClick={() => {
                          setShowAuthModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-2 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <img
                          src="/cloud.png"
                          alt="Cloud"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.display = "none";
                          }}
                          className="h-5 w-auto object-contain shrink-0 filter drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                        />
                        <span>{t.authCloudSaves}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Run Statistics Box */}
                <div className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl text-left space-y-2">
                  <h3 className="text-xs text-[#ff9f1c] uppercase font-bold tracking-widest mb-3 flex items-center justify-center gap-2.5 text-center border-b border-gray-800/60 pb-2">
                    <img
                      src="/menu_stats.png"
                      alt="Statistiche"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{t.runStatsTitle}</span>
                  </h3>
                  <div className="flex justify-between items-center text-xs border-b border-gray-800/80 pb-1.5 mb-1.5">
                    <span className="text-slate-200 font-bold flex items-center gap-2">
                      <img
                        src="/score_icon.png"
                        alt="Punti"
                        className="w-5 h-5 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                      />
                      <span>{lang === "it" ? "Punteggio Totale:" : "Total Score:"}</span>
                    </span>
                    <span className="font-extrabold text-amber-300">{totalScore.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{t.totalRuns}:</span>
                    <span className="font-bold text-[#ff9f1c]">{totalRunsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{t.classicRuns}:</span>
                    <span className="font-bold text-green-400">{classicRunsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{t.shippudenRuns}:</span>
                    <span className="font-bold text-blue-400">{shippudenRunsCount}</span>
                  </div>
                </div>

                {/* Settings Item: Language & Tutorial */}
                <div className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl text-left space-y-3">
                  <h3 className="text-xs text-[#ff9f1c] uppercase font-bold tracking-widest mb-3 flex items-center justify-center gap-2.5 text-center border-b border-gray-800/60 pb-2">
                    <img
                      src="/menu_settings.png"
                      alt="Impostazioni"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{t.menuSettings}</span>
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-200 font-medium">
                      {lang === "it" ? "Lingua Gioco" : "Game Language"}
                    </span>
                    <button
                      onClick={() => setLanguage(lang === "it" ? "en" : "it")}
                      className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-[#ff9f1c] font-extrabold rounded-xl border border-[#ff9f1c]/40 uppercase tracking-widest transition-all cursor-pointer shadow-md text-xs"
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
                  className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-slate-100 font-semibold transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src="/menu_credits.png"
                      alt="Crediti"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{t.menuCredits}</span>
                  </span>
                  <span className="text-[#ff9f1c]">➔</span>
                </button>

                {/* Patch Notes Link */}
                <button
                  onClick={() => {
                    setShowPatchNotesModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-slate-100 font-semibold transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src="/menu_notes.png"
                      alt="Note"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{lang === "it" ? "Note sulla Versione" : "Patch Notes"}</span>
                  </span>
                  <span className="text-[#ff9f1c]">➔</span>
                </button>

                {/* Privacy Policy Link */}
                <button
                  onClick={() => {
                    setShowPrivacyModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-[#070b19]/80 hover:bg-[#0f152d] border border-gray-800 hover:border-[#ff9f1c]/40 p-4 rounded-2xl flex items-center justify-between text-sm text-slate-100 font-semibold transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src="/menu_privacy.png"
                      alt="Privacy"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
                    />
                    <span>{lang === "it" ? "Privacy Policy" : "Privacy Policy"}</span>
                  </span>
                  <span className="text-[#ff9f1c]">➔</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 text-center">
              <p className="text-[10px] text-gray-400 font-mono">
                {lang === "it" ? "NarutoLike v1.0.0 • Progetto Fan-Made" : "NarutoLike v1.0.0 • Fan-Made Project"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ACTIVE CONSUMABLE EFFECTS BADGES (PERSISTENT UNTIL EFFECT EXPIRES) */}
      {activeConsumableEffects.length > 0 && (
        <div className="fixed bottom-5 left-5 z-[90] flex flex-col gap-2 pointer-events-auto">
          {activeConsumableEffects.map((eff) => (
            <div
              key={eff.item.id}
              className="bg-[#0f152d]/95 border-2 border-emerald-500/80 rounded-2xl px-3.5 py-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2.5 backdrop-blur-md animate-fade-in cursor-help"
              title={eff.item.description[lang]}
            >
              <div className="w-8 h-8 p-1 bg-black/60 rounded-xl border border-emerald-400/50 flex items-center justify-center shrink-0">
                <img
                  src={`/items/${eff.item.id}.png`}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                    const parent = (e.currentTarget as HTMLElement).parentElement;
                    if (parent && !parent.querySelector(".eff-emoji")) {
                      const span = document.createElement("span");
                      span.className = "eff-emoji text-sm";
                      span.innerText = eff.item.iconEmoji;
                      parent.appendChild(span);
                    }
                  }}
                  alt={eff.item.name[lang]}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-emerald-300 leading-tight truncate">
                  {eff.item.name[lang]}
                </div>
                <div className="text-[10px] text-gray-300 font-mono font-bold">
                  ⌛ {eff.remainingBattles} {lang === "it" ? (eff.remainingBattles === 1 ? "battaglia rimanente" : "battaglie rimanenti") : (eff.remainingBattles === 1 ? "battle remaining" : "battles remaining")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GLOBAL TOAST NOTIFICATION CONTAINER (BOTTOM RIGHT SLIDE UP) */}
      <div
        className={`fixed bottom-5 right-5 z-[100] transition-all duration-500 transform ${toastData ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "translate-y-12 opacity-0 scale-90 pointer-events-none"
          }`}
      >
        <div className="bg-[#0f152d]/95 text-amber-300 font-bold px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(255,159,28,0.5)] border-2 border-[#ff9f1c] flex items-center gap-3 max-w-md backdrop-blur-md">
          {/* Item & Ninja Avatars display */}
          <div className="flex items-center gap-1.5 shrink-0">
            {toastData?.itemImg ? (
              <div className="w-8 h-8 p-1 bg-black/60 rounded-xl border border-purple-500/50 flex items-center justify-center relative">
                <img
                  src={toastData.itemImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                    const parent = (e.currentTarget as HTMLElement).parentElement;
                    if (parent && !parent.querySelector(".toast-emoji")) {
                      const span = document.createElement("span");
                      span.className = "toast-emoji text-sm";
                      span.innerText = toastData.itemEmoji || "📜";
                      parent.appendChild(span);
                    }
                  }}
                  alt="Item"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]"
                />
              </div>
            ) : (
              <span className="text-xl">📜</span>
            )}

            {toastData?.ninjaImg && (
              <div className="w-8 h-8 p-0.5 bg-black/60 rounded-xl border border-amber-500/50 flex items-center justify-center">
                <NinjaAvatar
                  src={toastData.ninjaImg}
                  name="Shinobi"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <span className="text-xs sm:text-sm font-mono leading-tight text-white">{toastData?.text}</span>
        </div>
      </div>
    </main>
  );
}