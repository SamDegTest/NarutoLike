import React from "react";
import { RunNinja, Ninja } from "@/types/index";
import { RARITY_CONFIGS } from "@/lib/rarity";
import { NinjaAvatar } from "./NinjaAvatar";
import { ChakraNatureBadge } from "./ChakraNatureBadge";
import { JUTSU_MAP } from "@/data/jutsus";
import { useLanguageStore } from "@/store/useLanguageStore";
import { TRANSLATIONS, translateNinjaName, JUTSU_TRANSLATIONS } from "@/data/translations";
import { useGameStore } from "@/store/useGameStore";
import { getActiveSynergies } from "@/lib/synergies";
import { getNinjaEffectiveStats } from "@/utils/statUtils";

interface Props {
  ninja: RunNinja | Ninja;
  onClose: () => void;
  onUnequipItem?: (ninjaId: string) => void;
}

export function NinjaDetailModal({ ninja, onClose, onUnequipItem }: Props) {
  const { language: lang } = useLanguageStore();
  const t = TRANSLATIONS[lang];

  const translatedName = translateNinjaName(ninja.id, ninja.name, lang);
  const config = RARITY_CONFIGS[ninja.rank || "C"];
  const level = (ninja as any).level || 1;

  const runTeam = useGameStore((state) => state.runTeam);
  const activeConsumableEffects = useGameStore((state) => state.activeConsumableEffects);
  const activeSynergies = getActiveSynergies(runTeam.length > 0 ? runTeam : [(ninja as any)]);

  const effStats = getNinjaEffectiveStats(
    ninja as RunNinja,
    activeConsumableEffects,
    runTeam.length > 0 ? runTeam : [(ninja as any)],
    lang
  );

  const currentHp = (ninja as any).currentHp !== undefined ? (ninja as any).currentHp : effStats.hpMax.total;
  const currentChakra = (ninja as any).currentChakra !== undefined ? (ninja as any).currentChakra : effStats.chakraMax.total;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / effStats.hpMax.total) * 100));
  const chakraPercent = Math.max(0, Math.min(100, (currentChakra / effStats.chakraMax.total) * 100));

  const hasAnyBoost =
    effStats.hpMax.isBoosted ||
    effStats.chakraMax.isBoosted ||
    effStats.attack.isBoosted ||
    effStats.defense.isBoosted ||
    effStats.speed.isBoosted;

  // Collect unique active boost sources
  const allSources = [
    ...effStats.hpMax.sources,
    ...effStats.chakraMax.sources,
    ...effStats.attack.sources,
    ...effStats.defense.sources,
    ...effStats.speed.sources,
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={config.cardStyle}
        className={`bg-[#0f152d] border-4 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] my-auto ${config.cardBorder} ${config.cardGlow}`}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${config.badgeBg} ${config.badgeTextColor} shrink-0`}>
              {config.rankSymbol}
            </span>
            <h3 className={`text-lg sm:text-xl font-black truncate ${config.textColor}`}>
              {translatedName}
            </h3>
            <span className="text-xs font-mono font-bold text-[#ff9f1c] bg-black/50 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
              Lv. {level}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white font-bold flex items-center justify-center transition-all cursor-pointer border border-gray-700 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 font-sans text-white">

          {/* AVATAR & NATURE HERO SECTION */}
          <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/10">
            <NinjaAvatar
              src={ninja.sprite}
              name={translatedName}
              rank={ninja.rank}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-black/60 rounded-2xl p-1 border-2 border-amber-500/40 shrink-0 shadow-lg"
            />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <ChakraNatureBadge nature={ninja.chakraNature} showText={true} />
                <span className="text-[10px] font-mono text-gray-300 uppercase bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                  {ninja.version === "shippuden" ? "Shippuden" : "Genin"}
                </span>
              </div>

              {/* HP BAR */}
              <div>
                <div className="flex justify-between text-[11px] font-mono font-bold text-gray-300 mb-0.5">
                  <span>HP</span>
                  <span className={effStats.hpMax.isBoosted ? "text-emerald-300 font-extrabold flex items-center gap-1" : "text-emerald-400"}>
                    {currentHp} / {effStats.hpMax.total}
                    {effStats.hpMax.isBoosted && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/40">
                        ▲ ({effStats.hpMax.base})
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded overflow-hidden border border-gray-700">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${hpPercent}%` }} />
                </div>
              </div>

              {/* CHAKRA BAR */}
              <div>
                <div className="flex justify-between text-[11px] font-mono font-bold text-gray-300 mb-0.5">
                  <span>CHAKRA</span>
                  <span className={effStats.chakraMax.isBoosted ? "text-blue-300 font-extrabold flex items-center gap-1" : "text-blue-400"}>
                    {currentChakra} / {effStats.chakraMax.total}
                    {effStats.chakraMax.isBoosted && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded border border-blue-500/40">
                        ▲ ({effStats.chakraMax.base})
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded overflow-hidden border border-gray-700">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${chakraPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID WITH BASE VS BOOSTED INDICATORS */}
          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{lang === "it" ? "Statistiche dello Shinobi" : "Shinobi Stats"}</span>
              {hasAnyBoost && (
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  {lang === "it" ? "POTENZIATO" : "BOOSTED"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-mono">
              {/* HP */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  effStats.hpMax.isBoosted
                    ? "bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    : "bg-gray-950/80 border border-green-500/20"
                }`}
              >
                <span className="text-gray-400 block text-[9px] uppercase font-bold">HP</span>
                <span className={`font-extrabold text-sm ${effStats.hpMax.isBoosted ? "text-emerald-300" : "text-green-400"}`}>
                  {effStats.hpMax.total}
                  {effStats.hpMax.isBoosted && <span className="text-xs ml-0.5">▲</span>}
                </span>
                {effStats.hpMax.isBoosted && (
                  <span className="text-[8px] text-emerald-400/90 font-bold block truncate" title={`Base: ${effStats.hpMax.base}`}>
                    (Base {effStats.hpMax.base})
                  </span>
                )}
              </div>

              {/* CHK */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  effStats.chakraMax.isBoosted
                    ? "bg-blue-950/40 border-2 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]"
                    : "bg-gray-950/80 border border-blue-500/20"
                }`}
              >
                <span className="text-gray-400 block text-[9px] uppercase font-bold">CHK</span>
                <span className={`font-extrabold text-sm ${effStats.chakraMax.isBoosted ? "text-blue-300" : "text-blue-400"}`}>
                  {effStats.chakraMax.total}
                  {effStats.chakraMax.isBoosted && <span className="text-xs ml-0.5">▲</span>}
                </span>
                {effStats.chakraMax.isBoosted && (
                  <span className="text-[8px] text-blue-400/90 font-bold block truncate" title={`Base: ${effStats.chakraMax.base}`}>
                    (Base {effStats.chakraMax.base})
                  </span>
                )}
              </div>

              {/* ATK */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  effStats.attack.isBoosted
                    ? "bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    : "bg-gray-950/80 border border-red-500/20"
                }`}
              >
                <span className="text-gray-400 block text-[9px] uppercase font-bold">ATK</span>
                <span className={`font-extrabold text-sm ${effStats.attack.isBoosted ? "text-emerald-300" : "text-red-400"}`}>
                  {effStats.attack.total}
                  {effStats.attack.isBoosted && <span className="text-xs ml-0.5 text-emerald-400">▲</span>}
                </span>
                {effStats.attack.isBoosted && (
                  <span className="text-[8px] text-emerald-400/90 font-bold block truncate" title={`Base: ${effStats.attack.base}`}>
                    (Base {effStats.attack.base})
                  </span>
                )}
              </div>

              {/* DEF */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  effStats.defense.isBoosted
                    ? "bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    : "bg-gray-950/80 border border-amber-500/20"
                }`}
              >
                <span className="text-gray-400 block text-[9px] uppercase font-bold">DEF</span>
                <span className={`font-extrabold text-sm ${effStats.defense.isBoosted ? "text-emerald-300" : "text-amber-400"}`}>
                  {effStats.defense.total}
                  {effStats.defense.isBoosted && <span className="text-xs ml-0.5 text-emerald-400">▲</span>}
                </span>
                {effStats.defense.isBoosted && (
                  <span className="text-[8px] text-emerald-400/90 font-bold block truncate" title={`Base: ${effStats.defense.base}`}>
                    (Base {effStats.defense.base})
                  </span>
                )}
              </div>

              {/* SPD */}
              <div
                className={`p-2 rounded-xl transition-all ${
                  effStats.speed.isBoosted
                    ? "bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    : "bg-gray-950/80 border border-purple-500/20"
                }`}
              >
                <span className="text-gray-400 block text-[9px] uppercase font-bold">SPD</span>
                <span className={`font-extrabold text-sm ${effStats.speed.isBoosted ? "text-emerald-300" : "text-purple-400"}`}>
                  {effStats.speed.total}
                  {effStats.speed.isBoosted && <span className="text-xs ml-0.5 text-emerald-400">▲</span>}
                </span>
                {effStats.speed.isBoosted && (
                  <span className="text-[8px] text-emerald-400/90 font-bold block truncate" title={`Base: ${effStats.speed.base}`}>
                    (Base {effStats.speed.base})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVE BOOST BREAKDOWN PANEL */}
          {allSources.length > 0 && (
            <div className="bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{lang === "it" ? "Sorgenti Potenziamenti Attivi" : "Active Boost Sources"}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {allSources.map((src, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/40 px-1 py-0.2 rounded uppercase">
                        {src.type === "item" ? (lang === "it" ? "Strumento" : "Item") : src.type === "consumable" ? (lang === "it" ? "Consumabile" : "Consumable") : (lang === "it" ? "Sinergia" : "Synergy")}
                      </span>
                      <span>{src.name}</span>
                    </span>
                    <span className="font-extrabold text-emerald-400">{src.bonusText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EQUIPPED ITEM DISPLAY */}
          {(() => {
            const item = (ninja as RunNinja).equippedItem;
            return (
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
                <div className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{lang === "it" ? "Strumento Equipaggiato" : "Equipped Item"}</span>
                  {item && onUnequipItem && (
                    <button
                      type="button"
                      onClick={() => onUnequipItem(ninja.id)}
                      className="text-[10px] text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40 transition-all cursor-pointer font-extrabold uppercase"
                    >
                      {lang === "it" ? "Rimuovi Strumento" : "Unequip Item"}
                    </button>
                  )}
                </div>

                {item ? (
                  (() => {
                    const itemRarity = RARITY_CONFIGS[(item.rarity || "C") as keyof typeof RARITY_CONFIGS];
                    return (
                      <div className={`flex items-center gap-3 p-2.5 rounded-xl border-2 ${itemRarity.cardBorder} ${itemRarity.cardBg}`}>
                        <div className="w-10 h-10 p-1 bg-black/60 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
                          <img
                            src={`/items/${item.id}.png`}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                            alt={item.name[lang]}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-black ${itemRarity.badgeBg} ${itemRarity.badgeTextColor}`}>
                              RANK {item.rarity || "C"}
                            </span>
                            <div className={`font-bold text-xs ${itemRarity.textColor}`}>{item.name[lang]}</div>
                          </div>
                          <div className="text-[10px] text-gray-300 font-mono leading-tight mt-0.5 whitespace-pre-line">
                            {item.description[lang]}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-xs text-gray-400 italic font-mono text-center py-2 bg-gray-950/40 rounded-xl border border-gray-800">
                    {lang === "it" ? "Nessuno strumento equipaggiato." : "No item currently equipped."}
                  </div>
                )}
              </div>
            );
          })()}

          {/* JUTSUS & TECHNIQUES LIST */}
          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{lang === "it" ? "Tecniche e Jutsu Imparati" : "Learned Jutsus & Techniques"}</span>
              <span className="text-[10px] text-gray-400">({ninja.jutsuList.length})</span>
            </div>

            <div className="space-y-2">
              {ninja.jutsuList.map((jId, idx) => {
                const jutsuData = JUTSU_MAP.get(jId);
                const isActive = ninja.activeJutsuId === jId;
                const jutsuName = JUTSU_TRANSLATIONS[jId]?.name[lang] || jutsuData?.name || jId;
                const jutsuDesc = JUTSU_TRANSLATIONS[jId]?.description[lang] || jutsuData?.description || "";
                const isHeal = jutsuData && jutsuData.power < 0;

                return (
                  <div
                    key={jId}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                        : "bg-[#070b19] border-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-extrabold font-mono text-gray-400">#{idx + 1}</span>
                        <h5 className="font-extrabold text-xs text-white truncate">{jutsuName}</h5>
                        {isActive && (
                          <span className="text-[9px] font-black font-mono bg-cyan-500 text-gray-950 px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0">
                            {lang === "it" ? "ATTIVA" : "ACTIVE"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono font-bold">
                        <span className="text-blue-400">{jutsuData?.chakraCost || 0} CHK</span>
                        <span className={isHeal ? "text-green-400" : "text-red-400"}>
                          {isHeal ? `+${Math.abs(jutsuData?.power || 0)} HEAL` : `${jutsuData?.power || 0} PWR`}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-300 font-mono leading-tight">
                      {jutsuDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SYNERGIES AFFILIATION */}
          {activeSynergies.length > 0 && (
            <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
                {lang === "it" ? "Sinergie Attive di Squadra" : "Active Squad Synergies"}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeSynergies.map((res) => (
                  <div
                    key={res.synergy.id}
                    className={`text-[10px] px-2.5 py-1 rounded-xl border font-bold flex items-center gap-1.5 ${res.synergy.colorClass} ${res.synergy.borderClass}`}
                    title={res.tier.description[lang]}
                  >
                    <span>{res.synergy.icon}</span>
                    <span>{res.synergy.name[lang]} ({res.tier.levelName[lang]})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
