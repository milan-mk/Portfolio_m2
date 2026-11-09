import React, { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { SkillSpider } from './SkillSpider';
import './BarracksSection.css';

/** Scenes the spider cycles through. */
const SCENES = [
  { id: 'white', name: 'Clean White' },
  { id: 'moon', name: 'Blood Moon' },
  { id: 'city', name: 'Comic City' },
] as const;
const HINT_STORE = 'mk-skills-spider-used';


/**
 * Skills: a simple, clean grid of categories.
 * On scroll the cards rise in one by one.
 */

export function BarracksSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [scene, setScene] = useState(0);
  const [prevScene, setPrevScene] = useState<number | null>(null);
  const [tag, setTag] = useState('Pull me');
  const [hint, setHint] = useState(true);
  const tagTimer = useRef<number>(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_STORE)) setHint(false);
    } catch { /* storage unavailable: defaults are fine */ }
  }, []);

  const nextScene = () => {
    const next = (scene + 1) % SCENES.length;
    setPrevScene(scene);
    setScene(next);
    setHint(false);
    setTag(SCENES[next].name);
    window.clearTimeout(tagTimer.current);
    tagTimer.current = window.setTimeout(() => { setPrevScene(null); setTag('Pull me'); }, 1600);
    try { localStorage.setItem(HINT_STORE, '1'); } catch { /* ignore */ }
  };
  useEffect(() => () => window.clearTimeout(tagTimer.current), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="army-camps" ref={ref} className={`sk${inView ? ' is-in' : ''}`} data-scene={SCENES[scene].id}>
      {/* only the current and the fading-out scene are mounted, so images load on demand */}
      {prevScene !== null && SCENES[prevScene].id !== 'white' && <div className={`sk__bg sk__bg--${SCENES[prevScene].id} is-out`} aria-hidden="true" />}
      {SCENES[scene].id !== 'white' && (
        <div key={SCENES[scene].id} className={`sk__bg sk__bg--${SCENES[scene].id} is-on`} aria-hidden="true" />
      )}

      <SkillSpider onPull={nextScene} label={tag} hint={hint} />

      <div className="sk__inner">
        <header className="sk__head">
          <span className="sk__eyebrow">Toolkit</span>
          <h2 className="sk__title">Skills</h2>
          <p className="sk__sub">Everything I work with, pulled together in one place.</p>
        </header>

        <div className="sk__grid">
          {SKILL_CATEGORIES.map((cat, i) => (
            <article key={cat.id} className="sk-card" style={{ '--i': i } as React.CSSProperties}>
              <header className="sk-card__head">
                <span className="sk-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">{cat.icon}</span>
                </span>
                <div>
                  <h3 className="sk-card__name">{cat.name}</h3>
                  <p className="sk-card__sub">{cat.subtitle}</p>
                </div>
              </header>
              <ul className="sk-card__chips">
                {cat.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
