import { useEffect, useState } from 'react';

const matches = (query: string) =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(query).matches;

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => matches(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatch(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return match;
}
