import { useCallback, useSyncExternalStore } from 'react';

/**
 * Live `matchMedia` result. The server (and hydration) always sees `false`,
 * so prerendered HTML hydrates cleanly and the real value lands right after.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
