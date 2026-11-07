import React, { useState } from 'react';
import { CHIEF_INFO, DIRECT_OUTPOSTS } from '../data/portfolioData';
import { SocialIcon } from './SocialIcon';
import { sendRecruitmentMessage } from '../utils/api';
import { villageAudio } from '../utils/soundEffects';
import './RecruitmentSection.css';

const MISSIONS: { value: string; label: string }[] = [
  { value: 'Full-time SDE', label: 'Full-time SDE' },
  { value: 'Frontend Engineer', label: 'Frontend' },
  { value: 'Backend Engineer', label: 'Backend' },
  { value: 'Full-Stack Developer', label: 'Full-Stack' },
  { value: 'Internship / Trainee', label: 'Internship' },
  { value: 'Freelance / Contract', label: 'Freelance' },
  { value: 'General Missive', label: 'Just saying hi' },
];


export const RecruitmentSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(res.error || 'Failed to dispatch battle scroll.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="clan-recruitment" className="rc">
      <div className="rc__wrap">
        {/* the character sits on the frame's top-right corner */}
        <img
          src="/images/recruit-sit.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          width={300}
          height={537}
          className="rc__sit"
        />

        <div className="rc-rig">
          <div className="rc-rig__tab"><i aria-hidden="true" /> Signal Status</div>
          <img className="rc-rig__web rc-rig__web--tl" src="/images/skill-web-tl.webp" alt="" aria-hidden="true" draggable={false} />
          <img className="rc-rig__web rc-rig__web--bl" src="/images/skill-web-bl.webp" alt="" aria-hidden="true" draggable={false} />
          <img className="rc-rig__web rc-rig__web--br" src="/images/skill-web-br.webp" alt="" aria-hidden="true" draggable={false} />

          <div className="rc-rig__panel">
            <div className="rc-rig__bar">
              <span className="rc-rig__live"><i aria-hidden="true" />WEB-NET FREQ // 442.8 MHz &bull; READY FOR DISPATCH</span>
              <span className="rc-rig__meta">REPLY WINDOW: 24H</span>
            </div>

            <div className="rc-rig__body">
              {/* ── Left: the form ── */}
              <div className="rc-card rc-form">
                <h2 className="rc-form__title">Shoot a Missive</h2>
                <p className="rc-form__sub">
                  Leave coordinates for software engineering roles, hackathon collabs, or ML pipelines.
                </p>

                <form onSubmit={handleSubmit} className="rc-form__f">
                  <div className="rc-form__row">
                    <label className="rc-field">
                      <span>Callsign // Recruiter name</span>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins (Tech Lead)"
                        disabled={loading}
                      />
                    </label>
                    <label className="rc-field">
                      <span>Return frequency // Email</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="recruiter@engineering.io"
                        disabled={loading}
                      />
                    </label>
                  </div>

                  <fieldset className="rc-field rc-missions">
                    <legend>Mission type</legend>
                    <div className="rc-chips" role="radiogroup" aria-label="Mission type">
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
                    <span>Transmission content</span>
                    <textarea
                      required
                      rows={4}
                      value={formData.orders}
                      onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                      placeholder="Outline your stack, timeline, and problem statement. Tell me how you'd like me to contribute..."
                      disabled={loading}
                    />
                  </label>

                  {errorMessage && (
                    <div className="rc-note rc-note--err" role="alert">
                      <span className="material-symbols-outlined" aria-hidden="true">error</span>
                      <div>
                        <b>Transmission interrupted</b>
                        <p>{errorMessage}</p>
                      </div>
                      <button type="button" onClick={() => setErrorMessage(null)} aria-label="Dismiss">✕</button>
                    </div>
                  )}

                  {submitted && (
                    <div className="rc-note rc-note--ok" role="status">
                      <span className="material-symbols-outlined" aria-hidden="true">verified</span>
                      <div>
                        <b>Transmission sent!</b>
                        <p>{CHIEF_INFO.name} has your message and will reply within 24 hours.</p>
                      </div>
                      <button type="button" onClick={() => setSubmitted(false)} aria-label="Dismiss">✕</button>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="rc-launch">
                    {loading ? (
                      <>
                        <span className="rc-spin" aria-hidden="true" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" aria-hidden="true">send</span>
                        <span>Launch web transmission</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* ── Right: direct channels + resume ── */}
              <div className="rc-side">
                <div className="rc-card rc-relays">
                  <span className="rc-relays__tab">Direct frequencies</span>
                  <p className="rc-relays__label">Fast-travel relays</p>
                  <div className="rc-relays__grid">
                    {DIRECT_OUTPOSTS.map((o) => (
                      <a key={o.name} href={o.url} target="_blank" rel="noreferrer" className="rc-relay">
                        <span className="rc-relay__ico"><SocialIcon platform={o.name} className="w-4 h-4" /></span>
                        <span className="rc-relay__txt">
                          <b>{o.name}</b>
                          <small>{o.handle.replace(/\s*→\s*$/, '')}</small>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rc-card rc-resume">
                  <span className="rc-resume__ribbon" aria-hidden="true">PDF</span>
                  <h3 className="rc-resume__title">Chief Scroll (Resume)</h3>
                  <div className="rc-resume__row">
                    <div className="rc-resume__doc" aria-hidden="true">
                      <i /><i /><i /><i />
                    </div>
                    <p>
                      Full technical specification, coursework, project metrics and academic references, formatted for ATS scans.
                    </p>
                  </div>
                  <a href="/resume.pdf" download className="rc-resume__btn">
                    <span className="material-symbols-outlined" aria-hidden="true">download</span>
                    <span>Get verified dossier</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
