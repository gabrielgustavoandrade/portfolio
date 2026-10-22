import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useI18n } from '../i18n/I18nProvider';
import './About.css';

export function About({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  const textRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(textRef, { skip: reducedMotion });

  return (
    <section
      id="about"
      className="section section--frame about"
      aria-labelledby="about-label"
    >
      <h2 id="about-label" className="section__label micro">
        {t.about.label}
      </h2>
      <p
        ref={textRef}
        className={`section__body about__text${inView ? ' is-in' : ''}`}
      >
        {t.about.text}
      </p>
    </section>
  );
}
