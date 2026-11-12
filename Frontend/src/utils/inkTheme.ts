import { toggleTheme } from './theme';

/**
 * Ink-bleed theme change (after codemure-official/ink-bleed-theme-changer).
 *
 * The browser snapshots the page before and after the theme flips (View Transitions), and the
 * new theme is revealed through an irregular ink blot that spreads from the pulled note.
 * The blot is the same signed-distance field as the original shader (domain-warped fbm blob,
 * lobes, curling tendrils), sampled on a coarse grid every frame and traced into a clip-path.
 * No extra dependencies; browsers without View Transitions (or reduced motion) just switch.
 */

type Pt = { x: number; y: number };

const DURATION = 1.5; // seconds
const GROWTH = 0.7;
const CLEAN_FROM = 0.45;
const CLEAN_REACH = 0.4;
const A_LOBE = 0.22;
const A_BLOB = 0.2;
const A_SUM = A_LOBE + A_BLOB;
const TENDRIL = 1;
const TENDRIL_REACH = 0.24;

// ---------- periodic gradient noise (32-cell lattice, like the original texture) ----------
const CELLS = 32;
const GX = new Float32Array(CELLS * CELLS);
const GY = new Float32Array(CELLS * CELLS);
(() => {
  let a = 0x1b1eed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < GX.length; i++) {
    const r = rand() * Math.PI * 2;
    GX[i] = Math.cos(r);
    GY[i] = Math.sin(r);
  }
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function gn(px: number, py: number): number {
  const fx0 = Math.floor(px), fy0 = Math.floor(py);
  const fx = px - fx0, fy = py - fy0;
  const x0 = ((fx0 % CELLS) + CELLS) % CELLS, y0 = ((fy0 % CELLS) + CELLS) % CELLS;
  const x1 = (x0 + 1) % CELLS, y1 = (y0 + 1) % CELLS;
  const i00 = y0 * CELLS + x0, i10 = y0 * CELLS + x1, i01 = y1 * CELLS + x0, i11 = y1 * CELLS + x1;
  const n00 = GX[i00] * fx + GY[i00] * fy;
  const n10 = GX[i10] * (fx - 1) + GY[i10] * fy;
  const n01 = GX[i01] * fx + GY[i01] * (fy - 1);
  const n11 = GX[i11] * (fx - 1) + GY[i11] * (fy - 1);
  const u = fade(fx), v = fade(fy);
  const a = n00 + (n10 - n00) * u;
  const b = n01 + (n11 - n01) * u;
  return Math.max(-1, Math.min(1, (a + (b - a) * v) * 1.45));
}

function fbm(px: number, py: number, oct: number): number {
  let s = 0, a = 0.5, norm = 0;
  for (let i = 0; i < oct; i++) {
    s += a * gn(px, py);
    norm += a;
    const nx = (0.8 * px - 0.6 * py) * 2.03 + 17.13;
    py = (0.6 * px + 0.8 * py) * 2.03 + 17.13;
    px = nx;
    a *= 0.5;
  }
  return s / norm;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

interface Ctx {
  cx: number; cy: number; seedX: number; seedY: number; cos: number; sin: number;
  ref: number; R: number; cleanup: number; t: number;
}

/** Signed field in CSS px: negative = inked. Mirrors the fragment shader. */
function field(x: number, y: number, c: Ctx): number {
  const rx = x - c.cx, ry = y - c.cy;
  const d = Math.hypot(rx, ry);
  const R = c.R;
  const inner = R * (1 - A_SUM) + c.cleanup - 30;
  const outer = R * (1 + A_SUM) * (1 + TENDRIL_REACH * TENDRIL) + c.cleanup + 24;
  if (d < inner) return -50;
  if (d > outer) return 50;

  const t = c.t;
  const px = rx / c.ref, py = ry / c.ref;
  const ux = rx / Math.max(d, 1e-3), uy = ry / Math.max(d, 1e-3);
  const dx = c.cos * ux - c.sin * uy, dy = c.sin * ux + c.cos * uy;

  const qx = px * 2.4 + c.seedX, qy = py * 2.4 + c.seedY;
  const wx = fbm(qx, qy + 0.31 * t, 3);
  const wy = fbm(qx + 5.2 - 0.27 * t, qy + 1.3, 3);

  const blob = fbm(qx + 2.3 * wx + 0.12 * t, qy + 2.3 * wy - 0.08 * t, 5);
  const lx = dx * 0.9 + c.seedY * 0.37 + 0.06 * t, ly = dy * 0.9 + c.seedX * 0.37 + 0.06 * t;
  const lobes = gn(lx, ly) * 0.75 + gn(lx * 2.1 + 9.1, ly * 2.1 + 9.1) * 0.25;
  const reach = clamp(1 + A_LOBE * 1.6 * lobes + A_BLOB * 1.5 * blob, 1 - A_SUM, 1 + A_SUM);
  let f = d - R * reach;

  const gate = smooth(-0.35, 0.4, fbm(dx * 1.6 + c.seedX * 0.61 + 3.7, dy * 1.6 + c.seedY * 0.61 + 3.7, 3));
  const tx = dx * 2.2 + (d / c.ref) * 2.6 + 1.2 * wx + c.seedX * 1.7;
  const ty = dy * 2.2 - (d / c.ref) * 1.9 + 1.2 * wy + c.seedY * 1.7 + 0.18 * t;
  const n = fbm(tx, ty, 4);
  const ridge = (Math.abs(n) * Math.max(d, 24)) / 4;
  const lenN = gn(dx * 3.1 + c.seedX * 0.43 + 0.1 * t, dy * 3.1 + c.seedY * 0.43 + 0.1 * t) * 0.5 + 0.5;
  const L = TENDRIL * TENDRIL_REACH * R * gate * (0.35 + 0.65 * lenN);
  const along = clamp(f / Math.max(L, 1), 0, 1);
  const width = clamp(R * 0.022, 2.5, 9) * (1 - along * along) * gate;
  const ft = Math.max(f - L, ridge - width);
  const k = 6;
  const h = clamp(0.5 + (0.5 * (ft - f)) / k, 0, 1);
  f = ft * (1 - h) + f * h - k * h * (1 - h);
  return f - c.cleanup;
}

// ---------- marching squares -> closed loops ----------
function trace(c: Ctx, w: number, h: number, cell: number): string {
  const nx = Math.ceil(w / cell) + 3, ny = Math.ceil(h / cell) + 3; // nodes, 1 cell of margin each side
  const ox = -cell, oy = -cell;
  const v = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const edgeRing = i === 0 || j === 0 || i === nx - 1 || j === ny - 1;
    const val = field(ox + i * cell, oy + j * cell, c);
    // the outer ring (one cell outside the viewport) is always "not inked", so every contour closes
    v[j * nx + i] = edgeRing ? Math.max(val, 0.001) : val;
  }

  // edge ids: horizontal edge (i,j)->(i+1,j) = 2*(j*nx+i); vertical (i,j)->(i,j+1) = 2*(j*nx+i)+1
  const pts = new Map<number, Pt>();
  const edge = (e: number): number => {
    if (!pts.has(e)) {
      const horiz = (e & 1) === 0;
      const n = e >> 1;
      const i = n % nx, j = (n / nx) | 0;
      const a = v[n];
      const b = horiz ? v[n + 1] : v[n + nx];
      const t = a / (a - b);
      pts.set(e, horiz ? { x: ox + (i + t) * cell, y: oy + j * cell } : { x: ox + i * cell, y: oy + (j + t) * cell });
    }
    return e;
  };
  const next = new Map<number, number>();
  const link = (a: number, b: number) => next.set(edge(a), edge(b));

  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const n = j * nx + i;
      const a = v[n] < 0, b = v[n + 1] < 0, d = v[n + nx] < 0, e = v[n + nx + 1] < 0; // tl, tr, bl, br
      const top = 2 * n, left = 2 * n + 1, right = 2 * (n + 1) + 1, bottom = 2 * (n + nx);
      const code = (a ? 1 : 0) | (b ? 2 : 0) | (e ? 4 : 0) | (d ? 8 : 0);
      // inside on the left of travel direction
      switch (code) {
        case 1: link(left, top); break;
        case 2: link(top, right); break;
        case 3: link(left, right); break;
        case 4: link(right, bottom); break;
        case 5: { // saddle: tl & br inked
          const centre = (v[n] + v[n + 1] + v[n + nx] + v[n + nx + 1]) / 4 < 0;
          if (centre) { link(left, bottom); link(right, top); } else { link(left, top); link(right, bottom); }
          break;
        }
        case 6: link(top, bottom); break;
        case 7: link(left, bottom); break;
        case 8: link(bottom, left); break;
        case 9: link(bottom, top); break;
        case 10: { // saddle: tr & bl inked
          const centre = (v[n] + v[n + 1] + v[n + nx] + v[n + nx + 1]) / 4 < 0;
          if (centre) { link(top, left); link(bottom, right); } else { link(top, right); link(bottom, left); }
          break;
        }
        case 11: link(bottom, right); break;
        case 12: link(right, left); break;
        case 13: link(right, top); break;
        case 14: link(top, left); break;
      }
    }
  }

  let out = '';
  const seen = new Set<number>();
  const f1 = (n: number) => Math.round(n * 10) / 10;
  for (const start of next.keys()) {
    if (seen.has(start)) continue;
    let e = start;
    let first = true;
    for (let guard = 0; guard < 20000; guard++) {
      seen.add(e);
      const p = pts.get(e)!;
      out += (first ? 'M' : 'L') + f1(p.x) + ' ' + f1(p.y) + ' ';
      first = false;
      const nxt = next.get(e);
      if (nxt === undefined || nxt === start) break;
      e = nxt;
    }
    out += 'Z ';
  }
  return out || 'M0 0Z';
}

// ---------- the transition ----------
let busy = false;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const toggleThemeInk = (origin?: Pt) => inkChange(toggleTheme, origin);

/** Runs `apply` (any synchronous DOM/state change) and reveals its result through the ink blot. */
export function inkChange(apply: () => void, origin?: Pt): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
  if (busy || !doc.startViewTransition || reduced()) {
    apply();
    return;
  }
  busy = true;
  const root = document.documentElement;
  const w = root.clientWidth, h = root.clientHeight;
  const o = origin ?? { x: w / 2, y: h / 3 };
  const maxDist = Math.max(Math.hypot(o.x, o.y), Math.hypot(w - o.x, o.y), Math.hypot(o.x, h - o.y), Math.hypot(w - o.x, h - o.y)) + 4;
  const ang = Math.random() * Math.PI * 2;
  const ctx: Ctx = {
    cx: o.x, cy: o.y, seedX: Math.random() * 64 - 32, seedY: Math.random() * 64 - 32,
    cos: Math.cos(ang), sin: Math.sin(ang), ref: Math.max(w, h), R: 0, cleanup: 0, t: 0,
  };
  const cell = clamp(Math.max(w, h) / 120, 8, 14);
  const full = `M-20 -20 L${w + 20} -20 L${w + 20} ${h + 20} L-20 ${h + 20} Z`;

  root.style.setProperty('--ink', '"M0 0Z"');
  root.classList.add('ink-run');

  const vt = doc.startViewTransition(apply);
  const done = () => {
    root.classList.remove('ink-run');
    root.style.removeProperty('--ink');
    busy = false;
  };
  vt.finished.then(done, done);

  vt.ready.then(() => {
    // keeps the transition alive while we drive the clip-path ourselves
    root.animate([{ opacity: 1 }, { opacity: 1 }], { duration: (DURATION + 0.35) * 1000, pseudoElement: '::view-transition-new(root)' });
    const t0 = performance.now();
    const step = (now: number) => {
      const time = (now - t0) / 1000;
      const lin = Math.min(1, time / DURATION);
      const p = 1 - Math.pow(1 - lin, 3);
      const ramp = Math.max(0, (lin - CLEAN_FROM) / (1 - CLEAN_FROM));
      ctx.t = time;
      ctx.R = p * maxDist * GROWTH;
      ctx.cleanup = ramp * ramp * maxDist * CLEAN_REACH + Math.max(0, (lin - 0.97) / 0.03) * maxDist;
      const path = lin >= 1 ? full : trace(ctx, w, h, cell);
      root.style.setProperty('--ink', JSON.stringify(path));
      if (lin < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, done);
}
