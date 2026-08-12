import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/useAuthStore";

interface LeaderboardEntry {
  id: string;
  username: string | null;
  avatar_url: string | null;
  selected_title: string | null;
  max_level_reached: number;
  total_runs: number;
  classic_runs: number;
  shippuden_runs: number;
  total_score?: number;
  classic_high_score?: number;
  shippuden_high_score?: number;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

type TabType = "total" | "classic" | "shippuden";

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { language: storeLang } = useLanguageStore();
  const lang = storeLang || "it";
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>("total");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      
      // Try querying the leaderboard view first
      const { data: viewData, error: viewError } = await supabase
        .from("leaderboard")
        .select("*")
        .limit(100);

      if (!viewError && viewData && viewData.length > 0) {
        setLeaderboard(viewData);
      } else {
        // Fallback: Query profiles table directly if view has missing columns or needs schema refresh
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, selected_title, max_level_reached, total_runs, classic_runs, shippuden_runs, total_score, classic_high_score, shippuden_high_score")
          .order("total_score", { ascending: false })
          .limit(100);

        if (profileData) {
          setLeaderboard(profileData);
        }
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  const defaultAvatar = "/default_avatar.png";

  // Sort leaderboard entries based on active tab
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (activeTab === "total") {
      const scoreA = a.total_score || 0;
      const scoreB = b.total_score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.total_runs || 0) - (a.total_runs || 0);
    } else if (activeTab === "classic") {
      const scoreA = a.classic_high_score || 0;
      const scoreB = b.classic_high_score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.classic_runs || 0) - (a.classic_runs || 0);
    } else {
      const scoreA = a.shippuden_high_score || 0;
      const scoreB = b.shippuden_high_score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.shippuden_runs || 0) - (a.shippuden_runs || 0);
    }
  });

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

        <header className="text-center border-b-2 border-gray-800 pb-3 mb-3 shrink-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
            <img
              src="/leaderboard_header.png"
              alt="Classifica"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 filter drop-shadow-[0_0_10px_rgba(255,159,28,0.8)]"
            />
            <span>{lang === "it" ? "CLASSIFICA GLOBALE SHINOBI" : "GLOBAL SHINOBI LEADERBOARD"}</span>
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {lang === "it"
              ? "Guadagna punti vincendo scontri, sconfiggendo boss ed evaporando le saghe!"
              : "Earn points by winning battles, beating bosses, and clearing sagas!"}
          </p>
        </header>

        {/* TABS NAVIGATION */}
        <div className="flex gap-1.5 p-1 bg-[#070b19] rounded-xl border border-gray-800 mb-3 shrink-0">
          <button
            onClick={() => setActiveTab("total")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "total"
                ? "bg-amber-500 text-[#070b19] shadow-md"
                : "text-gray-400 hover:text-amber-300"
            }`}
          >
            <img
              src="/tab_total.png"
              alt="Totali"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.6)]"
            />
            <span>{lang === "it" ? "Punti Totali" : "Total Score"}</span>
          </button>

          <button
            onClick={() => setActiveTab("classic")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "classic"
                ? "bg-amber-500 text-[#070b19] shadow-md"
                : "text-gray-400 hover:text-amber-300"
            }`}
          >
            <img
              src="/tab_classic.png"
              alt="Classic"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.6)]"
            />
            <span>Classic High Score</span>
          </button>

          <button
            onClick={() => setActiveTab("shippuden")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "shippuden"
                ? "bg-amber-500 text-[#070b19] shadow-md"
                : "text-gray-400 hover:text-amber-300"
            }`}
          >
            <img
              src="/tab_shippuden.png"
              alt="Shippuden"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 filter drop-shadow-[0_0_6px_rgba(255,159,28,0.6)]"
            />
            <span>Shippuden High Score</span>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-amber-300 font-bold text-sm gap-3">
            <img
              src="/sharingan_spinner.png"
              alt="Caricamento..."
              className="w-10 h-10 object-contain animate-spin filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            />
            <span>{lang === "it" ? "Caricamento Classifica..." : "Loading Leaderboard..."}</span>
          </div>
        ) : sortedLeaderboard.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 font-mono text-xs">
            <span>🍃 {lang === "it" ? "Nessun dato in classifica ancora." : "No leaderboard records found yet."}</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sortedLeaderboard.map((entry, index) => {
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

              const displayTitle = entry.selected_title || (lang === "it" ? "Novizio di Konoha 🍃" : "Promising Genin 🍥");
              
              let scoreToDisplay = 0;
              let scoreLabel = "";
              if (activeTab === "total") {
                scoreToDisplay = entry.total_score || 0;
                scoreLabel = lang === "it" ? "Punti Totali" : "Total Pts";
              } else if (activeTab === "classic") {
                scoreToDisplay = entry.classic_high_score || 0;
                scoreLabel = lang === "it" ? "Record Classic" : "Classic Best";
              } else {
                scoreToDisplay = entry.shippuden_high_score || 0;
                scoreLabel = lang === "it" ? "Record Shippuden" : "Shippuden Best";
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
                      <div className="text-[11px] text-amber-400/90 font-mono font-semibold truncate max-w-[170px] sm:max-w-[220px]">
                        {displayTitle}
                      </div>
                      <div className="text-xs text-gray-400 font-mono flex items-center gap-2 sm:gap-3 flex-wrap mt-0.5">
                        {activeTab === "total" && (
                          <>
                            <span className="flex items-center gap-1">
                              <span>Run Totali: <strong className="text-amber-300">{entry.total_runs || 0}</strong></span>
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-amber-200">
                              Classic: <strong>{entry.classic_runs || 0}</strong>
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-purple-300">
                              Shippuden: <strong>{entry.shippuden_runs || 0}</strong>
                            </span>
                          </>
                        )}

                        {activeTab === "classic" && (
                          <span className="flex items-center gap-1">
                            <span>Run Classic: <strong className="text-amber-300">{entry.classic_runs || 0}</strong></span>
                          </span>
                        )}

                        {activeTab === "shippuden" && (
                          <span className="flex items-center gap-1">
                            <span>Run Shippuden: <strong className="text-purple-300">{entry.shippuden_runs || 0}</strong></span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-extrabold text-amber-300 font-mono">
                      {scoreToDisplay.toLocaleString()} pts
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {scoreLabel}
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
