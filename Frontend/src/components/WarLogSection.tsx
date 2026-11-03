import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CAMPAIGN_PROJECTS } from '../data/portfolioData';
import type { ProjectCampaign } from '../types/portfolio';
import './WarLogSection.css';

/**
 * Projects section: the character hangs upside-down from a red thread and has tied
 * two project boxes to his hand; two more boxes hang from those on their own threads.
 * Click a box to open the full details in a pop-up.
 *
 * - Artwork:  /public/images/projects-hang.webp (765 x 1424)
 * - Content:  CAMPAIGN_PROJECTS in data/portfolioData.ts (the first four are shown on the hanging board)
 * - The boxes are laid over the painted canvases in the artwork (positions in CARDS, art pixels).
 */

const ART_W = 765;
const ART_H = 1424;
/** On phones only the part of the art above the threads' ends is drawn; projects become a normal list. */
const ART_CROP_H = 662;
/** The point the whole piece swings from (the end of the thread at the top). */
const PIVOT = '368px 0px';
const WIDE_MIN = 560;
/** Box positions (art pixels); each covers a painted canvas of the artwork. */
const CARD_W = 308;
const CARD_H = 296;
const CARDS = [
  { x: 119, y: 668 },
  { x: 454, y: 646 },
  { x: 119, y: 1064 },
  { x: 454, y: 1036 },
] as const;

/** Threads that hang the lower boxes from the upper ones (art coordinates). */
const CHAIN = [
  { id: 'a', d: 'M303 958 C322 1000 396 1015 372 1066' },
  { id: 'b', d: 'M596 936 C628 985 548 1000 560 1038' },
];
const CHAIN_WRAP = [
  { dy: 5, d: 'M280 920 C292 962 332 958 322 918' },
  { dy: 5, d: 'M290 926 C312 958 338 940 330 912' },
  { dy: 36, d: 'M574 893 C588 930 626 926 618 884' },
  { dy: 36, d: 'M584 896 C604 928 632 910 626 876' },
];

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

const CardBody: React.FC<{ p: ProjectCampaign }> = ({ p }) => (
  <>
    <span className="pj-card__cat">{p.category}</span>
    <h3 className="pj-card__title">{p.title}</h3>
    <p className="pj-card__desc">{p.description}</p>
    <span className="pj-card__more">View details →</span>
  </>
);

export const WarLogSection: React.FC = () => {
  const projects = CAMPAIGN_PROJECTS;
  const shown = projects.slice(0, 4);
  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<ProjectCampaign | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // keep the art scaled to the stage width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setWidth(stageRef.current?.clientWidth ?? el.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // play the intro every time the section scrolls into view (re-arms once it is fully off-screen)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.25) setInView(true);
          else if (e.intersectionRatio === 0) setInView(false);
        }
      },
      { threshold: [0, 0.25] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wide = width >= WIDE_MIN;
  const scale = width > 0 ? width / ART_W : 1;
  const stageH = (wide ? ART_H : ART_CROP_H) * scale;

  const style = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;
  const close = React.useCallback(() => setActive(null), []);

  return (
    <section id="war-log" className="pj">
      <div className="pj__inner">
        <header className="pj__head">
          <span className="pj__eyebrow">Selected work</span>
          <h2 className="pj__title">Projects</h2>
          <p className="pj__sub">Hanging around with a few things I&rsquo;ve built. Tap a card to see the details.</p>
        </header>

        <div
          ref={stageRef}
          className={`pj__stage${inView ? ' is-in' : ''}`}
          style={{ height: stageH || undefined }}
          role="group"
          aria-label="Projects hanging from the character's hand"
        >
          <div className="pj__scale" style={style({ width: ART_W, height: ART_H, transform: `scale(${scale})` })}>
            <div className="pj__swing" style={style({ transformOrigin: PIVOT })}>
              <img className="pj__art" src="/images/projects-hang.webp" width={ART_W} height={ART_H} alt="" aria-hidden="true" draggable={false} />

              {wide && (
                <svg className="pj__chain" viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H} aria-hidden="true">
                  {CHAIN.map((c) => (
                    <g key={c.id}>
                      <path className="pj__rope" d={c.d} pathLength={1} />
                      <path className="pj__twist" d={c.d} />
                    </g>
                  ))}
                  {CHAIN_WRAP.map((w) => (
                    <path key={w.d} className="pj__rope pj__rope--wrap" d={w.d} transform={`translate(0 ${w.dy})`} />
                  ))}
                </svg>
              )}

              {wide &&
                shown.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`pj-hang pj-hang--${i % 2 === 0 ? 'a' : 'b'}`}
                    style={style({ left: CARDS[i].x, top: CARDS[i].y, width: CARD_W, height: CARD_H, '--i': i })}
                    onClick={() => setActive(p)}
                    aria-label={`${p.title}, open details`}
                  >
                    <CardBody p={p} />
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* phones: the same projects as plain stacked cards */}
        {!wide && (
          <div className="pj__list">
            {projects.map((p) => (
              <button key={p.id} type="button" className="pj-hang pj-hang--list" onClick={() => setActive(p)} aria-label={`${p.title}, open details`}>
                <CardBody p={p} />
              </button>
            ))}
          </div>
        )}
      </div>

      {active && createPortal(<ProjectDetails p={active} onClose={close} />, document.body)}
    </section>
  );
};
