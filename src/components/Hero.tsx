import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useEarthDock } from '../hooks/useEarthDock';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/I18nProvider';
import { EXIT_MAX_WIDTH, MOBILE_MAX_WIDTH } from '../utils/earthDock';
import { LanguageToggle } from './LanguageToggle';
import './Hero.css';

// Three.js stays out of the entry chunk: the poster paints first, the live
// scene loads after first paint and cross-fades in once its textures land.
const EarthCanvas = lazy(() =>
  import('./earth/EarthCanvas').then((module) => ({
    default: module.EarthCanvas,
  })),
);
const HeroDustCanvas = lazy(() =>
  import('./earth/HeroDustCanvas').then((module) => ({
    default: module.HeroDustCanvas,
  })),
);

/** Rendered from the live scene by scripts/render-earth-poster.mjs. */
export const EARTH_POSTER = {
  src: '/earth/poster-1600.webp',
  srcSet: '/earth/poster-800.webp 800w, /earth/poster-1600.webp 1600w',
  sizes: '(max-width: 720px) 184vw, 1030px',
} as const;

const SCENE_IDLE_TIMEOUT_MS = 1200;
/** Matches the `.earth__canvas` opacity transition in Hero.css. */
const CROSSFADE_MS = 600;

function useAfterFirstPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === 'function') {
        idle = window.requestIdleCallback(() => setReady(true), {
          timeout: SCENE_IDLE_TIMEOUT_MS,
        });
      } else {
        timer = window.setTimeout(() => setReady(true), 0);
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);
  return ready;
}

export function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  const earthRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const paceRef = useRef<'full' | 'idle'>('full');
  const [compact] = useState(
    () =>
      typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH,
  );
  const sceneAllowed = useAfterFirstPaint();
  const [earthLive, setEarthLive] = useState(false);
  const [posterGone, setPosterGone] = useState(false);

  const exit = useMediaQuery(`(max-width: ${EXIT_MAX_WIDTH}px)`);

  useEarthDock({ earthRef, heroRef, paceRef, reducedMotion, exit });

  // The canvas fades in over the poster; drop the poster once it's covered.
  useEffect(() => {
    if (!earthLive) return;
    const timer = window.setTimeout(
      () => setPosterGone(true),
      reducedMotion ? 0 : CROSSFADE_MS + 50,
    );
    return () => window.clearTimeout(timer);
  }, [earthLive, reducedMotion]);

  return (
    <>
      <header
        ref={heroRef}
        className={`hero${reducedMotion ? ' hero--reduced' : ''}`}
      >
        <div className="hero__backdrop" aria-hidden="true" />
        {!reducedMotion && sceneAllowed ? (
          <Suspense fallback={null}>
            <HeroDustCanvas paceRef={paceRef} compact={compact} />
          </Suspense>
        ) : null}

        <div className="hero__chrome">
          <nav className="hero__nav micro" aria-label={t.nav.label}>
            <a href="#work">{t.nav.work}</a>
            <a className="hero__nav-wide" href="#harness">
              {t.nav.harness}
            </a>
            <a className="hero__nav-wide" href="#projects">
              {t.nav.projects}
            </a>
            <a href="#experience">{t.nav.experience}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <LanguageToggle />
        </div>

        <div className="hero__copy">
          <h1 className="hero__name hero__rise">Gabriel Andrade</h1>
          {/* One segment per line; the pipes stay in the text for copy/paste. */}
          <p className="hero__headline hero__rise">
            {t.hero.headline.map((segment, index) => (
              <Fragment key={segment}>
                {index > 0 ? <span className="hero__sep"> | </span> : null}
                <span className="hero__segment">{segment}</span>
              </Fragment>
            ))}
          </p>
        </div>

        <a className="hero__cue micro" href="#work">
          <span className="hero__cue-line" aria-hidden="true" />
          <span>{t.nav.cue}</span>
        </a>
      </header>

      <div className="earth" ref={earthRef} aria-hidden="true">
        <div className="earth__intro">
          {!posterGone ? (
            <img
              className="earth__poster"
              src={EARTH_POSTER.src}
              srcSet={EARTH_POSTER.srcSet}
              sizes={EARTH_POSTER.sizes}
              alt=""
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />
          ) : null}
          {sceneAllowed ? (
            <Suspense fallback={null}>
              <EarthCanvas
                paceRef={paceRef}
                spin={reducedMotion ? 0 : 1}
                onReady={() => setEarthLive(true)}
                className={earthLive ? 'is-live' : undefined}
              />
            </Suspense>
          ) : null}
        </div>
      </div>
    </>
  );
}
