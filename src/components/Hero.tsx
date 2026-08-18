import { type CSSProperties, useRef } from 'react';
import { usePinnedProgress } from '../hooks/usePinnedProgress';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { getGlobePose, getRailProgress } from '../utils/heroMotion';
import { EarthCanvas } from './earth/EarthCanvas';
import { HeroWorkRail } from './HeroWorkRail';
import './Hero.css';

export function Hero() {
  const pinRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { progress, viewportWidth, viewportHeight } = usePinnedProgress(
    pinRef,
    { disabled: reducedMotion },
  );
  const pose = getGlobePose(progress, viewportWidth, viewportHeight);
  const railProgress = reducedMotion ? 1 : getRailProgress(progress);

  return (
    <section
      ref={pinRef}
      className={`hero${reducedMotion ? ' hero--reduced' : ''}${
        railProgress > 0.55 ? ' hero--rail-live' : ''
      }`}
      style={{ '--hero-progress': progress } as CSSProperties}
      aria-label="Introduction"
    >
      <div className="hero__sticky">
        <nav className="hero__nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#build-log">Lab</a>
        </nav>

        <div className="hero__copy">
          <div className="hero__title-clip">
            <h1 className="hero__title">Gabriel Andrade</h1>
          </div>
          <p className="hero__lede">Commerce, built for speed.</p>
          <p className="hero__kicker">
            Software Engineer | Agent systems — traces, latency, cost, evals
          </p>
        </div>

        <div
          className={`hero__globe${pose.interactive ? '' : ' hero__globe--quiet'}`}
          style={{
            width: pose.size,
            height: pose.size,
            transform: `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`,
          }}
          aria-hidden="true"
        >
          <EarthCanvas />
        </div>

        <HeroWorkRail progress={railProgress} />
      </div>
    </section>
  );
}
