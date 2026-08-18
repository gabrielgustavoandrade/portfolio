import { type RefObject, useEffect, useState } from 'react';

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

interface UsePinnedProgressOptions {
  /** When true, skip the pin and lock to the end pose. */
  disabled?: boolean;
}

interface PinnedProgress {
  progress: number;
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
    viewportWidth: typeof window === 'undefined' ? 1280 : window.innerWidth,
    viewportHeight: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    if (disabled) {
      setState((current) => ({
        ...current,
        progress: 1,
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
        setState({ progress: 0, viewportWidth, viewportHeight });
        return;
      }

      const scrollable = height - viewportHeight;

      if (scrollable <= 0) {
        setState({ progress: 1, viewportWidth, viewportHeight });
        return;
      }

      const traveled = -element.getBoundingClientRect().top;
      setState({
        progress: clamp(traveled / scrollable),
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
