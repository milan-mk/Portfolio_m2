import React, { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import './BarracksSection.css';

/**
 * Skills: a simple, clean grid of categories with hand-drawn corner webs.
 * On scroll the webs drop and reveal into place, then the cards rise in one by one.
 */

const WEB_SRC: Record<'tl' | 'tr' | 'bl' | 'br', string> = {
  tl: '/images/skill-web-tl.webp',
  tr: '/images/skill-web-tr.webp',
  bl: '/images/skill-web-bl.webp',
  br: '/images/skill-web-br.webp',
};

function Web({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <div className={`sk__w sk__w--${pos}`} aria-hidden="true">
      <img className="sk__web-img" src={WEB_SRC[pos]} alt="" draggable={false} />
    </div>
  );
}

export function BarracksSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

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
    <section id="army-camps" ref={ref} className={`sk${inView ? ' is-in' : ''}`}>
      <Web pos="tl" />
      <Web pos="tr" />
      <Web pos="bl" />
      <Web pos="br" />

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
