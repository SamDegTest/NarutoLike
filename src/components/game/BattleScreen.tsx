import React, { useState, useEffect, useRef } from "react";
import { useBattleStore } from "@/store/useBattleStore";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { NinjaAvatar } from "@/components/game/NinjaAvatar";
import { ChakraNatureBadge } from "@/components/game/ChakraNatureBadge";
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
  const [activeFighterSide, setActiveFighterSide] = useState<"player" | "opp" | null>(null);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [activeTargetSide, setActiveTargetSide] = useState<"player" | "opp" | null>(null);

  useEffect(() => {
    setImageError(false);
    if (!animatingSymbol) setCoords(null);
  }, [animatingSymbol]);

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

  const isTutorialActive = useGameStore((state) => state.isTutorialActive);
  const activeNodeTutorialPopup = useGameStore((state) => state.activeNodeTutorialPopup);
  const isGamePaused = isTutorialActive || activeNodeTutorialPopup !== null;

  useEffect(() => {
    if (isFinished || isGamePaused) return;

    const delay = speed === "fast" ? 280 : 1100;
    const timer = setTimeout(() => {
      const nextStepIndex = currentStepIndex + 1;
      const nextStep = battleSteps[nextStepIndex];

      if (nextStep) {
        if (nextStep.attackerId && nextStep.elementSymbol) {
          const attackerSide = nextStep.isPlayerAttacking ? "player" : "opp";
          const targetSide = nextStep.isHealing 
            ? (nextStep.isPlayerAttacking ? "player" : "opp")
            : (nextStep.isPlayerAttacking ? "opp" : "player");

          setAnimatingSymbol({
            symbol: nextStep.elementSymbol,
            direction: nextStep.isPlayerAttacking ? "left-to-right" : "right-to-left"
          });
          setActiveFighterId(nextStep.attackerId);
          setActiveFighterSide(attackerSide);
          setActiveTargetId(nextStep.targetId);
          setActiveTargetSide(targetSide);

          setTimeout(() => {
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
            setActiveFighterSide(null);
            setActiveTargetId(null);
            setActiveTargetSide(null);
            setCoords(null);
          }, speed === "fast" ? 180 : 700);
        }
      }

      setCurrentStepIndex(nextStepIndex);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isFinished, speed, battleSteps, isGamePaused]);

  useEffect(() => {
    if (isFinished && battleStatus === "victory" && !isGamePaused) {
      const delay = speed === "fast" ? 600 : 1800;
      const timer = setTimeout(() => {
        claimVictory();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isFinished, battleStatus, claimVictory, speed, isGamePaused]);

  const handleSkip = () => {
    setCurrentStepIndex(stepsCount - 1);
    setAnimatingSymbol(null);
    setActiveFighterId(null);
    setActiveFighterSide(null);
    setActiveTargetId(null);
    setActiveTargetSide(null);
    setCoords(null);
  };

  const handleSpeedToggle = () => {
    setSpeed((s) => (s === "normal" ? "fast" : "normal"));
  };

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

        @keyframes outcomePop {
          0% { transform: scale(0.7) translateY(20px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes outcomeShake {
          0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
          20% { transform: scale(1.02) rotate(-2deg); opacity: 1; }
          40% { transform: rotate(2deg); }
          60% { transform: rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes chakraPulseGold {
          0%, 100% { box-shadow: 0 0 25px rgba(234, 179, 8, 0.4), inset 0 0 15px rgba(234, 179, 8, 0.2); }
          50% { box-shadow: 0 0 50px rgba(234, 179, 8, 0.8), inset 0 0 30px rgba(234, 179, 8, 0.4); }
        }
        @keyframes chakraPulseRed {
          0%, 100% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.2); }
          50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.8), inset 0 0 30px rgba(239, 68, 68, 0.4); }
        }
        .animate-outcome-victory {
          animation: outcomePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, chakraPulseGold 3s infinite ease-in-out;
        }
        .animate-outcome-defeat {
          animation: outcomeShake 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards, chakraPulseRed 3s infinite ease-in-out;
        }
      `}</style>

      <div data-tutorial="battle-screen" className="w-full max-w-4xl bg-[#0f152d] border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[94dvh] relative">
        {/* MINIMAL SLEEK HEADER */}
        <header className="bg-[#070b19] border-b border-amber-500/20 px-2.5 sm:px-4 py-2 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-base font-extrabold text-amber-400 tracking-wider uppercase truncate">
              ⚔️ {lang === "it" ? "Scontro Shinobi" : "Shinobi Battle"}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-800/80 px-1.5 sm:px-2 py-0.5 rounded border border-gray-700 shrink-0">
              {lang === "it" ? "T." : "T."} {Math.min(currentStepIndex + 1, stepsCount)}/{stepsCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!isFinished && (
              <>
                <button
                  onClick={handleSpeedToggle}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold border border-amber-500/30 rounded transition-all cursor-pointer"
                >
                  ⚡ {speed === "normal" ? "1x" : "2x"}
                </button>

                <button
                  onClick={handleSkip}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 rounded transition-all cursor-pointer"
                >
                  ⏩ {lang === "it" ? "Salta" : "Skip"}
                </button>
              </>
            )}
          </div>
        </header>

        {/* LIVE ACTION BAR */}
        {currentStep && currentStep.log && (
          <div className="bg-[#0b1022] border-b border-gray-800/60 px-2.5 sm:px-4 py-1.5 text-center text-[10px] sm:text-xs font-mono text-cyan-300 truncate shrink-0">
            💬 {currentStep.log}
          </div>
        )}

        {/* BATTLEFIELD SQUAD COLUMNS */}
        <div className="flex-1 grid grid-cols-2 gap-1.5 sm:gap-3 p-1.5 sm:p-4 min-h-0 overflow-y-auto relative bg-[#070b19]/60">
          
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
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2"
                />
              ) : (
                <span className="text-2xl sm:text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] -translate-x-1/2 -translate-y-1/2 block select-none">
                  {animatingSymbol.symbol}
                </span>
              )}
            </div>
          )}

          {/* PLAYER SQUAD COLUMN */}
          <div data-tutorial="battle-jutsu" className="bg-[#0f152d]/90 p-1.5 sm:p-3 rounded-xl border border-blue-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase border-b border-blue-500/20 pb-1 mb-1.5 tracking-wider truncate">
                🛡️ {lang === "it" ? "Squadra" : "Squad"}
              </div>
              <div className="space-y-1.5 sm:space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
                {currentStep.playerTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const chakraPercent = Math.max(0, (ninja.currentChakra / ninja.baseStats.chakra) * 100);
                  const isDefeated = ninja.currentHp <= 0;

                  const isAttacking = activeFighterSide === "player" && activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetSide === "player" && activeTargetId === ninja.id;

                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-blue scale-[1.01]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.01]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-player-${ninja.id}`}
                      className={`p-1.5 sm:p-2 rounded-lg border bg-gray-900/90 transition-all duration-200 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-7 h-7 sm:w-9 sm:h-9 object-contain bg-black/40 rounded border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className="font-bold text-gray-200 text-[10px] sm:text-xs truncate">{translatedName}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <ChakraNatureBadge nature={ninja.chakraNature} showText={false} />
                              <span className="text-[9px] sm:text-[10px] text-[#ff9f1c] font-mono shrink-0 font-bold">
                                Lv.{(ninja as any).level || 1}
                              </span>
                            </div>
                          </div>
                          <div className="text-[8px] sm:text-[10px] text-gray-400 font-mono font-bold leading-tight flex items-center justify-between">
                            <span>{ninja.currentHp}/{ninja.baseStats.hp}</span>
                            {ninja.equippedItem && (
                              <span
                                className="text-[8px] text-purple-300 bg-purple-950/80 px-1 py-0.2 rounded border border-purple-500/40 flex items-center gap-0.5"
                                title={ninja.equippedItem.name[lang]}
                              >
                                <img src={`/items/${ninja.equippedItem.id}.png`} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Item" className="w-2.5 h-2.5 object-contain" />
                                <span className="truncate max-w-[50px]">{ninja.equippedItem.name[lang]}</span>
                              </span>
                            )}
                          </div>
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
          <div className="bg-[#0f152d]/90 p-1.5 sm:p-3 rounded-xl border border-red-500/20 flex flex-col justify-between h-full min-h-0">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-red-400 uppercase border-b border-red-500/20 pb-1 mb-1.5 tracking-wider truncate">
                ⚔️ {lang === "it" ? "Avversari" : "Enemies"}
              </div>
              <div className="space-y-1.5 sm:space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
                {currentStep.opponentTeam.map((ninja) => {
                  const hpPercent = Math.max(0, (ninja.currentHp / ninja.baseStats.hp) * 100);
                  const isDefeated = ninja.currentHp <= 0;

                  const isAttacking = activeFighterSide === "opp" && activeFighterId === ninja.id;
                  const isBeingTargeted = activeTargetSide === "opp" && activeTargetId === ninja.id;

                  let stateGlowClass = "";
                  if (isAttacking) stateGlowClass = "pulse-glow-red scale-[1.01]";
                  else if (isBeingTargeted) stateGlowClass = "pulse-glow-target scale-[1.01]";

                  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);

                  return (
                    <div
                      key={ninja.id}
                      id={`battle-opp-${ninja.id}`}
                      className={`p-1.5 sm:p-2 rounded-lg border bg-gray-900/90 transition-all duration-200 ${
                        isDefeated 
                          ? "border-red-950/40 opacity-40" 
                          : isAttacking || isBeingTargeted 
                          ? stateGlowClass 
                          : "border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <NinjaAvatar
                          src={ninja.sprite}
                          name={translatedName}
                          className="w-7 h-7 sm:w-9 sm:h-9 object-contain bg-black/40 rounded border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className="font-bold text-gray-200 text-[10px] sm:text-xs truncate">{translatedName}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <ChakraNatureBadge nature={ninja.chakraNature} showText={false} />
                              <span className="text-[9px] sm:text-[10px] text-[#ff9f1c] font-mono shrink-0 font-bold">
                                Lv.{(ninja as any).level || 1}
                              </span>
                            </div>
                          </div>
                          <div className="text-[8px] sm:text-[10px] text-gray-400 font-mono font-bold leading-tight">
                            {ninja.currentHp}/{ninja.baseStats.hp}
                          </div>
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
          </div>
        </div>

        {/* BLURRED END-OF-BATTLE OUTCOME OVERLAY */}
        {isFinished && battleStatus !== null && (
          <div className="absolute inset-0 z-40 backdrop-blur-md bg-black/80 flex items-center justify-center p-4 transition-all duration-500">
            {battleStatus === "victory" ? (
              <div className="w-full max-w-md bg-gradient-to-b from-[#1a233d]/95 via-[#11192e]/95 to-[#0d1326]/95 border-2 border-amber-400/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.3)] text-center flex flex-col items-center animate-outcome-victory relative overflow-hidden backdrop-blur-lg">
                {/* Background Rays / Ambient Glow */}
                <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Animated Victory Icon */}
                <div className="relative mb-3 flex items-center justify-center">
                  <img 
                    src="/victory.png" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/trophy.png";
                    }}
                    alt="Victory" 
                    className="w-28 h-28 object-contain filter drop-shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-bounce"
                  />
                </div>

                <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <span className="text-amber-400">✦</span> 忍 勝利 • SHINOBI VICTORY <span className="text-amber-400">✦</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
                  {lang === "it" ? "Vittoria!" : "Victory!"}
                </h2>
                <p className="text-xs text-gray-300 mb-6 max-w-xs leading-relaxed">
                  {lang === "it" ? "La tua squadra ha superato la prova con successo!" : "Your squad successfully triumphed in battle!"}
                </p>

                <button
                  onClick={claimVictory}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-black text-base rounded-xl shadow-xl uppercase tracking-wider transition-all duration-200 transform hover:scale-[1.02] border-b-4 border-amber-700 cursor-pointer flex items-center justify-center gap-2"
                >
                  ⚡ {t.claimVictoryBtn}
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md bg-gradient-to-b from-[#2a1216]/95 via-[#1a0a0d]/95 to-[#0f0709]/95 border-2 border-red-500/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center flex flex-col items-center animate-outcome-defeat relative overflow-hidden backdrop-blur-lg">
                {/* Background Ambient Glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Animated Defeat Icon */}
                <div className="relative mb-3 flex items-center justify-center">
                  <img 
                    src="/defeat.png" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/sharingan_spinner.png";
                    }}
                    alt="Defeat" 
                    className="w-28 h-28 object-contain filter drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse"
                  />
                </div>

                <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <span className="text-red-500">✦</span> 敗 北 • SHINOBI DEFEAT <span className="text-red-500">✦</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 via-rose-500 to-red-600 bg-clip-text text-transparent uppercase tracking-wider mb-2">
                  {lang === "it" ? "Sconfitta" : "Defeated"}
                </h2>
                <p className="text-xs text-gray-300 mb-4 max-w-xs leading-relaxed">
                  {lang === "it" ? "I tuoi ninja sono caduti in battaglia. Riorganizzati e riprova!" : "Your ninjas have fallen. Regroup and try again!"}
                </p>

                {/* Points & Coins Earned Summary (Defeat) */}
                {(() => {
                  const runScore = useGameStore.getState().currentRunScore;
                  const earnedCoins = Math.floor(runScore * 0.01);
                  return (
                    <div className="w-full bg-black/60 border border-red-500/30 rounded-xl p-3 mb-5 text-center font-mono grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <img src="/score_icon.png" alt="Punti" className="w-4 h-4 object-contain" />
                          <span>{lang === "it" ? "Punti Run" : "Run Points"}</span>
                        </div>
                        <div className="text-lg font-black text-amber-300">
                          +{runScore.toLocaleString()} pts
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border-l border-red-500/20">
                        <div className="text-[10px] text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <img src="/coin.png" alt="Monete" className="w-4 h-4 object-contain" />
                          <span>{lang === "it" ? "Monete Ryo" : "Ryo Coins"}</span>
                        </div>
                        <div className="text-lg font-black text-yellow-400">
                          +{earnedCoins.toLocaleString()} ryo
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const state = useGameStore.getState();
                  const user = useAuthStore.getState().user;
                  const currentCoins = user ? state.totalCoins : state.sessionCoins;
                  // Calculate fair revive cost: 10% of current run score (minimum 50 Ryo)
                  const reviveCost = Math.max(50, Math.floor(state.currentRunScore * 0.1));
                  const canAffordRevive = currentCoins >= reviveCost;

                  return (
                    <div className="flex flex-col gap-2 w-full">
                      {/* REVIVE AND CONTINUE RUN BUTTON */}
                      <button
                        onClick={() => {
                          if (!canAffordRevive) return;
                          const success = useGameStore.getState().reviveAndContinueRun(reviveCost);
                          if (success) {
                            resetBattle();
                          }
                        }}
                        disabled={!canAffordRevive}
                        className={`w-full py-3 px-3 font-extrabold text-xs rounded-xl shadow uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-4 cursor-pointer ${
                          canAffordRevive
                            ? "bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white border-green-950 hover:scale-[1.02] shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                            : "bg-gray-800/80 text-gray-400 border-gray-900 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span>✨ {lang === "it" ? "Riprendi Run" : "Revive & Continue"}</span>
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-yellow-500/40 text-yellow-300 font-mono text-[11px]">
                          <img src="/coin.png" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} alt="Ryo" className="w-3.5 h-3.5 object-contain" />
                          <span>{reviveCost} ryo</span>
                        </div>
                      </button>

                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => {
                            resetBattle();
                            endRun();
                          }}
                          className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-extrabold text-xs rounded-xl shadow uppercase tracking-wider transition-all border border-gray-700 cursor-pointer"
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
                          className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow uppercase tracking-wider transition-all border-b-4 border-amber-900 cursor-pointer"
                        >
                          🔄 {lang === "it" ? "Nuova Run" : "New Run"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
