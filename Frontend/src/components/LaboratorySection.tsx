import React from 'react';
import { LAB_HONORS } from '../data/portfolioData';

export const LaboratorySection: React.FC = () => {
  return (
    <section id="laboratory" className="w-full px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-[1040px] mx-auto flex flex-col gap-5">
        {/* Section Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 pb-2 border-b border-surface-container-highest">
          <div>
            <div className="flex items-center gap-1.5 text-tertiary font-label text-[11px] uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px]">science</span>
              The Laboratory &amp; Research Spells
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-[28px] font-extrabold uppercase text-on-surface tracking-tight mt-0.5">
              Academic Research &amp; Upgrades
            </h2>
          </div>
          <div className="font-label text-[10px] uppercase tracking-widest text-tertiary bg-surface-container px-2.5 py-1 rounded border border-surface-container-high self-start sm:self-auto font-bold shadow-[0_2px_0_#050811]">
            Research Level: Active / Magna Cum Laude
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Education Plaque */}
          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-2.5 shadow-[0_3px_0_#050811] border border-surface-container-highest/70 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary-container border border-primary-container/30">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-[10px] uppercase text-primary font-bold">
                  Primary Stronghold Degree
                </span>
                <h3 className="font-display font-bold text-base text-on-surface">
                  B.S. in Computer Science
                </h3>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between border border-surface-container-high/40">
              <span className="font-body text-xs text-outline">University of Engineering • 2021-2025</span>
              <span className="font-label text-[10px] text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20">
                GPA: 3.8 / 4.0
              </span>
            </div>

            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Graduated with Magna Cum Laude honors. Completed foundational research in distributed systems, operating system primitives, and algorithms.
            </p>

            <div className="mt-auto bg-surface-container-high p-2 rounded flex flex-col gap-0.5 border border-surface-container-highest">
              <span className="font-label text-[9px] uppercase text-primary-fixed font-bold tracking-wider">
                Capstone Research Paper
              </span>
              <p className="font-body text-xs text-on-surface italic">
                "Optimistic Lock-Free Resolution in Tree-Structured Collaborative UI Canvases"
              </p>
            </div>
          </div>

          {/* 2. Certifications Upgrade Block */}
          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-2.5 shadow-[0_3px_0_#050811] border border-surface-container-highest/70 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary-container/30">
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-[10px] uppercase text-secondary font-bold">
                  Enchanted Certifications
                </span>
                <h3 className="font-display font-bold text-base text-on-surface">
                  Certified Masteries
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between border border-surface-container-high/40">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xs sm:text-sm text-on-surface">
                    AWS Cloud Practitioner
                  </span>
                  <span className="font-body text-[10px] text-outline">Amazon Web Services • 2024</span>
                </div>
                <span className="font-label text-[9px] text-primary-container bg-surface-container px-1.5 py-0.5 rounded font-bold border border-primary-container/30">
                  Active
                </span>
              </div>

              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between border border-surface-container-high/40">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xs sm:text-sm text-on-surface">
                    Meta Front-End Developer
                  </span>
                  <span className="font-body text-[10px] text-outline">Meta Professional • 2024</span>
                </div>
                <span className="font-label text-[9px] text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold border border-secondary/30">
                  Active
                </span>
              </div>
            </div>

            <p className="font-body text-xs text-on-surface-variant mt-auto leading-relaxed">
              Continual laboratory experiments: Currently brewing advanced Docker Swarm and Distributed Cache (Redis) certifications.
            </p>
          </div>

          {/* 3. Hackathons & Trophies */}
          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-2.5 shadow-[0_3px_0_#050811] border border-surface-container-highest/70 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary border border-tertiary-container/30">
                <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-[10px] uppercase text-tertiary font-bold">
                  Trophy Road League
                </span>
                <h3 className="font-display font-bold text-base text-on-surface">
                  Hackathon Honors
                </h3>
              </div>
            </div>

            {LAB_HONORS.map((honor) => (
              <div
                key={honor.id}
                className="bg-surface-container-lowest p-2 rounded flex flex-col gap-0.5 border border-surface-container-high/40"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-display font-bold text-xs sm:text-sm ${honor.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                    {honor.title}
                  </span>
                  <span className="font-label text-[9px] text-outline font-bold">{honor.year}</span>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {honor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
