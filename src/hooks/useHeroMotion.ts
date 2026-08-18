import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  clamp,
  damp,
  getGlobePose,
  getLedeLeave,
  getRailItemProgress,
  getRailProgress,
  getTitleLeave,
  MOTION,
} from '../utils/heroMotion';
export type PinPhase = 'start' | 'pin' | 'end';

export interface HeroMotionRefs {
  pinRef: RefObject<HTMLElement | null>;
  globeRef: RefObject<HTMLDivElement | null>;
  copyRef: RefObject<HTMLDivElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  ledeRef?: RefObject<HTMLParagraphElement | null>;
  kickerRef: RefObject<HTMLParagraphElement | null>;
  railRef: RefObject<HTMLUListElement | null>;
  paceRef: MutableRefObject<'full' | 'idle'>;
}

interface UseHeroMotionOptions extends HeroMotionRefs {
  reducedMotion: boolean;
}

const readTarget = (
  element: HTMLElement | null,
): { progress: number; phase: PinPhase } => {
  if (!element) {
    return { progress: 0, phase: 'start' };
  }

  const viewportHeight = window.innerHeight;
  const height = element.offsetHeight;

  if (height === 0) {
    return { progress: 0, phase: 'start' };
  }

  const scrollable = height - viewportHeight;
  const rect = element.getBoundingClientRect();

  if (scrollable <= 0) {
    return { progress: 1, phase: 'end' };
  }

  if (rect.top >= 0) {
    return { progress: 0, phase: 'start' };
  }

  if (rect.bottom <= viewportHeight) {
    return { progress: 1, phase: 'end' };
  }

  return {
    progress: clamp(-rect.top / scrollable),
    phase: 'pin',
  };
};

const applyPose = (
  refs: HeroMotionRefs,
  progress: number,
  viewportWidth: number,
  viewportHeight: number,
  lastSize: { current: number },
) => {
  const pose = getGlobePose(progress, viewportWidth, viewportHeight);
  const titleLeave = getTitleLeave(progress);
  const ledeLeave = getLedeLeave(progress);
  const rail = getRailProgress(progress);

  if (refs.globeRef.current) {
    if (lastSize.current !== pose.size) {
      lastSize.current = pose.size;
      refs.globeRef.current.style.width = `${pose.size}px`;
      refs.globeRef.current.style.height = `${pose.size}px`;
    }
    refs.globeRef.current.style.transform = `translate3d(${pose.translateX}px, ${pose.translateY}px, 0) scale(${pose.scale})`;
    refs.globeRef.current.classList.toggle(
      'hero__globe--quiet',
      !pose.interactive,
    );
  }

  if (refs.copyRef.current) {
    refs.copyRef.current.style.transform = `translate3d(-50%, ${titleLeave * -MOTION.titleLeaveVh * viewportHeight}px, 0)`;
  }

  if (refs.titleRef.current) {
    refs.titleRef.current.style.transform = `translate3d(0, ${titleLeave * -8}%, 0)`;
  }

  const ledeY = ledeLeave * -MOTION.ledeLiftPx;
  const ledeOpacity = String(1 - ledeLeave);
  if (refs.ledeRef?.current) {
    refs.ledeRef.current.style.transform = `translate3d(0, ${ledeY}px, 0)`;
    refs.ledeRef.current.style.opacity = ledeOpacity;
  }
  if (refs.kickerRef.current) {
    refs.kickerRef.current.style.transform = `translate3d(0, ${ledeY}px, 0)`;
    refs.kickerRef.current.style.opacity = ledeOpacity;
  }

  if (refs.railRef.current) {
    refs.railRef.current.style.transform = `translate3d(${(1 - rail) * MOTION.railShiftX}px, ${(1 - rail) * MOTION.railShiftYVh * viewportHeight}px, 0)`;
    const items =
      refs.railRef.current.querySelectorAll<HTMLElement>('.hero-rail__item');
    items.forEach((item, index) => {
      const itemT = getRailItemProgress(progress, index);
      item.style.transform = `translate3d(0, ${(1 - itemT) * MOTION.railItemLift}px, 0)`;
    });
  }

  refs.paceRef.current = pose.scale < MOTION.idleScale ? 'idle' : 'full';

  return { railLive: rail > 0.55 };
};

export function useHeroMotion({
  reducedMotion,
  pinRef,
  globeRef,
  copyRef,
  titleRef,
  ledeRef,
  kickerRef,
  railRef,
  paceRef,
}: UseHeroMotionOptions) {
  const refsBag = useRef<HeroMotionRefs>({
    pinRef,
    globeRef,
    copyRef,
    titleRef,
    ledeRef,
    kickerRef,
    railRef,
    paceRef,
  });
  refsBag.current = {
    pinRef,
    globeRef,
    copyRef,
    titleRef,
    ledeRef,
    kickerRef,
    railRef,
    paceRef,
  };
  const [phase, setPhase] = useState<PinPhase>(reducedMotion ? 'end' : 'start');
  const [railLive, setRailLive] = useState(reducedMotion);
  const smoothedRef = useRef(reducedMotion ? 1 : 0);
  const lastTimeRef = useRef(0);
  const lastSizeRef = useRef(0);

  useLayoutEffect(() => {
    const refs = refsBag.current;
    const target = reducedMotion
      ? { progress: 1, phase: 'end' as const }
      : readTarget(refs.pinRef.current);
    smoothedRef.current = target.progress;
    const next = applyPose(
      refs,
      target.progress,
      window.innerWidth,
      window.innerHeight,
      lastSizeRef,
    );
    setPhase(target.phase);
    setRailLive(next.railLive);
  }, [reducedMotion]);

  useEffect(() => {
    const refs = refsBag.current;
    if (reducedMotion) {
      applyPose(refs, 1, window.innerWidth, window.innerHeight, lastSizeRef);
      setPhase('end');
      setRailLive(true);
      refs.paceRef.current = 'idle';
      return;
    }

    let frame = 0;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;

      const dt = Math.min(
        0.064,
        lastTimeRef.current === 0 ? 0.016 : (now - lastTimeRef.current) / 1000,
      );
      lastTimeRef.current = now;

      const target = readTarget(refs.pinRef.current);
      const next = damp(
        smoothedRef.current,
        target.progress,
        dt,
        MOTION.scrubSeconds,
      );
      const settled = Math.abs(target.progress - next) < MOTION.settleEpsilon;
      smoothedRef.current = settled ? target.progress : next;

      const applied = applyPose(
        refs,
        smoothedRef.current,
        window.innerWidth,
        window.innerHeight,
        lastSizeRef,
      );

      setPhase((current) =>
        current === target.phase ? current : target.phase,
      );
      setRailLive((current) =>
        current === applied.railLive ? current : applied.railLive,
      );

      if (settled) {
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (frame !== 0) return;
      lastTimeRef.current = 0;
      frame = requestAnimationFrame(tick);
    };

    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, [reducedMotion]);

  return { phase, railLive };
}
