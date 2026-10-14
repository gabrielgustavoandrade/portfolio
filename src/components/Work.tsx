import { useRef } from 'react';
import { projects } from '../data/projects';
import { useStaggerReveal } from '../hooks/useStaggerReveal';
import { ProjectCard } from './ProjectCard';
import './Work.css';

export function Work({ reducedMotion }: { reducedMotion: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(gridRef, {
    selector: '.work-card',
    skip: reducedMotion,
    stagger: 100,
  });

  return (
    <section
      id="work"
      className="section section--frame work"
      aria-labelledby="work-label"
    >
      <h2 id="work-label" className="section__label micro">
        Work
      </h2>
      <div ref={gridRef} className="section__body work__grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
