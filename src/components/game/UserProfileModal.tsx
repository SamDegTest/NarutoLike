import React, { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { supabase } from "@/lib/supabaseClient";
import { InviteFriendModal } from "./InviteFriendModal";

interface UserProfileModalProps {
  onClose: () => void;
  onOpenInviteModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose, onOpenInviteModal }) => {
  const { user, username, avatarUrl, uploadAvatar, signOut } = useAuthStore();
  const { totalRunsCount, classicRunsCount, shippudenRunsCount, currentLevel, totalScore, classicHighScore, shippudenHighScore } = useGameStore();
  const lang = useLanguageStore((state) => state.language);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "it" ? "L'immagine non può superare 5MB" : "Image size must not exceed 5MB");
      return;
    }

    setIsUploading(true);
    const { error } = await uploadAvatar(file);
    setIsUploading(false);

    if (error) {
      alert(error.message || (lang === "it" ? "Errore durante il caricamento" : "Upload error"));
    }
  };

  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailChangeStatus, setEmailChangeStatus] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    async function loadTitle() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("selected_title")
          .eq("id", user.id)
          .single();
        if (data?.selected_title) {
          setSelectedTitle(data.selected_title);
        }
      }
    }
    loadTitle();
  }, [user]);

  const defaultAvatar = "/default_avatar.png";

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500 rounded-3xl max-w-md w-full p-6 relative shadow-2xl text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-amber-300 font-bold text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold text-amber-300 uppercase tracking-wider mb-6 flex items-center justify-center gap-2.5">
          <img
            src="/menu_stats.png"
            alt="Statistiche"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".profile-header-fallback")) {
                const span = document.createElement("span");
                span.className = "profile-header-fallback text-xl";
                span.innerText = "📊";
                parent.insertBefore(span, target);
              }
            }}
            className="w-7 h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
          />
          <span>{lang === "it" ? "PROFILO SHINOBI" : "SHINOBI PROFILE"}</span>
        </h2>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Avatar Container with Upload trigger */}
        <div 
          onClick={handleAvatarClick} 
          className="relative w-24 h-24 mx-auto mb-4 rounded-2xl border-4 border-amber-500 shadow-xl overflow-hidden cursor-pointer group bg-black/50"
          title={lang === "it" ? "Clicca per cambiare la foto dal tuo dispositivo" : "Click to change photo from device"}
        >
          {isUploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-amber-300 font-bold text-[10px] gap-1">
              <img
                src="/sharingan_spinner.png"
                alt="Uploading..."
                className="w-6 h-6 object-contain animate-spin filter drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
              />
              <span>{lang === "it" ? "Caricamento..." : "Uploading..."}</span>
            </div>
          ) : (
            <img src={avatarUrl || defaultAvatar} alt="Avatar" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300 text-xs font-bold gap-1">
            <img
              src="/change_avatar.png"
              alt="Cambia foto"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".change-avatar-fallback")) {
                  const span = document.createElement("span");
                  span.className = "change-avatar-fallback text-lg";
                  span.innerText = "📷";
                  parent.insertBefore(span, target);
                }
              }}
              className="w-6 h-6 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
            />
            <span>{lang === "it" ? "Cambia Foto" : "Change Photo"}</span>
          </div>
        </div>

        {/* Username & Status */}
        <h3 className="text-xl font-bold text-white mb-1">{username || user?.user_metadata?.username || user?.email?.split("@")[0] || "Shinobi"}</h3>
        {selectedTitle && (
          <div className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold font-mono px-3 py-1 rounded-full border border-amber-500/40 mb-2">
            ✨ {selectedTitle}
          </div>
        )}
        <p className="text-xs text-gray-400 font-mono mb-2">{user?.email}</p>

        {/* Change Email Toggle Section */}
        <div className="mb-6">
          {!showChangeEmail ? (
            <button
              onClick={() => setShowChangeEmail(true)}
              className="text-[11px] text-amber-300/80 hover:text-amber-300 underline font-mono cursor-pointer"
            >
              {lang === "it" ? "✏️ Modifica Indirizzo Email" : "✏️ Change Email Address"}
            </button>
          ) : (
            <div className="bg-[#070b19] border border-amber-500/30 p-3 rounded-xl space-y-2 text-left animate-fade-in max-w-xs mx-auto">
              <label className="block text-[10px] text-gray-400 font-mono uppercase">
                {lang === "it" ? "Nuovo Indirizzo Email:" : "New Email Address:"}
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nuovo@email.com"
                className="w-full bg-black/60 border border-gray-700 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
              />
              {emailChangeStatus && (
                <div className="text-[10px] font-mono text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                  {emailChangeStatus}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={async () => {
                    if (!newEmail || isChangingEmail) return;
                    setIsChangingEmail(true);
                    setEmailChangeStatus(null);
                    const { error } = await useAuthStore.getState().updateEmailAddress(newEmail);
                    setIsChangingEmail(false);
                    if (error) {
                      setEmailChangeStatus(error.message);
                    } else {
                      setEmailChangeStatus(
                        lang === "it"
                          ? "Email di verifica inviata al nuovo ed al vecchio indirizzo! Conferma entrambi per completare."
                          : "Verification email sent! Confirm both old and new addresses."
                      );
                    }
                  }}
                  disabled={isChangingEmail}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#070b19] font-black text-xs rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  {isChangingEmail ? (lang === "it" ? "Invio..." : "Sending...") : (lang === "it" ? "Invia Conferma" : "Send Confirmation")}
                </button>
                <button
                  onClick={() => {
                    setShowChangeEmail(false);
                    setEmailChangeStatus(null);
                  }}
                  className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Game Statistics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-2.5 text-center col-span-2">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono flex items-center justify-center gap-1.5">
              <img
                src="/score_icon.png"
                alt="Punti"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".score-profile-fallback")) {
                    const span = document.createElement("span");
                    span.className = "score-profile-fallback";
                    span.innerText = "🏆";
                    parent.insertBefore(span, target);
                  }
                }}
                className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.7)]"
              />
              <span>{lang === "it" ? "Punteggio Totale Cumulativo" : "Total Cumulative Score"}</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {totalScore.toLocaleString()} <span className="text-xs font-normal">pts</span>
            </div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              🍥 Classic Best
            </div>
            <div className="text-sm font-bold text-amber-200 font-mono mt-1">
              {classicHighScore.toLocaleString()} pts
            </div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              ⚡ Shippuden Best
            </div>
            <div className="text-sm font-bold text-purple-300 font-mono mt-1">
              {shippudenHighScore.toLocaleString()} pts
            </div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-2.5 text-center col-span-2">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              {lang === "it" ? "Statistiche Partite (Run)" : "Run Statistics"}
            </div>
            <div className="text-xs font-mono text-gray-300 mt-1 flex items-center justify-around">
              <span>Totali: <strong className="text-amber-300">{totalRunsCount}</strong></span>
              <span>Classic: <strong className="text-amber-200">{classicRunsCount}</strong></span>
              <span>Shippuden: <strong className="text-purple-300">{shippudenRunsCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Upload Avatar Button */}
        <button
          onClick={handleAvatarClick}
          className="w-full py-2.5 mb-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-[#070b19] font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 border-amber-800 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src="/change_avatar.png"
            alt="Carica Foto"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".btn-avatar-fallback")) {
                const span = document.createElement("span");
                span.className = "btn-avatar-fallback text-sm";
                span.innerText = "📷";
                parent.insertBefore(span, target);
              }
            }}
            className="w-4 h-4 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
          />
          <span>{lang === "it" ? "Carica Nuova Foto dal Dispositivo" : "Upload New Photo from Device"}</span>
        </button>

        {/* Invite a Friend Button */}
        <button
          onClick={() => {
            if (onOpenInviteModal) {
              onClose();
              onOpenInviteModal();
            } else {
              setShowInviteModal(true);
            }
          }}
          className="w-full py-2.5 mb-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 border-emerald-900 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <img
            src="/invite_friend.png"
            alt="Invita un Amico"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".modal-invite-fallback")) {
                const span = document.createElement("span");
                span.className = "modal-invite-fallback text-sm";
                span.innerText = "📜";
                parent.insertBefore(span, target);
              }
            }}
            className="w-5 h-5 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          />
          <span>{lang === "it" ? "Invita un Amico Shinobi" : "Invite a Shinobi Friend"}</span>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="w-full py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-bold border border-red-500/40 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <span>{lang === "it" ? "Disconnetti Account" : "Sign Out Account"}</span>
        </button>

        {/* Invite Friend Sub-Modal Overlay */}
        {showInviteModal && (
          <InviteFriendModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </div>
  );
};
