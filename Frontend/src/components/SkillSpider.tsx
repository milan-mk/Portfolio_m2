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
        <img
          src="/images/skill-spider.webp"
          width={364}
          height={632}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>
      <span className={`sk-spider__tag${hint ? ' is-hint' : ''}`} aria-live="polite">{label}</span>
    </div>
  );
}
