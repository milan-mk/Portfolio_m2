import React, { useCallback, useEffect, useRef } from 'react';

/**
 * A spider hanging from the top of the Skills section on a silk thread.
 * Pull it down a little and let go: the scene behind the skills changes and it springs back.
 * Click/tap just makes it bounce; Enter or Space (keyboard) changes the scene directly.
 */
const REST = 'clamp(44px, 15vw, 150px)';   // thread length at rest
const THRESHOLD = 32;                       // px of pull needed to switch
const MAX_PULL = 96;

export function SkillSpider({ onPull, label, hint }: { onPull: () => void; label: string; hint: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const drag = useRef<{ y0: number; id: number } | null>(null);
  const pullRef = useRef(0);

  const setPull = (v: number) => {
    pullRef.current = v;
    root.current?.style.setProperty('--pull', `${v}px`);
    root.current?.classList.toggle('is-armed', v >= THRESHOLD);
  };

  /** damped spring back to 0, with a little overshoot */
  const springBack = useCallback((from: number, v0 = 0) => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPull(0); return; }
    let x = from, v = v0, last = performance.now();
    const k = 190, c = 7.5;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      v += (-k * x - c * v) * dt; x += v * dt;
      setPull(x);
      if (Math.abs(x) < 0.15 && Math.abs(v) < 2) { setPull(0); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const down = (e: React.PointerEvent) => {
    cancelAnimationFrame(raf.current);
    drag.current = { y0: e.clientY - pullRef.current, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    root.current?.classList.add('is-drag');
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.y0);
    setPull(MAX_PULL * (1 - Math.exp(-dy / MAX_PULL)));           // rubber-band feel
  };
  const up = () => {
    if (!drag.current) return;
    drag.current = null;
    root.current?.classList.remove('is-drag');
    const p = pullRef.current;
    if (p >= THRESHOLD) onPull();
    springBack(p, p >= THRESHOLD ? 40 : 0);
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      onPull();
      springBack(46, 120);
    }
  };

  return (
    <div ref={root} className="sk-spider" style={{ '--rest': REST } as React.CSSProperties}>
      <span className="sk-spider__thread" aria-hidden="true" />
      <div
        className="sk-spider__body"
        role="button"
        tabIndex={0}
        aria-label="Pull the spider to change the background"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onKeyDown={key}
      >
        <svg viewBox="0 0 120 170" aria-hidden="true" focusable="false">
          <g className="sk-spider__legs" fill="none" stroke="#0b0b10" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
            {/* four legs a side, jointed: arched front pair, long rear pair */}
            <path d="M52 66 Q35 58 33 38 Q32 22 44 8" />
            <path d="M50 72 Q28 68 16 56 Q10 49 13 38" />
            <path d="M50 79 Q28 84 21 102 Q16 116 21 134" />
            <path d="M54 86 Q42 106 40 128 Q39 144 47 162" />
            <path d="M68 66 Q85 58 87 38 Q88 22 76 8" />
            <path d="M70 72 Q92 68 104 56 Q110 49 107 38" />
            <path d="M70 79 Q92 84 99 102 Q104 116 99 134" />
            <path d="M66 86 Q78 106 80 128 Q81 144 73 162" />
          </g>
          <g fill="#0b0b10">
            <circle cx="33" cy="38" r="2.9" /><circle cx="16" cy="56" r="2.9" /><circle cx="21" cy="102" r="2.9" /><circle cx="40" cy="128" r="2.9" />
            <circle cx="87" cy="38" r="2.9" /><circle cx="104" cy="56" r="2.9" /><circle cx="99" cy="102" r="2.9" /><circle cx="80" cy="128" r="2.9" />
            <ellipse cx="60" cy="68" rx="12" ry="12.5" />
            <ellipse cx="60" cy="108" rx="17.5" ry="25" />
          </g>
          <path d="M60 98 l5 8 -5 8 -5 -8z" fill="#d9302a" opacity=".92" />
          <ellipse cx="55" cy="96" rx="4.5" ry="9" fill="#fff" opacity=".1" />
        </svg>
      </div>
      <span className={`sk-spider__tag${hint ? ' is-hint' : ''}`} aria-live="polite">{label}</span>
    </div>
  );
}
