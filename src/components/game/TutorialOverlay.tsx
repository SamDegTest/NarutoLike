"use client";

import React, { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useBattleStore } from "@/store/useBattleStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";
import { NINJA_MAP } from "@/data/ninjas";

export const TutorialOverlay: React.FC = () => {
  const {
    isTutorialActive,
    tutorialStep,
    isRunActive,
    nextTutorialStep,
    prevTutorialStep,
    skipTutorial,
    activeNodeTutorialPopup,
    dismissNodeTutorialPopup,
  } = useGameStore();

  const isBattleActive = useBattleStore((state) => state.isBattleActive);
  const lang = useLanguageStore((state) => state.language);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const [showEndModal, setShowEndModal] = useState(false);

  const pendingJutsuToLearn = useGameStore((state) => state.pendingJutsuToLearn);
  const activePowerUps = useGameStore((state) => state.activePowerUps);

  // Check if player has already used the scroll
  const hasUsedScroll = activePowerUps.some((p) => p.usedOnNinjaId);

  const availableRecruitChoices = useGameStore((state) => state.availableRecruitChoices);

  // Auto-advance step 1 -> step 2 when starter ninja is selected and run starts
  useEffect(() => {
    if (isTutorialActive && tutorialStep === 1 && isRunActive) {
      useGameStore.setState({ tutorialStep: 2 });
    }
  }, [isTutorialActive, tutorialStep, isRunActive]);

  // Auto-advance step 2 -> step 3 when player finishes using the scroll (hasUsedScroll becomes true)
  useEffect(() => {
    if (isTutorialActive && tutorialStep === 2 && isRunActive && hasUsedScroll) {
      useGameStore.setState({ tutorialStep: 3 });
    }
  }, [isTutorialActive, tutorialStep, isRunActive, hasUsedScroll]);

  // Track if Step 3 node action was initiated (recruitment opened or battle started)
  const [hasStartedStep3Action, setHasStartedStep3Action] = useState(false);

  useEffect(() => {
    if (isTutorialActive && tutorialStep === 3) {
      if (availableRecruitChoices || isBattleActive) {
        setHasStartedStep3Action(true);
      }
    }
  }, [isTutorialActive, tutorialStep, availableRecruitChoices, isBattleActive]);

  // Auto-advance step 3 -> step 4 ONLY when the action has STARTED and is NOW COMPLETED (recruitment overlay closed AND battle not active)
  useEffect(() => {
    if (isTutorialActive && tutorialStep === 3 && isRunActive && hasStartedStep3Action) {
      // Advance ONLY when recruitment is finished (choices closed) AND battle is completed/inactive
      if (!availableRecruitChoices && !isBattleActive) {
        useGameStore.setState({ tutorialStep: 4 });
      }
    }
  }, [isTutorialActive, tutorialStep, isRunActive, hasStartedStep3Action, availableRecruitChoices, isBattleActive]);

  // Map tutorial steps to target selector attributes
  const stepTargetSelectors: Record<number, string[]> = {
    1: ['[data-tutorial="starter-selection"]'],
    2: pendingJutsuToLearn
      ? ['[data-tutorial="scroll-modal"]']
      : ['[data-tutorial="team-panel"]', '[data-tutorial="map-section"]'],
    3: availableRecruitChoices
      ? ['[data-tutorial="recruit-modal"]']
      : isBattleActive
      ? ['[data-tutorial="battle-screen"]']
      : ['[data-tutorial="node-battle"]', '[data-tutorial="node-recruit"]'],
    4: ['[data-tutorial="node-heal"]'],
    5: ['[data-tutorial="node-boss"]'],
  };

  useEffect(() => {
    if (!isTutorialActive || showEndModal) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const selectors = stepTargetSelectors[tutorialStep] || [];
      const foundElements: Element[] = [];
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          foundElements.push(el);
        }
      }

      if (foundElements.length === 0) {
        setTargetRect(null);
        return;
      }

      let minLeft = Infinity;
      let minTop = Infinity;
      let maxRight = -Infinity;
      let maxBottom = -Infinity;
      let hasValid = false;

      for (const el of foundElements) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        hasValid = true;
        minLeft = Math.min(minLeft, rect.left);
        minTop = Math.min(minTop, rect.top);
        maxRight = Math.max(maxRight, rect.right);
        maxBottom = Math.max(maxBottom, rect.bottom);
      }

      if (!hasValid) {
        setTargetRect(null);
        return;
      }

      setTargetRect(new DOMRect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop));
    };

    updateRect();
    const interval = setInterval(updateRect, 250);
    window.addEventListener("resize", updateRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
    };
  }, [isTutorialActive, tutorialStep, showEndModal, pendingJutsuToLearn, availableRecruitChoices, isBattleActive]);

  // RENDER END OF TUTORIAL SCREEN
  if (isTutorialActive && showEndModal) {
    return (
      <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
        <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_60px_rgba(255,159,28,0.6)] text-center flex flex-col items-center relative">
          <div className="mb-4 animate-bounce">
            <img
              src="/achievements/tutorial_master.png"
              alt="Tutorial Completato"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) parent.innerText = "🎓";
              }}
              className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,159,28,0.7)]"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#ff9f1c] mb-3 font-mono tracking-wide">
            {t.tutorialEndTitle || "Tutorial Completato!"}
          </h2>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6 font-mono bg-black/30 p-4 rounded-xl border border-white/10">
            {t.tutorialEndText || "Ora sei pronto per l'avventura! Scegli il percorso che preferisci sulla mappa e affronta ogni sfida con strategia. Buona fortuna, Ninja!"}
          </p>

          <button
            onClick={() => {
              setShowEndModal(false);
              skipTutorial();
            }}
            className="w-full py-3.5 bg-[#ff9f1c] hover:bg-yellow-400 text-[#070b19] font-black rounded-xl text-sm uppercase tracking-wider transition-all border-b-4 border-amber-800 cursor-pointer shadow-xl active:translate-y-0.5"
          >
            {t.tutorialFinish ? t.tutorialFinish.replace("⚡", "").trim() : "Ho capito, Iniziamo!"}
          </button>
        </div>
      </div>
    );
  }

  // RENDER POPUP FOR NEW NODE TYPE EXPLANATIONS (PowerUp, Recruit, Heal, Boss)
  if (activeNodeTutorialPopup) {
    const popupTitle = t[activeNodeTutorialPopup.titleKey as keyof typeof t] || activeNodeTutorialPopup.titleKey;
    const popupText = t[activeNodeTutorialPopup.textKey as keyof typeof t] || activeNodeTutorialPopup.textKey;

    return (
      <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in">
        <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-[0_0_50px_rgba(255,159,28,0.5)] text-center flex flex-col items-center relative">
          <div className="flex items-center justify-between w-full mb-3 border-b border-amber-500/30 pb-2">
            <div className="flex items-center gap-2">
              <img
                src="/cloud.png"
                alt="Cloud"
                className="h-6 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
              />
              <span className="text-xs font-mono font-extrabold text-amber-300 uppercase tracking-widest">
                GUIDA NUOVA TAPPA
              </span>
            </div>
            <button
              onClick={dismissNodeTutorialPopup}
              className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-[#ff9f1c] mb-2 font-mono tracking-wide">
            {popupTitle}
          </h3>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6 font-mono">
            {popupText}
          </p>

          <button
            onClick={dismissNodeTutorialPopup}
            className="w-full py-3 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-black rounded-xl text-xs uppercase tracking-wider transition-all border-b-4 border-amber-800 cursor-pointer shadow-lg active:translate-y-0.5"
          >
            {t.tutorialFinish || "Ho Capito, Continua! ⚡"}
          </button>
        </div>
      </div>
    );
  }

  if (!isTutorialActive) return null;

  const stepTitles: Record<number, string> = {
    1: t.tutorialStep1Title,
    2: t.tutorialStep2Title,
    3: t.tutorialStep3Title,
    4: t.tutorialStep4Title,
    5: t.tutorialStep5Title,
  };

  const stepTexts: Record<number, string> = {
    1: t.tutorialStep1Text,
    2: pendingJutsuToLearn
      ? (t.tutorialStep2TextPhase2 || "Ottimo! Ora che hai attivato il Rotolo, clicca sulla carta del tuo ninja nella squadra a sinistra per potenziarlo!")
      : t.tutorialStep2Text,
    3: t.tutorialStep3Text,
    4: t.tutorialStep4Text,
    5: t.tutorialStep5Text,
  };

  // Action is required for step 1, step 2 (until scroll used), and step 3 (must pick a node)
  const isActionRequired = tutorialStep === 1 || (tutorialStep === 2 && !hasUsedScroll) || tutorialStep === 3;

  // Determine tooltip placement (above or below target)
  const isBottomHalf = targetRect ? targetRect.top > window.innerHeight / 2 : false;

  const handleNextStep = () => {
    if (tutorialStep === 5) {
      setShowEndModal(true);
    } else {
      nextTutorialStep();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none select-none">
      {/* 4-Rectangle Cutout Backdrop allowing direct click-through to highlighted target element */}
      {targetRect ? (
        <>
          {/* Top backdrop */}
          <div
            className="fixed left-0 top-0 right-0 bg-black/80 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
            style={{ height: `${Math.max(0, targetRect.top - 8)}px` }}
          />
          {/* Bottom backdrop */}
          <div
            className="fixed left-0 right-0 bottom-0 bg-black/80 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
            style={{ top: `${Math.min(window.innerHeight, targetRect.bottom + 8)}px` }}
          />
          {/* Left backdrop */}
          <div
            className="fixed left-0 bg-black/80 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
            style={{
              top: `${Math.max(0, targetRect.top - 8)}px`,
              height: `${targetRect.height + 16}px`,
              width: `${Math.max(0, targetRect.left - 8)}px`,
            }}
          />
          {/* Right backdrop */}
          <div
            className="fixed right-0 bg-black/80 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
            style={{
              top: `${Math.max(0, targetRect.top - 8)}px`,
              height: `${targetRect.height + 16}px`,
              left: `${Math.min(window.innerWidth, targetRect.right + 8)}px`,
            }}
          />

          {/* Animated Glowing Golden Spotlight Border around the active element */}
          <div
            className="fixed z-[201] transition-all duration-300 rounded-2xl border-4 border-amber-400 shadow-[0_0_35px_rgba(255,159,28,0.95)] animate-pulse pointer-events-none"
            style={{
              top: `${Math.max(0, targetRect.top - 8)}px`,
              left: `${Math.max(0, targetRect.left - 8)}px`,
              width: `${targetRect.width + 16}px`,
              height: `${targetRect.height + 16}px`,
            }}
          />
        </>
      ) : (
        /* Full Backdrop if target element is not found */
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] pointer-events-auto transition-all duration-300" />
      )}

      {/* Tutorial Floating Guidance Box */}
      <div
        className={`fixed z-[202] flex items-center justify-center p-1.5 sm:p-4 pointer-events-auto transition-all duration-300 ${
          tutorialStep === 3 && availableRecruitChoices
            ? "top-1 left-1 sm:top-2 sm:left-2 right-auto bottom-auto max-w-[210px] sm:max-w-[240px] lg:bottom-6 lg:right-6 lg:left-auto lg:top-auto lg:max-w-sm"
            : tutorialStep === 2 && pendingJutsuToLearn
            ? "top-1 right-1 sm:top-2 sm:right-2 left-auto bottom-auto max-w-[210px] sm:max-w-[240px] lg:bottom-6 lg:right-6 lg:top-auto lg:max-w-sm"
            : targetRect
            ? isBottomHalf
              ? "top-2 right-2 sm:top-6 sm:right-6 left-auto bottom-auto max-w-[250px] sm:max-w-xs lg:max-w-sm"
              : "bottom-2 right-2 sm:bottom-6 sm:right-6 left-auto top-auto max-w-[250px] sm:max-w-xs lg:max-w-sm"
            : tutorialStep >= 2
            ? "bottom-2 sm:bottom-6 right-2 sm:right-6 left-auto top-auto max-w-[290px] sm:max-w-xs lg:max-w-sm"
            : "inset-0"
        }`}
      >
        <div className="bg-[#0f152d] border-3 sm:border-4 border-[#ff9f1c] rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.95)] animate-fade-in text-center flex flex-col items-center relative max-h-[85vh] overflow-y-auto">
          
          {/* Header Badge */}
          <div className="flex items-center justify-between w-full mb-2.5 border-b border-amber-500/30 pb-2">
            <div className="flex items-center gap-2">
              <img
                src="/cloud.png"
                alt="Cloud"
                className="h-5 sm:h-6 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
              />
              <span className="text-[11px] sm:text-xs font-mono font-extrabold text-amber-300 uppercase tracking-widest">
                TUTORIAL INTERATTIVO • STEP {tutorialStep}/5
              </span>
            </div>
            <button
              onClick={skipTutorial}
              className="text-[11px] sm:text-xs font-bold text-gray-400 hover:text-red-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              {t.tutorialSkip}
            </button>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-[#ff9f1c] mb-1.5 font-mono tracking-wide">
            {stepTitles[tutorialStep]}
          </h3>

          {/* Real Node Graphic representation depending on step */}
          {!(tutorialStep === 3 && availableRecruitChoices) && (
            <div className="my-1.5 flex items-center justify-center">
              {tutorialStep === 2 && (
                <img
                  src="/sprites/jutsus/Scrolls.png"
                  alt="Rotolo Proibito"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,159,28,0.8)]"
                />
              )}
              {tutorialStep === 3 && (() => {
                const activeMap = useGameStore.getState().activeMap;
                const battleNode = activeMap.find((n) => n.stage === 1 && n.type === "battle");
                const oppId = battleNode?.opponents?.[0];
                const oppNinja = oppId ? NINJA_MAP.get(oppId) : null;
                const enemySprite = oppNinja?.sprite || "/sprites/naruto_kid.png";

                return (
                  <div className="flex items-center gap-4 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                    <img
                      src={enemySprite}
                      alt="Combattimento"
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain filter drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                    />
                    <span className="text-xs text-gray-400 font-mono font-bold">vs</span>
                    <img
                      src="/academy.png"
                      alt="Accademia Ninja"
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain filter drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                    />
                  </div>
                );
              })()}
              {tutorialStep === 4 && (
                <img
                  src="/ramen.png"
                  alt="Ramen Ichiraku"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                />
              )}
              {tutorialStep === 5 && (() => {
                const activeMap = useGameStore.getState().activeMap;
                const bossNode = activeMap.find((n) => n.type === "boss");
                const bossId = bossNode?.opponents?.[0];
                const bossNinja = bossId ? NINJA_MAP.get(bossId) : null;
                const bossSprite = bossNinja?.sprite || "/sprites/mizuki.png";

                return (
                  <img
                    src={bossSprite}
                    alt={bossNinja?.name || "Boss Finale"}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                  />
                );
              })()}
            </div>
          )}

          {/* Action Prompt */}
          <p className="text-[10px] sm:text-xs text-gray-200 leading-tight sm:leading-relaxed mb-2 font-mono">
            {tutorialStep === 3 && availableRecruitChoices
              ? (lang === "it" ? "Seleziona un ninja dall'Accademia per aggiungerlo al tuo team!" : "Select a ninja from the Academy to add to your team!")
              : stepTexts[tutorialStep]}
          </p>

          {/* Step Actions */}
          <div className="flex items-center justify-between w-full gap-2 mt-auto">
            {tutorialStep > 4 ? (
              <button
                onClick={prevTutorialStep}
                className="py-1.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-[10px] sm:text-xs uppercase tracking-wider transition-all border border-gray-600 cursor-pointer shrink-0"
              >
                {t.tutorialPrev}
              </button>
            ) : <div />}

            {isActionRequired ? (
              <span className="w-full text-center text-[10px] sm:text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1.5 rounded-xl animate-pulse block">
                {tutorialStep === 2
                  ? pendingJutsuToLearn
                    ? (t.tutorialActionRequiredUseScroll || "Clicca sul tuo ninja nella squadra a sinistra per usare il rotolo!")
                    : "Clicca sul nodo del Rotolo in cima alla mappa!"
                  : tutorialStep === 3
                  ? "Scegli ed esegui un nodo evidenziato sulla mappa!"
                  : (t.tutorialActionRequired || "Esegui l'azione evidenziata per proseguire")}
              </span>
            ) : (
              <button
                onClick={handleNextStep}
                className="py-1.5 px-3.5 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-black rounded-xl text-[10px] sm:text-xs uppercase tracking-wider transition-all border-b-4 border-amber-800 cursor-pointer shadow-lg active:translate-y-0.5 shrink-0"
              >
                {tutorialStep === 5 ? t.tutorialFinish : t.tutorialNext}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
