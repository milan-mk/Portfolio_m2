import React, { useEffect } from 'react';
import { AboutSection } from './components/AboutSection';
import { BarracksSection } from './components/BarracksSection';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { RecruitmentSection } from './components/RecruitmentSection';
import { ScrollReveal } from './components/ScrollReveal';
import { WarLogSection } from './components/WarLogSection';
import { villageAudio } from './utils/soundEffects';

export const App: React.FC = () => {
  useEffect(() => {
    // Tactile Click scale feedback and sound effects for pushable game elements
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a[href^="#"]');
      if (target && target instanceof HTMLElement) {
        target.style.transform = 'scale(0.97)';
        setTimeout(() => {
          target.style.transform = '';
        }, 120);

        const href = target.getAttribute('href') || '';
        const text = (target.textContent || '').toLowerCase();
        if (href.includes('war-log') || text.includes('expedition') || text.includes('inspect')) {
          villageAudio.playHorn();
        } else if (href.includes('clan-recruitment') || text.includes('hire') || text.includes('summon')) {
          villageAudio.playGold();
        } else {
          villageAudio.playTap();
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      {/* Main Village Grounds */}
      <main className="relative z-10 w-full pt-0 flex-grow flex flex-col">
        {/* Village Base Town Hall & Chief Narrative (Above fold, instant load) */}
        <HeroSection />

        {/* About: character on one side, short intro on the other */}
        <AboutSection />

        <div className="village-lower bg-[#0b0b0f] text-[#f1f1f6] pt-8 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 flex flex-col gap-8 sm:gap-14 lg:gap-16">
          {/* Barracks & Arcane Forge (Skill Matrix) */}
          <ScrollReveal yOffset={28} once={false}>
            <BarracksSection />
          </ScrollReveal>

          {/* Clan War Log & Battle Replays (Featured Projects) */}
          <ScrollReveal yOffset={28} once={false}>
            <WarLogSection />
          </ScrollReveal>

          {/* Experience: timeline of roles */}
          <ScrollReveal yOffset={28} once={false}>
            <ExperienceSection />
          </ScrollReveal>

          {/* Guild Recruitment Outpost (Contact Missive & Resume) */}
          <ScrollReveal yOffset={28}>
            <RecruitmentSection />
          </ScrollReveal>
        </div>
      </main>

      {/* Camp Quarters & Scout Outposts Footer */}
      <div className="village-lower bg-[#0b0b0f]">
        <ScrollReveal yOffset={20}>
          <Footer />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default App;
