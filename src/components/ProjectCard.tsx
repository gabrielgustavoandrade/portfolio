import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';

export function ProjectCard({ project }: { project: Project }) {
  const { image } = project;
  const imageStyle = {
    '--pos': image.position ?? '50% 50%',
    '--pos-mobile': image.mobilePosition ?? image.position ?? '50% 50%',
  } as CSSProperties;

  return (
    <article
      className={`work-card card${project.lead ? ' work-card--lead' : ''}`}
      aria-labelledby={`work-${project.slug}`}
    >
      <div className="work-card__frame">
        <div className="work-card__chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div
          className={`work-card__shot work-card__shot--${image.fit}`}
          style={imageStyle}
        >
          <picture>
            <source srcSet={`${image.src}.webp`} type="image/webp" />
            <img
              src={`${image.src}.png`}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      <div className="work-card__body">
        <div className="work-card__meta micro">
          <span>{project.index}</span>
          <span>{project.tag}</span>
        </div>
        <p className="work-card__name">{project.name}</p>
        <h3 className="work-card__title" id={`work-${project.slug}`}>
          {project.headline}
        </h3>
        {project.summary ? (
          <p className="work-card__summary">{project.summary}</p>
        ) : null}

        <div className="work-card__foot">
          {project.highlights ? (
            <ul className="work-card__pills" aria-label="Highlights">
              {project.highlights.map((item) => (
                <li key={item} className="tag">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {project.links ? (
            <div className="work-card__links">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          ) : null}

          {project.metrics ? (
            <dl className="work-card__metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </article>
  );
}
