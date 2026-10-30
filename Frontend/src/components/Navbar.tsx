import React, { useState, useEffect } from 'react';
import { CHIEF_INFO, RESOURCE_METERS } from '../data/portfolioData';
import { villageAudio } from '../utils/soundEffects';
import { VillageAudioPlayer } from './VillageAudioPlayer';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Base', href: '#citadel-base', id: 'citadel-base', icon: 'fort' },
    { name: 'Skills', href: '#army-camps', id: 'army-camps', icon: 'swords' },
    { name: 'Projects Log', href: '#war-log', id: 'war-log', icon: 'military_tech' },
    { name: 'Summon CV', href: '#clan-recruitment', id: 'clan-recruitment', icon: 'mark_email_read' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
        ? 'bg-surface-container-lowest/98 backdrop-blur-md shadow-[0_12px_24px_-4px_rgba(0,0,0,0.85)] border-b border-surface-container-highest/60'
        : 'bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_12px_24px_-4px_rgba(0,0,0,0.75)]'
        }`}
    >
      <div className="h-16 sm:h-20 w-full max-w-[1360px] mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-3">
        {/* Chief Emblem & Crest */}
        <a href="#citadel-base" className="flex items-center gap-2 shrink-0 group">
          <img
            alt="Clash Dev Emblem Logo"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            src={CHIEF_INFO.emblemImg}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-xs sm:text-base uppercase text-primary tracking-wide group-hover:text-primary-container transition-colors">
                Chief {CHIEF_INFO.name.split(' ')[0]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant font-bold whitespace-nowrap">
                TH Level {CHIEF_INFO.townHallLevel}
              </span>
              <span className="hidden sm:inline-block font-label text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 bg-surface-container-high rounded text-primary-container font-bold border border-surface-container-highest whitespace-nowrap">
                {CHIEF_INFO.roleBadge}
              </span>
            </div>
          </div>
        </a>

        {/* Live Resource HUD Bars (Visible on 2XL wide desktop screens) */}
        <div className="hidden 2xl:flex items-center gap-2.5 shrink-0">
          {RESOURCE_METERS.map((meter) => {
            const isGold = meter.color === 'primary';
            const isElixir = meter.color === 'secondary';
            const textColor = isGold ? 'text-primary' : isElixir ? 'text-secondary' : 'text-tertiary';
            const barColor = isGold ? 'bg-primary-container' : isElixir ? 'bg-secondary-container' : 'bg-tertiary';

            return (
              <div
                key={meter.id}
                onClick={() => villageAudio.playGold()}
                className="flex flex-col gap-1 w-32 bg-surface-container-lowest p-1.5 rounded border border-surface-container-high/40 shadow-[0_2px_0_#070304] cursor-pointer hover:border-primary-container/50 hover:brightness-105 active:scale-98 transition-all"
                title={`${meter.name}: ${meter.current} / ${meter.max} (Click to collect)`}
              >
                <div className="flex justify-between items-center px-1 font-label text-[10px] font-bold">
                  <span className={`${textColor} flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-[13px]">{meter.icon}</span>
                    {meter.name.split(' ')[0]}
                  </span>
                  <span className="text-on-surface font-mono text-[9px]">
                    {meter.current} / {meter.max}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${meter.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container p-1 rounded-lg border border-surface-container-highest/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`font-label text-[11px] xl:text-[12px] uppercase px-2.5 xl:px-3 py-1.5 transition-all flex items-center gap-1 whitespace-nowrap ${isActive
                  ? 'bg-primary-container text-on-primary-container font-bold rounded shadow-[0_3px_0_#78350f]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded'
                  }`}
              >
                {link.icon && (
                  <span className="material-symbols-outlined text-[15px]">{link.icon}</span>
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* CTA, Audio Player & Status Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Clash Village Audio Toggle */}
          <VillageAudioPlayer />

          {/* Status text (Only on wide screens to prevent overflow) */}
          <div className="hidden 2xl:flex flex-col items-end">
            <span className="font-label text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {CHIEF_INFO.status}
            </span>
            <span className="font-body text-[12px] text-on-surface-variant">
              {CHIEF_INFO.statusDetail}
            </span>
          </div>

          {/* Always Visible Hire Button */}
          <a
            href="#clan-recruitment"
            className="inline-flex items-center justify-center font-display font-bold text-xs sm:text-[13px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-primary-container text-on-primary-container uppercase rounded shadow-[0_2px_0_#78350f] hover:brightness-105 active:translate-y-[1px] active:shadow-none transition-all shrink-0 whitespace-nowrap"
          >
            Hire Chief
          </a>

          {/* Chief Avatar Icon (Hidden until XL to preserve spacing) */}
          <img
            alt={CHIEF_INFO.name}
            className="hidden xl:block w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-primary-container/70 shadow-[0_0_8px_rgba(245,158,11,0.4)] shrink-0"
            src={CHIEF_INFO.avatarImg}
          />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container-highest px-gutter-mobile py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Resource meters */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-surface-container-high">
            {RESOURCE_METERS.map((meter) => (
              <div key={meter.id} className="bg-surface-container-low p-1.5 rounded text-center">
                <span className="font-label text-[10px] text-outline uppercase block">
                  {meter.name.split(' ')[0]}
                </span>
                <span className="font-display font-bold text-xs text-primary">{meter.current}</span>
              </div>
            ))}
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-label text-[13px] uppercase py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center gap-2"
            >
              {link.icon && (
                <span className="material-symbols-outlined text-[18px] text-primary">{link.icon}</span>
              )}
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
