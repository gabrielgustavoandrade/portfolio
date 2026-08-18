import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';
import { useEnterList } from '../hooks/useEnterList';
import { LiveSmartDateInput } from './LiveSmartDateInput';
import { TransitionLink } from './TransitionLink';
import './WorkList.css';

interface WorkListProps {
  projects: Project[];
  id?: string;
  title?: string;
  subtitle?: string;
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const ordinal = String(index + 1).padStart(2, '0');

  return (
    <article
      className="work-card enter"
      data-enter
      style={{ '--enter-delay': `${index * 45}ms` } as CSSProperties}
    >
      <p className="rail-label">
        <span>{ordinal}</span> {project.title}
      </p>
      {project.slug === 'smart-date-input' ? (
        <div className="work-card__still work-card__still--live">
          <LiveSmartDateInput />
        </div>
      ) : (
        <TransitionLink
          to={`/work/${project.slug}`}
          className="work-card__still"
        >
          <p className="work-card__still-text">{project.subtitle}</p>
        </TransitionLink>
      )}
      <p className="work-card__summary">{project.summary}</p>
      {project.links && project.links.length > 0 && (
        <div className="work-card__links">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="work-card__link-item"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export function WorkList({
  projects,
  id = 'work',
  title = 'Selected Work',
  subtitle = 'Products and systems I helped design and build.',
}: WorkListProps) {
  const rootRef = useEnterList();

  return (
    <section className="work-list home-block" id={id} ref={rootRef}>
      <div className="home-block__inner">
        <header className="home-block__header enter" data-enter>
          <h2 className="home-block__title">{title}</h2>
          <p className="home-block__lede">{subtitle}</p>
        </header>

        <div className="work-list__grid">
          {projects.map((project, index) => (
            <WorkCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
