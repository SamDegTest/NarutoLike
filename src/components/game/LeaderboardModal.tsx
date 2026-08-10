import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";

interface LeaderboardEntry {
  id: string;
  username: string | null;
  avatar_url: string | null;
  max_level_reached: number;
  total_runs: number;
  classic_runs: number;
  shippuden_runs: number;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const { user } = useAuthStore();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .limit(50);

      if (!error && data) {
        setLeaderboard(data);
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  const defaultAvatar = "/default_avatar.png";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f152d] border-4 border-amber-500 rounded-3xl max-w-2xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[92dvh] flex flex-col text-white"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-amber-300 font-bold text-lg cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        <header className="text-center border-b-2 border-gray-800 pb-3 mb-4 shrink-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
            🏆 {lang === "it" ? "CLASSIFICA GLOBALE SHINOBI" : "GLOBAL SHINOBI LEADERBOARD"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "it"
              ? "I migliori 50 Ninja del mondo classificati per Livello Massimo e Run Totali."
              : "Top 50 Shinobi worldwide ranked by Max Level and Total Runs."}
          </p>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-amber-300 font-mono text-sm gap-2">
            <span className="text-3xl animate-spin">🌀</span>
            <span>{lang === "it" ? "Caricamento Classifica..." : "Loading Leaderboard..."}</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 font-mono text-xs">
            <span>🍃 {lang === "it" ? "Nessun dato in classifica ancora." : "No leaderboard records found yet."}</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = user && user.id === entry.id;
              const rankNum = index + 1;

              let rankBadge = `${rankNum}`;
              let rankStyle = "bg-gray-800 text-gray-300 border-gray-700";

              if (rankNum === 1) {
                rankBadge = "🥇 #1";
                rankStyle = "bg-gradient-to-r from-amber-500 to-yellow-500 text-yellow-950 font-black border-yellow-300 shadow-md";
              } else if (rankNum === 2) {
                rankBadge = "🥈 #2";
                rankStyle = "bg-gradient-to-r from-slate-300 to-gray-400 text-slate-950 font-black border-slate-200 shadow-md";
              } else if (rankNum === 3) {
                rankBadge = "🥉 #3";
                rankStyle = "bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black border-amber-500 shadow-md";
              }

              return (
                <div
                  key={entry.id || index}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrentUser
                      ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.01]"
                      : "bg-[#070b19]/90 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${rankStyle}`}>
                      {rankBadge}
                    </span>

                    <img
                      src={entry.avatar_url || defaultAvatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/50 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white truncate">
                          {entry.username || "Shinobi"}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                            {lang === "it" ? "TU" : "YOU"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <img
                            src="/run.png"
                            alt="Run"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src.endsWith("/run.png")) {
                                target.src = "/icon.png";
                              } else {
                                target.style.display = "none";
                              }
                            }}
                            className="w-3.5 h-3.5 object-contain shrink-0 filter drop-shadow-[0_0_4px_rgba(255,159,28,0.6)]"
                          />
                          <span>Run: <strong className="text-amber-300">{entry.total_runs || 0}</strong></span>
                        </span>
                        <span>⚡ Liv. Max: <strong className="text-green-400">{entry.max_level_reached || 1}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-300 font-mono">
                      Level {entry.max_level_reached || 1}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {entry.shippuden_runs > 0 ? "Shippuden Veteran" : "Classic Genin"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 border-t border-gray-800 pt-3 text-center shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-yellow-500 text-[#070b19] font-bold rounded-xl uppercase tracking-wider text-xs transition-colors border-b-4 border-amber-700 shadow-md cursor-pointer"
          >
            {lang === "it" ? "Chiudi Classifica" : "Close Leaderboard"}
          </button>
        </div>

      </div>
    </div>
  );
};
