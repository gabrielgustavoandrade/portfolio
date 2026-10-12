import { type RefObject, useLayoutEffect } from 'react';

export const ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

interface StaggerRevealOptions {
  /** Children to animate, matched inside the container. */
  selector: string;
  skip?: boolean;
  /** Delay between items that enter together. */
  stagger?: number;
  duration?: number;
  fromScale?: number;
  threshold?: number;
}

/**
 * anime.js-style staggered scale-in on scroll, via WAAPI. Each item is
 * observed on its own; items crossing in the same batch share a stagger.
 * The resting state lives in CSS (`data-reveal="in"`), so the animation
 * only supplies the "from" frame and never leaves inline styles behind.
 */
export function useStaggerReveal(
  containerRef: RefObject<HTMLElement | null>,
  {
    selector,
    skip = false,
    stagger = 100,
    duration = 900,
    fromScale = 0.92,
    threshold = 0.2,
  }: StaggerRevealOptions,
) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
    const reveal = (item: HTMLElement) => {
      item.dataset.reveal = 'in';
    };

    if (
      skip ||
      typeof IntersectionObserver === 'undefined' ||
      typeof Element.prototype.animate !== 'function'
    ) {
      items.forEach(reveal);
      return;
    }

    for (const item of items) item.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => items.indexOf(a) - items.indexOf(b));
        entering.forEach((item, order) => {
          observer.unobserve(item);
          reveal(item);
          item.animate(
            [
              { opacity: 0, transform: `scale(${fromScale})` },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration,
              delay: order * stagger,
              easing: ENTER_EASING,
              fill: 'backwards',
            },
          );
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, [containerRef, selector, skip, stagger, duration, fromScale, threshold]);
}
