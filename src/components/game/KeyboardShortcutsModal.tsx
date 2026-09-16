import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useGameStore } from "@/store/useGameStore";
import {
  ShortcutAction,
  CustomKeybindings,
  DEFAULT_KEYBINDINGS,
  formatKeyForDisplay,
  normalizeKey,
} from "@/lib/keybindings";

import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ActionConfig {
  action: ShortcutAction;
  title: { it: string; en: string };
  description: { it: string; en: string };
}

const ACTION_CONFIGS: ActionConfig[] = [
  {
    action: "fast_advance",
    title: {
      it: "Avanzamento Rapido & Azioni",
      en: "Fast Advance & Actions",
    },
    description: {
      it: "Naviga la mappa, conferma il Ristoro Ichiraku, applica i Rotoli Proibiti, recluta ninja o salta le animazioni di battaglia.",
      en: "Advance map, confirm Ichiraku healing, apply scrolls, recruit ninjas or skip battle animations.",
    },
  },
  {
    action: "chakra_chart",
    title: {
      it: "Grafico Nature del Chakra",
      en: "Chakra Natures Chart",
    },
    description: {
      it: "Apri o chiudi la tabella delle affinità e debolezze elementali del Chakra.",
      en: "Open or close the elemental Chakra affinities and weaknesses chart.",
    },
  },
  {
    action: "game_menu",
    title: {
      it: "Menu di Gioco",
      en: "Game Menu",
    },
    description: {
      it: "Apri o chiudi il menu principale con impostazioni, salvataggio e opzioni della corsa.",
      en: "Open or close the main menu with settings, save options, and run controls.",
    },
  },
  {
    action: "close_windows",
    title: {
      it: "Chiudi Finestre Modali",
      en: "Close Modal Windows",
    },
    description: {
      it: "Chiudi le finestre modali o i pannelli informativi attivi.",
      en: "Close active modal windows or information panels.",
    },
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  const { language: lang } = useLanguageStore();
  const user = useAuthStore((state) => state.user);
  const customKeybindings = useGameStore((state) => state.customKeybindings);
  const setCustomKeybindings = useGameStore((state) => state.setCustomKeybindings);
  const resetCustomKeybindings = useGameStore((state) => state.resetCustomKeybindings);

  const [listeningTarget, setListeningTarget] = useState<{
    action: ShortcutAction;
    keyIndex?: number;
  } | null>(null);

  const [conflictInfo, setConflictInfo] = useState<{
    keyToAssign: string;
    newAction: ShortcutAction;
    keyIndex?: number;
    conflictingAction: ShortcutAction;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Global keydown listener for remapping keybindings
  useEffect(() => {
    if (!isOpen || !listeningTarget) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const pressedKey = normalizeKey(e.key);

      // Pressing Escape during remapping cancels listening unless specifically remapping close_windows
      if (pressedKey === "Escape" && listeningTarget.action !== "close_windows") {
        setListeningTarget(null);
        return;
      }

      // Check if pressed key is already used by another action
      let existingAction: ShortcutAction | null = null;
      (Object.keys(customKeybindings) as ShortcutAction[]).forEach((act) => {
        if (act !== listeningTarget.action) {
          const keys = customKeybindings[act] || [];
          if (keys.some((k) => normalizeKey(k).toLowerCase() === pressedKey.toLowerCase())) {
            existingAction = act;
          }
        }
      });

      if (existingAction) {
        setConflictInfo({
          keyToAssign: pressedKey,
          newAction: listeningTarget.action,
          keyIndex: listeningTarget.keyIndex,
          conflictingAction: existingAction,
        });
        setListeningTarget(null);
        return;
      }

      // Apply the keybinding change
      applyKeyBinding(listeningTarget.action, pressedKey, listeningTarget.keyIndex);
      setListeningTarget(null);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [isOpen, listeningTarget, customKeybindings]);

  if (!isOpen) return null;

  const applyKeyBinding = (
    action: ShortcutAction,
    newKey: string,
    keyIndex?: number,
    swapAction?: ShortcutAction
  ) => {
    const updatedBindings: CustomKeybindings = { ...customKeybindings };

    if (swapAction) {
      // Remove newKey from swapAction
      updatedBindings[swapAction] = (updatedBindings[swapAction] || []).filter(
        (k) => normalizeKey(k).toLowerCase() !== normalizeKey(newKey).toLowerCase()
      );
      if (updatedBindings[swapAction].length === 0) {
        updatedBindings[swapAction] = [DEFAULT_KEYBINDINGS[swapAction][0]];
      }
    }

    const currentKeys = [...(updatedBindings[action] || [])];

    if (keyIndex !== undefined && keyIndex >= 0 && keyIndex < currentKeys.length) {
      currentKeys[keyIndex] = newKey;
    } else {
      if (!currentKeys.some((k) => normalizeKey(k).toLowerCase() === normalizeKey(newKey).toLowerCase())) {
        currentKeys.push(newKey);
      }
    }

    updatedBindings[action] = currentKeys;
    setCustomKeybindings(updatedBindings);

    const actionTitle = ACTION_CONFIGS.find((a) => a.action === action)?.title[lang] || action;
    setToastMessage(
      lang === "it"
        ? `Tasto "${formatKeyForDisplay(newKey, lang)}" salvato per ${actionTitle}!`
        : `Key "${formatKeyForDisplay(newKey, lang)}" saved for ${actionTitle}!`
    );
  };

  const removeKey = (action: ShortcutAction, keyIndex: number) => {
    const currentKeys = [...(customKeybindings[action] || [])];
    if (currentKeys.length <= 1) {
      setToastMessage(
        lang === "it"
          ? "Devi mantenere almeno un tasto per questa scorciatoia!"
          : "You must keep at least one key for this shortcut!"
      );
      return;
    }
    currentKeys.splice(keyIndex, 1);
    const updated = { ...customKeybindings, [action]: currentKeys };
    setCustomKeybindings(updated);
  };

  const handleResetDefaults = () => {
    if (!user) {
      setToastMessage(
        lang === "it"
          ? "🔒 I comandi sono già quelli predefiniti per gli ospiti!"
          : "🔒 Keybindings are already set to default for guest users!"
      );
      return;
    }
    resetCustomKeybindings();
    setListeningTarget(null);
    setConflictInfo(null);
    setToastMessage(
      lang === "it" ? "Scorciatoie ripristinate ai valori predefiniti!" : "Shortcuts reset to defaults!"
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500/80 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative flex flex-col my-auto font-sans"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>⌨️</span>
              <span>{lang === "it" ? "Personalizza Scorciatoie" : "Customize Shortcuts"}</span>
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              {lang === "it"
                ? "Clicca su un tasto per modificarlo. I cambiamenti si salvano sul tuo profilo!"
                : "Click on any key to edit it. Changes save automatically to your profile!"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white font-bold flex items-center justify-center transition-all cursor-pointer border border-gray-700 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* GUEST WARNING BANNER */}
        {!user && (
          <div className="mb-3.5 p-3 bg-amber-950/70 border border-amber-500/50 rounded-2xl text-amber-200 text-xs font-mono flex items-center gap-2.5 shadow-md">
            <span className="text-base shrink-0">🔒</span>
            <span>
              {lang === "it"
                ? "I comandi personalizzati sono riservati agli utenti registrati. Effettua l'accesso per personalizzare e salvare i tasti sul tuo profilo."
                : "Custom keybindings are reserved for registered users. Sign in to customize and save keyboard shortcuts to your profile."}
            </span>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="mb-3 px-3 py-2 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold font-mono animate-fade-in flex items-center gap-2 shadow-lg">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CONFLICT RESOLUTION MODAL OVERLAY */}
        {conflictInfo && (
          <div className="mb-4 p-3.5 bg-amber-950/90 border-2 border-amber-500 rounded-2xl text-amber-200 text-xs space-y-2 animate-fade-in shadow-xl">
            <div className="font-extrabold flex items-center gap-2 text-amber-300">
              <span>⚠️</span>
              <span>{lang === "it" ? "Tasto già assegnato!" : "Key already assigned!"}</span>
            </div>
            <p>
              {lang === "it"
                ? `Il tasto "${formatKeyForDisplay(conflictInfo.keyToAssign, lang)}" è attualmente assegnato a "${
                    ACTION_CONFIGS.find((a) => a.action === conflictInfo.conflictingAction)?.title.it
                  }".`
                : `The key "${formatKeyForDisplay(conflictInfo.keyToAssign, lang)}" is currently assigned to "${
                    ACTION_CONFIGS.find((a) => a.action === conflictInfo.conflictingAction)?.title.en
                  }".`}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  applyKeyBinding(
                    conflictInfo.newAction,
                    conflictInfo.keyToAssign,
                    conflictInfo.keyIndex,
                    conflictInfo.conflictingAction
                  );
                  setConflictInfo(null);
                }}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg hover:bg-amber-400 transition-all text-xs cursor-pointer shadow-md"
              >
                {lang === "it" ? "🔄 Scambia Tasti" : "🔄 Swap Keys"}
              </button>
              <button
                onClick={() => {
                  applyKeyBinding(
                    conflictInfo.newAction,
                    conflictInfo.keyToAssign,
                    conflictInfo.keyIndex
                  );
                  setConflictInfo(null);
                }}
                className="px-3 py-1.5 bg-gray-800 text-amber-300 font-bold rounded-lg border border-amber-500/40 hover:bg-gray-700 transition-all text-xs cursor-pointer"
              >
                {lang === "it" ? "Sostituisci" : "Overwrite"}
              </button>
              <button
                onClick={() => setConflictInfo(null)}
                className="px-3 py-1.5 bg-red-950/60 text-red-300 font-bold rounded-lg border border-red-800/60 hover:bg-red-900/60 transition-all text-xs cursor-pointer"
              >
                {lang === "it" ? "Annulla" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* SHORTCUTS LIST */}
        <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
          {ACTION_CONFIGS.map((cfg) => {
            const keys = customKeybindings[cfg.action] || DEFAULT_KEYBINDINGS[cfg.action];
            const isListening = listeningTarget?.action === cfg.action;

            return (
              <div
                key={cfg.action}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isListening
                    ? "bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                    : "bg-black/50 border-white/10 hover:border-amber-500/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                      <span>{cfg.title[lang]}</span>
                    </h4>
                    <p className="text-[10px] text-gray-300 font-mono leading-tight">
                      {cfg.description[lang]}
                    </p>
                  </div>

                  {/* KEY BADGES & EDITING */}
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0 self-start sm:self-center">
                    {keys.map((k, kIdx) => {
                      const isKeyBeingEdited = isListening && listeningTarget.keyIndex === kIdx;

                      return (
                        <div key={kIdx} className="relative group flex items-center">
                          <button
                            onClick={() => {
                              if (!user) {
                                setToastMessage(
                                  lang === "it"
                                    ? "🔒 Accedi con il tuo account per personalizzare i tasti!"
                                    : "🔒 Sign in to customize keyboard shortcuts!"
                                );
                                return;
                              }
                              setListeningTarget({ action: cfg.action, keyIndex: kIdx });
                            }}
                            className={`kbd border-2 text-xs font-extrabold font-mono px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
                              !user
                                ? "bg-gray-900/60 text-gray-400 border-gray-800 opacity-75 cursor-not-allowed"
                                : isKeyBeingEdited
                                ? "bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-200 scale-105 cursor-pointer"
                                : "bg-gray-900 hover:bg-gray-800 text-amber-300 border-gray-700 hover:border-amber-500/60 cursor-pointer"
                            }`}
                            title={
                              !user
                                ? (lang === "it" ? "Accedi per personalizzare i tasti" : "Sign in to edit keys")
                                : (lang === "it" ? "Clicca per modificare questo tasto" : "Click to edit this key")
                            }
                          >
                            <span>{isKeyBeingEdited ? "..." : formatKeyForDisplay(k, lang)}</span>
                            {user && <span className="text-[9px] text-gray-400 group-hover:text-amber-300">✏️</span>}
                          </button>

                          {/* DELETE KEY BUTTON (if >1 key) */}
                          {user && keys.length > 1 && (
                            <button
                              onClick={() => removeKey(cfg.action, kIdx)}
                              className="ml-1 w-5 h-5 rounded-full bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-black flex items-center justify-center border border-red-800/60 transition-all cursor-pointer"
                              title={lang === "it" ? "Rimuovi questo tasto" : "Remove this key"}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* ADD SECONDARY KEY BUTTON (max 2 keys per action) */}
                    {user && keys.length < 2 && (
                      <button
                        onClick={() => setListeningTarget({ action: cfg.action })}
                        className="px-2.5 py-1.5 bg-gray-900/80 hover:bg-amber-500/20 text-gray-400 hover:text-amber-300 border border-dashed border-gray-700 hover:border-amber-500/60 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1"
                        title={lang === "it" ? "Aggiungi un tasto secondario" : "Add secondary key"}
                      >
                        <span>+</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* LISTENING STATUS BANNER */}
                {isListening && (
                  <div className="mt-2.5 pt-2 border-t border-amber-500/30 text-[11px] font-mono text-amber-300 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 animate-pulse">
                      <span>🎙️</span>
                      <span>
                        {lang === "it"
                          ? "Premi un qualsiasi tasto sulla tastiera..."
                          : "Press any key on your keyboard..."}
                      </span>
                    </span>
                    <button
                      onClick={() => setListeningTarget(null)}
                      className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      {lang === "it" ? "Annulla (Esc)" : "Cancel (Esc)"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-5 pt-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white font-extrabold border border-gray-700 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>🔄</span>
            <span>{lang === "it" ? "Ripristina Predefiniti" : "Reset to Defaults"}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {lang === "it" ? "Salva e Chiudi" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
