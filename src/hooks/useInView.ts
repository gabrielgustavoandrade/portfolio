import { type RefObject, useEffect, useState } from 'react';

interface UseInViewOptions {
  /** Start in view (e.g. reduced motion) and never observe. */
  skip?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/** One-shot viewport entry flag for section reveals. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  {
    skip = false,
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
  } = {} as UseInViewOptions,
) {
  const [inView, setInView] = useState(skip);

  useEffect(() => {
    if (skip) {
      setInView(true);
      return;
    }
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, skip, threshold, rootMargin]);

  return inView;
}
