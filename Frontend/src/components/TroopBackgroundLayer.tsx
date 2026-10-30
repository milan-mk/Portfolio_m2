import React from 'react';

interface FloatingTroopIcon {
  id: string;
  name: string;
  role: string;
  image: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  delay: string;
  duration: string;
  reverse?: boolean;
}

const FLOATING_TROOPS: FloatingTroopIcon[] = [
  // --- Citadel Base / Hero Section ---
  {
    id: 'hero-builder',
    name: 'BUILDER',
    role: 'Chief Craftsman',
    image: '/images/troops/builder.png',
    top: '90px',
    right: '2%',
    size: 105,
    rotation: 5,
    delay: '0s',
    duration: '6.5s',
  },
  {
    id: 'hero-archer',
    name: 'SUPER ARCHER',
    role: 'Precision Scout',
    image: '/images/troops/super_archer.png',
    top: '360px',
    left: '1.5%',
    size: 96,
    rotation: -7,
    delay: '1.2s',
    duration: '7.2s',
    reverse: true,
  },
  {
    id: 'hero-lavahound',
    name: 'LAVA HOUND',
    role: 'Magma Vanguard',
    image: '/images/troops/lava_hound.png',
    top: '640px',
    right: '1.8%',
    size: 115,
    rotation: 6,
    delay: '2.5s',
    duration: '7.0s',
  },

  // --- Barracks & Arcane Forge / Skill Matrix ---
  {
    id: 'skills-wizard',
    name: 'WIZARD',
    role: 'Fire Arcane Core',
    image: '/images/troops/wizard.png',
    top: '960px',
    left: '1.5%',
    size: 105,
    rotation: -6,
    delay: '0.8s',
    duration: '6.8s',
  },
  {
    id: 'skills-golem-top',
    name: 'GOLEM',
    role: 'Molten Basalt Titan',
    image: '/images/troops/golem.png',
    top: '1260px',
    right: '2%',
    size: 105,
    rotation: 7,
    delay: '3.0s',
    duration: '7.4s',
    reverse: true,
  },
  {
    id: 'skills-golem',
    name: 'GOLEM',
    role: 'Ground Colossus',
    image: '/images/troops/golem.png',
    top: '1560px',
    left: '1.5%',
    size: 108,
    rotation: 5,
    delay: '1.6s',
    duration: '8.0s',
  },
  {
    id: 'skills-balloon',
    name: 'BALLOON',
    role: 'Air Bombardment',
    image: '/images/troops/balloon.png',
    top: '1860px',
    right: '2%',
    size: 96,
    rotation: -5,
    delay: '2.1s',
    duration: '6.2s',
    reverse: true,
  },

  // --- Clan War Log / Expeditions ---
  {
    id: 'war-hogrider',
    name: 'HOG RIDER',
    role: 'Fast Raid Sentry',
    image: '/images/troops/hog_rider.png',
    top: '2180px',
    left: '1.5%',
    size: 106,
    rotation: -7,
    delay: '0.4s',
    duration: '6.4s',
  },
  {
    id: 'war-lavapup',
    name: 'LAVA HOUND',
    role: 'Inferno Air Tank',
    image: '/images/troops/lava_hound.png',
    top: '2500px',
    right: '2%',
    size: 110,
    rotation: 6,
    delay: '2.8s',
    duration: '7.8s',
    reverse: true,
  },
  {
    id: 'war-pekka',
    name: 'P.E.K.K.A',
    role: 'Titan Vanguard',
    image: '/images/troops/pekka.png',
    top: '2840px',
    left: '1.5%',
    size: 115,
    rotation: -5,
    delay: '1.1s',
    duration: '8.5s',
  },

  // --- Guild Recruitment & Outposts ---
  {
    id: 'recruit-wizard',
    name: 'WIZARD',
    role: 'Fire Arcane Scout',
    image: '/images/troops/wizard.png',
    top: '3200px',
    right: '2%',
    size: 110,
    rotation: 7,
    delay: '1.9s',
    duration: '7.2s',
  },
  {
    id: 'recruit-balloon',
    name: 'BALLOON',
    role: 'Heavy Air Sentry',
    image: '/images/troops/balloon.png',
    top: '3560px',
    left: '1.5%',
    size: 100,
    rotation: -6,
    delay: '2.4s',
    duration: '6.6s',
    reverse: true,
  },
];

export const TroopBackgroundLayer: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none contain-paint transform-gpu"
      aria-hidden="true"
    >
      {FLOATING_TROOPS.map((troop) => {
        const animationClass = troop.reverse
          ? 'animate-troop-float-reverse'
          : 'animate-troop-float';

        return (
          <div
            key={troop.id}
            className="absolute transition-opacity duration-700 pointer-events-auto"
            style={{
              top: troop.top,
              left: troop.left,
              right: troop.right,
              transform: `rotate(${troop.rotation}deg)`,
            }}
          >
            {/* Animated Floating Character Sprite */}
            <div
              className={`flex flex-col items-center group cursor-pointer ${animationClass}`}
              style={{
                animationDelay: troop.delay,
                animationDuration: troop.duration,
              }}
            >
              {/* Character Cutout with Ambient Glow */}
              <div
                className="relative transition-all duration-300 group-hover:scale-115 group-hover:brightness-110"
                style={{
                  width: `${troop.size}px`,
                  height: `${troop.size}px`,
                }}
              >
                <img
                  src={troop.image}
                  alt={troop.name}
                  loading="lazy"
                  className="w-full h-full object-contain opacity-40 sm:opacity-50 group-hover:opacity-95 transition-opacity duration-300 filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] drop-shadow-[0_0_16px_rgba(234,88,12,0.45)]"
                />
              </div>

              {/* Tactical Identification Plaque */}
              <div className="flex flex-col items-center mt-[-6px] opacity-45 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                <span className="font-display font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider text-secondary bg-surface-container/85 px-2 py-0.5 rounded-full border border-secondary/30 shadow-md backdrop-blur-xs whitespace-nowrap">
                  {troop.name}
                </span>
                <span className="font-label text-[8px] uppercase tracking-widest text-outline/80 mt-0.5 whitespace-nowrap">
                  {troop.role}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
