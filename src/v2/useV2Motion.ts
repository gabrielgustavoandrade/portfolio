import { useEffect, useState } from 'react';

export type V2Hover = 'teatro' | 'palacio' | 'work' | 'postcard' | null;

export interface V2Look {
  x: number;
  y: number;
}

export function useV2Motion(reducedMotion: boolean, ready = true) {
  const [scroll, setScroll] = useState(0);
  const [look, setLook] = useState<V2Look>({ x: 0, y: 0 });
  const [hover, setHover] = useState<V2Hover>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const [intro, setIntro] = useState(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (!ready) return;

    if (reducedMotion) {
      setIntro(1);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / 1200);
      const eased = 1 - (1 - t) ** 3;
      setIntro(eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, ready]);

  useEffect(() => {
    let frame: number | null = null;

    const readScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        readScroll();
        frame = null;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      setLook({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      });
    };

    readScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', readScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = workOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [workOpen]);

  return {
    scroll,
    look,
    hover,
    setHover,
    workOpen,
    setWorkOpen,
    intro,
  };
}
