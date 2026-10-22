import { EARTH_FILL } from '../components/earth/earthGeometry';

/**
 * Beat 1 → Beat 2: the Earth starts as the hero globe and, over the
 * first ~100vh of scroll, shrinks into the top-right corner mark where
 * it stays for the rest of the page. Poses are measured off the
 * 1440×900 and 390×844 design stills and describe the visible sphere,
 * not the canvas box.
 */

export const MOBILE_MAX_WIDTH = 720;
/** Fraction of the viewport height scrolled before the Earth is docked. */
export const DOCK_SCROLL_VH = 0.9;
export const DOCK_SMOOTH_SECONDS = 0.18;
export const DOCK_SETTLE_EPSILON = 0.0005;

export interface EarthPose {
  centerX: number;
  centerY: number;
  diameter: number;
}

export interface EarthFrame {
  boxSize: number;
  x: number;
  y: number;
  scale: number;
}

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Cubic in-out. No bounce, no elastic. */
export function easeInOutCubic(t: number) {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/** Frame-rate independent exponential smoothing toward `target`. */
export function damp(
  current: number,
  target: number,
  dt: number,
  seconds: number,
) {
  if (seconds <= 0) return target;
  return current + (target - current) * (1 - Math.exp(-dt / seconds));
}

/** Mirrors `--inset: clamp(24px, 6.67vw, 96px)`. */
export function getInset(viewportWidth: number) {
  return clamp(viewportWidth * 0.0667, 24, 96);
}

export function getHeroPose(
  viewportWidth: number,
  viewportHeight: number,
): EarthPose {
  if (viewportWidth <= MOBILE_MAX_WIDTH) {
    // 600px box at left −60, top 430 in the 390×844 still.
    const unit = viewportWidth / 390;
    return {
      centerX: 240 * unit,
      centerY: viewportHeight * 0.865,
      diameter: 566 * unit,
    };
  }

  // 860px box at right −170, top 20 in the 1440×900 still.
  const unit = Math.min(viewportWidth / 1440, viewportHeight / 900);
  return {
    centerX: viewportWidth - 260 * unit,
    centerY: viewportHeight / 2,
    diameter: 811 * unit,
  };
}

export function getDockPose(viewportWidth: number): EarthPose {
  if (viewportWidth <= MOBILE_MAX_WIDTH) {
    return { centerX: viewportWidth - 44, centerY: 44, diameter: 38 };
  }

  return {
    centerX: viewportWidth - getInset(viewportWidth) - 32,
    centerY: 76,
    diameter: 60,
  };
}

export function getDockProgress(scrollY: number, viewportHeight: number) {
  return clamp(scrollY / Math.max(1, viewportHeight * DOCK_SCROLL_VH));
}

/**
 * Transform for the fixed Earth box. While travelling the canvas keeps
 * its hero resolution and is scaled down around its center; once docked
 * the box itself shrinks so the corner mark renders at its real size.
 */
export function getEarthFrame(
  progress: number,
  viewportWidth: number,
  viewportHeight: number,
): EarthFrame {
  const hero = getHeroPose(viewportWidth, viewportHeight);
  const dock = getDockPose(viewportWidth);
  const t = easeInOutCubic(progress);
  const centerX = hero.centerX + (dock.centerX - hero.centerX) * t;
  const centerY = hero.centerY + (dock.centerY - hero.centerY) * t;
  const diameter = hero.diameter + (dock.diameter - hero.diameter) * t;

  const docked = progress >= 1;
  const boxSize = Math.round(
    (docked ? dock.diameter : hero.diameter) / EARTH_FILL,
  );
  const scale = docked ? 1 : diameter / hero.diameter;

  return {
    boxSize,
    x: centerX - boxSize / 2,
    y: centerY - boxSize / 2,
    scale,
  };
}

/**
 * Narrow screens skip the dock: the corner mark would sit on top of copy.
 * Instead the hero globe leaves upward, scrubbed 1:1 by scroll through the
 * hero. Heights come from the hero box (100svh), never `innerHeight`, so
 * the iOS address bar showing or hiding can't move the Earth.
 */
export const EXIT_MAX_WIDTH = 768;
export const EXIT_END_SCALE = 0.72;
/** Progress at which the fade starts; fully transparent at 1. */
export const EXIT_FADE_START = 0.55;
/** Past the top edge at progress 1, so the glow is gone too. */
const EXIT_MARGIN = 24;
/** Above this progress the scene renders at idle pace. */
export const EXIT_IDLE_PROGRESS = 0.3;

export interface EarthExitFrame extends EarthFrame {
  opacity: number;
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / Math.max(1e-6, edge1 - edge0));
  return x * x * (3 - 2 * x);
}

export function getExitProgress(scrollY: number, heroHeight: number) {
  return clamp(scrollY / Math.max(1, heroHeight));
}

/**
 * Position is linear in progress so the globe tracks the finger; at 1 the
 * whole (scaled) box sits above the viewport.
 */
export function getExitFrame(
  progress: number,
  viewportWidth: number,
  heroHeight: number,
): EarthExitFrame {
  const hero = getHeroPose(viewportWidth, heroHeight);
  const boxSize = Math.round(hero.diameter / EARTH_FILL);
  const p = clamp(progress);
  const scale = 1 + (EXIT_END_SCALE - 1) * p;
  const travel = hero.centerY + (boxSize * EXIT_END_SCALE) / 2 + EXIT_MARGIN;
  const centerY = hero.centerY - travel * p;

  return {
    boxSize,
    x: hero.centerX - boxSize / 2,
    y: centerY - boxSize / 2,
    scale,
    opacity: 1 - smoothstep(EXIT_FADE_START, 1, p),
  };
}
