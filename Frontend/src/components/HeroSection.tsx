import React, { useEffect, useState } from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import './HeroSection.css';

/**
 * Interactive artwork hero ("canvas mode").
 *
 * The personalised illustration is the stage. Invisible, accessible buttons are
 * laid over each paper card (and the character) using percentage boxes measured
 * from the artwork, so they stay aligned at every screen size.
 *
 * - On load (and on "Replay") the figure is drawn in stage by stage, like the intro video
 * - Hover / focus a card  -> red ring, soft tint and a tooltip
 * - Click a card          -> project showcase modal
 * - Click the character   -> "About me" drawer
 * - Phones                -> the same cards are repeated as tappable chips under the art
 *
 * The artwork lives in /public/images/hero/anim/*.webp (one file per layer). If you change it,
 * re-cut the layers and re-measure the hotspot boxes below (percent of stage width / height).
 */

interface WorkItem {
  title: string;
  tag: string;
  /** optional link (external URL or #section) */
  href?: string;
}

interface Skill {
  id: string;
  label: string;
  description: string;
  /** hotspot box over the artwork, in percent, plus the card's tilt */
  l: number;
  t: number;
  w: number;
  h: number;
  rot: number;
  pill?: boolean;
  work: WorkItem[];
}

/**
 * EDIT YOUR SKILLS HERE.
 * - `label`: the text printed on the paper card (use short names, 1-3 words; it is drawn as live text)
 * - `description`: shown in the popup when the card is clicked
 * - `work`: your projects for that skill (title, tag, optional link)
 * You can rename the cards freely; to add or remove a card you also need to move/copy a hotspot box (l, t, w, h, rot).
 *
 * Add your real work here. Categories with no items show a "get in touch" state
 * instead of made-up numbers.
 */
const SKILLS: Skill[] = [
  {
    id: 'video-editing',
    label: 'VIDEO EDITING',
    description: 'High-retention short-form reels, commercial cuts, motion graphics and colour grading.',
    l: 13.7, t: 54.4, w: 9.3, h: 9.7, rot: -4,
    work: [],
  },
  {
    id: 'ai-content',
    label: 'AI CONTENT CREATION',
    description: 'Generative visual workflows, character consistency and AI-driven creatives.',
    l: 12.0, t: 83.3, w: 11.5, h: 10.9, rot: -6,
    work: [],
  },
  {
    id: 'graphic-design',
    label: 'GRAPHIC DESIGN',
    description: 'Bold poster typography, key visuals and social media design systems.',
    l: 68.75, t: 57.3, w: 9.6, h: 9.4, rot: 2,
    work: [],
  },
  {
    id: 'design',
    label: 'DESIGN',
    description: 'Interactive web experiences, landing pages and visual storytelling.',
    l: 82.1, t: 54.7, w: 8.4, h: 7.6, rot: 12,
    pill: true,
    work: [{ title: 'This interactive portfolio', tag: 'React · TypeScript · Tailwind', href: '#citadel-base' }],
  },
  {
    id: 'brand-creative',
    label: 'BRAND CREATIVE',
    description: 'Visual identity, brand guidelines and creative direction from idea to launch.',
    l: 82.1, t: 83.0, w: 9.6, h: 8.9, rot: -2,
    work: [],
  },
];

/** Layers cut from the illustration (percent of the stage). Drawn in order, bottom to top. */
const LAYERS = [
  { src: 'base', cls: 'base', l: 0.0, t: 0.0, w: 100.0, h: 100.0 },
  { src: 'woven', cls: 'woven', l: 0.0, t: 0.0, w: 100.0, h: 100.0 },
  { src: 'web1', cls: 'web web1', l: 51.781, t: 17.578, w: 5.632, h: 10.417 },
  { src: 'web2', cls: 'web web2', l: 61.41, t: 17.578, w: 4.542, h: 29.297 },
  { src: 'sigAm', cls: 'pop pop1', l: 72.311, t: 79.427, w: 6.904, h: 10.417 },
  { src: 'sigFfe', cls: 'pop pop2', l: 53.779, t: 57.617, w: 5.814, h: 7.487 },
  { src: 'smile', cls: 'pop pop3', l: 89.753, t: 71.615, w: 3.997, h: 7.812 },
  { src: 'strands', cls: 'strands', l: 68.677, t: 32.552, w: 9.448, h: 14.323 },
  { src: 'spider', cls: 'spider', l: 81.032, t: 62.5, w: 7.994, h: 17.578 },
  { src: 'fig_white', cls: 'white', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_hair', cls: 'hatch hh', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_shirt', cls: 'hatch hs', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_pants', cls: 'hatch hp', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_hair', cls: 'fill hair', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_shirt', cls: 'fill shirt', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_skin', cls: 'fill skin', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_pants', cls: 'fill pants', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_shoes', cls: 'fill shoes', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_line', cls: 'line', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
] as const;


/** Red thread bundle that shoots from the hand across the letters (SVG units = illustration px, 2752 x 1536). */
const THREADS = [
  'M1895 655 C 2050 560 2300 440 2790 190',
  'M1895 655 C 2080 580 2330 470 2790 235',
  'M1895 655 C 2060 600 2350 500 2790 285',
  'M1895 655 C 2100 560 2250 420 2400 380 C 2480 350 2520 400 2480 420 C 2440 440 2560 330 2790 330',
  'M1895 655 C 2090 610 2400 540 2790 380',
  'M1895 655 C 2000 640 2200 560 2330 560',
  'M2330 180 C 2370 150 2420 130 2470 135',
  'M2300 215 C 2340 190 2380 160 2420 150',
];

/** Inline style helper that allows CSS custom properties. */
const css = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;

const place = (s: Pick<Skill, 'l' | 't' | 'w' | 'h' | 'rot'>) =>
  css({ '--l': `${s.l}%`, '--t': `${s.t}%`, '--w': `${s.w}%`, '--h': `${s.h}%`, '--rot': `${s.rot}deg` });

const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

export const HeroSection: React.FC = () => {
  const [open, setOpen] = useState<Skill | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  /** bumping this remounts the layers, which restarts the CSS animation */
  const [run, setRun] = useState(0);

  const overlay = open !== null || aboutOpen;
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setAboutOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [overlay]);

  return (
    <section id="citadel-base" className="hero relative w-full px-2 sm:px-6 pt-2 sm:pt-4">
      <div className="hc" role="group" aria-label={`${CHIEF_INFO.name} interactive portfolio hero`}>
        {/* The illustration, built from layers so it can be "drawn in" like the intro video */}
        <div
          className="hc__layers"
          key={run}
          role="img"
          aria-label="Illustration of Milan Kumar Modak in a dynamic pose in front of the giant word PORTFOLIO, surrounded by paper notes labelled Video Editing, AI Content Creation, Graphic Design, Design and Brand Creative"
        >
          {LAYERS.map((L) => (
            <img
              key={L.src}
              className={`hc__l ${L.cls.split(' ').map((c) => `hc__l--${c}`).join(' ')}`}
              src={`/images/hero/anim/${L.src}.webp`}
              alt=""
              aria-hidden="true"
              draggable={false}
              decoding="async"
              style={{ left: `${L.l}%`, top: `${L.t}%`, width: `${L.w}%`, height: `${L.h}%` }}
              {...(L.src === 'base' ? { fetchPriority: 'high' as const } : {})}
            />
          ))}
          <svg className="hc__threads" viewBox="0 0 2752 1536" preserveAspectRatio="none" aria-hidden="true">
            {THREADS.map((d, i) => (
              <path key={i} d={d} pathLength={1} style={{ '--d': `${6 + i * 0.18}s` } as React.CSSProperties} />
            ))}
          </svg>
        </div>

        <button type="button" className="hc__replay" onClick={() => setRun((n) => n + 1)} aria-label="Replay intro animation">
          ↻ Replay
        </button>

        {/* Smiley note easter egg */}
        <div className="hc__egg" style={place({ l: 18.8, t: 3.5, w: 9.6, h: 18.5, rot: 0 })} aria-hidden="true">
          <span className="hc__tip">Hi, I’m {CHIEF_INFO.name.split(' ')[0]} 👋</span>
        </div>

        {/* Character -> About */}
        <button
          type="button"
          className="hc__char"
          onClick={() => setAboutOpen(true)}
          aria-label="About me"
        >
          <span className="hc__tip">About me</span>
        </button>

        {/* Skill cards */}
        {SKILLS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hc__spot${s.pill ? ' hc__spot--pill' : ''}`}
            style={{ ...place(s), '--i': i } as React.CSSProperties}
            onClick={() => setOpen(s)}
            aria-label={`View ${s.label} work`}
          >
            <span className={`hc__lab${s.pill ? ' hc__lab--pill' : ''}`} style={css({ '--n': Math.max(...s.label.split(' ').map((w) => w.length)) })}>
              {s.label}
            </span>
            <span className="hc__tip">Click to explore {s.label.toLowerCase()}</span>
          </button>
        ))}
      </div>

      {/* Tappable chips for phones (the cards on the art are small there) */}
      <div className="hc-chips" aria-label="Skill categories">
        {SKILLS.map((s) => (
          <button key={s.id} type="button" className="hc-chip" onClick={() => setOpen(s)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Intro strip: name, bio, CTAs (existing anchors preserved) */}
      <div className="hc-strip">
        <div className="hc-strip__text">
          <p className="hc-strip__name">{CHIEF_INFO.name}</p>
          <p className="hc-strip__bio">{CHIEF_INFO.bio}</p>
        </div>
        <div className="hc-strip__cta">
          <a href="#war-log" className="hc-btn hc-btn--red">
            <span className="material-symbols-outlined text-[18px]">explore</span> View Projects
          </a>
          <a href="#clan-recruitment" className="hc-btn hc-btn--ghost">
            <span className="material-symbols-outlined text-[18px]">description</span> Resume &amp; Contact
          </a>
        </div>
      </div>

      {/* Skill modal */}
      {open && (
        <div className="hc-modal" role="presentation" onClick={() => setOpen(null)}>
          <div className="hc-modal__card" role="dialog" aria-modal="true" aria-label={open.label} onClick={(e) => e.stopPropagation()}>
            <div className="hc-modal__top">
              <span className="hc-modal__badge">Skill Category</span>
              <button type="button" className="hc-modal__x" onClick={() => setOpen(null)} aria-label="Close" autoFocus>✕</button>
            </div>
            <h2 className="hc-modal__title">{open.label}</h2>
            <p className="hc-modal__desc">{open.description}</p>

            {open.work.length > 0 ? (
              <div className="hc-modal__list">
                {open.work.map((w) => (
                  <a
                    key={w.title}
                    className="hc-work"
                    href={w.href ?? '#'}
                    onClick={(e) => {
                      if (w.href?.startsWith('#')) {
                        e.preventDefault();
                        setOpen(null);
                        go(w.href);
                      }
                    }}
                    {...(w.href && !w.href.startsWith('#') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <div>
                      <div className="hc-work__title">{w.title}</div>
                      <div className="hc-work__tag">{w.tag}</div>
                    </div>
                    <span className="hc-work__go">→</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="hc-empty">
                <p>Samples for this category are shared on request.</p>
                <a
                  href="#clan-recruitment"
                  className="hc-btn hc-btn--red"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(null);
                    go('#clan-recruitment');
                  }}
                >
                  Get in touch
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About drawer */}
      {aboutOpen && (
        <div className="hc-modal hc-modal--drawer" role="presentation" onClick={() => setAboutOpen(false)}>
          <aside className="hc-drawer" role="dialog" aria-modal="true" aria-label="About me" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hc-modal__x hc-drawer__x" onClick={() => setAboutOpen(false)} aria-label="Close" autoFocus>✕</button>
            <span className="hc-modal__badge">About me</span>
            <h2 className="hc-modal__title">{CHIEF_INFO.name}</h2>
            <p className="hc-modal__desc">{CHIEF_INFO.bio}</p>
            <div className="hc-drawer__cta">
              <a href="#war-log" className="hc-btn hc-btn--red" onClick={() => setAboutOpen(false)}>View Projects</a>
              <a href="#clan-recruitment" className="hc-btn hc-btn--dark" onClick={() => setAboutOpen(false)}>Contact</a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
