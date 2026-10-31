import React, { useEffect, useState } from 'react';
import { BarracksSection } from './components/BarracksSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
// import { IntroModal } from './components/IntroModal';
//import { LaboratorySection } from './components/LaboratorySection';
import { RecruitmentSection } from './components/RecruitmentSection';
import { ScrollReveal } from './components/ScrollReveal';
import { WarLogSection } from './components/WarLogSection';
import { villageAudio } from './utils/soundEffects';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('citadel-base');
  const [introOpen, setIntroOpen] = useState(true);

  const handleCloseIntro = () => {
    setIntroOpen(false);
    villageAudio.playHorn();
  };

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

    // High-performance IntersectionObserver for Citadel HUD scroll spy (zero layout thrashing)
    const sectionIds = ['citadel-base', 'army-camps', 'war-log', 'clan-recruitment'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0.05 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">


      {/* Clash of Clans Intro Briefing Modal */}
      {/* <IntroModal isOpen={introOpen} onClose={handleCloseIntro} /> */}


      {/* Main Village Grounds */}
      <main className="relative z-10 w-full pt-2 sm:pt-4 pb-12 sm:pb-16 flex-grow flex flex-col gap-8 sm:gap-14 lg:gap-16">
        {/* Village Base Town Hall & Chief Narrative (Above fold, instant load) */}
        <HeroSection />

        {/* Barracks & Arcane Forge (Skill Matrix) */}
        <ScrollReveal yOffset={28}>
          <BarracksSection />
        </ScrollReveal>

        {/* Clan War Log & Battle Replays (Featured Projects) */}
        <ScrollReveal yOffset={28}>
          <WarLogSection />
        </ScrollReveal>

        {/* Guild Recruitment Outpost (Contact Missive & Resume) */}
        <ScrollReveal yOffset={28}>
          <RecruitmentSection />
        </ScrollReveal>
      </main>

      {/* Camp Quarters & Scout Outposts Footer */}
      <ScrollReveal yOffset={20}>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default App;
