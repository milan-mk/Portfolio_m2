import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CAMPAIGN_PROJECTS } from '../data/portfolioData';
import type { ProjectCampaign } from '../types/portfolio';
import './WarLogSection.css';

/**
 * Projects section: the character hangs upside-down from a red thread and has tied
 * two canvases to his hand. Each canvas shows one project; the arrows swap in the next pair.
 *
 * - Artwork:  /public/images/projects-hang.webp (765 x 1024)
 * - Content:  CAMPAIGN_PROJECTS in data/portfolioData.ts (title, category, description, tags, demoUrl, sourceUrl, image)
 * - Canvas corners were measured on the artwork; they are mapped with a perspective transform (matrix3d below).
 */

const ART_W = 765;
const ART_H = 1024;
/** Where the threads meet the canvases; on phones only the part above this is drawn. */
const ART_CROP_H = 662;
/** The point the whole piece swings from (the end of the thread at the top). */
const PIVOT = '368px 0px';
const FACE_W = 230;
const FACE_H = 250;
/** matrix3d that maps a 230 x 250 rectangle onto each canvas face (measured from the artwork). */
const FACE_M3D = {
  left: '1.09564,0.105715,0,0.000329166,0.0965826,0.957485,0,6.95169e-05,0,0,1,0,160,719,0,1',
  right: '1.2389,0.262849,0,0.00043321,-0.000690579,0.808898,0,-2.58991e-05,0,0,1,0,487,684,0,1',
} as const;

const PER_PAGE = 2;
const WIDE_MIN = 560; // below this width the canvases are replaced by normal cards under the art

const ProjectCard: React.FC<{ p: ProjectCampaign }> = ({ p }) => {
  const [imgOk, setImgOk] = useState(true);
  const hasDemo = !!p.demoUrl && p.demoUrl !== '#';
  return (
    <>
      {p.image && imgOk && (
        <div className="pj-card__shot">
          <img src={p.image} alt="" loading="lazy" onError={() => setImgOk(false)} />
        </div>
      )}
      <div className="pj-card__meta">
        <span className="pj-card__no">No. {String(p.questNumber).padStart(2, '0')}</span>
        <span className="pj-card__cat">{p.category}</span>
      </div>
      <h3 className="pj-card__title">{p.title}</h3>
      <p className="pj-card__desc">{p.description}</p>
      <ul className="pj-card__tags" aria-label="Technologies">
        {p.tags.slice(0, 4).map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
      <div className="pj-card__cta">
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
          Source
        </a>
      </div>
    </>
  );
};

export const WarLogSection: React.FC = () => {
  const projects = CAMPAIGN_PROJECTS;
  const pages = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const [animKey, setAnimKey] = useState(0);
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

  // play the "lower in" intro whenever the section scrolls into view
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          setInView((prev) => {
            if (!prev) {
              setAnimKey((k) => k + 1);
              return true;
            }
            return prev;
          });
        } else if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          setInView(false);
        }
      },
      { threshold: [0, 0.15] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wide = width >= WIDE_MIN;
  const scale = width > 0 ? width / ART_W : 1;
  const stageH = (wide ? ART_H : ART_CROP_H) * scale;

  const go = useCallback((d: number) => setPage((p) => (p + d + pages) % pages), [pages]);
  const visible = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const style = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;

  return (
    <section id="war-log" className="pj">
      <div className="pj__inner">
        <header className="pj__head">
          <span className="pj__eyebrow">Selected work</span>
          <h2 className="pj__title">Projects</h2>
          <p className="pj__sub">
            Hanging around with a few things I&rsquo;ve built. Hover a canvas to read it, click through to open it.
          </p>
        </header>

        <div
          ref={stageRef}
          className={`pj__stage${inView ? ' is-in' : ''}`}
          style={{ height: stageH || undefined }}
          role="group"
          aria-label="Projects hanging from the character's hand"
        >
          <div className="pj__scale" style={style({ width: ART_W, height: ART_H, transform: `scale(${scale})` })}>
            <div key={animKey} className="pj__swing" style={style({ transformOrigin: PIVOT })}>
              <img className="pj__art" src="/images/projects-hang.webp" width={ART_W} height={ART_H} alt="" aria-hidden="true" draggable={false} />

              {wide &&
                visible.map((p, i) => (
                  <article
                    key={`${page}-${p.id}`}
                    className={`pj-face pj-face--${i === 0 ? 'left' : 'right'}`}
                    style={style({
                      width: FACE_W,
                      height: FACE_H,
                      transform: `matrix3d(${i === 0 ? FACE_M3D.left : FACE_M3D.right})`,
                      '--i': i,
                    })}
                  >
                    <div className="pj-card pj-card--face">
                      <ProjectCard p={p} />
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>

        {/* phones: the same projects as plain stacked cards */}
        {!wide && (
          <div className="pj__list">
            {projects.map((p) => (
              <article key={p.id} className="pj-card pj-card--list">
                <ProjectCard p={p} />
              </article>
            ))}
          </div>
        )}

        {wide && pages > 1 && (
          <nav className="pj__pager" aria-label="Project pages">
            <button type="button" className="pj__arrow" onClick={() => go(-1)} aria-label="Previous projects">
              &larr;
            </button>
            <div className="pj__dots">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pj__dot${i === page ? ' is-on' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`Show projects ${i * PER_PAGE + 1} to ${Math.min(projects.length, (i + 1) * PER_PAGE)}`}
                  aria-current={i === page}
                />
              ))}
            </div>
            <button type="button" className="pj__arrow" onClick={() => go(1)} aria-label="Next projects">
              &rarr;
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};
