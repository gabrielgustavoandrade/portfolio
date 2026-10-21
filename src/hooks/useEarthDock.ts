import type { MutableRefObject, RefObject } from 'react';
import {
  DOCK_SETTLE_EPSILON,
  DOCK_SMOOTH_SECONDS,
  damp,
  type EarthFrame,
  EXIT_IDLE_PROGRESS,
  getDockProgress,
  getEarthFrame,
  getExitFrame,
  getExitProgress,
} from '../utils/earthDock';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Matches the 200ms cross-fade in `.earth`. */
const REDUCED_FADE_MS = 200;

/** Soft edge where the static globe meets the bottom of the hero. */
const STATIC_FADE_PX = 96;

interface UseEarthDockOptions {
  earthRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  paceRef: MutableRefObject<'full' | 'idle'>;
  reducedMotion: boolean;
  /** Narrow screens: scroll the globe out of the hero instead of docking. */
  exit: boolean;
}

const transformFor = (frame: EarthFrame) =>
  `translate3d(${frame.x}px, ${frame.y}px, 0) scale(${frame.scale})`;

/**
 * Drives the fixed Earth from hero globe to corner mark. Writes styles
 * directly so scrolling never re-renders React.
 */
export function useEarthDock({
  earthRef,
  heroRef,
  paceRef,
  reducedMotion,
  exit,
}: UseEarthDockOptions) {
  useIsomorphicLayoutEffect(() => {
    const earth = earthRef.current;
    if (!earth || !exit) return;

    // Cached; only a width change (rotation) re-measures, so the iOS
    // toolbar collapsing on scroll never shifts the globe.
    let width = window.innerWidth;
    let heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
    const measure = () => {
      width = window.innerWidth;
      heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
    };
    const setBox = (frame: EarthFrame) => {
      earth.style.width = `${frame.boxSize}px`;
      earth.style.height = `${frame.boxSize}px`;
    };
    const cleanupStyles = (className: string) => {
      earth.classList.remove(className);
      earth.style.removeProperty('opacity');
      earth.style.removeProperty('mask-image');
      earth.style.removeProperty('-webkit-mask-image');
    };

    if (reducedMotion) {
      // No scroll-linked motion: the globe sits in the document and
      // scrolls away with the hero. Fade it out at the hero's bottom edge
      // so it never lies over the next section.
      earth.classList.add('earth--static');
      paceRef.current = 'full';
      const place = () => {
        const frame = getExitFrame(0, width, heroHeight);
        setBox(frame);
        earth.style.transform = transformFor(frame);
        const cut = Math.max(0, heroHeight - frame.y);
        const mask = `linear-gradient(to bottom, #000 ${Math.max(0, cut - STATIC_FADE_PX)}px, transparent ${cut}px)`;
        earth.style.setProperty('mask-image', mask);
        earth.style.setProperty('-webkit-mask-image', mask);
      };
      const onResize = () => {
        if (window.innerWidth === width) return;
        measure();
        place();
      };
      place();
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        cleanupStyles('earth--static');
      };
    }

    earth.classList.add('earth--exit');
    let frameId = 0;
    let lastProgress = -1;

    const update = () => {
      frameId = 0;
      const progress = getExitProgress(window.scrollY, heroHeight);
      if (progress === lastProgress) return;
      lastProgress = progress;
      const frame = getExitFrame(progress, width, heroHeight);
      earth.style.transform = transformFor(frame);
      earth.style.opacity = `${frame.opacity}`;
      paceRef.current = progress > EXIT_IDLE_PROGRESS ? 'idle' : 'full';
    };
    const layout = () => {
      setBox(getExitFrame(0, width, heroHeight));
      lastProgress = -1;
      update();
    };
    const onScroll = () => {
      if (frameId === 0) frameId = requestAnimationFrame(update);
    };
    const onResize = () => {
      if (window.innerWidth === width) return;
      measure();
      layout();
    };

    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cleanupStyles('earth--exit');
    };
  }, [earthRef, heroRef, paceRef, reducedMotion, exit]);

  useIsomorphicLayoutEffect(() => {
    const earth = earthRef.current;
    if (!earth || exit) return;

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
      earth.style.transform = transformFor(frame);
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
        earth.classList.remove(
          'earth--fading',
          'earth--docked',
          'earth--quiet',
        );
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
      earth.classList.remove('earth--docked', 'earth--quiet');
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
    };
  }, [earthRef, paceRef, reducedMotion, exit]);
}
