import React, { useEffect, useRef } from 'react';
import './ExperienceSection.css';

type Job = {
  role: string;
  org: string;
  place?: string;
  period: string;
  type: string;
  icon: 'board' | 'cap';
  text: string;
  tags: string[];
};

/* Edit this list to add or change a role. Newest first. */
const JOBS: Job[] = [
  {
    role: 'Sr. Technical Trainer',
    org: 'Acropolis Institutions',
    period: 'May 2022 — Present',
    type: 'Full-time',
    icon: 'board',
    text:
      'Leading technical training initiatives in Computer Science. Teaching advanced subjects including Machine Learning, Data Science, Blockchain, and Cyber Security. Mentoring students and conducting research.',
    tags: ['Machine Learning', 'Data Science', 'Blockchain', 'Cyber Security', 'Mentoring'],
  },
  {
    role: 'Assistant Professor',
    org: 'IPS Academy',
    place: 'Indore',
    period: 'Aug 2018 — May 2022',
    type: 'Full-time',
    icon: 'cap',
    text:
      'Served as Assistant Professor in CS department. Published 1 Patent and multiple research papers (National & International). Authored chapters in edited books. Led curriculum development for emerging technologies.',
    tags: ['1 Patent', 'Research Papers', 'Book Chapters', 'Curriculum'],
  },
];

function Icon({ kind }: { kind: Job['icon'] }) {
  return (
    <svg viewBox="0 0 48 48" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === 'board' ? (
        <>
          <rect x="6" y="8" width="36" height="25" rx="3" />
          <path d="M13 16h14M13 23h9" />
          <path d="M31 27l3-9 3 9M32.2 24.5h4.6" />
          <path d="M16 41l4-8M32 41l-4-8" />
        </>
      ) : (
        <>
          <path d="M24 9L5 18l19 9 19-9z" />
          <path d="M12 22v9c0 3 6 6 12 6s12-3 12-6v-9" />
          <path d="M43 18v12" />
        </>
      )}
    </svg>
  );
}

export const ExperienceSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = ref.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const items = Array.from(track.querySelectorAll<HTMLElement>('.ex-item'));

    // cards pop in one by one as they enter the screen
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0.25 },
    );
    if (io) items.forEach((el) => io.observe(el)); else items.forEach((el) => el.classList.add('is-in'));

    // the line fills down as you scroll through the list
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
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
  }, []);

  return (
    <section id="experience" ref={ref} className="ex" aria-labelledby="ex-title">
      <div className="ex__inner">
        <header className="ex__head">
          <span className="ex__eyebrow">Career trail</span>
          <h2 id="ex-title" className="ex__title">Experience</h2>
          <p className="ex__sub">Where I've taught, mentored and built things.</p>
        </header>

        <ol className="ex__track" ref={trackRef}>
          <span className="ex__line" aria-hidden="true"><i /></span>
          {JOBS.map((j) => (
            <li className="ex-item" key={j.role + j.period}>
              <span className="ex-item__dot" aria-hidden="true" />
              <article className="ex-card">
                <div className="ex-card__icon"><Icon kind={j.icon} /></div>
                <div className="ex-card__meta">
                  <span className="ex-pill ex-pill--date">{j.period}</span>
                  <span className="ex-pill ex-pill--type">{j.type}</span>
                </div>
                <h3 className="ex-card__role">{j.role}</h3>
                <p className="ex-card__org">{j.org}{j.place ? `, ${j.place}` : ''}</p>
                <p className="ex-card__text">{j.text}</p>
                <ul className="ex-card__tags">
                  {j.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSection;
