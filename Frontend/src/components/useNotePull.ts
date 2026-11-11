import { useEffect, useRef } from 'react';
import type React from 'react';

const THRESHOLD = 26;   // finger pull (px) needed to fire
const MAX_PULL = 64;    // rubber-band limit (px)
const MAX_VISUAL = 0.04; // the note never travels more than this share of the stage width
const TAPE_H = 0.0417;   // tape height as a share of the stage width

/** Pull behaviour for the hero note: drag down past THRESHOLD and let go to fire `onPull`. */
export function useNotePull(onPull: (origin: { x: number; y: number }) => void) {
  const ref = useRef<HTMLButtonElement>(null);
  const st = useRef({ y0: 0, down: false, active: false, pull: 0, raf: 0 });

  // decode the cut-out images up front so nothing pops in on the first pull
  useEffect(() => {
    ['note', 'tape', 'note-patch'].forEach((n) => {
      const i = new Image();
      i.src = `/images/hero/${n}.webp`;
      i.decode?.().catch(() => {});
    });
  }, []);

  // where the ink starts: the middle of the note, in viewport pixels
  const origin = () => {
    const r = ref.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 3 };
  };

  const set = (v: number) => {
    st.current.pull = v;
    const el = ref.current;
    const stage = el?.parentElement;
    if (!el || !stage) return;
    const w = stage.clientWidth;
    const vis = v * Math.min(1, (w * MAX_VISUAL) / MAX_PULL);
    stage.style.setProperty('--np', `${vis}px`);
    stage.style.setProperty('--ns', `${1 + vis / (w * TAPE_H)}`);
    stage.classList.toggle('note-live', st.current.down || st.current.active);
    el.classList.toggle('is-armed', v >= THRESHOLD);
  };

  const spring = (from: number, v0 = 0) => {
    cancelAnimationFrame(st.current.raf);
    st.current.active = true;
    const finish = () => { st.current.active = false; set(0); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
    let x = from, v = v0, last = performance.now();
    const step = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000); last = t;
      v += (-190 * x - 25 * v) * dt;   // critically damped: no overshoot above the wall
      x += v * dt;
      if (x <= 0.3 || (Math.abs(x) < 0.4 && Math.abs(v) < 4)) return finish();
      set(x);
      st.current.raf = requestAnimationFrame(step);
    };
    st.current.raf = requestAnimationFrame(step);
  };

  function end(fire: boolean) {
    if (!st.current.down) return;
    st.current.down = false;
    ref.current?.classList.remove('is-drag');
    const p = st.current.pull;
    if (fire && p >= THRESHOLD) { onPull(origin()); spring(p, 120); } else spring(p);
  }

  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      cancelAnimationFrame(st.current.raf);
      st.current.active = false;
      st.current.down = true; st.current.y0 = e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
      ref.current?.classList.add('is-drag');
      set(st.current.pull);
    },
    onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!st.current.down) return;
      const dy = Math.max(0, e.clientY - st.current.y0);
      set(MAX_PULL * (1 - Math.exp(-dy / MAX_PULL)));
    },
    onPointerUp: () => end(true),
    onPointerCancel: () => end(false),
    onClick: (e: React.MouseEvent) => {
      // keyboard activation (Enter / Space) has detail 0; a mouse click without a pull does nothing
      if (e.detail === 0) { onPull(origin()); spring(40, 100); }
    },
  };

  return { ref, handlers };
}
