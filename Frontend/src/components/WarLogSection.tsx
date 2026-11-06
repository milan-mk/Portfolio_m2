import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CAMPAIGN_PROJECTS } from '../data/portfolioData';
import type { ProjectCampaign } from '../types/portfolio';
import './WarLogSection.css';

/**
 * Projects section: the character hangs upside-down from a red thread. A twisted web rope
 * shoots from his palm and flares out into a cobweb (a drawn image), and holds one big board with the project boxes
 * inside. The board sways gently. Click a box to open its details in a pop-up.
 *
 * - Artwork:  /public/images/projects-hang-top.webp (1024 x 765 source, shown 765 wide, the character only)
 * - Web:      /public/images/projects-web.webp (rope + cobweb; continues the strands drawn on his hand)
 * - Content:  CAMPAIGN_PROJECTS in data/portfolioData.ts (the first four are shown on the board)
 * - Everything is laid out in "art" pixels (765 wide) and scaled to the stage width.
 */

const ART_W = 765;
/** Where the web image fades in over the strands on his hand (the swing pivots here, so the join barely moves). */
const WRIST = { x: 431.4, y: 546 };
/** The web artwork: wrist strands, twisted rope, cobweb and eyelets (drawn at the same scale as the strands on his hand, so the lines are just as thin). */
const WEB_IMG = { x: 262, y: 542, w: 292, h: 285.0 };
/** Board (the big container). Its top border lines up with the board edge drawn in the web image. */
const BOARD = { x: 57, y: 817, w: 700, h: 592 };
const ART_H = BOARD.y + BOARD.h + 36;
const ART_TOP_H = 571.5;
const PIVOT = '368px 0px';
const WIDE_MIN = 560;

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
  // on phones the stage ends where the web reaches the board, and the board follows in normal flow
  const stageH = (wide ? ART_H : BOARD.y) * scale;

  const style = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;
  const close = React.useCallback(() => setActive(null), []);

  const board = (list: ProjectCampaign[]) => (
    <div className="pj-board__grid">
      {list.map((p, i) => (
        <article
          key={p.id}
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
      ))}
    </div>
  );

  return (
    <section id="war-log" className="pj">
      <div className="pj__inner">
        <header className="pj__head">
          <span className="pj__eyebrow">Selected work</span>
          <h2 className="pj__title">Projects</h2>
          <p className="pj__sub">Hanging around with a few things I&rsquo;ve built. Tap a box to see the details.</p>
        </header>

        <div
          ref={stageRef}
          className={`pj__stage${inView ? ' is-in' : ''}${wide ? '' : ' is-narrow'}`}
          style={{ height: stageH || undefined }}
          role="group"
          aria-label="Projects hanging from the character's hand"
        >
          <div className="pj__scale" style={style({ width: ART_W, height: wide ? ART_H : BOARD.y, transform: `scale(${scale})` })}>
            <div className="pj__swing" style={style({ transformOrigin: PIVOT })}>
              {/* drawn in like the hero character: white shape, then colour, with the outline on top */}
              <img className="pj__art pj__art--white" src="/images/projects-hang-top.webp" width={ART_W} height={ART_TOP_H} alt="" aria-hidden="true" draggable={false} />
              <img className="pj__art pj__art--col" src="/images/projects-hang-top.webp" width={ART_W} height={ART_TOP_H} alt="" aria-hidden="true" draggable={false} />
              <img className="pj__art pj__art--line" src="/images/projects-hang-line.webp" width={ART_W} height={ART_TOP_H} alt="" aria-hidden="true" draggable={false} />

              {/* the web + board pivot from the wrist */}
              <div className="pj__hang" style={style({ transformOrigin: `${WRIST.x}px ${WRIST.y}px` })}>
                <img className="pj__web" src="/images/projects-web.webp" width={WEB_IMG.w} height={WEB_IMG.h} alt="" aria-hidden="true" draggable={false} style={style({ left: WEB_IMG.x, top: WEB_IMG.y })} />
                {wide && (
                  <div className="pj-board" style={style({ left: BOARD.x, top: BOARD.y, width: BOARD.w, height: BOARD.h })}>
                    {board(shown)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* phones: the same board, in normal flow below the web */}
        {!wide && <div className="pj-board pj-board--flow">{board(projects)}</div>}
      </div>

      {active && createPortal(<ProjectDetails p={active} onClose={close} />, document.body)}
    </section>
  );
};
