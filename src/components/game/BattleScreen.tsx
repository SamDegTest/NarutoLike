import React, { useState, useEffect, useRef } from "react";
import { useBattleStore } from "@/store/useBattleStore";
import { useGameStore } from "@/store/useGameStore";
import { NinjaAvatar } from "@/components/game/NinjaAvatar";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS, translateNinjaName } from "@/data/translations";

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
  const { playerTeam: finalPlayerTeam, opponentTeam: finalOpponentTeam, battleStatus, battleSteps, claimVictory, resetBattle } = useBattleStore();
  const { endRun, selectSaga } = useGameStore();
  const { language: lang } = useLanguageStore();
  const t = TRANSLATIONS[lang];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState<"normal" | "fast">("normal");
  const [animatingSymbol, setAnimatingSymbol] = useState<{ symbol: string; direction: "left-to-right" | "right-to-left" } | null>(null);
  const [coords, setCoords] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeFighterId, setActiveFighterId] = useState<string | null>(null);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);

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
        if (nextStep.attackerId && nextStep.elementSymbol) {
          setAnimatingSymbol({
            symbol: nextStep.elementSymbol,
            direction: nextStep.isPlayerAttacking ? "left-to-right" : "right-to-left"
          });
          setActiveFighterId(nextStep.attackerId);
          setActiveTargetId(nextStep.targetId);

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

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStepIndex]);

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

      <div className="w-full max-w-4xl bg-[#0f152d] border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[94dvh]">
        
        {/* MINIMAL SLEEK HEADER */}
        <header className="bg-[#070b19] border-b border-amber-500/20 px-4 py-2.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-amber-400 tracking-wider uppercase">
              ⚔️ {lang === "it" ? "Scontro" : "Battle"}
            </span>
            <span className="text-xs text-gray-400 font-mono bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700">
              {lang === "it" ? "Turno" : "Turn"} {currentStepIndex + 1}/{stepsCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && (
              <>
                <button
                  onClick={handleSpeedToggle}
                  className="px-2.5 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold border border-amber-500/30 rounded transition-all cursor-pointer"
                >
                  ⚡ {speed === "normal" ? "1x" : "2x"}
                </button>

                <button
                  onClick={handleSkip}
                  className="px-2.5 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 rounded transition-all cursor-pointer"
                >
                  ⏩ {lang === "it" ? "Salta" : "Skip"}
                </button>
              </>
            )}
          </div>
        </header>

        {/* BATTLEFIELD SQUAD COLUMNS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 sm:p-4 min-h-0 overflow-y-auto relative bg-[#070b19]/60">
          
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
                  className="w-14 h-14 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2"
                />
              ) : (
                <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] -translate-x-1/2 -translate-y-1/2 block select-none">
                  {animatingSymbol.symbol}
                </span>
              )}
            </div>
          )}

          {/* PLAYER SQUAD COLUMN */}
          <div className="bg-[#0f152d]/90 p-3 rounded-xl border border-blue-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase border-b border-blue-500/20 pb-1 mb-2 tracking-wider">
                🛡️ {lang === "it" ? "I Tuoi Shinobi" : "Your Squad"}
              </div>
              <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                {currentStep.playerTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const chakraPercent = Math.max(0, (ninja.currentChakra / ninja.baseStats.chakra) * 100);
                  const isDefeated = ninja.currentHp <= 0;

                  const isAttacking = activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetId === ninja.id;

                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-blue scale-[1.01]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.01]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-player-${ninja.id}`}
                      className={`p-2 rounded-lg border bg-gray-900/80 transition-all duration-200 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-8 h-8 object-contain bg-black/40 rounded border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex justify-between items-center">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-gray-200 text-xs truncate">{translatedName}</span>
                            <span className="text-[10px] text-[#ff9f1c] font-mono shrink-0">
                              Lv.{(ninja as any).level || 1}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-300 font-mono font-bold">
                            {ninja.currentHp}/{ninja.baseStats.hp}
                          </span>
                        </div>
                      </div>

                      {/* HP BAR */}
                      <div className="w-full bg-gray-800 h-1.5 rounded overflow-hidden mb-1">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-200"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>

                      {/* CHAKRA BAR */}
                      <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
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

          {/* OPPONENT SQUAD COLUMN */}
          <div className="bg-[#0f152d]/90 p-3 rounded-xl border border-red-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <div className="text-xs font-bold text-red-400 uppercase border-b border-red-500/20 pb-1 mb-2 tracking-wider">
                ⚔️ {lang === "it" ? "Avversari" : "Enemies"}
              </div>
              <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                {currentStep.opponentTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const isDefeated = ninja.currentHp <= 0;

                  const isAttacking = activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetId === ninja.id;

                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-red scale-[1.01]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.01]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-opponent-${ninja.id}`}
                      className={`p-2 rounded-lg border bg-gray-900/80 transition-all duration-200 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-8 h-8 object-contain bg-black/40 rounded border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex justify-between items-center">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-gray-200 text-xs truncate">{translatedName}</span>
                            <span className="text-[10px] text-[#ff9f1c] font-mono shrink-0">
                              Lv.{(ninja as any).level || 1}
                            </span>
                          </div>
                          <span className="text-[10px] text-red-300 font-mono font-bold">
                            {ninja.currentHp}/{ninja.baseStats.hp}
                          </span>
                        </div>
                      </div>

                      {/* HP BAR */}
                      <div className="w-full bg-gray-800 h-1.5 rounded overflow-hidden">
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

            {/* RESOLUTION ACTION BUTTONS */}
            {isFinished && battleStatus !== null && (
              <div className="mt-3 border-t border-gray-800 pt-2 flex flex-col items-center shrink-0">
                {battleStatus === "victory" && (
                  <button
                    onClick={claimVictory}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm rounded-xl shadow-lg uppercase tracking-wider transition-all border-b-4 border-green-950"
                  >
                    🏆 {t.claimVictoryBtn}
                  </button>
                )}
                {battleStatus === "defeat" && (
                  <div className="w-full flex flex-col gap-2">
                    <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-2 text-center font-mono">
                      <div className="text-[10px] text-gray-300 uppercase tracking-wider">
                        🎯 {lang === "it" ? "Punti Guadagnati In Questa Run" : "Points Earned This Run"}
                      </div>
                      <div className="text-lg font-black text-amber-300">
                        +{useGameStore.getState().currentRunScore.toLocaleString()} pts
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          resetBattle();
                          endRun();
                        }}
                        className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-lg shadow uppercase transition-all border border-gray-700 cursor-pointer"
                      >
                        🏠 {t.returnHomeBtn}
                      </button>
                      <button
                        onClick={() => {
                          const saga = useGameStore.getState().activeSagaId;
                          resetBattle();
                          endRun();
                          if (saga) {
                            useGameStore.getState().selectSaga(saga);
                          }
                        }}
                        className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow uppercase transition-all border-b-4 border-amber-900 cursor-pointer"
                      >
                        🔄 {lang === "it" ? "Nuova Run" : "New Run"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MINIMAL LIVE BATTLE LOG FOOTER */}
        <footer className="bg-[#070b19] border-t border-gray-800 p-3 h-24 shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs text-gray-300 pr-1">
            {visibleLogs.map((log, index) => {
              const isSuperEffective = log.includes("SUPER EFFICACE");
              const isDamage = log.includes("danni") || log.includes("damage");
              const isHealing = log.includes("cura") || log.includes("heal");
              const isDefeated = log.includes("sconfitto") || log.includes("defeated");

              return (
                <p 
                  key={index} 
                  className={
                    isSuperEffective
                      ? "text-yellow-300 font-extrabold"
                      : isDamage 
                      ? "text-amber-200 font-semibold" 
                      : log.includes("usa") || log.includes("attacks")
                      ? "text-cyan-300 font-semibold" 
                      : isHealing
                      ? "text-emerald-300 font-semibold"
                      : isDefeated 
                      ? "text-red-400 font-extrabold" 
                      : "text-gray-400"
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
    </div>
  );
}
