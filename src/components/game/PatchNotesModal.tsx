import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface PatchNotesModalProps {
  onClose: () => void;
}

export const PatchNotesModal: React.FC<PatchNotesModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  const patchLogs = [
    {
      version: "v1.4.0",
      date: "17-08-2026",
      notes: lang === "it" ? [
        "Sistema Sinergie Shinobi Multi-Livello: Introdotte 15 sinergie storiche con livelli di potenziamento a scaglioni (Bronzo, Argento, ORO MAX) basati sui membri della squadra.",
        "Adattamento alla Saga (Kid & Shippuden): I membri e gli sprite delle sinergie si adattano automaticamente alla saga della run attuale (Kid o Shippuden).",
        "Highlight Sinergie nel Negozio Ryo: Badge dorati animati e aura luminosa nello shop quando un ninja attiva o potenzia una sinergia di squadra.",
        "Scheda Wiki Sinergie Dedicata: Aggiunto il 3° tab nelle note della Wiki per esplorare la guida completa a tutte le sinergie e i relativi livelli sbloccabili.",
        "Ripristino Battaglia in Corso: Il riscatto con monete dopo una sconfitta riprende la battaglia dal Round 1 curando al 100% il team alleato e conservando i danni nemici.",
        "Fix Gestione HP & Chakra Effettivi: Gli strumenti e il Ramen applicano ora il 100% del valore massimo effettivo considerando base stats, oggetti e sinergie.",
        "Detrazione Istantanea Ryo: Le monete spese nello shop o per il continue vengono sottratte immediatamente dal profilo utente."
      ] : [
        "Multi-Tier Shinobi Synergy Engine: Introduced 15 lore synergies with scaled progression tiers (Bronze, Silver, GOLD MAX) based on active squad members.",
        "Saga Consistency Adaptation (Kid & Shippuden): Synergy members and sprites automatically adapt to match the active run's saga era (Kid or Shippuden).",
        "Ryo Shop Synergy Highlighting: Animated gold badges and glowing aura rings on shop cards when a candidate ninja activates or upgrades a team synergy.",
        "Dedicated Synergy Wiki Tab: Added 3rd tab to the Shinobi Wiki to explore full synergy guides, scaling tiers, and active run status.",
        "Ongoing Battle Continue Fix: Reviving after defeat restarts the current battle node from Round 1 with 100% allied effective HP & Chakra while preserving enemy damage.",
        "Effective HP & Chakra Scaling Fix: Gear assignment, Ichiraku Ramen, campfire rests, and boss defeat victories now properly calculate 100% total effective HP & Chakra stats.",
        "Instant Ryo Coin Deduction: Coins spent on recruitment, shop rerolls, or revives are immediately deducted from the user profile."
      ]
    },
    {
      version: "v1.3.0",
      date: "17-08-2026",
      notes: lang === "it" ? [
        "Rarità e Bilanciamento Oggetti: Assegnati i Rank (S, A, B, C) a tutti gli oggetti consumabili ed equipaggiabili con stats da Game Changer e potenziamenti da 3 battaglie.",
        "Progressione Nemici Scalabile: I nemici casuali della mappa scalano ora di Rank in base al capitolo (Rank S rari all'inizio, Rank C rari nella fase finale).",
        "Negozio Ryo Migliorato: Aggiunta l'icona della Natura del Chakra per ogni ninja acquistabile nel negozio.",
        "UX Redesign & Grafica Pulita: Icone elementali del Chakra senza contorni o sfondi ovali, dimensioni ridimensionate nella Wiki Shinobi.",
        "Gestione Zaino & Congedo Ninja: Gli strumenti assegnati ai ninja congedati tornano automaticamente nello zaino.",
        "Scorciatoie da Tastiera: Aggiunto il pannello dedicato con la guida ai tasti rapidi (Spazio / Invio, C, M, Esc)."
      ] : [
        "Item Rarities & Rebalance: Assigned explicit Rarity Ranks (S, A, B, C) to all consumables and assignable gear with game-changing stats and 3-fight boost durations.",
        "Scaling Enemy Progression: Random map opponents now scale in rank based on chapter progression (Rank S rare early on, Rank C rare in final levels).",
        "Ryo Shop Enhancement: Added Chakra Nature icons to each ninja available in the Ryo shop.",
        "UX Redesign & Clean Graphics: Chakra elemental icons cleaned without oval borders, resized crisp graphics in the Shinobi Wiki.",
        "Backpack & Dismissal UX: Assigned items are automatically returned to inventory when dismissing a ninja.",
        "Keyboard Shortcuts Panel: Added dedicated quick controls modal (Space / Enter, C, M, Esc)."
      ]
    },
    {
      version: "v1.2.0",
      date: "06-08-2026",
      notes: lang === "it" ? [
        "Estesa la Modalità Shippuden a 10 Capitoli progressivi con tutti i villain principali del manga/anime.",
        "Nuovi Boss Akatsuki e Guerra: Deidara & Sasori, Hidan & Kakuzu, Itachi, Kisame, Pain (Sei Vie), Kabuto Eremita, Obito (Tobi).",
        "Aggiunti i Boss Finali con il Decacoda: Obito Jinchūriki e Madara Jinchūriki del Decacoda."
      ] : [
        "Extended Shippuden Mode to 10 progressive Chapters featuring all major anime/manga villains.",
        "New Akatsuki & War Bosses: Deidara & Sasori, Hidan & Kakuzu, Itachi, Kisame, Six Paths Pain, Sage Kabuto, Obito (Tobi).",
        "Added Ten-Tails Final Bosses: Obito Ten-Tails Jinchuriki and Madara Ten-Tails Jinchuriki."
      ]
    },
    {
      version: "v1.1.0",
      date: "04-08-2026",
      notes: lang === "it" ? [
        "Aggiunto il Menu ad Hamburger premium per raggruppare i link.",
        "Implementato il pannello Impostazioni (Settings) nel menu per configurare la lingua.",
        "Aggiunto il pannello dei Crediti di gioco (Credits).",
        "Aggiunto il pannello delle Note della patch (Patch Notes)."
      ] : [
        "Added premium Hamburger Menu to consolidate header controls.",
        "Implemented Settings panel within the menu to customize language options.",
        "Added game Credits panel.",
        "Added game Patch Notes panel."
      ]
    },
    {
      version: "v1.0.0",
      date: "04-08-2026",
      notes: lang === "it" ? [
        "Introdotto il supporto Multilingua dinamico (Italiano ed Inglese).",
        "Implementato il salvataggio in Cloud automatico tramite database Supabase.",
        "Aggiunto il sistema di autenticazione sicuro con e-mail e password."
      ] : [
        "Introduced dynamic Multi-language support (Italian & English).",
        "Implemented automatic Cloud Saves synced via Supabase database.",
        "Added secure email & password user authentication system."
      ]
    },
    {
      version: "v0.1.0",
      date: "01-08-2026",
      notes: lang === "it" ? [
        "Versione demo iniziale rilasciata.",
        "Combattimento a turni automatico completo ispirato a Naruto.",
        "Mappa della run a nodi ramificati in stile roguelike."
      ] : [
        "Initial playable demo version released.",
        "Full automatic turn-based combat system inspired by Naruto.",
        "Branching roguelike level nodes road map."
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-[#ff9f1c] text-center uppercase tracking-wider mb-6">
          {t.patchNotesTitle}
        </h2>

        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {patchLogs.map((log, idx) => (
            <div key={idx} className="bg-[#070b19]/80 border border-gray-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2 border-b border-gray-850 pb-1.5">
                <span className="text-green-400 font-extrabold font-mono text-sm">
                  {t.patchNotesVersion} {log.version}
                </span>
                <span className="text-gray-500 font-mono text-xs">
                  📅 {log.date}
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {log.notes.map((note, nIdx) => (
                  <li key={nIdx} className="leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#ff9f1c] hover:bg-yellow-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 cursor-pointer"
        >
          {lang === "it" ? "Chiudi" : "Close"}
        </button>

      </div>
    </div>
  );
};
