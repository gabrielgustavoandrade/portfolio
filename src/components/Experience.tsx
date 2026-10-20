import { type CSSProperties, useRef } from 'react';
import { experience } from '../data/experience';
import { useInView } from '../hooks/useInView';
import { useI18n } from '../i18n/I18nProvider';
import './Experience.css';

export function Experience({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { skip: reducedMotion });

  return (
    <section
      id="experience"
      className="section section--frame experience"
      aria-labelledby="experience-label"
    >
      <h2 id="experience-label" className="section__label micro">
        {t.experience.label}
      </h2>
      <div
        ref={listRef}
        className={`section__body experience__list${inView ? ' is-in' : ''}`}
      >
        {experience.map((entry, order) => {
          const item = { ...entry, ...t.experience.items[entry.company] };
          return (
            <article
              key={item.company}
              className="experience__item"
              style={{ '--i': order } as CSSProperties}
            >
              <div className="experience__head">
                <h3 className="experience__company">{item.company}</h3>
                {item.clients ? (
                  <p className="experience__clients">{item.clients}</p>
                ) : null}
                <p className="experience__engagement micro">
                  {item.engagement}
                  <span aria-hidden="true"> · </span>
                  {item.period}
                </p>
              </div>
              <ul className="experience__points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
