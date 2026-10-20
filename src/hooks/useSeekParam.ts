import { useEffect, useState } from 'react';
import { parseSeek } from '../utils/fourier';

/**
 * `?<key>=0–1|end` freezes an animation for screenshots. Read after mount so
 * the prerendered HTML (which has no query string) hydrates without a mismatch.
 */
export function useSeekParam(key: string) {
  const [seek, setSeek] = useState<number | null>(null);
  useEffect(() => {
    setSeek(parseSeek(window.location.search, key));
  }, [key]);
  return seek;
}
