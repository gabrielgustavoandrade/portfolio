/**
 * Capybara epicycles, ported from the fourier-study sketch: a hand-placed
 * side profile, smoothed with Catmull-Rom, resampled by arc length, then
 * expanded as a real Fourier series per axis.
 */

/** Key points of the capybara (side profile, facing right). */
const KEY_POINTS: ReadonlyArray<readonly [number, number]> = [
  [60, 110], [90, 80], [150, 64], [220, 60], [268, 66], [298, 58], [304, 46],
  [316, 45], [320, 57], [352, 60], [392, 70], [412, 86], [420, 106], [413, 124],
  [396, 134], [362, 140], [334, 150], [318, 170], [312, 200], [314, 236],
  [292, 240], [288, 206], [274, 194], [200, 198], [152, 194], [144, 214],
  [146, 238], [122, 241], [114, 212], [92, 196], [66, 176], [52, 146],
];

const SPLINE_STEPS = 40;
const SAMPLES = 1000;
const SCALE = 2;
export const MAX_TERMS = 100;

/** Circles per axis, one stage each. */
export const STAGES = [1, 2, 3, 5, 10, 25, 100] as const;
export const DRAW_SECONDS = 4.2;
export const HOLD_SECONDS = 0.9;
export const STAGE_SECONDS = DRAW_SECONDS + HOLD_SECONDS;
/** Ends on the last stage's finished trace (its hold is the resting state). */
export const TOTAL_SECONDS = (STAGES.length - 1) * STAGE_SECONDS + DRAW_SECONDS;

type Point = [number, number];

function catmullRom(points: ReadonlyArray<readonly [number, number]>) {
  const out: Point[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const a = points[(i - 1 + n) % n];
    const b = points[i];
    const c = points[(i + 1) % n];
    const d = points[(i + 2) % n];
    for (let j = 0; j < SPLINE_STEPS; j++) {
      const t = j / SPLINE_STEPS;
      const t2 = t * t;
      const t3 = t2 * t;
      const axis = (q: 0 | 1) =>
        0.5 *
        (2 * b[q] +
          (-a[q] + c[q]) * t +
          (2 * a[q] - 5 * b[q] + 4 * c[q] - d[q]) * t2 +
          (-a[q] + 3 * b[q] - 3 * c[q] + d[q]) * t3);
      out.push([axis(0), axis(1)]);
    }
  }
  return out;
}

function resample(points: Point[], count: number) {
  const lengths = [0];
  for (let i = 1; i <= points.length; i++) {
    const a = points[i - 1];
    const b = points[i % points.length];
    lengths.push(lengths[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = lengths[lengths.length - 1];
  const out: Point[] = [];
  let j = 0;
  for (let i = 0; i < count; i++) {
    const s = (i * total) / count;
    while (lengths[j + 1] < s) j++;
    const f = (s - lengths[j]) / (lengths[j + 1] - lengths[j]);
    const a = points[j];
    const b = points[(j + 1) % points.length];
    out.push([a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]);
  }
  return out;
}

export interface FourierSeries {
  /** Centered, scaled outline samples. */
  outline: Point[];
  /** x(t) = A0 + Σ A_k cos kt + B_k sin kt; y(t) likewise with C, D. */
  a: Float64Array;
  b: Float64Array;
  c: Float64Array;
  d: Float64Array;
}

export function buildCapybaraSeries(): FourierSeries {
  let points = resample(catmullRom(KEY_POINTS), SAMPLES);
  let cx = 0;
  let cy = 0;
  for (const [x, y] of points) {
    cx += x;
    cy += y;
  }
  cx /= SAMPLES;
  cy /= SAMPLES;
  points = points.map(([x, y]) => [(x - cx) * SCALE, (y - cy) * SCALE]);

  const a = new Float64Array(MAX_TERMS + 1);
  const b = new Float64Array(MAX_TERMS + 1);
  const c = new Float64Array(MAX_TERMS + 1);
  const d = new Float64Array(MAX_TERMS + 1);
  for (let k = 0; k <= MAX_TERMS; k++) {
    let sa = 0;
    let sb = 0;
    let sc = 0;
    let sd = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const t = (2 * Math.PI * i) / SAMPLES;
      const co = Math.cos(k * t);
      const si = Math.sin(k * t);
      sa += points[i][0] * co;
      sb += points[i][0] * si;
      sc += points[i][1] * co;
      sd += points[i][1] * si;
    }
    const f = k ? 2 / SAMPLES : 1 / SAMPLES;
    a[k] = sa * f;
    b[k] = sb * f;
    c[k] = sc * f;
    d[k] = sd * f;
  }

  return { outline: points, a, b, c, d };
}

export function evaluate(
  series: FourierSeries,
  terms: number,
  t: number,
): Point {
  let x = series.a[0];
  let y = series.c[0];
  for (let k = 1; k <= terms; k++) {
    const co = Math.cos(k * t);
    const si = Math.sin(k * t);
    x += series.a[k] * co + series.b[k] * si;
    y += series.c[k] * co + series.d[k] * si;
  }
  return [x, y];
}

/** Cubic in-out, same curve as the study. */
export const easeInOutCubic = (u: number) =>
  u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;

export interface FourierFrameState {
  stage: number;
  terms: number;
  /** Angle drawn so far, 0 … 2π. */
  angle: number;
}

/** Timeline position (seconds) → which stage and how far it has drawn. */
export function frameAt(seconds: number): FourierFrameState {
  const clamped = Math.min(TOTAL_SECONDS, Math.max(0, seconds));
  const stage = Math.min(
    STAGES.length - 1,
    Math.floor(clamped / STAGE_SECONDS),
  );
  const local = clamped - stage * STAGE_SECONDS;
  const u = Math.min(1, Math.max(0, local / DRAW_SECONDS));
  return {
    stage,
    terms: STAGES[stage],
    angle: 2 * Math.PI * easeInOutCubic(u),
  };
}

/**
 * `?fourier=0.5` → 0.5. Accepts 0–1 (or 0–100 as a percentage);
 * anything else returns null.
 */
export function parseSeek(search: string, key: string): number | null {
  const raw = new URLSearchParams(search).get(key);
  if (raw === null || raw.trim() === '') return null;
  if (raw === 'end') return 1;
  const value = Number(raw.replace('%', ''));
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.min(1, value > 1 ? value / 100 : value);
}

/** Total radius of each axis's circle chain (for layout). */
export function chainReach(series: FourierSeries, terms = MAX_TERMS) {
  let x = 0;
  let y = 0;
  for (let k = 1; k <= terms; k++) {
    x += Math.hypot(series.a[k], series.b[k]);
    y += Math.hypot(series.c[k], series.d[k]);
  }
  return { x, y };
}
