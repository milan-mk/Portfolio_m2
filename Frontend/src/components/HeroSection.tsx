import React, { useEffect, useRef, useState } from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import { toggleTheme, useTheme } from '../utils/theme';
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
  /** target section anchor if present on the page */
  section?: string;
  work: WorkItem[];
}

/** Interactive artwork hotspot cards mapped to positions on the illustration */
const SKILLS: Skill[] = [
  {
    id: 'projects',
    label: 'Projects',
    description: 'Explore full-stack applications, interactive experiences, and creative engineering projects.',
    l: 13.7, t: 54.4, w: 9.3, h: 9.7, rot: -4,
    section: '#war-log',
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
    id: 'cv',
    label: 'summon cv',
    description: 'Engineering experience, credentials, resume, and direct collaboration channels.',
    l: 68.75, t: 57.3, w: 9.6, h: 9.4, rot: 2,
    section: '#clan-recruitment',
    work: [],
  },
  {
    id: 'skills',
    label: 'SKILLS',
    description: 'Technical toolkit, frameworks, databases, and architectural proficiencies.',
    l: 82.1, t: 54.7, w: 8.4, h: 7.6, rot: 12,
    pill: true,
    section: '#army-camps',
    work: [],
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
  { src: 'lowthread', cls: 'lowthread', l: 0, t: 0, w: 100, h: 100 },
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
  // 1. Wrist loop precisely following the wrist contour at the crease
  'M 1776 718 C 1762 724 1752 735 1758 748 C 1765 758 1782 758 1795 748 C 1806 740 1808 728 1792 718',
  // 2. Secondary wrist contour wrap
  'M 1768 724 C 1754 734 1748 746 1756 756 C 1768 764 1784 760 1796 748',
  // 3. Main center shooting strand (wrist -> palm -> knuckle -> far right)
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1935 620 2060 550 2752 245',
  // 4. Upper strand in bundle
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1930 615 2050 540 2752 220',
  // 5. Lower strand in bundle
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1940 625 2070 560 2752 270',
  // 6. Strand 4
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1945 630 2080 570 2752 295',
  // 7. Strand 5
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1950 635 2090 580 2752 320',
  // 8. Web loop curling over letter
  'M 1778 718 C 1818 690 1855 665 1885 648 C 1940 620 2070 550 2320 400 C 2450 350 2520 320 2500 390 C 2440 380 2400 370 2752 260',
  // 9. Web details on letters
  'M 2200 296 C 2230 275 2260 270 2300 276',
  'M 2190 312 C 2230 290 2270 286 2310 292',
];

/** Inline style helper that allows CSS custom properties. */
const css = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;

const place = (s: Pick<Skill, 'l' | 't' | 'w' | 'h' | 'rot'>) =>
  css({ '--l': `${s.l}%`, '--t': `${s.t}%`, '--w': `${s.w}%`, '--h': `${s.h}%`, '--rot': `${s.rot}deg` });

const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

export const HeroSection: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<Skill | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const hasLeftRef = useRef(false);

  // Re-trigger the drawing intro animation whenever the user rescrolls to the hero section
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasLeftRef.current) {
            setAnimKey((k) => k + 1);
            hasLeftRef.current = false;
          }
        } else {
          hasLeftRef.current = true;
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // On every fresh load show the hero from its very top (no restored scroll position).
  useEffect(() => {
    if (window.location.hash) return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

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

  const handleSkillClick = (s: Skill, e: React.MouseEvent) => {
    if (s.section) {
      e.preventDefault();
      go(s.section);
    } else {
      setOpen(s);
    }
  };

  return (
    <section id="citadel-base" ref={heroRef} className="hero relative w-full p-0">
      <div key={animKey} className="hc" role="group" aria-label={`${CHIEF_INFO.name} interactive portfolio hero`}>
        {/* The illustration, built from layers so it can be "drawn in" like the intro video */}
        <div
          className="hc__layers"
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
              <path key={i} d={d} pathLength={1} style={{ '--d': `${3.3 + i * 0.12}s` } as React.CSSProperties} />
            ))}
          </svg>
        </div>

        {/* Paper note on the wall = dark / light mode switch */}
        <button
          type="button"
          className="hc__egg"
          style={place({ l: 18.8, t: 3.5, w: 9.6, h: 18.5, rot: 0 })}
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="hc__tip">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

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
          <a
            key={s.id}
            href={s.section ?? '#'}
            className={`hc__spot${s.pill ? ' hc__spot--pill' : ''}`}
            style={{ ...place(s), '--i': i } as React.CSSProperties}
            onClick={(e) => handleSkillClick(s, e)}
            aria-label={s.section ? `Go to ${s.label} section` : `Explore ${s.label}`}
          >
            <span className={`hc__lab${s.pill ? ' hc__lab--pill' : ''}`} style={css({ '--n': Math.max(...s.label.split(' ').map((w) => w.length)) })}>
              {s.label}
            </span>
            <span className="hc__tip">{s.section ? `Go to ${s.label.toLowerCase()}` : `Click to explore ${s.label.toLowerCase()}`}</span>
          </a>
        ))}
      </div>

      {/* Tappable chips for phones (the cards on the art are small there) */}
      <div className="hc-chips" aria-label="Skill categories">
        {SKILLS.map((s) => (
          <a
            key={s.id}
            href={s.section ?? '#'}
            className="hc-chip"
            onClick={(e) => handleSkillClick(s, e)}
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Intro strip: name, bio, and CTAs directing to Projects and Skills */}
      <div className="hc-strip">
        <div className="hc-strip__text">
          <p className="hc-strip__name">{CHIEF_INFO.name}</p>
          <p className="hc-strip__bio">{CHIEF_INFO.bio}</p>
        </div>
        <div className="hc-strip__cta">
          <a href="#war-log" className="hc-btn hc-btn--red">
            <span className="material-symbols-outlined text-[18px]">explore</span> View Projects
          </a>
          <a href="#army-camps" className="hc-btn hc-btn--ghost">
            <span className="material-symbols-outlined text-[18px]">build</span> View Skills
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
                <p>{open.section ? `Explore full ${open.label.toLowerCase()} in this portfolio.` : 'Samples for this category are shared on request.'}</p>
                <a
                  href={open.section ?? '#clan-recruitment'}
                  className="hc-btn hc-btn--red"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(null);
                    go(open.section ?? '#clan-recruitment');
                  }}
                >
                  {open.section ? `Go to ${open.label}` : 'Get in touch'}
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
              <a href="#army-camps" className="hc-btn hc-btn--dark" onClick={() => setAboutOpen(false)}>View Skills</a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
