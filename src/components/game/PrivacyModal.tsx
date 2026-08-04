import React from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-[#ff9f1c] text-center uppercase tracking-wider mb-6">
          Privacy Policy
        </h2>

        <div className="space-y-4 text-xs text-gray-300 max-h-[350px] overflow-y-auto pr-1 leading-relaxed">
          {lang === "it" ? (
            <>
              <p>
                La tua privacy è fondamentale per noi. Questa politica descrive come gestiamo i tuoi dati all'interno del progetto amatoriale **NarutoLike**.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">1. Dati Raccolti</h3>
              <p>
                Se decidi di creare un account per i salvataggi cloud, raccogliamo il tuo indirizzo email e un nome utente a tua scelta. Le password sono criptate e gestite in sicurezza tramite il provider **Supabase Auth**.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">2. Utilizzo dei Dati</h3>
              <p>
                Utilizziamo i dati raccolti unicamente per consentirti di salvare e caricare i tuoi progressi di gioco online. Non inviamo email pubblicitarie né condividiamo i tuoi dati con terze parti.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">3. Cancellazione dei Dati</h3>
              <p>
                Puoi richiedere la rimozione del tuo profilo e dei relativi salvataggi in qualsiasi momento. Tutti i dati associati verranno cancellati in modo definitivo dai nostri server.
              </p>
            </>
          ) : (
            <>
              <p>
                Your privacy is important to us. This policy describes how we handle your data within the **NarutoLike** fan-made project.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">1. Data Collected</h3>
              <p>
                If you choose to create an account for cloud saves, we collect your email address and a username of your choice. Passwords are encrypted and securely managed via **Supabase Auth**.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">2. Use of Data</h3>
              <p>
                We use the collected data solely to allow you to save and load your game progress online. We do not send promotional emails or share your data with third parties.
              </p>
              <h3 className="font-bold text-[#ff9f1c] uppercase mt-3 font-mono">3. Data Deletion</h3>
              <p>
                You can request the removal of your profile and game saves at any time. All associated data will be permanently deleted from our servers.
              </p>
            </>
          )}
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
