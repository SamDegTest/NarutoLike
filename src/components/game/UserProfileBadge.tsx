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
        className="flex items-center gap-2 bg-gradient-to-r from-[#ff9f1c]/20 to-yellow-500/20 hover:from-[#ff9f1c]/30 hover:to-yellow-500/30 text-amber-300 font-extrabold px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 text-xs font-mono tracking-wider uppercase animate-pulse"
      >
        <span>☁️</span>
        <span>{lang === "it" ? "Accedi / Registrati" : "Login / Register"}</span>
      </button>
    );
  }

  const defaultAvatar = "/default_avatar.png";

  return (
    <div className="relative inline-block text-left">
      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center gap-2.5 bg-[#0f152d]/90 backdrop-blur-md border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl p-1.5 pr-3 shadow-2xl transition-all">
        {/* Avatar Container with Camera Hover Overlay */}
        <div
          onClick={handleAvatarClick}
          className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-amber-400/80 bg-black/60 cursor-pointer group shrink-0 shadow-inner"
          title={lang === "it" ? "Clicca per cambiare foto dal tuo dispositivo 📷" : "Click to change photo from device 📷"}
        >
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-black/80 text-[10px] text-amber-300 font-bold animate-spin">
              🌀
            </div>
          ) : (
            <img
              src={avatarUrl || defaultAvatar}
              alt={username || "User"}
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            />
          )}

          {/* Camera Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
            📷
          </div>
        </div>

        {/* User Information */}
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className="cursor-pointer select-none text-left"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-amber-300 text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[150px]">
              {username || user?.user_metadata?.username || user?.email?.split("@")[0] || "Shinobi"}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Online" />
          </div>
          <div className="text-xs text-gray-300 font-mono font-medium leading-tight mt-0.5">
            {lang === "it" ? "Account Cloud ☁️" : "Cloud Account ☁️"}
          </div>
        </div>
      </div>

      {/* Profile Actions Dropdown Menu */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-48 bg-[#0f152d] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
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
