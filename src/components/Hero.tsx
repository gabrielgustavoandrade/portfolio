import { useRef, useState } from 'react';
import { useEarthDock } from '../hooks/useEarthDock';
import { MOBILE_MAX_WIDTH } from '../utils/earthDock';
import { EarthCanvas } from './earth/EarthCanvas';
import { HeroDustCanvas } from './earth/HeroDustCanvas';
import './Hero.css';

export function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  const earthRef = useRef<HTMLDivElement>(null);
  const paceRef = useRef<'full' | 'idle'>('full');
  const [compact] = useState(
    () =>
      typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH,
  );

  useEarthDock({ earthRef, paceRef, reducedMotion });

  return (
    <>
      <header className={`hero${reducedMotion ? ' hero--reduced' : ''}`}>
        <div className="hero__backdrop" aria-hidden="true" />
        {!reducedMotion ? (
          <HeroDustCanvas paceRef={paceRef} compact={compact} />
        ) : null}

        <nav className="hero__nav micro" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="hero__copy">
          <h1 className="hero__name hero__rise">Gabriel Andrade</h1>
          <div className="hero__meta">
            <p className="hero__headline hero__rise">
              Senior Full Stack Engineer | AI agents in production | React,
              TypeScript, Next.js, Python
            </p>
            <p className="hero__stack micro hero__rise">
              React · TypeScript · Next.js · Python
            </p>
          </div>
        </div>

        <a className="hero__cue micro" href="#work">
          <span className="hero__cue-line" aria-hidden="true" />
          <span>Selected systems ↓</span>
        </a>
      </header>

      <div className="earth" ref={earthRef} aria-hidden="true">
        <div className="earth__intro">
          <EarthCanvas paceRef={paceRef} spin={reducedMotion ? 0 : 1} />
        </div>
      </div>
    </>
  );
}
