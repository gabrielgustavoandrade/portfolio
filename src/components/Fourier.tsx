import { useMemo } from 'react';
import { parseSeek, STAGES } from '../utils/fourier';
import { FourierCanvas } from './FourierCanvas';
import './Fourier.css';

export function Fourier({ reducedMotion }: { reducedMotion: boolean }) {
  // `?fourier=0.5` freezes the drawing halfway (screenshots, reviews).
  const seek = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : parseSeek(window.location.search, 'fourier'),
    [],
  );

  return (
    <section
      id="fourier"
      className="section section--frame fourier"
      aria-labelledby="fourier-label"
    >
      <h2 id="fourier-label" className="section__label micro">
        Side project
      </h2>

      <div className="section__body section__split fourier__layout">
        <div className="section__intro">
          <div className="section__copy">
            <h3 className="section__title">Fourier series drawing</h3>
            <p className="section__lede">
              An outline drawn with a Fourier series. Each axis is a chain of
              rotating circles, and the shape gets more accurate as terms are
              added.
            </p>
          </div>

          <ul className="section__facts fourier__facts">
            <li>
              <var>x</var>(<var>t</var>) = Σ (<var>a</var>
              <sub>k</sub> cos <var>kt</var> + <var>b</var>
              <sub>k</sub> sin <var>kt</var>)
            </li>
            <li>
              <var>y</var>(<var>t</var>) = Σ (<var>c</var>
              <sub>k</sub> cos <var>kt</var> + <var>d</var>
              <sub>k</sub> sin <var>kt</var>)
            </li>
            <li>{STAGES.join(' → ')} circles per axis</li>
          </ul>
        </div>

        <figure className="section__figure fourier__figure">
          <FourierCanvas reducedMotion={reducedMotion} seek={seek} />
          <figcaption>
            Canvas 2D. 1,000 samples, up to 100 terms per axis.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
