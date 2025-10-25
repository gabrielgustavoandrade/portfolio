import { useEffect, useRef } from 'react';
import { useCardMagneticTitle } from '../hooks/useCardMagneticTitle';
import type { Project } from '../data/projects';
import { TransitionLink } from './TransitionLink';
import './WorkList.css';

interface WorkListProps {
  projects: Project[];
}

function WorkCard({ project }: { project: Project }) {
  const [cardRef, titleRef] = useCardMagneticTitle<
    HTMLAnchorElement,
    HTMLHeadingElement
  >({ strength: 0.1 });

  return (
    <TransitionLink
      ref={cardRef}
      to={`/work/${project.slug}`}
      className="work-card"
    >
      <h3 ref={titleRef} className="work-card__title" aria-label={project.title}>
        {project.title}
      </h3>
      <p className="work-card__subtitle">{project.subtitle}</p>
      <div className="work-card__meta">
        {project.meta.role} · {project.meta.location}
      </div>
      <p className="work-card__summary">{project.summary}</p>
    </TransitionLink>
  );
}

export function WorkList({ projects }: WorkListProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.work-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [projects]);

  return (
    <section className="work-list" id="work">
      <div className="work-list__container">
        <div className="work-list__header">
          <h2 className="work-list__title">Selected Work</h2>
          <p className="work-list__subtitle">
            Products and systems I helped design and build.
          </p>
        </div>

        <div className="work-list__grid" ref={cardsRef}>
          {projects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
