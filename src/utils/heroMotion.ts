export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Shared ease — cubic in-out. No bounce, no elastic. */
export function easeMotion(t: number) {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/**
 * Time constant for the pin scrub. Visual progress trails native
 * scroll by about this many seconds — same idea as ScrollTrigger
 * `scrub: 0.8`.
 */
export const MOTION = {
  scrubSeconds: 0.8,
  settleEpsilon: 0.0007,
  titleHold: 0.1,
  titleEnd: 0.4,
  titleLeaveVh: 0.28,
  ledeStart: 0.05,
  ledeEnd: 0.36,
  ledeLiftPx: 14,
  globeStart: 0,
  globeEnd: 1,
  railStart: 0.44,
  railEnd: 0.92,
  railStagger: 0.045,
  railShiftX: 28,
  railShiftYVh: 0.84,
  railItemLift: 20,
  idleScale: 0.42,
} as const;

export function windowProgress(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return easeMotion((progress - start) / (end - start));
}

export function damp(
  current: number,
  target: number,
  dt: number,
  seconds: number,
) {
  if (seconds <= 0) return target;
  return current + (target - current) * (1 - Math.exp(-dt / seconds));
}

export interface GlobePose {
  size: number;
  scale: number;
  translateX: number;
  translateY: number;
  visualX: number;
  visualY: number;
  interactive: boolean;
}

export function getGlobeLayout(viewportWidth: number, viewportHeight: number) {
  const isMobile = viewportWidth < 720;
  const size = Math.min(
    viewportWidth * (isMobile ? 0.92 : 0.78),
    viewportHeight * (isMobile ? 0.5 : 0.64),
    isMobile ? 400 : 760,
  );
  const endSize = isMobile ? 68 : 104;
  const startX = (viewportWidth - size) / 2;
  const startY = viewportHeight * (isMobile ? 0.5 : 0.4);
  const inset = isMobile ? 16 : 56;
  const endX = inset;
  const endY = isMobile ? 20 : 40;

  return {
    size,
    endSize,
    startX,
    startY,
    endX,
    endY,
    startCenterX: startX + size / 2,
    startCenterY: startY + size / 2,
    endCenterX: endX + endSize / 2,
    endCenterY: endY + endSize / 2,
  };
}

/**
 * Sphere-preserving pose. `t` is already eased. Scale and translation
 * share one center so the Earth shrinks in place as it travels —
 * not a top-left layout jump.
 */
export function getGlobePose(
  progress: number,
  viewportWidth: number,
  viewportHeight: number,
): GlobePose {
  const t = windowProgress(progress, MOTION.globeStart, MOTION.globeEnd);
  const layout = getGlobeLayout(viewportWidth, viewportHeight);
  const scale = 1 - t * (1 - layout.endSize / layout.size);
  const centerX =
    layout.startCenterX + (layout.endCenterX - layout.startCenterX) * t;
  const centerY =
    layout.startCenterY + (layout.endCenterY - layout.startCenterY) * t;
  const translateX = centerX - layout.size / 2;
  const translateY = centerY - layout.size / 2;

  return {
    size: layout.size,
    scale,
    translateX,
    translateY,
    visualX: translateX + ((1 - scale) * layout.size) / 2,
    visualY: translateY + ((1 - scale) * layout.size) / 2,
    interactive: t < 0.32,
  };
}

export function getTitleLeave(progress: number) {
  if (progress <= MOTION.titleHold) return 0;
  return windowProgress(progress, MOTION.titleHold, MOTION.titleEnd);
}

export function getLedeLeave(progress: number) {
  return windowProgress(progress, MOTION.ledeStart, MOTION.ledeEnd);
}

export function getRailProgress(progress: number) {
  return windowProgress(progress, MOTION.railStart, MOTION.railEnd);
}

export function getRailItemProgress(progress: number, index: number) {
  const delay = index * MOTION.railStagger;
  return windowProgress(progress, MOTION.railStart + delay, MOTION.railEnd);
}
