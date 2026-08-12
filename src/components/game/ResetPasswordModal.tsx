import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface ResetPasswordModalProps {
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  const { updatePassword, loading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password criteria evaluation
  const reqLength = password.length >= 6;
  const reqUppercase = /[A-Z]/.test(password);
  const reqLowercase = /[a-z]/.test(password);
  const reqNumber = /[0-9]/.test(password);
  const reqSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const satisfiedCount = [reqLength, reqUppercase, reqLowercase, reqNumber, reqSpecial].filter(Boolean).length;

  let strengthLabel = t.passwordStrengthVeryWeak;
  let strengthColorText = "text-red-400";
  let strengthBarBg = "bg-red-500";
  let barWidth = "20%";

  if (password.length === 0) {
    barWidth = "0%";
  } else if (satisfiedCount <= 1) {
    strengthLabel = t.passwordStrengthVeryWeak;
    strengthColorText = "text-red-400";
    strengthBarBg = "bg-red-500";
    barWidth = "20%";
  } else if (satisfiedCount === 2) {
    strengthLabel = t.passwordStrengthWeak;
    strengthColorText = "text-orange-400";
    strengthBarBg = "bg-orange-500";
    barWidth = "40%";
  } else if (satisfiedCount === 3) {
    strengthLabel = t.passwordStrengthMedium;
    strengthColorText = "text-yellow-300";
    strengthBarBg = "bg-yellow-500";
    barWidth = "60%";
  } else if (satisfiedCount === 4) {
    strengthLabel = t.passwordStrengthStrong;
    strengthColorText = "text-lime-300";
    strengthBarBg = "bg-lime-500";
    barWidth = "80%";
  } else if (satisfiedCount === 5) {
    strengthLabel = t.passwordStrengthVeryStrong;
    strengthColorText = "text-emerald-400";
    strengthBarBg = "bg-emerald-500";
    barWidth = "100%";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (satisfiedCount < 5) {
      setErrorMessage(
        lang === "it"
          ? "La password deve soddisfare tutti e 5 i requisiti di sicurezza!"
          : "Password must satisfy all 5 security requirements!"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        lang === "it" ? "Le due password inserite non coincidono!" : "Passwords do not match!"
      );
      return;
    }

    const { error } = await updatePassword(password);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(
        lang === "it"
          ? "✅ Password aggiornata con successo! Ora sei autenticato."
          : "✅ Password updated successfully! You are now logged in."
      );
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#ff9f1c]/20 border border-[#ff9f1c] flex items-center justify-center text-xl shrink-0">
            🔑
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#ff9f1c] uppercase tracking-wider">
              {lang === "it" ? "Reimposta Password" : "Reset Password"}
            </h2>
            <p className="text-xs text-gray-400">
              {lang === "it"
                ? "Inserisci la tua nuova password per accedere al tuo account."
                : "Enter your new password to access your account."}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-950/40 border border-red-500 text-red-400 p-3 rounded-lg text-xs mb-4 text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-950/40 border border-green-500 text-green-400 p-3 rounded-lg text-xs mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
              {lang === "it" ? "Nuova Password" : "New Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#070b19] border-2 border-gray-800 focus:border-[#ff9f1c] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
              {lang === "it" ? "Conferma Nuova Password" : "Confirm New Password"}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-[#070b19] border-2 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500"
                  : confirmPassword && confirmPassword === password
                  ? "border-emerald-500"
                  : "border-gray-800 focus:border-[#ff9f1c]"
              }`}
              required
            />
            {confirmPassword && confirmPassword !== password && (
              <p className="text-[11px] font-mono text-red-400 font-bold flex items-center gap-1.5 mt-1">
                <span>⚠️</span> {lang === "it" ? "Le password non coincidono!" : "Passwords do not match!"}
              </p>
            )}
          </div>

          {/* REAL-TIME PASSWORD STRENGTH METER & REQUIREMENTS CHECKLIST */}
          <div className="p-3 bg-[#070b19]/90 border border-gray-800 rounded-xl space-y-2 text-xs shadow-inner">
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
                <span className="text-gray-400">{t.passwordStrengthLabel}</span>
                <span className={`font-bold ${strengthColorText}`}>
                  {password.length > 0 ? strengthLabel : "-"}
                </span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-300 ${strengthBarBg}`}
                  style={{ width: barWidth }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800/80">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-mono font-bold">
                {t.passwordReqTitle}
              </div>
              <ul className="space-y-1 text-[11px]">
                <li className={`flex items-center gap-1.5 transition-colors ${reqLength ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  <span className="font-mono">{reqLength ? "✓" : "✕"}</span>
                  <span>{t.passwordReqLength}</span>
                </li>
                <li className={`flex items-center gap-1.5 transition-colors ${reqUppercase ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  <span className="font-mono">{reqUppercase ? "✓" : "✕"}</span>
                  <span>{t.passwordReqUppercase}</span>
                </li>
                <li className={`flex items-center gap-1.5 transition-colors ${reqLowercase ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  <span className="font-mono">{reqLowercase ? "✓" : "✕"}</span>
                  <span>{t.passwordReqLowercase}</span>
                </li>
                <li className={`flex items-center gap-1.5 transition-colors ${reqNumber ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  <span className="font-mono">{reqNumber ? "✓" : "✕"}</span>
                  <span>{t.passwordReqNumber}</span>
                </li>
                <li className={`flex items-center gap-1.5 transition-colors ${reqSpecial ? "text-emerald-400 font-bold" : "text-gray-500"}`}>
                  <span className="font-mono">{reqSpecial ? "✓" : "✕"}</span>
                  <span>{t.passwordReqSpecial}</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || satisfiedCount < 5 || password !== confirmPassword}
            className="w-full mt-4 py-3 bg-[#ff9f1c] hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-all border-b-4 border-amber-700 cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <img src="/sharingan_spinner.png" alt="Loading" className="w-4 h-4 object-contain animate-spin" />
            ) : (
              <span>{lang === "it" ? "AGGIORNA PASSWORD" : "UPDATE PASSWORD"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
