import React from 'react';
import { CAMPAIGN_PROJECTS, CHIEF_INFO } from '../data/portfolioData';

export const WarLogSection: React.FC = () => {
  const getPillStyles = (theme?: string) => {
    switch (theme) {
      case 'cyan':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/50 hover:bg-orange-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/50 hover:bg-purple-500/30';
      case 'emerald':
      default:
        return 'bg-red-500/20 text-red-300 border-red-400/50 hover:bg-red-500/30';
    }
  };

  return (
    <section id="war-log" className="w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-14">
      <div className="max-w-[1040px] mx-auto flex flex-col gap-6">
        {/* Section Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 pb-3 border-b border-surface-container-highest">
          <div>
            <div className="flex items-center gap-1.5 text-primary font-label text-[11px] uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px]">military_tech</span>
              Guild Campaign Log: 100% Cleared Expeditions
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-[28px] font-extrabold uppercase text-on-surface tracking-tight mt-0.5">
              Featured Engineering Battle Replays
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded border border-surface-container-high self-start sm:self-auto shadow-[0_2px_0_#070304]">
            <span className="material-symbols-outlined text-primary-container text-[16px] material-symbols-fill">star</span>
            <span className="material-symbols-outlined text-primary-container text-[16px] material-symbols-fill">star</span>
            <span className="material-symbols-outlined text-primary-container text-[16px] material-symbols-fill">star</span>
            <span className="font-label text-[10px] uppercase text-primary font-bold ml-1">
              Perfect Campaign Record
            </span>
          </div>
        </div>

        {/* Active Village War Defense Layout Banner (TH10 Fortress Blueprint) */}
        <div className="relative bg-surface-container rounded-2xl p-4 sm:p-5 border border-surface-container-highest/80 shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row items-center gap-5 animate-magma-glow">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600/50 via-primary-container to-orange-500/50 shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>

          {/* Base Layout Isometric Preview */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-xl bg-surface-container-lowest p-2 border border-secondary/40 shadow-inner group overflow-hidden flex items-center justify-center">
            <img
              src={CHIEF_INFO.th10BaseImg}
              alt="Town Hall 10 Defense Layout"
              className="w-full h-full object-contain rounded-lg drop-shadow-[0_4px_16px_rgba(234,88,12,0.6)] group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded text-[8px] font-label text-primary text-center border border-primary-container/30 uppercase font-bold tracking-wider">
              TH10 Anti-3-Star Layout
            </div>
          </div>

          {/* Defense Architecture Narrative */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label text-[10px] uppercase tracking-wider text-primary-container bg-primary-container/15 px-2 py-0.5 rounded border border-primary-container/30 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Active Defense Fortress
              </span>
              <span className="font-label text-[10px] uppercase text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                0 Stars Conceded &bull; Perfect Defense Record
              </span>
            </div>

            <h3 className="font-display font-black text-lg sm:text-xl uppercase text-on-surface">
              Fortified Web Architecture Defense Grid
            </h3>

            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Every production web system I build is engineered like this maxed Town Hall 10 layout: core state isolated on protected island containers, dual multi-target load balancers to incinerate traffic surges, and multi-layer firewall boundaries.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-surface-container-lowest p-1.5 rounded flex items-center gap-2 border border-surface-container-high/40">
                <span className="material-symbols-outlined text-primary-container text-[16px]">local_fire_department</span>
                <span className="font-label text-[10px] text-on-surface uppercase font-bold">Multi-Inferno Core</span>
              </div>
              <div className="bg-surface-container-lowest p-1.5 rounded flex items-center gap-2 border border-surface-container-high/40">
                <span className="material-symbols-outlined text-primary-container text-[16px]">adjust</span>
                <span className="font-label text-[10px] text-on-surface uppercase font-bold">Triple X-Bow Sentry</span>
              </div>
              <div className="bg-surface-container-lowest p-1.5 rounded flex items-center gap-2 border border-surface-container-high/40">
                <span className="material-symbols-outlined text-primary-container text-[16px]">verified_user</span>
                <span className="font-label text-[10px] text-on-surface uppercase font-bold">Lava Wall Perimeter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid: Clan War Attack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {CAMPAIGN_PROJECTS.map((project) => {
            const pillStyle = getPillStyles(project.pillTheme);
            const hpValue = project.hp || 95;

            return (
              <div
                key={project.id}
                className="relative bg-surface-container/95 backdrop-blur-xs rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)] border border-surface-container-highest/80 overflow-hidden group hover:border-secondary/60 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Background Watermark Sprite (like silhouette in reference image) */}
                {project.troopImage && (
                  <img
                    src={project.troopImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute -right-6 -bottom-6 w-44 h-44 object-contain opacity-5 pointer-events-none filter grayscale contrast-200 group-hover:opacity-8 transition-opacity duration-300"
                  />
                )}

                {/* Card Top Row: Troop Character Sprite (Left) & HP Bar + Stars (Right) */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Troop Character Avatar & Quest Info */}
                  <div className="flex items-center gap-3">
                    {project.troopImage ? (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center p-1 rounded-xl bg-surface-container-highest/60 border border-surface-container-highest shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={project.troopImage}
                          alt={project.troopName || project.title}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-surface-container-highest">
                        <span className="material-symbols-outlined text-primary text-[24px]">swords</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label text-[10px] uppercase text-primary-container font-extrabold tracking-wider">
                          Quest #{project.questNumber}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-highest font-label text-[9px] text-outline uppercase font-bold border border-surface-container-high">
                          {project.category}
                        </span>
                      </div>
                      {project.troopName && (
                        <span className="font-label text-[11px] text-on-surface-variant font-bold tracking-wide">
                          Guardian: <span className="text-secondary">{project.troopName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: HP Bar & 3 Stars Badge */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {/* HP Meter (Game Styled) */}
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 px-2.5 py-1 rounded-md border border-surface-container-high/60 shadow-xs">
                      <span className="font-label font-black text-[11px] text-primary-container tracking-wider">
                        HP
                      </span>
                      <div className="w-14 sm:w-16 h-2 bg-surface-container-high rounded-full overflow-hidden p-[1px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary-container shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                          style={{ width: `${hpValue}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px] text-on-surface">
                        {hpValue}
                      </span>
                    </div>

                    {/* 3-Star Badge */}
                    <div className="flex items-center gap-0.5 bg-surface-container-lowest/80 px-1.5 py-0.5 rounded shadow-xs border border-surface-container-high/40">
                      {Array.from({ length: project.stars }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-primary-container text-[13px] material-symbols-fill">
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Title */}
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black uppercase text-on-surface tracking-wide group-hover:text-secondary transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                    {project.description}
                  </p>
                </div>

                {/* Project Image Preview with subtle badge */}
                <div className="relative w-full h-32 sm:h-36 rounded-lg overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] border border-surface-container-highest/60 bg-surface-container-lowest">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={project.title}
                    src={project.image}
                    loading="lazy"
                  />
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur font-label text-[10px] font-bold text-on-surface border border-surface-container-high shadow-xs">
                    {project.badgeHighlight}
                  </div>
                </div>

                {/* Tactical Combat Metrics with ⚔ Icons (Matching User Reference Image) */}
                <div className="bg-surface-container-lowest/85 rounded-xl p-3 border border-surface-container-high/60 flex flex-col gap-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                      <span className="text-secondary text-[12px] filter drop-shadow-[0_0_2px_rgba(56,189,248,0.5)]">⚔</span>
                      <span>{project.lootWon.stat1.label}</span>
                    </span>
                    <span className="font-bold text-primary-container tracking-wider">
                      {project.lootWon.stat1.value}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-surface-container-high/40 pt-1.5">
                    <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                      <span className="text-secondary text-[12px] filter drop-shadow-[0_0_2px_rgba(56,189,248,0.5)]">⚔</span>
                      <span>{project.lootWon.stat2.label}</span>
                    </span>
                    <span className="font-bold text-secondary tracking-wider">
                      {project.lootWon.stat2.value}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-surface-container-high/40 pt-1.5">
                    <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                      <span className="text-secondary text-[12px] filter drop-shadow-[0_0_2px_rgba(56,189,248,0.5)]">⚔</span>
                      <span>{project.lootWon.stat3.label}</span>
                    </span>
                    <span className="font-bold text-tertiary tracking-wider">
                      {project.lootWon.stat3.value}
                    </span>
                  </div>
                </div>

                {/* Tech Pills (Matching Colorful Rounded Pill Badges in Reference Image) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`font-label text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-200 cursor-default shadow-xs ${pillStyle}`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Action Triggers */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-surface-container-highest/40">
                  <a
                    href={project.demoUrl}
                    className="flex-1 text-center py-2 rounded-lg font-display font-bold text-xs sm:text-sm uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1 btn-tactile-gold shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] material-symbols-fill">play_arrow</span>
                    <span>Attack (Demo)</span>
                  </a>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 rounded-lg bg-surface-container-highest text-primary hover:bg-surface-bright font-display font-bold text-xs sm:text-sm uppercase tracking-wide shadow-[0_2px_0_#050811] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 border border-surface-container-high/60 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    <span>Inspect Source</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
