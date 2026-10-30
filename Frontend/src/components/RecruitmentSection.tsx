import React, { useState } from 'react';
import { CHIEF_INFO, DIRECT_OUTPOSTS } from '../data/portfolioData';
import { SocialIcon } from './SocialIcon';
import { sendRecruitmentMessage } from '../utils/api';
import { villageAudio } from '../utils/soundEffects';

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
    <section id="clan-recruitment" className="w-full px-4 sm:px-6 py-8 sm:py-12 lg:py-14">
      <div className="max-w-[1040px] mx-auto">
        <div className="relative bg-surface-container rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-[0_12px_24px_rgba(0,0,0,0.7)] border border-surface-container-highest/70 overflow-hidden">
          {/* Runic Border Trim Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container/20 via-primary-container to-primary-container/20"></div>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div>
              <div className="flex items-center gap-1.5 text-primary-container font-label text-[11px] uppercase tracking-widest font-bold">
                <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                Guild Recruitment Outpost
              </div>
              <h2 className="font-display text-xl sm:text-2xl lg:text-[28px] font-extrabold uppercase text-on-surface tracking-tight mt-0.5">
                Send a Guild Missive to {CHIEF_INFO.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded shadow-[0_2px_0_#050811] border border-surface-container-high/40 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label text-[10px] uppercase text-emerald-400 font-bold tracking-wider">
                0 Days Deployment Time • Ready to Build
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Column: Parchment Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-3.5 sm:p-5 rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_4px_0_#050811] border border-surface-container-high/60 flex flex-col gap-3">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label text-[10px] uppercase tracking-wider text-outline font-bold">
                      Chief Name / Recruiter
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Chief Sarah (Tech Lead)"
                      disabled={loading}
                      className="w-full bg-surface-container p-2 rounded text-on-surface placeholder:text-outline font-body text-xs sm:text-sm border border-surface-container-highest focus:outline-none focus:ring-1.5 focus:ring-primary-container transition-all disabled:opacity-60"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label text-[10px] uppercase tracking-wider text-outline font-bold">
                      Carrier Pigeon / Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="recruiter@clanengineering.io"
                      disabled={loading}
                      className="w-full bg-surface-container p-2 rounded text-on-surface placeholder:text-outline font-body text-xs sm:text-sm border border-surface-container-highest focus:outline-none focus:ring-1.5 focus:ring-primary-container transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Role / Clan Mission Type */}
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[10px] uppercase tracking-wider text-outline font-bold">
                    Clan Mission / Role Offering
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    disabled={loading}
                    className="w-full bg-surface-container p-2 rounded text-on-surface font-body text-xs sm:text-sm border border-surface-container-highest focus:outline-none focus:ring-1.5 focus:ring-primary-container transition-all cursor-pointer disabled:opacity-60"
                  >
                    <option value="Full-time SDE">Full-time Software Development Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer (React / Next.js)</option>
                    <option value="Backend Engineer">Backend Engineer (Node / Python / APIs)</option>
                    <option value="Full-Stack Developer">Full-Stack Clan Warrior</option>
                    <option value="Internship / Trainee">Software Engineering Internship</option>
                    <option value="Freelance / Contract">Clan Contract / Freelance Project</option>
                    <option value="General Missive">General Discussion / Networking</option>
                  </select>
                </div>

                {/* Battle Orders / Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[10px] uppercase tracking-wider text-outline font-bold">
                    Battle Orders (Project or Team Details)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                    placeholder="Tell me about your product fortress, tech stack, and how you want me to contribute..."
                    disabled={loading}
                    className="w-full bg-surface-container p-2 rounded text-on-surface placeholder:text-outline font-body text-xs sm:text-sm border border-surface-container-highest focus:outline-none focus:ring-1.5 focus:ring-primary-container transition-all resize-none disabled:opacity-60"
                  ></textarea>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-2.5 rounded bg-red-950/50 text-red-300 text-xs font-body border border-red-800/60 flex items-start gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-[16px] text-red-400 mt-0.5 shrink-0">error</span>
                    <div className="flex-1">
                      <p className="font-bold text-red-200">Dispatch Interrupted</p>
                      <p className="mt-0.5 text-red-300/90">{errorMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-400 hover:text-red-200 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Success Banner */}
                {submitted && (
                  <div className="p-3 rounded bg-primary-container/15 text-primary-container text-xs font-body border border-primary-container/30 animate-in fade-in zoom-in-95 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary-container shrink-0 mt-0.5">verified</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">🎉 Battle Scroll Dispatched to MongoDB Fortress!</p>
                      <p className="mt-0.5 text-on-surface-variant text-[11px]">
                        Chief {CHIEF_INFO.name} has safely logged your recruitment scroll and will reply within 24 hours.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-primary-container/80 hover:text-primary-container text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-tactile-gold w-full py-2.5 rounded-lg font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_3px_0_#050811] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></span>
                      <span>Dispatching Battle Scroll...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px] material-symbols-fill">send</span>
                      <span>Send Clan Invitation (Dispatch to Fortress)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Direct Channels & Resume Plaque */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
              <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_4px_0_#050811] border border-surface-container-high/60 flex flex-col gap-2.5">
                <span className="font-label text-[10px] uppercase tracking-wider text-primary font-bold">
                  Fast-Troop Direct Outposts
                </span>
                <div className="flex flex-col gap-1.5">
                  {DIRECT_OUTPOSTS.map((outpost, idx) => (
                    <a
                      key={idx}
                      href={outpost.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-1.5 px-2.5 rounded bg-surface-container hover:bg-surface-container-high transition-colors border border-surface-container-highest/40 group"
                    >
                      <span className="flex items-center gap-2 text-on-surface font-body text-xs group-hover:text-primary transition-colors">
                        <span className="text-primary-container group-hover:scale-110 transition-transform flex items-center justify-center w-4 h-4 shrink-0">
                          <SocialIcon platform={outpost.name} className="w-3.5 h-3.5" />
                        </span>
                        {outpost.name}
                      </span>
                      <span className="font-label text-[10px] text-outline font-bold group-hover:text-on-surface transition-colors">
                        {outpost.handle}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume Download Callout Plaque */}
              <div className="bg-surface-container-high p-3.5 sm:p-4 rounded-xl shadow-[0_4px_0_#050811] border border-surface-container-highest flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-primary uppercase">
                    Chief Scroll (Resume)
                  </span>
                  <span className="font-label text-[9px] text-tertiary bg-surface-container-lowest px-1.5 py-0.5 rounded font-bold border border-tertiary/30">
                    PDF V2025
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  Full technical specification, coursework, project metrics, and academic references formatted for ATS scans.
                </p>
                <a
                  href="/resume.pdf"
                  download
                  className="btn-tactile-stone mt-1 w-full py-2 rounded-lg font-display font-bold text-xs uppercase text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_3px_0_#050811]"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Resume Scroll</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
