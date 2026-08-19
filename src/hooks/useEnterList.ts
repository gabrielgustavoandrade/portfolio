import { useLayoutEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const onscreen = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
};

export function useEnterList() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = [...root.querySelectorAll<HTMLElement>('[data-enter]')];
    if (items.length === 0) return;

    const reveal = (element: Element) => {
      element.classList.add('is-in');
    };

    if (reduced) {
      for (const item of items) {
        reveal(item);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    const sync = () => {
      for (const item of items) {
        if (item.classList.contains('is-in')) continue;
        if (onscreen(item)) {
          reveal(item);
          observer.unobserve(item);
        } else {
          observer.observe(item);
        }
      }
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [reduced]);

  return rootRef;
}
