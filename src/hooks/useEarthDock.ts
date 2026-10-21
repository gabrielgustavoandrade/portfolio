import type { MutableRefObject, RefObject } from 'react';
import { EARTH_FILL } from '../components/earth/earthGeometry';
import {
  DOCK_SETTLE_EPSILON,
  DOCK_SMOOTH_SECONDS,
  damp,
  type EarthFrame,
  getDockProgress,
  getEarthFrame,
} from '../utils/earthDock';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Space between the hero copy and the globe, and above the bottom cue. */
const HERO_GAP_PX = 20;
const HERO_BOTTOM_PX = 64;
const HERO_MIN_DIAMETER = 220;
const HERO_WIDTH_FRACTION = 0.9;

/** Matches the 200ms cross-fade in `.earth`. */
const REDUCED_FADE_MS = 200;


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

    // Phones: no scroll-linked motion at all (iOS Safari stuttered it).
    // The globe is rendered inside the hero (see Hero.tsx) and sized and
    // placed in plain pixels from the hero's real box: centered, fully
    // framed, between the name and the bottom cue. Re-placed whenever the
    // hero or copy box changes, because WebKit can run this before layout
    // settles (it read ~220px for a 664px hero and parked the globe off
    // the top-left).
    const hero = heroRef.current;
    if (!hero) return;
    earth.classList.add('earth--hero');
    paceRef.current = 'full';
    let last = '';
    const place = () => {
      const heroBox = hero.getBoundingClientRect();
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      if (!width || !height) return;
      const copy = hero.querySelector('.hero__copy');
      const copyBottom = copy
        ? copy.getBoundingClientRect().bottom - heroBox.top
        : height * 0.4;
      const top = copyBottom + HERO_GAP_PX;
      const avail = height - top - HERO_BOTTOM_PX;
      const diameter = Math.max(
        HERO_MIN_DIAMETER,
        Math.min(width * HERO_WIDTH_FRACTION, avail),
      );
      const box = Math.round(diameter / EARTH_FILL);
      const centerY = top + diameter / 2;
      const key = `${width}x${height}:${box}:${Math.round(centerY)}`;
      if (key === last) return;
      last = key;
      earth.style.width = `${box}px`;
      earth.style.height = `${box}px`;
      earth.style.left = `${Math.round((width - box) / 2)}px`;
      earth.style.top = `${Math.round(centerY - box / 2)}px`;
      earth.style.transform = 'none';
    };
    place();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    observer?.observe(hero);
    const copy = hero.querySelector('.hero__copy');
    if (copy) observer?.observe(copy);
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', place);
      earth.classList.remove('earth--hero');
      for (const prop of ['width', 'height', 'left', 'top', 'transform']) {
        earth.style.removeProperty(prop);
      }
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
