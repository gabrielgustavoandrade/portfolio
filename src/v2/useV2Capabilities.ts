import { useEffect, useState } from 'react';

export interface V2Capabilities {
  live3d: boolean;
  reducedMotion: boolean;
  ready: boolean;
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function readCapabilities(): Omit<V2Capabilities, 'ready'> {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 720px)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const lowMemory = typeof memory === 'number' && memory <= 2;
  const live3d = hasWebGL() && !coarsePointer && !narrow && !lowMemory;

  return { live3d, reducedMotion };
}

export function useV2Capabilities() {
  const [capabilities, setCapabilities] = useState<V2Capabilities>({
    live3d: false,
    reducedMotion: false,
    ready: false,
  });

  useEffect(() => {
    const update = () => {
      setCapabilities({ ...readCapabilities(), ready: true });
    };

    update();

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const width = window.matchMedia('(max-width: 720px)');
    motion.addEventListener('change', update);
    coarse.addEventListener('change', update);
    width.addEventListener('change', update);
    window.addEventListener('resize', update);

    return () => {
      motion.removeEventListener('change', update);
      coarse.removeEventListener('change', update);
      width.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return capabilities;
}
