import React from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import { SocialIcon } from './SocialIcon';

const LINKS = [
  { key: 'github', label: 'GitHub', url: 'https://github.com/milan-mk', external: true },
  { key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', external: true },
  { key: 'email', label: 'Email', url: 'mailto:milanmodak2005@gmail.com', external: false },
  { key: 'discord', label: 'Discord', url: 'https://discord.com', external: true },
];

/** Simple footer: name + year on one side, social icons and back-to-top on the other. */
export const Footer: React.FC = () => {
  return (
    <footer className="site-footer w-full bg-[#0b0b0f] border-t border-white/10">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs sm:text-sm text-on-surface-variant text-center sm:text-left">
          &copy; {new Date().getFullYear()} {CHIEF_INFO.name}
        </p>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-4">
            {LINKS.map((l) => (
              <li key={l.key}>
                <a
                  href={l.url}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noreferrer' : undefined}
                  aria-label={l.label}
                  title={l.label}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  <SocialIcon platform={l.key} className="w-5 h-5" />
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-label text-[11px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Back to top"
          >
            Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
};
