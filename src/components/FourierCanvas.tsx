import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import {
  buildCapybaraSeries,
  evaluate,
  type FourierSeries,
  frameAt,
  STAGES,
  TOTAL_SECONDS,
} from '../utils/fourier';

/** Logical canvas units; the canvas scales to fit its box. */
const W = 1280;
const H = 1120;
/** Drawing center, x-chain row, y-chain column (see the study's layout). */
const OX = 840;
const OY = 860;
const XCY = 330;
const YCX = 230;
const TRACE_STEPS = 600;

const CREAM = '#f2ebe0';
const DUST = '#d7e4ff';
const MUTE = '#8b93a7';

type Trace = Float32Array;

function hexAlpha(hex: string, alpha: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Phasor chain; rotation 0 → the horizontal component is the signal. */
function drawChain(
  g: CanvasRenderingContext2D,
  terms: number,
  t: number,
  cos: Float64Array,
  sin: Float64Array,
  ox: number,
  oy: number,
  rotation: number,
  color: string,
) {
  let x = ox;
  let y = oy;
  g.lineWidth = 1.4;
  const ring = hexAlpha(color, 0.3);
  const arm = hexAlpha(color, 0.85);
  for (let k = 1; k <= terms; k++) {
    const r = Math.hypot(cos[k], sin[k]);
    if (r < 0.3 && k > 12) continue;
    const phase = k * t - Math.atan2(sin[k], cos[k]);
    const dx = r * Math.cos(phase + rotation);
    const dy = r * Math.sin(phase + rotation);
    g.strokeStyle = ring;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = arm;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + dx, y + dy);
    g.stroke();
    x += dx;
    y += dy;
  }
  return [x, y] as const;
}

function traceFor(series: FourierSeries, terms: number, cache: Map<number, Trace>) {
  let trace = cache.get(terms);
  if (!trace) {
    trace = new Float32Array((TRACE_STEPS + 1) * 2);
    for (let i = 0; i <= TRACE_STEPS; i++) {
      const [x, y] = evaluate(series, terms, (2 * Math.PI * i) / TRACE_STEPS);
      trace[i * 2] = x;
      trace[i * 2 + 1] = y;
    }
    cache.set(terms, trace);
  }
  return trace;
}

function drawFrame(
  g: CanvasRenderingContext2D,
  series: FourierSeries,
  cache: Map<number, Trace>,
  seconds: number,
) {
  const { terms, angle } = frameAt(seconds);
  g.clearRect(0, 0, W, H);

  // Target silhouette
  g.beginPath();
  series.outline.forEach(([x, y], i) => {
    if (i) g.lineTo(OX + x, OY + y);
    else g.moveTo(OX + x, OY + y);
  });
  g.closePath();
  g.fillStyle = hexAlpha(CREAM, 0.06);
  g.fill();

  // Trace so far
  const trace = traceFor(series, terms, cache);
  const [px, py] = evaluate(series, terms, angle);
  const last = Math.floor((angle / (2 * Math.PI)) * TRACE_STEPS);
  g.save();
  g.strokeStyle = CREAM;
  g.lineWidth = 4;
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.shadowColor = hexAlpha(DUST, 0.55);
  g.shadowBlur = 14;
  g.beginPath();
  g.moveTo(OX + trace[0], OY + trace[1]);
  for (let i = 1; i <= last; i++) {
    g.lineTo(OX + trace[i * 2], OY + trace[i * 2 + 1]);
  }
  g.lineTo(OX + px, OY + py);
  g.stroke();
  g.restore();

  const sx = OX + px;
  const sy = OY + py;
  const [ex, ey] = drawChain(
    g,
    terms,
    angle,
    series.a,
    series.b,
    OX + series.a[0],
    XCY,
    0,
    DUST,
  );
  const [fx, fy] = drawChain(
    g,
    terms,
    angle,
    series.c,
    series.d,
    YCX,
    OY + series.c[0],
    Math.PI / 2,
    MUTE,
  );

  g.setLineDash([10, 10]);
  g.lineWidth = 1.6;
  g.strokeStyle = hexAlpha(DUST, 0.5);
  g.beginPath();
  g.moveTo(ex, ey);
  g.lineTo(sx, sy);
  g.stroke();
  g.strokeStyle = hexAlpha(MUTE, 0.6);
  g.beginPath();
  g.moveTo(fx, fy);
  g.lineTo(sx, sy);
  g.stroke();
  g.setLineDash([]);

  for (const [x, y, color] of [
    [ex, ey, DUST],
    [fx, fy, MUTE],
    [sx, sy, CREAM],
  ] as const) {
    g.fillStyle = color;
    g.beginPath();
    g.arc(x, y, 7, 0, Math.PI * 2);
    g.fill();
  }

  return terms;
}

/**
 * Live epicycle drawing. Plays once when scrolled into view, holds the
 * finished capybara. `seek` (0–1) freezes the timeline for screenshots;
 * reduced motion shows the finished drawing.
 */
export function FourierCanvas({
  reducedMotion,
  seek = null,
}: {
  reducedMotion: boolean;
  seek?: number | null;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);
  const frozen = reducedMotion || seek !== null;
  const inView = useInView(boxRef, { threshold: 0.35, skip: frozen });

  // `run` restarts the timeline (Replay).
  // biome-ignore lint/correctness/useExhaustiveDependencies: run is a restart key
  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas?.getContext('2d');
    if (!canvas || !g) return;

    const series = buildCapybaraSeries();
    const cache = new Map<number, Trace>();

    const fitCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(((width * H) / W) * ratio);
      g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    };

    let seconds = frozen
      ? (seek ?? 1) * TOTAL_SECONDS
      : 0;
    const paint = () => {
      const terms = drawFrame(g, series, cache, seconds);
      if (counterRef.current) {
        counterRef.current.textContent = String(terms);
      }
    };

    fitCanvas();
    paint();
    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            fitCanvas();
            paint();
          });
    resize?.observe(canvas);

    if (frozen || !inView) {
      setDone(frozen);
      return () => resize?.disconnect();
    }

    setDone(false);
    let frame = 0;
    let last = 0;
    let visible = true;
    const visibility =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !frame && seconds < TOTAL_SECONDS) {
              last = 0;
              frame = requestAnimationFrame(tick);
            }
          });
    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      seconds += last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      paint();
      if (seconds >= TOTAL_SECONDS) {
        setDone(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    visibility?.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      visibility?.disconnect();
      resize?.disconnect();
    };
  }, [frozen, seek, inView, run]);

  return (
    <div ref={boxRef} className="fourier__stage">
      <canvas
        ref={canvasRef}
        className="fourier__canvas"
        role="img"
        aria-label="A capybara outline traced by two chains of rotating circles, one per axis."
      />
      <div className="fourier__hud">
        <p className="fourier__count">
          N = <span ref={counterRef}>{STAGES[STAGES.length - 1]}</span>
          <span className="fourier__count-unit"> circles per axis</span>
        </p>
        {!frozen ? (
          <button
            type="button"
            className="pill fourier__replay"
            onClick={() => setRun((value) => value + 1)}
            disabled={!done}
          >
            Replay
          </button>
        ) : null}
      </div>
    </div>
  );
}
