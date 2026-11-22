import React, { useEffect, useRef, useState } from 'react';
import { CHIEF_INFO, DIRECT_OUTPOSTS } from '../data/portfolioData';
import { SocialIcon } from './SocialIcon';
import { sendRecruitmentMessage } from '../utils/api';
import { villageAudio } from '../utils/soundEffects';
import './RecruitmentSection.css';

const MISSIONS: { value: string; label: string }[] = [
  { value: 'Full-time SDE', label: 'Full-time role' },
  { value: 'Frontend Engineer', label: 'Frontend' },
  { value: 'Backend Engineer', label: 'Backend' },
  { value: 'Full-Stack Developer', label: 'Full-Stack' },
  { value: 'Internship / Trainee', label: 'Internship' },
  { value: 'Freelance / Contract', label: 'Freelance' },
  { value: 'General Missive', label: 'General inquiry' },
];


/** plain channel names for the contact cards (the data file keeps its original wording) */
const plainName = (n: string) => {
  const k = n.toLowerCase();
  if (k.includes('github')) return 'GitHub';
  if (k.includes('linkedin')) return 'LinkedIn';
  if (k.includes('mail')) return 'Email';
  if (k.includes('discord')) return 'Discord';
  return n;
};

export const RecruitmentSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  // replay the intro (threads drop in) every time the section scrolls into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.2) setInView(true);
          else if (e.intersectionRatio === 0) setInView(false);
        }
      },
      { threshold: [0, 0.2] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Full-time SDE',
    orders: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await sendRecruitmentMessage({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        orders: formData.orders,
      });

      if (res.success) {
        setSubmitted(true);
        villageAudio.playGold();
        setFormData({
          name: '',
          email: '',
          role: 'Full-time SDE',
          orders: '',
        });
      } else {
        setErrorMessage(res.error || 'Failed to send your message. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="clan-recruitment" ref={rootRef} className={`rc${inView ? ' is-in' : ''}`}>
      <div className="rc__inner">
        <header className="rc__head">
          <span className="rc__eyebrow">Contact</span>
          <h2 className="rc__title">Get in touch</h2>
          <p className="rc__sub">
            Open to software engineering roles, internships and collaborations. Send a message below or reach me directly on any channel.
          </p>
        </header>

        {/* ── the hotline: four channels hang from one web thread ── */}
        <div className="rc-hot" role="group" aria-label="Direct channels">
          <span className="rc-hot__line" aria-hidden="true" />
          <ul className="rc-hot__list">
            {DIRECT_OUTPOSTS.map((o, i) => (
              <li key={o.name} style={{ '--i': i } as React.CSSProperties}>
                <a href={o.url} target="_blank" rel="noreferrer" className="rc-relay">
                  <span className="rc-relay__ico"><SocialIcon platform={o.name} className="w-5 h-5" /></span>
                  <span className="rc-relay__txt">
                    <b>{plainName(o.name)}</b>
                    <small>{o.handle.replace(/\s*→\s*$/, '')}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rc__stage">
          {/* ── the message board ── */}
          <div className="rc-board">
            <div className="rc-board__tab"><i aria-hidden="true" /> Typically replies within 24 hours</div>
            <img className="rc-board__web rc-board__web--tr" src="/images/skill-web-tr.webp" alt="" aria-hidden="true" draggable={false} />
            <img className="rc-board__web rc-board__web--bl" src="/images/skill-web-bl.webp" alt="" aria-hidden="true" draggable={false} />

            <form onSubmit={handleSubmit} className="rc-form">
              <div className="rc-form__row">
                <label className="rc-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    disabled={loading}
                  />
                </label>
                <label className="rc-field">
                  <span>Email</span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    disabled={loading}
                  />
                </label>
              </div>

              <fieldset className="rc-field rc-missions">
                <legend>I'm reaching out about</legend>
                <div className="rc-chips" role="radiogroup" aria-label="Reason for contact">
                  {MISSIONS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      role="radio"
                      aria-checked={formData.role === m.value}
                      className={`rc-chip${formData.role === m.value ? ' is-on' : ''}`}
                      onClick={() => setFormData({ ...formData, role: m.value })}
                      disabled={loading}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="rc-field">
                <span>Message</span>
                <textarea
                  required
                  rows={5}
                  value={formData.orders}
                  onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                  placeholder="Tell me about the role or project, your timeline and how I can help."
                  disabled={loading}
                />
              </label>

              {errorMessage && (
                <div className="rc-note rc-note--err" role="alert">
                  <span className="material-symbols-outlined" aria-hidden="true">error</span>
                  <div>
                    <b>Message not sent</b>
                    <p>{errorMessage}</p>
                  </div>
                  <button type="button" onClick={() => setErrorMessage(null)} aria-label="Dismiss">✕</button>
                </div>
              )}

              {submitted && (
                <div className="rc-note rc-note--ok" role="status">
                  <span className="material-symbols-outlined" aria-hidden="true">verified</span>
                  <div>
                    <b>Message sent</b>
                    <p>Thanks for reaching out. {CHIEF_INFO.name} will reply within 24 hours.</p>
                  </div>
                  <button type="button" onClick={() => setSubmitted(false)} aria-label="Dismiss">✕</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="rc-launch">
                {loading ? (
                  <>
                    <span className="rc-spin" aria-hidden="true" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" aria-hidden="true">send</span>
                    <span>Send message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── the character perches on the resume card ── */}
          <aside className="rc-side">
            <div className="rc-resume">
              <span className="rc-resume__ribbon" aria-hidden="true">PDF</span>
              <h3 className="rc-resume__title">Resume</h3>
              <div className="rc-resume__row">
                <div className="rc-resume__doc" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <p>
                  Skills, projects, education and experience in one document.
                </p>
              </div>
              <a href="/resume.pdf" download className="rc-resume__btn">
                <span className="material-symbols-outlined" aria-hidden="true">download</span>
                <span>Download resume</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
