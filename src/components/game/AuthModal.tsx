import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS } from "@/data/translations";

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const t = TRANSLATIONS[lang];

  const { signIn, signUp, resendConfirmationEmail, resetPassword, signInWithMagicLink, loading, user } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Auto-close modal if user gets authenticated via onAuthStateChange or polling
  React.useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  // Polling mechanism when waiting for email confirmation
  React.useEffect(() => {
    if (!awaitingConfirmation || !email || !password) return;

    const interval = setInterval(async () => {
      // Attempt silent background sign-in
      const { error } = await signIn(email, password);
      if (!error) {
        setAwaitingConfirmation(false);
        onClose();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [awaitingConfirmation, email, password, signIn, onClose]);

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

  const [showProgressChoice, setShowProgressChoice] = useState(false);
  const [pendingFormEvent, setPendingFormEvent] = useState<{ email: string; pass: string; user: string } | null>(null);

  const processRegistration = async (emailVal: string, passVal: string, userVal: string, keepProgress: boolean) => {
    setShowProgressChoice(false);
    if (!keepProgress) {
      // User wants to reset guest progress on new account
      useGameStore.getState().clearLocalSave();
    }
    const res = await signUp(emailVal, passVal, userVal);
    if (res?.error) {
      setErrorMessage(res.error.message);
    } else if (res?.needsEmailConfirmation) {
      setAwaitingConfirmation(true);
    } else {
      setSuccessMessage(t.authSuccessRegister);
      setTimeout(() => onClose(), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setResendStatus(null);

    if (isMagicLink) {
      if (!email) {
        setErrorMessage(t.authErrorEmpty);
        return;
      }
      const { error } = await signInWithMagicLink(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(t.authMagicLinkSent);
      }
      return;
    }

    if (isForgotPassword) {
      if (!email) {
        setErrorMessage(t.authErrorEmpty);
        return;
      }
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(t.authResetEmailSent);
      }
      return;
    }

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
        const guestScore = useGameStore.getState().totalScore;
        const guestRuns = useGameStore.getState().totalRunsCount;

        // If user played as guest before registering, ask whether to keep progress
        if ((guestScore > 0 || guestRuns > 0) && !showProgressChoice) {
          setPendingFormEvent({ email, pass: password, user: username });
          setShowProgressChoice(true);
          return;
        }

        await processRegistration(email, password, username, true);
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(t.authSuccessLogin);
          setTimeout(() => onClose(), 300);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  const handleResendEmail = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    setResendStatus(null);
    const { error } = await resendConfirmationEmail(email);
    setIsResending(false);

    if (error) {
      setResendStatus(error.message || (lang === "it" ? "Errore nell'invio dell'email" : "Error sending email"));
    } else {
      setResendStatus(
        lang === "it"
          ? "Nuova email di conferma inviata con successo!"
          : "Confirmation email resent successfully!"
      );
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-[#ff9f1c] rounded-3xl max-w-md w-full p-6 relative shadow-2xl transform scale-100 transition-all duration-300 max-h-[90dvh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#ff9f1c] font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        {showProgressChoice ? (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center text-3xl">
              🏆
            </div>
            <h3 className="text-xl font-extrabold text-amber-300 uppercase tracking-wider">
              {lang === "it" ? "Salvare i Progressi Ospite?" : "Save Guest Progress?"}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-mono">
              {lang === "it"
                ? `Hai accumulato ${useGameStore.getState().totalScore.toLocaleString()} punti e ${useGameStore.getState().totalRunsCount} run da ospite. Vuoi trasferirli sul nuovo profilo o ricominciare da capo?`
                : `You earned ${useGameStore.getState().totalScore.toLocaleString()} points and ${useGameStore.getState().totalRunsCount} runs as guest. Do you want to save them to your new profile or start fresh?`}
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (pendingFormEvent) {
                    processRegistration(pendingFormEvent.email, pendingFormEvent.pass, pendingFormEvent.user, true);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg border-b-4 border-green-950 cursor-pointer"
              >
                ✨ {lang === "it" ? "Salva Punti & Run sul Profilo" : "Save Points & Runs to Profile"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (pendingFormEvent) {
                    processRegistration(pendingFormEvent.email, pendingFormEvent.pass, pendingFormEvent.user, false);
                  }
                }}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl uppercase tracking-wider border border-gray-700 cursor-pointer"
              >
                🔄 {lang === "it" ? "Ricomincia da Capo (Reset Dati)" : "Start Fresh (Reset Data)"}
              </button>
            </div>
          </div>
        ) : awaitingConfirmation ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
              📩
            </div>
            <h3 className="text-xl font-extrabold text-amber-300 uppercase tracking-wider">
              {lang === "it" ? "Conferma la tua Email" : "Confirm Your Email"}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-mono">
              {lang === "it"
                ? `Abbiamo inviato un link di conferma a ${email}. Clicca sul link per attivare l'account.`
                : `We sent a confirmation link to ${email}. Click the link to activate your account.`}
            </p>
            
            <div className="bg-[#070b19] border border-amber-500/30 p-3 rounded-xl flex items-center justify-center gap-2.5 text-xs text-amber-400 font-mono">
              <span className="animate-spin text-base">🌀</span>
              <span>
                {lang === "it"
                  ? "In attesa della conferma... L'accesso avverrà automaticamente appena confermi!"
                  : "Waiting for confirmation... Auto-logging in upon confirmation!"}
              </span>
            </div>

            {resendStatus && (
              <div className="bg-gray-900 border border-gray-700 text-amber-300 p-2.5 rounded-lg text-xs font-mono">
                {resendStatus}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isResending
                  ? (lang === "it" ? "Invio in corso..." : "Resending...")
                  : (lang === "it" ? "🔄 Reinvia Email di Conferma" : "🔄 Resend Confirmation Email")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAwaitingConfirmation(false);
                  setIsRegister(false);
                }}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer mt-1"
              >
                {lang === "it" ? "Torna alla schermata di Login" : "Back to Login"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-[#ff9f1c] text-center uppercase tracking-wider mb-6">
              {isMagicLink
                ? t.authMagicLinkTitle
                : isForgotPassword
                ? t.authForgotPasswordTitle
                : isRegister
                ? t.authTitleRegister
                : t.authTitleLogin}
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
              {isRegister && !isForgotPassword && !isMagicLink && (
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
                  {isRegister || isForgotPassword || isMagicLink ? t.authEmail : t.authEmailOrUsername}
                </label>
                <input
                  type={isRegister || isForgotPassword || isMagicLink ? "email" : "text"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRegister || isForgotPassword || isMagicLink ? "hokage@konoha.com" : "hokage@konoha.com o NarutoUzumaki"}
                  className="w-full bg-[#070b19] border-2 border-gray-800 focus:border-[#ff9f1c] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  required
                />
              </div>

              {!isForgotPassword && !isMagicLink && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                      {t.authPassword}
                    </label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setIsMagicLink(false);
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] text-[#ff9f1c]/80 hover:text-yellow-400 underline cursor-pointer font-mono"
                      >
                        {t.authForgotPassword}
                      </button>
                    )}
                  </div>
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
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-[#ff9f1c] hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-500 text-[#070b19] font-bold rounded-lg uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 cursor-pointer"
              >
                {loading
                  ? t.authLoading
                  : isMagicLink
                  ? t.authSendMagicLinkBtn
                  : isForgotPassword
                  ? t.authSendResetEmail
                  : isRegister
                  ? t.authRegisterBtn
                  : t.authLoginBtn}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-2">
              {!isForgotPassword && !isRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMagicLink(!isMagicLink);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-amber-300/90 hover:text-amber-200 font-mono underline cursor-pointer"
                >
                  {isMagicLink ? t.authSwitchToLogin : t.authMagicLinkTab}
                </button>
              )}

              {isForgotPassword || isMagicLink ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsMagicLink(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-[#ff9f1c]/80 hover:text-yellow-400 underline cursor-pointer"
                >
                  {t.authSwitchToLogin}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setIsMagicLink(false);
                    setIsForgotPassword(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-[#ff9f1c]/80 hover:text-yellow-400 underline cursor-pointer"
                >
                  {isRegister ? t.authSwitchToLogin : t.authSwitchToRegister}
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

