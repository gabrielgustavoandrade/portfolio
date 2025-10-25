import { useEffect, useRef } from 'react';

interface UseCardMagneticTitleOptions {
  strength?: number;
}

/**
 * Hook that applies magnetic hover effect to a title element
 * when hovering over its parent card element.
 *
 * @returns Tuple of [cardRef, titleRef] to be attached to the respective elements
 */
export function useCardMagneticTitle<
  TCard extends HTMLElement,
  TTitle extends HTMLElement
>(options: UseCardMagneticTitleOptions = {}) {
  const { strength = 0.1 } = options;
  const cardRef = useRef<TCard>(null);
  const titleRef = useRef<TTitle>(null);

  useEffect(() => {
    const card = cardRef.current;
    const title = titleRef.current;
    if (!card || !title) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (!title) {
          rafId = null;
          return;
        }

        const rect = title.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const moveX = deltaX * strength;
        const moveY = deltaY * strength;

        title.style.transform = `translate(${moveX}px, ${moveY}px)`;

        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      if (title) {
        title.style.transform = 'translate(0, 0)';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return [cardRef, titleRef] as const;
}
