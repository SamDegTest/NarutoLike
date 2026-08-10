import React, { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { supabase } from "@/lib/supabaseClient";

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, username, avatarUrl, uploadAvatar, signOut } = useAuthStore();
  const { totalRunsCount, classicRunsCount, shippudenRunsCount, currentLevel } = useGameStore();
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

        <h2 className="text-2xl font-extrabold text-amber-300 uppercase tracking-wider mb-6">
          {lang === "it" ? "PROFILO SHINOBI" : "SHINOBI PROFILE"} 📜
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
            <div className="w-full h-full flex items-center justify-center bg-black/80 text-amber-300 font-bold text-xs">
              🌀 {lang === "it" ? "Caricamento..." : "Uploading..."}
            </div>
          ) : (
            <img src={avatarUrl || defaultAvatar} alt="Avatar" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-amber-300 text-xs font-bold">
            <span className="text-lg">📷</span>
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
        <p className="text-xs text-gray-400 font-mono mb-6">{user?.email}</p>

        {/* Game Statistics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              {lang === "it" ? "Run Totali Giocate" : "Total Runs Played"}
            </div>
            <div className="text-xl font-extrabold text-amber-300 mt-1">{totalRunsCount}</div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              {lang === "it" ? "Livello Corrente" : "Current Level"}
            </div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{currentLevel}</div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              Naruto Classic
            </div>
            <div className="text-sm font-bold text-amber-200 mt-1">{classicRunsCount} runs</div>
          </div>

          <div className="bg-[#070b19] border border-amber-500/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
              Naruto Shippuden
            </div>
            <div className="text-sm font-bold text-purple-300 mt-1">{shippudenRunsCount} runs</div>
          </div>
        </div>

        {/* Change Avatar Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-amber-500/50 transition-all cursor-pointer mb-3"
        >
          📷 {lang === "it" ? "Carica Nuova Foto dal Dispositivo" : "Upload New Photo from Device"}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="w-full py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-bold border border-red-500/40 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          🚪 {lang === "it" ? "Disconnetti Account" : "Sign Out Account"}
        </button>
      </div>
    </div>
  );
};
