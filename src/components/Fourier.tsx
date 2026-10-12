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
      aria-labelledby="fourier-title"
    >
      <span className="section__label micro">Craft / math</span>

      <div className="section__body section__split fourier__layout">
        <div className="section__intro">
          <div className="section__copy">
            <h2 id="fourier-title" className="section__title">
              A capybara, in circles
            </h2>
            <p className="section__lede">
              A hand-placed outline expanded as a real Fourier series. Each axis
              is a chain of rotating circles; their tips trace the shape, and it
              sharpens as the circles per axis grow.
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
            Canvas 2D, computed in your browser: 1,000 samples, 100 terms per
            axis.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
