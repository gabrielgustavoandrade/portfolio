import { useEffect, useLayoutEffect } from 'react';

/** `useLayoutEffect` in the browser, a silent no-op stand-in during prerender. */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
