import { type RefObject, useEffect, useState } from 'react';

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

interface UsePinnedProgressOptions {
  /** When true, skip the pin and lock to the end pose. */
  disabled?: boolean;
}

export type PinPhase = 'start' | 'pin' | 'end';

interface PinnedProgress {
  progress: number;
  phase: PinPhase;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Maps scroll through a tall pin container (sticky child) to 0–1 progress.
 * Progress is 1 when the pin is exhausted or when motion is disabled.
 */
export function usePinnedProgress(
  ref: RefObject<HTMLElement | null>,
  options: UsePinnedProgressOptions = {},
): PinnedProgress {
  const { disabled = false } = options;
  const [state, setState] = useState<PinnedProgress>(() => ({
    progress: disabled ? 1 : 0,
    phase: disabled ? 'end' : 'start',
    viewportWidth: typeof window === 'undefined' ? 1280 : window.innerWidth,
    viewportHeight: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    if (disabled) {
      setState((current) => ({
        ...current,
        progress: 1,
        phase: 'end',
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      }));
      return;
    }

    let frame = 0;

    const update = () => {
      const element = ref.current;
      if (!element) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const height = element.offsetHeight;

      // jsdom and first paint can report 0. Stay on beat 1 until layout exists.
      if (height === 0) {
        setState({
          progress: 0,
          phase: 'start',
          viewportWidth,
          viewportHeight,
        });
        return;
      }

      const scrollable = height - viewportHeight;
      const rect = element.getBoundingClientRect();

      if (scrollable <= 0) {
        setState({
          progress: 1,
          phase: 'end',
          viewportWidth,
          viewportHeight,
        });
        return;
      }

      let progress = 0;
      let phase: PinPhase = 'start';

      if (rect.top > 0) {
        progress = 0;
        phase = 'start';
      } else if (rect.bottom <= viewportHeight) {
        progress = 1;
        phase = 'end';
      } else {
        progress = clamp(-rect.top / scrollable);
        phase = 'pin';
      }

      setState({
        progress,
        phase,
        viewportWidth,
        viewportHeight,
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [disabled, ref]);

  return state;
}
