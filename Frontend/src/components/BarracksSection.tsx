import React, { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import './BarracksSection.css';

/**
 * Skills: a simple, clean grid of categories with cobwebs in the corners.
 * On scroll the webs draw themselves in, then the cards rise in one by one.
 */

/** One corner web (quarter fan) in a 220 x 220 box, hanging from the top-left corner. */
function cornerWeb(): string[] {
  const SPOKES = 6;
  const RINGS = 6;
  const R = 214;
  const pt = (r: number, a: number) => [r * Math.cos(a), r * Math.sin(a)] as const;
  const paths: string[] = [];
  // spokes
  for (let s = 0; s < SPOKES; s++) {
    const a = (s / (SPOKES - 1)) * (Math.PI / 2);
    const [x, y] = pt(R, a);
    paths.push(`M0 0 L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  // sagging rings between neighbouring spokes
  for (let k = 1; k <= RINGS; k++) {
    const r = (k / RINGS) * R * (k === RINGS ? 1 : 0.96);
    let d = '';
    for (let s = 0; s < SPOKES - 1; s++) {
      const a0 = (s / (SPOKES - 1)) * (Math.PI / 2);
      const a1 = ((s + 1) / (SPOKES - 1)) * (Math.PI / 2);
      const [x0, y0] = pt(r, a0);
      const [x1, y1] = pt(r, a1);
      const [cx, cy] = pt(r * 0.82, (a0 + a1) / 2); // pulled towards the corner = sag
      if (s === 0) d += `M${x0.toFixed(1)} ${y0.toFixed(1)}`;
      d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}
const WEB = cornerWeb();

function Web({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <div className={`sk__w sk__w--${pos}`} aria-hidden="true">
      <svg className="sk__web" viewBox="-2 -2 224 224">
        {WEB.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </svg>
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
