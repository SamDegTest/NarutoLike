import React, { useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";

interface UserProfileBadgeProps {
  onOpenAuthModal: () => void;
  onOpenProfileModal?: () => void;
  onOpenInviteModal?: () => void;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenInviteModal,
}) => {
  const { user, username, avatarUrl, selectedTitle, signOut, uploadAvatar } = useAuthStore();
  const { totalScore } = useGameStore();
  const lang = useLanguageStore((state) => state.language);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "it" ? "L'immagine non può superare 5MB" : "Image size must not exceed 5MB");
      return;
    }

    setIsUploading(true);
    const { error } = await uploadAvatar(file);
    setIsUploading(false);

    if (error) {
      alert(error.message || (lang === "it" ? "Errore durante il caricamento dell'avatar" : "Error uploading avatar"));
    }
  };

  if (!user) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="h-9 sm:h-11 lg:h-14 flex items-center gap-1 sm:gap-2 bg-[#0f152d]/90 backdrop-blur-md hover:bg-amber-500/20 text-amber-300 font-extrabold px-2 sm:px-3 lg:px-4 rounded-xl lg:rounded-2xl border border-amber-500/50 hover:border-amber-400 shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 text-[10px] sm:text-xs lg:text-sm font-mono tracking-wider uppercase shrink-0"
      >
        <img
          src="/cloud.png"
          alt="Cloud"
          onError={(e) => {
            const target = e.target as HTMLElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".cloud-btn-fallback")) {
              const span = document.createElement("span");
              span.className = "cloud-btn-fallback text-xs sm:text-base";
              span.innerText = "☁️";
              parent.insertBefore(span, target);
            }
          }}
          className="h-4 sm:h-5 lg:h-7 w-auto object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(255,159,28,0.8)]"
        />
        <span>{lang === "it" ? "Accedi / Registrati" : "Login / Register"}</span>
      </button>
    );
  }

  const defaultAvatar = "/default_avatar.png";
  const titleToDisplay = selectedTitle || (lang === "it" ? "Novizio di Konoha 🍃" : "Promising Genin 🍥");

  return (
    <div className="relative inline-block text-left shrink-0">
      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Profile Button - Clicking opens dropdown menu */}
      <div
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex items-center gap-1.5 sm:gap-2 bg-[#0f152d]/90 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 rounded-xl lg:rounded-2xl px-2 sm:px-3 lg:px-3.5 shadow-xl transition-all h-9 sm:h-11 lg:h-14 cursor-pointer select-none hover:scale-105 active:scale-95 shrink-0"
      >
        {/* Avatar Frame */}
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl overflow-hidden border border-amber-400/90 bg-black/60 shrink-0 shadow-inner">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/80">
              <img
                src="/sharingan_spinner.png"
                alt="Uploading..."
                className="w-5 h-5 object-contain animate-spin filter drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
              />
            </div>
          ) : (
            <img
              src={avatarUrl || defaultAvatar}
              alt={username || "User"}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* User Information */}
        <div className="text-left">
          <div className="flex items-center leading-tight">
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[150px]">
              {username || user?.user_metadata?.username || user?.email?.split("@")[0] || "Shinobi"}
            </span>
          </div>
          <div className="text-[10px] text-amber-400/90 font-mono font-semibold leading-tight truncate max-w-[120px] sm:max-w-[160px]">
            <span>{titleToDisplay}</span>
          </div>
        </div>
      </div>

      {/* Profile Actions Dropdown Menu */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2.5 w-64 bg-[#0f152d] border-2 border-amber-500/60 rounded-2xl shadow-2xl p-2.5 z-50 animate-fade-in"
          onClick={() => setShowDropdown(false)}
        >
          <button
            onClick={handleAvatarClick}
            className="w-full text-left px-3.5 py-2.5 text-sm sm:text-base font-bold text-gray-100 hover:bg-amber-500/20 hover:text-amber-300 rounded-xl transition-all flex items-center gap-3 cursor-pointer mb-1.5"
          >
            <img
              src="/change_avatar.png"
              alt="Carica Foto"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".badge-avatar-fallback")) {
                  const span = document.createElement("span");
                  span.className = "badge-avatar-fallback text-lg";
                  span.innerText = "📷";
                  parent.insertBefore(span, target);
                }
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
            />
            <span>{lang === "it" ? "Carica Foto Profilo" : "Upload Profile Photo"}</span>
          </button>

          {onOpenProfileModal && (
            <button
              onClick={() => {
                setShowDropdown(false);
                onOpenProfileModal();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm sm:text-base font-bold text-gray-100 hover:bg-amber-500/20 hover:text-amber-300 rounded-xl transition-all flex items-center gap-3 cursor-pointer mb-1.5"
            >
              <img
                src="/menu_stats.png"
                alt="Statistiche"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.8)]"
              />
              <span>{lang === "it" ? "Profilo & Statistiche" : "Profile & Stats"}</span>
            </button>
          )}

          {(onOpenInviteModal || onOpenProfileModal) && (
            <button
              onClick={() => {
                setShowDropdown(false);
                if (onOpenInviteModal) {
                  onOpenInviteModal();
                } else if (onOpenProfileModal) {
                  onOpenProfileModal();
                }
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm sm:text-base font-bold text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-all flex items-center gap-3 cursor-pointer mb-1.5"
            >
              <img
                src="/invite_friend.png"
                alt="Invita un Amico"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
              />
              <span>{lang === "it" ? "Invita un Amico" : "Invite a Friend"}</span>
            </button>
          )}

          <div className="border-t border-gray-800 my-1.5" />

          <button
            onClick={() => signOut()}
            className="w-full text-center justify-center px-3.5 py-2.5 text-sm sm:text-base font-bold text-red-400 hover:bg-red-950/40 rounded-xl transition-all flex items-center gap-3 cursor-pointer"
          >
            <span>{lang === "it" ? "Disconnetti" : "Sign Out"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
