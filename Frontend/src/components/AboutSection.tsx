import React, { useEffect, useRef, useState } from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import './AboutSection.css';

/**
 * About: the character on one side, a short intro on the other.
 * The picture is cropped from below so he stands in the frame from the waist up.
 */
export const AboutSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className={`ab${inView ? ' is-in' : ''}`} aria-labelledby="ab-title">
      <div className="ab__wrap">
        <div className="ab__art">
          <span className="ab__glow" aria-hidden="true" />
          <img
            className="ab__img"
            src="/images/about-character.webp"
            width={459}
            height={905}
            alt={`Illustration of ${CHIEF_INFO.name}`}
            draggable={false}
          />
        </div>

        <div className="ab__txt">
          <p className="ab__eyebrow">About me</p>
          <h2 id="ab-title" className="ab__title">
            Hi, I&rsquo;m <span>Milan.</span>
          </h2>
          <p className="ab__lead">
            A fresh Computer Science graduate who likes turning ideas into fast, tidy and good-looking web products.
          </p>
          <p className="ab__body">
            I build full-stack apps with modern frameworks, care a lot about UI details, and enjoy solving the awkward
            problems that only show up once real people start using something. I&rsquo;m looking for a team where I can
            ship, learn quickly and own what I build.
          </p>

          <dl className="ab__facts">
            <div><dt>Role</dt><dd>Junior Full-Stack Engineer</dd></div>
            <div><dt>Focus</dt><dd>UI/UX &amp; Creative Front-End</dd></div>
            <div><dt>Based in</dt><dd>India &middot; open to remote</dd></div>
          </dl>

          <div className="ab__cta">
            <a href="#war-log" className="ab__btn ab__btn--solid">See my work</a>
            <a href="#clan-recruitment" className="ab__btn ab__btn--ghost">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
};
