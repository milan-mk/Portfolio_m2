import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CAMPAIGN_PROJECTS } from '../data/portfolioData';
import type { ProjectCampaign } from '../types/portfolio';
import './WarLogSection.css';

/**
 * Projects section: the character hangs upside-down from a red thread on the right side.
 * A clean vertical timeline bar runs down the center with project boxes on both sides.
 * Click a box to open its details in a pop-up.
 *
 * - Artwork:  /public/images/projects-hang-top.webp (1024 x 765 source, shown 765 x 571.5 aspect)
 * - Content:  CAMPAIGN_PROJECTS in data/portfolioData.ts
 */

const ART_W = 765;
const ART_TOP_H = 571.5;

const ProjectDetails: React.FC<{ p: ProjectCampaign; onClose: () => void }> = ({ p, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasDemo = !!p.demoUrl && p.demoUrl !== '#';
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const stats = p.lootWon ? [p.lootWon.stat1, p.lootWon.stat2, p.lootWon.stat3].filter(Boolean) : [];

  return (
    <div className="pj-modal" role="dialog" aria-modal="true" aria-label={p.title} onClick={onClose}>
      <div className="pj-modal__panel" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="pj-modal__close" onClick={onClose} aria-label="Close details">
          ×
        </button>
        {p.image && imgOk && (
          <div className="pj-modal__shot">
            <img src={p.image} alt="" onError={() => setImgOk(false)} />
          </div>
        )}
        <div className="pj-modal__body">
          <span className="pj-modal__cat">{p.category}</span>
          <h3 className="pj-modal__title">{p.title}</h3>
          {p.badgeHighlight && <p className="pj-modal__badge">{p.badgeHighlight}</p>}
          <p className="pj-modal__desc">{p.description}</p>
          {stats.length > 0 && (
            <dl className="pj-modal__stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <ul className="pj-modal__tags" aria-label="Technologies">
            {p.tags.map((t) => (
              <li key={t.name}>{t.name}</li>
            ))}
          </ul>
          <div className="pj-modal__cta">
            <a
              className={`pj-btn pj-btn--red${hasDemo ? '' : ' is-soon'}`}
              href={hasDemo ? p.demoUrl : undefined}
              target={hasDemo ? '_blank' : undefined}
              rel="noreferrer"
              aria-disabled={!hasDemo}
            >
              {hasDemo ? 'Live demo' : 'Demo soon'}
            </a>
            <a className="pj-btn pj-btn--ink" href={p.sourceUrl} target="_blank" rel="noreferrer">
              Source code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardBody: React.FC<{ p: ProjectCampaign }> = ({ p }) => {
  const hasDemo = !!p.demoUrl && p.demoUrl !== '#';
  return (
    <>
      <span className="pj-card__cat">{p.category}</span>
      <h3 className="pj-card__title">{p.title}</h3>
      <p className="pj-card__desc">{p.description}</p>
      <div className="pj-card__cta">
        <a
          className={`pj-card__btn pj-card__btn--demo${hasDemo ? '' : ' is-soon'}`}
          href={hasDemo ? p.demoUrl : undefined}
          target={hasDemo ? '_blank' : undefined}
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-disabled={!hasDemo}
        >
          {hasDemo ? 'Live demo' : 'Demo soon'}
        </a>
        {p.sourceUrl && (
          <a
            className="pj-card__btn pj-card__btn--code"
            href={p.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Source code
          </a>
        )}
      </div>
    </>
  );
};

export const WarLogSection: React.FC = () => {
  const projects = CAMPAIGN_PROJECTS;
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<ProjectCampaign | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  // play the intro every time the section scrolls into view (re-arms once it is fully off-screen)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.15) setInView(true);
          else if (e.intersectionRatio === 0) setInView(false);
        }
      },
      { threshold: [0, 0.15] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // boxes pop in as they reach the screen; the bar fills down as you scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.querySelectorAll<HTMLElement>('.pj-tl__item'));
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-in'); }),
      { threshold: 0.2 },
    );
    if (io) items.forEach((el) => io.observe(el)); else items.forEach((el) => el.classList.add('is-in'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
      track.style.setProperty('--prog', `${(p * 100).toFixed(1)}%`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [projects.length]);

  const style = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;
  const close = React.useCallback(() => setActive(null), []);

  return (
    <section id="war-log" ref={sectionRef} className="pj">
      {/* hanging character anchored on the side */}
      <div className={`pj__stage${inView ? ' is-in' : ''}`} aria-hidden="true">
        <div className="pj__swing">
          {/* drawn in like the hero character: white shape, then colour, with the outline on top */}
          <img className="pj__art pj__art--white" src="/images/projects-hang-top.webp" width={ART_W} height={ART_TOP_H} alt="" draggable={false} />
          <img className="pj__art pj__art--col" src="/images/projects-hang-top.webp" width={ART_W} height={ART_TOP_H} alt="" draggable={false} />
          <img className="pj__art pj__art--line" src="/images/projects-hang-line.webp" width={ART_W} height={ART_TOP_H} alt="" draggable={false} />
        </div>
      </div>

      <div className="pj__inner">
        <header className="pj__head">
          <span className="pj__eyebrow">Selected work</span>
          <h2 className="pj__title">Projects</h2>
          <p className="pj__sub">Hanging around with a few things I&rsquo;ve built. Tap a box to see the details.</p>
        </header>

        {/* clean project timeline bar with boxes on both sides */}
        <ol className="pj-tl" ref={trackRef}>
          <span className="pj-tl__line" aria-hidden="true"><i /></span>
          {projects.map((p, i) => (
            <li key={p.id} className={`pj-tl__item pj-tl__item--${i % 2 === 0 ? 'l' : 'r'}`}>
              <span className="pj-tl__dot" aria-hidden="true" />
              <article
                className="pj-card"
                style={style({ '--i': i })}
                onClick={() => setActive(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(p);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${p.title}, open details`}
              >
                <CardBody p={p} />
              </article>
            </li>
          ))}
        </ol>
      </div>

      {active && createPortal(<ProjectDetails p={active} onClose={close} />, document.body)}
    </section>
  );
};
