import React from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import { SocialIcon } from './SocialIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest mt-10 sm:mt-12 border-t border-surface-container-highest/60">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6 mb-6">
          {/* Chief Info */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl uppercase text-primary">
                Chief {CHIEF_INFO.name}
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              Entry-level Software &amp; UI Engineer forged in modern web frameworks, component architectures, and responsive game-inspired interfaces. Ready to join a high-impact clan to build fortified digital products.
            </p>
          </div>

          {/* Camp Quarters */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[10px] uppercase tracking-wider text-primary-fixed font-bold">
              Camp Quarters
            </span>
            <ul className="flex flex-col gap-1 text-on-surface-variant font-body text-xs">
              <li>Village: India (Open to Remote / Relo)</li>
              <li>Role: Junior Full-Stack Engineer</li>
              <li>Specialization: UI/UX &amp; Creative Front-End</li>
              <li>Clan Status: Ready for Recruitment</li>
            </ul>
          </div>

          {/* Scout Outposts */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[10px] uppercase tracking-wider text-primary-fixed font-bold">
              Scout Outposts
            </span>
            <div className="flex flex-col gap-1.5 font-body text-xs text-on-surface-variant">
              <a
                href="https://github.com/milan-mk"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <span className="text-primary-container group-hover:scale-110 transition-transform">
                  <SocialIcon platform="github" className="w-3.5 h-3.5" />
                </span>
                <span>GitHub War Commits</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <span className="text-primary-container group-hover:scale-110 transition-transform">
                  <SocialIcon platform="linkedin" className="w-3.5 h-3.5" />
                </span>
                <span>LinkedIn Stronghold</span>
              </a>
              <a
                href="mailto:milanmodak2005@gmail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <span className="text-primary-container group-hover:scale-110 transition-transform">
                  <SocialIcon platform="email" className="w-3.5 h-3.5" />
                </span>
                <span>Direct Mail Scroll</span>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <span className="text-primary-container group-hover:scale-110 transition-transform">
                  <SocialIcon platform="discord" className="w-3.5 h-3.5" />
                </span>
                <span>Clan Discord</span>
              </a>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2 hover:text-primary transition-colors group pt-1 border-t border-surface-container-highest/40"
              >
                <span className="material-symbols-outlined text-[15px] text-primary-container group-hover:scale-110 transition-transform">
                  description
                </span>
                <span>Download Scroll (Resume)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-surface-container-high/40 text-on-surface-variant font-body text-xs">
          <p>
            © {new Date().getFullYear()} {CHIEF_INFO.name}. Tactile Strategy RPG Inspired Portfolio.
          </p>
          <p className="font-label text-[10px] uppercase tracking-widest text-outline font-bold">
            Citadel Shield Active • Level 1 Code Craftsman
          </p>
        </div>
      </div>
    </footer>
  );
};
