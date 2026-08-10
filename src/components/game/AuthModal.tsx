import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  const { signIn, signUp, loading } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
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

    if (!email || !password || (isRegister && !username)) {
      setErrorMessage(t.authErrorEmpty);
      return;
    }

    if (isRegister && !reqLength) {
      setErrorMessage(t.authErrorPasswordReq);
      return;
    }

    try {
      if (isRegister) {
        const res = await signUp(email, password, username);
        if (res?.error) {
          setErrorMessage(res.error.message);
        } else if (res?.needsEmailConfirmation) {
          setSuccessMessage(
            lang === "it"
              ? "Registrazione effettuata! Controlla la tua email per confermare l'account prima di accedere."
              : "Registration successful! Please check your email to confirm your account."
          );
        } else {
          setSuccessMessage(t.authSuccessRegister);
          setTimeout(() => onClose(), 1500);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(t.authSuccessLogin);
          setTimeout(() => onClose(), 1500);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-md w-full p-6 relative shadow-2xl transform scale-100 transition-all duration-300 max-h-[90dvh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-[#ff9f1c] text-center uppercase tracking-wider mb-6">
          {isRegister ? t.authTitleRegister : t.authTitleLogin}
        </h2>

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
          {isRegister && (
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
                {t.authUsername}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="NarutoUzumaki"
                className="w-full bg-[#070b19] border-2 border-gray-800 focus:border-[#ff9f1c] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
              {isRegister ? t.authEmail : t.authEmailOrUsername}
            </label>
            <input
              type={isRegister ? "email" : "text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isRegister ? "hokage@konoha.com" : "hokage@konoha.com o NarutoUzumaki"}
              className="w-full bg-[#070b19] border-2 border-gray-800 focus:border-[#ff9f1c] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-mono">
              {t.authPassword}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#070b19] border-2 border-gray-800 focus:border-[#ff9f1c] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors"
              required
            />

            {/* REAL-TIME PASSWORD STRENGTH METER & REQUIREMENTS CHECKLIST */}
            {isRegister && (
              <div className="mt-2.5 p-3 bg-[#070b19]/90 border border-gray-800 rounded-xl space-y-2 text-xs animate-fade-in shadow-inner">
                {/* STRENGTH METER BAR */}
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

                {/* REQUIREMENTS CHECKLIST */}
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
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-[#ff9f1c] hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 cursor-pointer"
          >
            {loading ? t.authLoading : isRegister ? t.authRegisterBtn : t.authLoginBtn}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-[#ff9f1c]/80 hover:text-yellow-400 underline cursor-pointer"
          >
            {isRegister ? t.authSwitchToLogin : t.authSwitchToRegister}
          </button>
        </div>

      </div>
    </div>
  );
};
