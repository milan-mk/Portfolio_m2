import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { TechIcon } from './TechIcon';

export const BarracksSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const totalUnits = SKILL_CATEGORIES.reduce((acc, cat) => acc + cat.skills.length, 0);

  const displayedCategories =
    activeCategory === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((cat) => cat.id === activeCategory);

  // Elemental color map for card borders, badges and glows
  const getElementStyles = (badge?: string) => {
    switch (badge) {
      case 'FIRE':
        return {
          badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          borderGlow: 'hover:border-orange-500/60 hover:shadow-[0_0_24px_rgba(249,115,22,0.18)]',
          pillHover: 'hover:border-orange-500/60 hover:text-orange-300',
          dotColor: 'bg-orange-400',
        };
      case 'ELECTRIC':
        return {
          badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          borderGlow: 'hover:border-amber-400/60 hover:shadow-[0_0_24px_rgba(251,191,36,0.18)]',
          pillHover: 'hover:border-amber-400/60 hover:text-amber-200',
          dotColor: 'bg-amber-400',
        };
      case 'MAGMA':
        return {
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          borderGlow: 'hover:border-red-500/60 hover:shadow-[0_0_24px_rgba(239,68,68,0.18)]',
          pillHover: 'hover:border-red-500/60 hover:text-red-300',
          dotColor: 'bg-red-400',
        };
      case 'PSYCHIC':
        return {
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          borderGlow: 'hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.18)]',
          pillHover: 'hover:border-purple-500/60 hover:text-purple-300',
          dotColor: 'bg-purple-400',
        };
      case 'FROST':
        return {
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          borderGlow: 'hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(6,182,212,0.18)]',
          pillHover: 'hover:border-cyan-400/60 hover:text-cyan-200',
          dotColor: 'bg-cyan-400',
        };
      case 'GROUND':
      default:
        return {
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          borderGlow: 'hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]',
          pillHover: 'hover:border-emerald-500/60 hover:text-emerald-300',
          dotColor: 'bg-emerald-400',
        };
    }
  };

  return (
    <section id="army-camps" className="w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-14">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
        {/* Section Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-surface-container-highest">
          <div>
            <div className="flex items-center gap-1.5 text-primary-container font-label text-[11px] uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Elemental Matchup Deck &bull; Barracks &amp; Arcane Forge
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-[28px] font-extrabold uppercase text-on-surface tracking-tight mt-0.5">
              Type Matchup Chart &amp; Skill Matrix
            </h2>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-label text-[10px] uppercase tracking-widest text-secondary bg-surface-container px-2.5 py-1 rounded border border-surface-container-high font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Housing Space: {totalUnits} / {totalUnits} Units
            </span>
          </div>
        </div>

        {/* Category Tactical Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`font-label text-xs uppercase tracking-wider px-3 py-1 rounded font-bold cursor-pointer transition-all border ${
              activeCategory === 'all'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_2px_0_#78350f]'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest shadow-[0_2px_0_#050811]'
            }`}
          >
            All Decks ({totalUnits})
          </button>
          {SKILL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 font-label text-xs uppercase tracking-wider px-2.5 py-1 rounded font-bold cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_2px_0_#78350f]'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest shadow-[0_2px_0_#050811]'
                }`}
              >
                {cat.troopImage && (
                  <img
                    src={cat.troopImage}
                    alt={cat.troopName || cat.name}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span>{cat.elementBadge || cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.skills.length})</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid — Responsive 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {displayedCategories.map((category) => {
            const styles = getElementStyles(category.elementBadge);

            return (
              <div
                key={category.id}
                className={`relative bg-surface-container/90 backdrop-blur-xs rounded-xl p-4 flex flex-col justify-between border border-surface-container-highest/70 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-300 group hover:-translate-y-1 ${styles.borderGlow}`}
              >
                {/* Top Card Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-surface-container-highest/50">
                  {/* Troop Character Avatar */}
                  <div className="relative w-14 h-14 shrink-0 rounded-lg bg-surface-container-highest/50 p-1 flex items-center justify-center border border-surface-container-highest group-hover:scale-105 transition-transform duration-300">
                    {category.troopImage ? (
                      <img
                        src={category.troopImage}
                        alt={category.troopName || category.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                        loading="lazy"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[24px] text-secondary">
                        {category.icon}
                      </span>
                    )}
                  </div>

                  {/* Element Badge & Category Title */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {category.elementBadge && (
                        <span
                          className={`font-label text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-widest ${styles.badgeBg}`}
                        >
                          {category.elementBadge}
                        </span>
                      )}
                      <span className="text-outline/80 font-label text-[9px] uppercase tracking-wider font-semibold">
                        {category.skills.length} Units
                      </span>
                    </div>

                    <h3 className="font-display text-sm sm:text-base font-extrabold uppercase text-on-surface tracking-wide truncate">
                      {category.name}
                    </h3>

                    {category.troopName && (
                      <span className="text-[10px] font-label text-outline uppercase tracking-wider block">
                        Guardian: {category.troopName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body: Interactive Skill Pills */}
                <div className="pt-3 flex flex-wrap gap-1.5 flex-1 items-start content-start">
                  {category.skills.map((skill) => {
                    const isHovered = hoveredSkill === skill.id;

                    return (
                      <div
                        key={skill.id}
                        onMouseEnter={() => setHoveredSkill(skill.id)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className={`relative group/pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/80 border border-surface-container-highest/70 text-on-surface text-xs font-medium cursor-default transition-all duration-200 hover:scale-105 hover:bg-surface-container-highest ${styles.pillHover}`}
                      >
                        <TechIcon name={skill.name} className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-semibold text-on-surface tracking-tight">
                          {skill.name}
                        </span>

                        {/* Tooltip on Hover */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 pointer-events-none whitespace-nowrap bg-surface-container-lowest text-on-surface px-2 py-0.5 rounded border border-surface-container-highest shadow-lg text-[9px] font-label font-bold flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} />
                            <span>Lv.{skill.level}</span>
                            <span className="text-outline">&bull;</span>
                            <span className="text-secondary">{skill.metricValue}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Subtitle / Tactical Deck Status Footnote */}
                <div className="mt-3 pt-2 border-t border-surface-container-highest/30 flex items-center justify-between text-[10px] font-label text-outline/80">
                  <span className="truncate">{category.subtitle}</span>
                  <span className="shrink-0 text-primary-container font-semibold ml-2">
                    {category.tierBadge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
