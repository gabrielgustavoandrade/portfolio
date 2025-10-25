import { useEffect, useRef } from 'react';

interface UseGlobalMagneticHoverOptions {
  /** Strength of the magnetic effect (0-1). Default: 0.05 */
  strength?: number;
}

/**
 * Creates a global magnetic hover effect where an element subtly follows
 * the cursor position anywhere on the page.
 *
 * Unlike useMagneticHover, this effect is always active and responds to
 * cursor movement across the entire document.
 *
 * @param options Configuration for the magnetic effect
 * @returns Ref to attach to the target element
 *
 * @example
 * const titleRef = useGlobalMagneticHover<HTMLHeadingElement>({
 *   strength: 0.025
 * });
 * return <h1 ref={titleRef}>Floating Title</h1>;
 */
export function useGlobalMagneticHover<T extends HTMLElement>(
  options: UseGlobalMagneticHoverOptions = {},
) {
  const { strength = 0.05 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (!element) {
          rafId = null;
          return;
        }

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const moveX = deltaX * strength;
        const moveY = deltaY * strength;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;

        rafId = null;
      });
    };

    // Listen to the entire document
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return ref;
}
