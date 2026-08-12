import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { supabase } from "@/lib/supabaseClient";

interface InviteFriendModalProps {
  onClose: () => void;
}

export const InviteFriendModal: React.FC<InviteFriendModalProps> = ({ onClose }) => {
  const lang = useLanguageStore((state) => state.language);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string | null>(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live debounced email availability check while user types
  useEffect(() => {
    const cleanEmail = inviteEmail.trim().toLowerCase();
    setInviteStatus(null);

    if (!cleanEmail) {
      setEmailValidationError(null);
      setIsCheckingEmail(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailValidationError(
        lang === "it" ? "Inserisci un indirizzo email valido" : "Please enter a valid email address"
      );
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(true);
    setEmailValidationError(null);

    const timer = setTimeout(async () => {
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .ilike("email", cleanEmail)
          .maybeSingle();

        if (existingProfile) {
          setEmailValidationError(
            lang === "it"
              ? "❌ Esiste già un utente registrato con questa email!"
              : "❌ An account with this email already exists!"
          );
        } else {
          setEmailValidationError(null);
        }
      } catch (err) {
        console.error("Error checking existing email:", err);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inviteEmail, lang]);

  const isFormValid =
    inviteEmail.trim() !== "" &&
    !isCheckingEmail &&
    !emailValidationError &&
    !isSendingInvite;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-left"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-emerald-500 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-emerald-300 font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
          <span className="text-3xl p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">📜</span>
          <div>
            <h3 className="text-lg font-extrabold text-emerald-300 uppercase tracking-wider">
              {lang === "it" ? "Invita un Amico" : "Invite a Friend"}
            </h3>
            <p className="text-xs text-gray-400">
              {lang === "it" ? "Recluta nuovi Shinobi nella Guerra Ninja!" : "Recruit new Shinobi to the Ninja War!"}
            </p>
          </div>
        </div>

        {/* Direct Email Invite Form */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-gray-300">
            {lang === "it" ? "Email dell'Amico da Invitare:" : "Friend's Email Address:"}
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="ninja@konoha.com"
              className={`flex-1 bg-[#070b19] border-2 rounded-xl px-3 py-2 text-xs text-white outline-none transition-colors ${
                emailValidationError
                  ? "border-red-500"
                  : inviteEmail.trim() && !isCheckingEmail && !emailValidationError
                  ? "border-emerald-500"
                  : "border-gray-800 focus:border-emerald-400"
              }`}
            />
            <button
              onClick={async () => {
                if (!isFormValid) return;
                const cleanEmail = inviteEmail.trim().toLowerCase();
                
                setIsSendingInvite(true);
                setInviteStatus(null);

                const { error } = await useAuthStore.getState().signInWithMagicLink(cleanEmail);
                setIsSendingInvite(false);

                if (error) {
                  setInviteStatus(`❌ ${error.message}`);
                } else {
                  setInviteStatus(
                    lang === "it"
                      ? "✅ Email di invito per il reclutamento inviata con successo!"
                      : "✅ Recruitment invite email sent successfully!"
                  );
                  setInviteEmail("");
                }
              }}
              disabled={!isFormValid}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-[#070b19] font-black text-xs uppercase tracking-wider rounded-xl shrink-0 shadow-md transition-all"
            >
              {isSendingInvite ? (lang === "it" ? "Invio..." : "Sending...") : (lang === "it" ? "Invia" : "Send")}
            </button>
          </div>

          {/* Live Validation Hints */}
          {isCheckingEmail && (
            <p className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 animate-pulse">
              <span>🔍</span> {lang === "it" ? "Verifica account in corso..." : "Checking account..."}
            </p>
          )}

          {!isCheckingEmail && emailValidationError && (
            <p className="text-[11px] font-mono text-red-400 font-bold flex items-center gap-1.5">
              <span>⚠️</span> {emailValidationError}
            </p>
          )}

          {!isCheckingEmail && !emailValidationError && inviteEmail.trim().length > 0 && (
            <p className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <span>✓</span> {lang === "it" ? "Email disponibile per l'invito" : "Email available for invite"}
            </p>
          )}

          {inviteStatus && (
            <div
              className={`text-xs font-mono p-2.5 rounded-xl border mt-2 ${
                inviteStatus.startsWith("❌")
                  ? "bg-red-950/60 border-red-500/50 text-red-300"
                  : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              }`}
            >
              {inviteStatus}
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 pt-3 space-y-2">
          <label className="block text-xs font-mono font-bold text-gray-300">
            {lang === "it" ? "Oppure Condividi il tuo Link di Reclutamento:" : "Or Share Your Referral Link:"}
          </label>
          <div className="flex gap-2 items-center bg-[#070b19] border border-gray-800 p-2 rounded-xl">
            <input
              type="text"
              readOnly
              value={typeof window !== "undefined" ? `${window.location.origin}/?signup=true` : ""}
              className="flex-1 bg-transparent text-xs font-mono text-gray-400 outline-none truncate"
            />
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const shareUrl = `${window.location.origin}/?signup=true`;
                  navigator.clipboard.writeText(shareUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-lg cursor-pointer shrink-0"
            >
              {copiedLink ? (lang === "it" ? "✓ COPIATO" : "✓ COPIED") : (lang === "it" ? "Copia Link" : "Copy Link")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
