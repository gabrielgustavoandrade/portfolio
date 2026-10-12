import { useMemo } from 'react';
import { HARNESS, HARNESS_SESSION } from '../data/harness';
import { parseSeek } from '../utils/fourier';
import { TerminalReplay } from './TerminalReplay';
import './Harness.css';

export function Harness({ reducedMotion }: { reducedMotion: boolean }) {
  // `?replay=end` (or 0–1) freezes the terminal for screenshots.
  const seek = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : parseSeek(window.location.search, 'replay'),
    [],
  );

  return (
    <section
      id="harness"
      className="section section--frame harness"
      aria-labelledby="harness-title"
    >
      <span className="section__label micro">Agent harness</span>

      <div className="section__body section__split harness__layout">
        <div className="section__intro">
          <div className="section__copy">
            <h2 id="harness-title" className="section__title">
              {HARNESS.name}
            </h2>
            <p className="section__lede">{HARNESS.lede}</p>
            <span className="section__note">{HARNESS.note}</span>
          </div>

          <ul className="section__facts">
            {HARNESS.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <figure className="section__figure harness__figure">
          <TerminalReplay
            steps={HARNESS_SESSION}
            title={HARNESS.name}
            reducedMotion={reducedMotion}
            seek={seek}
          />
          <figcaption>{HARNESS.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
