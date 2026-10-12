import { type MutableRefObject, type RefObject, useLayoutEffect } from 'react';
import {
  DOCK_SETTLE_EPSILON,
  DOCK_SMOOTH_SECONDS,
  damp,
  getDockProgress,
  getEarthFrame,
} from '../utils/earthDock';

/** Matches the 200ms cross-fade in `.earth`. */
const REDUCED_FADE_MS = 200;

interface UseEarthDockOptions {
  earthRef: RefObject<HTMLDivElement | null>;
  paceRef: MutableRefObject<'full' | 'idle'>;
  reducedMotion: boolean;
}

/**
 * Drives the fixed Earth from hero globe to corner mark. Writes styles
 * directly so scrolling never re-renders React.
 */
export function useEarthDock({
  earthRef,
  paceRef,
  reducedMotion,
}: UseEarthDockOptions) {
  useLayoutEffect(() => {
    const earth = earthRef.current;
    if (!earth) return;

    let lastBox = 0;
    const readTarget = () =>
      getDockProgress(window.scrollY, window.innerHeight);

    const apply = (progress: number) => {
      const frame = getEarthFrame(
        progress,
        window.innerWidth,
        window.innerHeight,
      );
      if (frame.boxSize !== lastBox) {
        lastBox = frame.boxSize;
        earth.style.width = `${frame.boxSize}px`;
        earth.style.height = `${frame.boxSize}px`;
      }
      earth.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0) scale(${frame.scale})`;
      earth.classList.toggle('earth--docked', progress >= 1);
      earth.classList.toggle('earth--quiet', progress > 0.3);
      paceRef.current = progress > 0.5 ? 'idle' : 'full';
    };

    if (reducedMotion) {
      // No scrub: hold the hero pose, then cross-fade to the corner mark.
      let state = readTarget() >= 0.5 ? 1 : 0;
      let timer = 0;
      apply(state);

      const onScroll = () => {
        const next = readTarget() >= 0.5 ? 1 : 0;
        if (next === state) return;
        state = next;
        earth.classList.add('earth--fading');
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          apply(state);
          earth.classList.remove('earth--fading');
        }, REDUCED_FADE_MS);
      };
      const onResize = () => apply(state);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      return () => {
        window.clearTimeout(timer);
        earth.classList.remove('earth--fading');
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }

    let smoothed = readTarget();
    let frame = 0;
    let lastTime = 0;
    apply(smoothed);

    const tick = (now: number) => {
      const dt = Math.min(
        0.064,
        lastTime === 0 ? 0.016 : (now - lastTime) / 1000,
      );
      lastTime = now;
      const target = readTarget();
      const next = damp(smoothed, target, dt, DOCK_SMOOTH_SECONDS);
      const settled = Math.abs(target - next) < DOCK_SETTLE_EPSILON;
      smoothed = settled ? target : next;
      apply(smoothed);
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      if (frame !== 0) return;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      lastBox = 0;
      apply(smoothed);
      kick();
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
    };
  }, [earthRef, paceRef, reducedMotion]);
}
