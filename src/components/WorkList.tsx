import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';
import { useEnterList } from '../hooks/useEnterList';
import { LiveSmartDateInput } from './LiveSmartDateInput';
import { RailLabel } from './system/RailLabel';
import { SectionHeader } from './system/SectionHeader';
import { TransitionLink } from './TransitionLink';
import './WorkList.css';

interface WorkListProps {
  projects: Project[];
  id?: string;
  index?: string;
  title?: string;
  subtitle?: string;
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const ordinal = String(index + 1).padStart(2, '0');
  const label = <RailLabel index={ordinal}>{project.title}</RailLabel>;

  return (
    <article
      className="work-card enter"
      data-enter
      style={{ '--enter-delay': `${index * 45}ms` } as CSSProperties}
    >
      {project.slug === 'smart-date-input' ? (
        <>
          <TransitionLink
            to={`/work/${project.slug}`}
            className="sys-card-block"
          >
            {label}
          </TransitionLink>
          <div className="sys-card sys-card--live">
            <LiveSmartDateInput />
          </div>
        </>
      ) : (
        <TransitionLink to={`/work/${project.slug}`} className="sys-card-block">
          {label}
          <p className="sys-kicker">{project.subtitle}</p>
        </TransitionLink>
      )}
      <p className="sys-kicker">{project.summary}</p>
      {project.links && project.links.length > 0 && (
        <div className="work-card__links">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sys-link sys-link--muted"
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
  index = '01',
  title = 'Selected Work',
  subtitle = 'Products and systems I helped design and build.',
}: WorkListProps) {
  const rootRef = useEnterList();

  return (
    <section className="sys-section" id={id} ref={rootRef}>
      <div className="sys-section__inner">
        <SectionHeader index={index} title={title}>
          <p className="sys-kicker">{subtitle}</p>
        </SectionHeader>

        <div className="sys-grid">
          {projects.map((project, cardIndex) => (
            <WorkCard key={project.slug} project={project} index={cardIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}
