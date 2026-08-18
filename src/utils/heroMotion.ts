export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export interface GlobePose {
  size: number;
  x: number;
  y: number;
  scale: number;
  interactive: boolean;
}

export function getGlobePose(
  progress: number,
  viewportWidth: number,
  viewportHeight: number,
): GlobePose {
  const t = easeInOutCubic(clamp(progress));
  const isMobile = viewportWidth < 720;
  const startSize = Math.min(
    viewportWidth * (isMobile ? 0.92 : 0.78),
    viewportHeight * (isMobile ? 0.5 : 0.64),
    isMobile ? 400 : 760,
  );
  const endSize = isMobile ? 68 : 104;
  const startX = (viewportWidth - startSize) / 2;
  const startY = viewportHeight * (isMobile ? 0.5 : 0.4);
  const endX = isMobile ? 16 : 28;
  const endY = isMobile ? 18 : 24;
  const scale = 1 - t * (1 - endSize / startSize);

  return {
    size: startSize,
    x: startX + (endX - startX) * t,
    y: startY + (endY - startY) * t,
    scale,
    interactive: t < 0.35,
  };
}

export function getRailProgress(progress: number) {
  return easeInOutCubic(clamp((progress - 0.2) / 0.8));
}
