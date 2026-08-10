import React, { useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";

interface UserProfileBadgeProps {
  onOpenAuthModal: () => void;
  onOpenProfileModal?: () => void;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const { user, username, avatarUrl, signOut, uploadAvatar } = useAuthStore();
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
        className="h-14 min-h-[56px] flex items-center gap-2.5 bg-[#0f152d]/90 backdrop-blur-md hover:bg-amber-500/20 text-amber-300 font-extrabold px-4 rounded-2xl border-2 border-amber-500/50 hover:border-amber-400 shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 text-xs sm:text-sm font-mono tracking-wider uppercase shrink-0"
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
              span.className = "cloud-btn-fallback text-base";
              span.innerText = "☁️";
              parent.insertBefore(span, target);
            }
          }}
          className="h-7 w-auto object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(255,159,28,0.8)] transition-transform hover:scale-110"
        />
        <span>{lang === "it" ? "Accedi / Registrati" : "Login / Register"}</span>
      </button>
    );
  }

  const defaultAvatar = "/default_avatar.png";

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
        className="flex items-center gap-3 bg-[#0f152d]/90 backdrop-blur-md border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl px-3.5 shadow-2xl transition-all h-14 min-h-[56px] cursor-pointer select-none hover:scale-105 active:scale-95 shrink-0"
      >
        {/* Enlarged Avatar Frame */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-400/90 bg-black/60 shrink-0 shadow-inner">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/80 text-xs text-amber-300 font-bold animate-spin">
              🌀
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
          <div className="text-[10px] sm:text-[11px] text-amber-400/80 font-mono font-bold leading-tight mt-0.5">
            <span>{lang === "it" ? "Account Cloud" : "Cloud Account"}</span>
          </div>
        </div>
      </div>

      {/* Profile Actions Dropdown Menu */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-52 bg-[#0f152d] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
          onClick={() => setShowDropdown(false)}
        >
          <button
            onClick={handleAvatarClick}
            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-200 hover:bg-amber-500/20 hover:text-amber-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer mb-1"
          >
            <span>📷</span>
            <span>{lang === "it" ? "Carica Foto Profilo" : "Upload Profile Photo"}</span>
          </button>

          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="w-full text-left px-3 py-2 text-xs font-bold text-gray-200 hover:bg-amber-500/20 hover:text-amber-300 rounded-xl transition-all flex items-center gap-2 cursor-pointer mb-1"
            >
              <span>📊</span>
              <span>{lang === "it" ? "Profilo & Statistiche" : "Profile & Stats"}</span>
            </button>
          )}

          <div className="border-t border-gray-800 my-1" />

          <button
            onClick={() => signOut()}
            className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>{lang === "it" ? "Disconnetti" : "Sign Out"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
