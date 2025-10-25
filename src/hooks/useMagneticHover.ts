import { useEffect, useRef } from 'react';

interface UseMagneticHoverOptions {
  /** Strength of the magnetic effect (0-1). Default: 0.3 */
  strength?: number;
  /** Maximum distance in pixels to trigger the effect. Default: 100 */
  maxDistance?: number;
}

/**
 * Creates a magnetic hover effect that pulls an element toward the cursor
 * when the mouse is within a specified distance.
 *
 * @param options Configuration for the magnetic effect
 * @returns Ref to attach to the target element
 *
 * @example
 * const buttonRef = useMagneticHover<HTMLButtonElement>({
 *   strength: 0.2,
 *   maxDistance: 60
 * });
 * return <button ref={buttonRef}>Click me</button>;
 */
export function useMagneticHover<T extends HTMLElement>(
  options: UseMagneticHoverOptions = {},
) {
  const { strength = 0.3, maxDistance = 100 } = options;
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

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < maxDistance) {
          const magnetStrength = (1 - distance / maxDistance) * strength;
          const moveX = deltaX * magnetStrength;
          const moveY = deltaY * magnetStrength;

          element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          element.style.transform = 'translate(0, 0)';
        }

        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      if (element) {
        element.style.transform = 'translate(0, 0)';
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, maxDistance]);

  return ref;
}
