import React, { useState, useEffect, useRef } from "react";
import { useBattleStore } from "@/store/useBattleStore";
import { useGameStore } from "@/store/useGameStore";
import { NinjaAvatar } from "@/components/game/NinjaAvatar";
import { JUTSU_MAP } from "@/data/jutsus";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS, translateNinjaName } from "@/data/translations";
import { ChakraChartModal } from "@/components/game/ChakraChartModal";

function getElementImage(symbol: string): string {
  switch (symbol) {
    case "🌪️": return "/elements/vento.png";
    case "⚡": return "/elements/fulmine.png";
    case "🪨": return "/elements/terra.png";
    case "💧": return "/elements/acqua.png";
    case "🔥": return "/elements/fuoco.png";
    default: return "";
  }
}

export function BattleScreen() {
  const { playerTeam: finalPlayerTeam, opponentTeam: finalOpponentTeam, battleLogs: finalLogs, battleStatus, battleSteps, claimVictory, resetBattle } = useBattleStore();
  const { endRun, selectSaga, activeSagaId } = useGameStore();
  const { language: lang } = useLanguageStore();
  const t = TRANSLATIONS[lang];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState<"normal" | "fast">("normal");
  const [animatingSymbol, setAnimatingSymbol] = useState<{ symbol: string; direction: "left-to-right" | "right-to-left" } | null>(null);
  const [coords, setCoords] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeFighterId, setActiveFighterId] = useState<string | null>(null);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [showChakraChartModal, setShowChakraChartModal] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (!animatingSymbol) setCoords(null);
  }, [animatingSymbol]);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const stepsCount = battleSteps.length;
  const isFinished = currentStepIndex >= stepsCount - 1;

  // Spacebar/Enter shortcut to skip battle animation or claim victory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (isFinished) {
          if (battleStatus === "victory") {
            claimVictory();
          } else {
            resetBattle();
            endRun();
            selectSaga(null);
          }
        } else {
          setCurrentStepIndex(Math.max(0, stepsCount - 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, battleStatus, stepsCount, claimVictory, resetBattle, endRun, selectSaga]);

  // Current step state
  const currentStep = battleSteps[currentStepIndex] || {
    playerTeam: finalPlayerTeam,
    opponentTeam: finalOpponentTeam,
    log: t.battleStarting,
    attackerId: "",
    targetId: "",
    elementSymbol: "",
    isPlayerAttacking: false,
    damage: 0,
    isHealing: false,
  };

  useEffect(() => {
    if (isFinished) return;

    const delay = speed === "fast" ? 280 : 1100;
    const timer = setTimeout(() => {
      const nextStepIndex = currentStepIndex + 1;
      const nextStep = battleSteps[nextStepIndex];

      if (nextStep) {
        // Trigger animation
        if (nextStep.attackerId && nextStep.elementSymbol) {
          setAnimatingSymbol({
            symbol: nextStep.elementSymbol,
            direction: nextStep.isPlayerAttacking ? "left-to-right" : "right-to-left"
          });
          setActiveFighterId(nextStep.attackerId);
          setActiveTargetId(nextStep.targetId);

          // Calculate elements position in viewport
          setTimeout(() => {
            const attackerSide = nextStep.isPlayerAttacking ? "player" : "opponent";
            const targetSide = nextStep.isHealing 
              ? (nextStep.isPlayerAttacking ? "player" : "opponent")
              : (nextStep.isPlayerAttacking ? "opponent" : "player");

            const attackerEl = document.getElementById(`battle-${attackerSide}-${nextStep.attackerId}`);
            const targetEl = document.getElementById(`battle-${targetSide}-${nextStep.targetId}`);

            if (attackerEl && targetEl) {
              const aRect = attackerEl.getBoundingClientRect();
              const tRect = targetEl.getBoundingClientRect();
              setCoords({
                startX: aRect.left + aRect.width / 2,
                startY: aRect.top + aRect.height / 2,
                endX: tRect.left + tRect.width / 2,
                endY: tRect.top + tRect.height / 2,
              });
            }
          }, 10);

          // Clear animation state
          setTimeout(() => {
            setAnimatingSymbol(null);
            setActiveFighterId(null);
            setActiveTargetId(null);
            setCoords(null);
          }, speed === "fast" ? 180 : 700);
        }
      }

      setCurrentStepIndex(nextStepIndex);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isFinished, speed, battleSteps]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStepIndex]);

  // Auto claim victory when finished
  useEffect(() => {
    if (isFinished && battleStatus === "victory") {
      const delay = speed === "fast" ? 400 : 1600;
      const timer = setTimeout(() => {
        claimVictory();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isFinished, battleStatus, claimVictory, speed]);

  const handleSkip = () => {
    setCurrentStepIndex(stepsCount - 1);
    setAnimatingSymbol(null);
    setActiveFighterId(null);
    setActiveTargetId(null);
    setCoords(null);
  };

  const handleSpeedToggle = () => {
    setSpeed((s) => (s === "normal" ? "fast" : "normal"));
  };

  // Build partial logs list to show progress
  const visibleLogs = battleSteps
    .slice(0, currentStepIndex + 1)
    .map((s) => s.log)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 font-sans text-white overflow-hidden">
      <style>{`
        @keyframes flyCustom {
          0% { transform: translate(var(--start-x), var(--start-y)) scale(0.6); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(var(--end-x), var(--end-y)) scale(1.5); opacity: 0; }
        }
        .animate-fly-custom {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          pointer-events: none;
          animation: flyCustom var(--fly-duration, 0.6s) cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .pulse-glow-blue {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
          border-color: #3b82f6 !important;
        }
        .pulse-glow-red {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
          border-color: #ef4444 !important;
        }
        .pulse-glow-target {
          box-shadow: 0 0 15px rgba(234, 179, 8, 0.8);
          border-color: #eab308 !important;
        }
      `}</style>

      <div className="w-full max-w-5xl bg-gray-900 border-4 border-orange-500 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[96dvh]">
        
        {/* HEADER WITH CONTROLS */}
        <header className="bg-orange-600/10 border-b border-orange-500/30 px-6 py-3 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold tracking-wider text-orange-400 uppercase">
              {lang === "it" ? "RISOLUZIONE DELLO SCONTRO" : "BATTLE RESOLUTION"}
            </h2>
            <div className="text-[10px] text-gray-400 uppercase font-mono">
              {lang === "it" ? "Progresso Turni" : "Turns Progress"}: {currentStepIndex + 1} / {stepsCount}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SPEED BUTTON */}
            {!isFinished && (
              <button
                onClick={handleSpeedToggle}
                className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-orange-300 font-bold border border-gray-700 rounded transition-colors"
              >
                {speed === "normal" ? t.speedNormal : t.speedFast}
              </button>
            )}

            {/* SKIP BUTTON */}
            {!isFinished && (
              <button
                onClick={handleSkip}
                className="px-3 py-1 text-xs bg-gray-800 hover:bg-red-950/60 text-red-400 font-bold border border-gray-700 rounded transition-colors"
              >
                {t.skipBattle} ⏩
              </button>
            )}

            {/* CHAKRA CHART BUTTON */}
            <button
              onClick={() => setShowChakraChartModal(true)}
              className="px-3 py-1 text-xs bg-gray-800 hover:bg-[#0f152d] text-yellow-400 font-bold border border-yellow-500/40 rounded transition-colors cursor-pointer"
              title={lang === "it" ? "Wiki & Guida Shinobi" : "Shinobi Wiki & Guide"}
            >
              📜 {lang === "it" ? "Wiki" : "Wiki"}
            </button>

            <div className="text-xs bg-gray-800 px-3 py-1 rounded border border-gray-700 text-gray-300">
              {lang === "it" ? "Stato" : "Status"}: <span className="font-semibold text-orange-400 uppercase">
                {isFinished ? (battleStatus === "victory" ? t.active : t.locked) : (lang === "it" ? "In Corso" : "In Progress")}
              </span>
            </div>
          </div>
        </header>

        {/* BATTLEFIELD STATUS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-0 overflow-y-auto relative">
          
          {/* FLYING ELEMENT SYMBOL OVERLAY */}
          {animatingSymbol && coords && (
            <div 
              style={{
                "--start-x": `${coords.startX}px`,
                "--start-y": `${coords.startY}px`,
                "--end-x": `${coords.endX}px`,
                "--end-y": `${coords.endY}px`,
                "--fly-duration": speed === "fast" ? "0.2s" : "0.6s",
              } as React.CSSProperties}
              className="animate-fly-custom"
            >
              {!imageError ? (
                <img
                  src={getElementImage(animatingSymbol.symbol)}
                  onError={() => setImageError(true)}
                  alt="Elemento"
                  className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2"
                />
              ) : (
                <span className="text-5xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] -translate-x-1/2 -translate-y-1/2 block select-none">
                  {animatingSymbol.symbol}
                </span>
              )}
            </div>
          )}

          {/* PLAYER SIDE */}
          <div className="bg-gray-850 p-4 rounded-xl border border-blue-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <h3 className="text-base font-bold text-blue-400 border-b border-blue-500/20 pb-1.5 mb-3 uppercase flex justify-between items-center">
                <span>{lang === "it" ? "I Tuoi Shinobi" : "Your Shinobi"}</span>
                <span className="text-xs text-gray-500 font-mono">{lang === "it" ? "Alleati" : "Allies"}</span>
              </h3>
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                {currentStep.playerTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const chakraPercent = Math.max(0, (ninja.currentChakra / ninja.baseStats.chakra) * 100);
                  const isDefeated = ninja.currentHp <= 0;
                  
                  const isAttacking = activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetId === ninja.id;
                  
                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-blue scale-[1.02]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.02]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-player-${ninja.id}`}
                      className={`p-2.5 rounded-lg border bg-gray-800/50 transition-all duration-205 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-700/60"
                      }`}
                    >
                      <div className="flex gap-2.5 items-center mb-1.5">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-9 h-9 object-contain bg-gray-900 rounded border border-gray-700 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-200 text-xs truncate leading-tight">{translatedName}</span>
                              <span className="text-[9px] text-[#ff9f1c] font-mono leading-none uppercase mt-0.5 font-bold">Lv. {ninja.level}</span>
                            </div>
                            <span className="text-[10px] bg-gray-700/60 px-1.5 py-0.5 rounded text-gray-300 font-mono font-bold">
                              HP: {ninja.currentHp}/{ninja.baseStats.hp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* HP BAR */}
                      <div className="w-full bg-gray-700/60 h-2 rounded-sm overflow-hidden mb-1.5 border border-gray-800">
                        <div
                          className="bg-green-500 h-full transition-all duration-200"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>

                      {/* CHAKRA BAR */}
                      <div className="w-full bg-gray-700/60 h-1 rounded-sm overflow-hidden border border-gray-800">
                        <div
                          className="bg-blue-500 h-full transition-all duration-200"
                          style={{ width: `${chakraPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OPPONENT SIDE */}
          <div className="bg-gray-850 p-4 rounded-xl border border-red-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <h3 className="text-base font-bold text-red-400 border-b border-red-500/20 pb-1.5 mb-3 uppercase flex justify-between items-center">
                <span>{lang === "it" ? "Nemici" : "Enemies"}</span>
                <span className="text-xs text-gray-500 font-mono">{lang === "it" ? "Avversari" : "Opponents"}</span>
              </h3>
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                {currentStep.opponentTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const isDefeated = ninja.currentHp <= 0;

                  const isAttacking = activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetId === ninja.id;

                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-red scale-[1.02]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.02]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-opponent-${ninja.id}`}
                      className={`p-2.5 rounded-lg border bg-gray-800/50 transition-all duration-205 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-700/60"
                      }`}
                    >
                      <div className="flex gap-2.5 items-center mb-1.5">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-9 h-9 object-contain bg-gray-900 rounded border border-gray-700 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-200 text-xs truncate leading-tight">{translatedName}</span>
                              <span className="text-[9px] text-[#ff9f1c] font-mono leading-none uppercase mt-0.5 font-bold">Lv. {ninja.level}</span>
                            </div>
                            <span className="text-[10px] bg-red-950/40 px-1.5 py-0.5 rounded text-red-300 font-mono font-bold">
                              HP: {ninja.currentHp}/{ninja.baseStats.hp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* HP BAR */}
                      <div className="w-full bg-gray-700/60 h-2 rounded-sm overflow-hidden border border-gray-800">
                        <div
                          className="bg-red-500 h-full transition-all duration-200"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RESOLUTION ACTIONS (ONLY SHOWN WHEN PLAYBACK REACHES THE END STATE) */}
            {isFinished && battleStatus !== null && (
              <div className="mt-4 border-t border-gray-800 pt-3 flex flex-col items-center shrink-0">
                {battleStatus === "victory" && (
                  <button
                    onClick={claimVictory}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-base rounded-lg shadow-lg uppercase tracking-wider transition-all border-b-4 border-green-950"
                  >
                    {t.claimVictoryBtn}
                  </button>
                )}
                {battleStatus === "defeat" && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        resetBattle();
                        endRun();
                      }}
                      className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all border border-gray-700"
                    >
                      {t.returnHomeBtn}
                    </button>
                    <button
                      onClick={() => {
                        const saga = activeSagaId;
                        resetBattle();
                        endRun();
                        if (saga) {
                          selectSaga(saga);
                        }
                      }}
                      className="flex-1 py-2.5 bg-red-700 hover:bg-red-650 text-white font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all border-b-4 border-red-950"
                    >
                      {lang === "it" ? "Fai un'altra Run" : "Run Again"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BATTLE EVENT LOGS */}
        <footer className="bg-gray-950 border-t border-gray-800 p-4 h-44 shrink-0 flex flex-col overflow-hidden">
          <h4 className="text-xs font-bold text-[#ff9f1c] mb-2 uppercase tracking-wider font-mono">{lang === "it" ? "Registro di Combattimento" : "Battle Logs"}</h4>
          <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs sm:text-sm text-gray-200 pr-1">
            {visibleLogs.map((log, index) => {
              const isSuperEffective = log.includes("SUPER EFFICACE");
              const isDamage = log.includes("danni") || log.includes("damage");
              const isHealing = log.includes("cura") || log.includes("heal");
              const isDefeated = log.includes("sconfitto") || log.includes("defeated");
              const isRound = log.includes("Round");

              return (
                <p 
                  key={index} 
                  className={
                    isSuperEffective
                      ? "text-yellow-300 font-extrabold bg-yellow-950/60 p-1 rounded border border-yellow-500/40"
                      : isDamage 
                      ? "text-amber-200 font-semibold" 
                      : log.includes("usa") || log.includes("attacks")
                      ? "text-cyan-300 font-semibold" 
                      : isHealing
                      ? "text-emerald-300 font-semibold"
                      : isDefeated 
                      ? "text-red-400 font-extrabold" 
                      : isRound
                      ? "text-purple-300 font-bold border-t border-gray-800 pt-1 mt-1 block"
                      : "text-gray-300"
                  }
                >
                  {log}
                </p>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </footer>
      </div>
      {showChakraChartModal && <ChakraChartModal onClose={() => setShowChakraChartModal(false)} />}
    </div>
  );
}
