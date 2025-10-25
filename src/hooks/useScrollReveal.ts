import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  /** Percentage of element visibility required to trigger (0-1). Default: 0.1 */
  threshold?: number;
  /** Margin around the root to adjust intersection detection. Default: '0px 0px -50px 0px' */
  rootMargin?: string;
  /** Whether the effect should trigger only once. Default: true */
  triggerOnce?: boolean;
}

/**
 * Detects when an element enters the viewport using Intersection Observer.
 * Useful for scroll-triggered animations and lazy loading.
 *
 * @param options Configuration for intersection detection
 * @returns Object containing ref and visibility state
 *
 * @example
 * const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
 *   threshold: 0.2,
 *   triggerOnce: true
 * });
 * return <div ref={ref} className={isVisible ? 'visible' : ''}>Content</div>;
 */
export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
