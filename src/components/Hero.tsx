import { useRef } from 'react';
import { useHeroMotion } from '../hooks/useHeroMotion';
import { useIsNarrowViewport } from '../hooks/useIsNarrowViewport';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { EarthCanvas } from './earth/EarthCanvas';
import { HeroDustCanvas } from './earth/HeroDustCanvas';
import { HeroWorkRail } from './HeroWorkRail';
import './Hero.css';

export function Hero() {
  const pinRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const paceRef = useRef<'full' | 'idle'>('full');
  const reducedMotion = usePrefersReducedMotion();
  const narrow = useIsNarrowViewport();
  const { phase, railLive } = useHeroMotion({
    reducedMotion,
    staticLayout: narrow,
    pinRef,
    globeRef,
    copyRef,
    titleRef,
    kickerRef,
    railRef,
    paceRef,
  });

  return (
    <section
      ref={pinRef}
      className={`hero${narrow ? ' hero--mobile' : ''}${
        reducedMotion && !narrow ? ' hero--reduced' : ''
      }${railLive && !narrow ? ' hero--rail-live' : ''}${
        !narrow && phase === 'pin' ? ' hero--pinned' : ''
      }${!narrow && phase === 'end' ? ' hero--released' : ''}`}
      aria-label="Introduction"
    >
      <div className="hero__sticky">
        <nav className="hero__nav" aria-label="Primary">
          <a className="sys-link" href="#work">
            Work
          </a>
          <a className="sys-link" href="#about">
            About
          </a>
          <a className="sys-link" href="#build-log">
            Lab
          </a>
        </nav>

        <div className="hero__copy" ref={copyRef}>
          <div className="hero__title-clip">
            <h1 className="hero__title" ref={titleRef}>
              Gabriel Andrade
            </h1>
          </div>
          {/*
            One-line lede slot. Wait for Gabriel's line.
            Do not invent a slogan.
          */}
          <p className="sys-kicker hero__kicker" ref={kickerRef}>
            Software Engineer | Agent systems — traces, latency, cost, evals
          </p>
        </div>

        {!reducedMotion ? (
          <HeroDustCanvas paceRef={paceRef} compact={narrow} />
        ) : null}

        <div className="hero__globe" ref={globeRef} aria-hidden="true">
          <EarthCanvas paceRef={paceRef} />
        </div>

        <HeroWorkRail ref={railRef} />
      </div>
    </section>
  );
}
