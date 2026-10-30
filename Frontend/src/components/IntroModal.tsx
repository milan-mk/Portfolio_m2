import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHIEF_INFO } from '../data/portfolioData';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  badge: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlightText: string;
  avatarIcon: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    badge: 'Town Hall 10 Fortress',
    icon: 'fort',
    title: 'Welcome, Chief!',
    subtitle: 'Village Inspection Initiated',
    description: `You have entered the tactical engineering fortress of ${CHIEF_INFO.name}. A Computer Science graduate and fresher developer ready to raid bottlenecks, defend production, and build resilient web systems.`,
    highlightText: 'Town Hall 10 Master Builder // Ready for Clan War',
    avatarIcon: 'military_tech',
  },
  {
    badge: 'Army Camps & Forge',
    icon: 'swords',
    title: 'Trained Unit Matrix',
    subtitle: 'Battle-Tested Tech Arsenal',
    description: 'Explore 25 trained unit capacities organized into Languages, Web Systems, ML & Data Pipelines, AI & Vision models, and Command DevOps platforms—each equipped with combat output ratings.',
    highlightText: '5 Tactical Squads // 25 Units Housing Space',
    avatarIcon: 'psychology',
  },
  {
    badge: 'Clan War Log',
    icon: 'shield',
    title: 'Campaign Expeditions',
    subtitle: '100% Cleared Battle Replays',
    description: 'Inspect featured full-stack projects and battle replays. Each quest highlights real-world metrics, source code tactics, live demos, and zero-defect architecture guarantees.',
    highlightText: '3-Star Perfect Campaign Records',
    avatarIcon: 'star',
  },
  {
    badge: 'Guild Recruitment',
    icon: 'mail',
    title: 'Recruit Chief Milan',
    subtitle: 'Immediate Deployment Available',
    description: 'Looking to fortify your engineering clan? Summon my resume scroll or dispatch a direct missive through the Guild Outpost. Immediate availability with 0 days deployment delay.',
    highlightText: 'Open to Full-Time, Remote & Relocation',
    avatarIcon: 'handyman',
  },
];

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface-container rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_0_1px_rgba(56,189,248,0.3),0_0_25px_rgba(14,165,233,0.15)] border-2 border-surface-container-highest overflow-hidden z-10 flex flex-col"
          >
            {/* Top Gold Trim Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-secondary/30 via-primary-container to-secondary/30"></div>

            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-surface-container-highest/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">
                  {step.icon}
                </span>
                <span className="font-label text-xs uppercase tracking-widest text-primary-container font-bold">
                  {step.badge}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer border border-surface-container-highest"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 flex flex-col gap-5">
              {/* Avatar & Title Row */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={CHIEF_INFO.avatarImg}
                    alt={CHIEF_INFO.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-container shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-container-highest border border-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[14px]">
                      {step.avatarIcon}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="font-label text-[11px] uppercase tracking-wider text-outline font-bold">
                    {step.subtitle}
                  </span>
                  <h3 className="font-display text-2xl font-black uppercase text-on-surface tracking-tight">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Step Description */}
              <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {step.description}
              </p>

              {/* Highlight Plaque Token */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high shadow-inner">
                <span className="material-symbols-outlined text-primary-container text-[18px] material-symbols-fill shrink-0">
                  verified
                </span>
                <span className="font-label text-[11px] sm:text-xs text-primary font-bold tracking-wide">
                  {step.highlightText}
                </span>
              </div>

              {/* Step Progress Dots */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {TOUR_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentStep
                          ? 'w-6 bg-primary-container shadow-[0_0_8px_rgba(255,184,0,0.5)]'
                          : 'w-2 bg-surface-container-highest hover:bg-outline'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <span className="font-label text-[11px] uppercase text-outline font-bold">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 bg-surface-container-lowest border-t border-surface-container-highest/60">
              {/* Skip Button */}
              <button
                type="button"
                onClick={onClose}
                className="btn-tactile-stone px-4 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1 text-outline hover:text-on-surface"
              >
                <span>Skip Tour</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Back Button */}
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-tactile-stone px-3.5 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span>Back</span>
                  </button>
                )}

                {/* Next / Enter Citadel Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-tactile-gold px-5 py-2.5 rounded-lg font-display font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isLastStep ? 'Enter Citadel' : 'Next'}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {isLastStep ? 'swords' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
