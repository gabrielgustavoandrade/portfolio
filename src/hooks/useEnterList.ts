import { useLayoutEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useEnterList() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = [...root.querySelectorAll<HTMLElement>('[data-enter]')];
    if (items.length === 0) return;

    if (reduced) {
      for (const item of items) {
        item.classList.add('is-in');
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    for (const item of items) {
      observer.observe(item);
    }

    return () => observer.disconnect();
  }, [reduced]);

  return rootRef;
}
