import { useRef } from 'react';
import { projects } from '../data/projects';
import { useInView } from '../hooks/useInView';
import { ProjectCard } from './ProjectCard';
import './Work.css';

export function Work({ reducedMotion }: { reducedMotion: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { skip: reducedMotion, threshold: 0.1 });

  return (
    <section
      id="work"
      className="section section--frame work"
      aria-labelledby="work-label"
    >
      <h2 id="work-label" className="section__label micro">
        Selected systems / 2026
      </h2>
      <div
        ref={gridRef}
        className={`section__body work__grid${inView ? ' is-in' : ''}`}
      >
        {projects.map((project, order) => (
          <ProjectCard key={project.slug} project={project} order={order} />
        ))}
      </div>
    </section>
  );
}
