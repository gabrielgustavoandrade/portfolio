import { useEffect, useRef } from 'react';
import { Project } from '../data/projects';
import { getTitleSegments } from '../utils/titleSegments';
import { TransitionLink } from './TransitionLink';
import './WorkList.css';

interface WorkListProps {
  projects: Project[];
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
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [projects]);

  // Magnetic cursor effect on title words
  useEffect(() => {
    // Skip magnetic effect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = cardsRef.current?.querySelectorAll('.work-card');
    if (!cards) return;

    const handleMouseMove = (e: MouseEvent, card: Element) => {
      const titleWords = card.querySelectorAll('.work-card__title span');

      titleWords.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const wordCenterX = rect.left + rect.width / 2;
        const wordCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - wordCenterX;
        const deltaY = e.clientY - wordCenterY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 100;

        if (distance < maxDistance) {
          const strength = (1 - distance / maxDistance) * 0.15;
          const moveX = deltaX * strength;
          const moveY = deltaY * strength;

          (word as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          (word as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    };

    const handleMouseLeave = (card: Element) => {
      const titleWords = card.querySelectorAll('.work-card__title span');
      titleWords.forEach((word) => {
        (word as HTMLElement).style.transform = 'translate(0, 0)';
      });
    };

    cards.forEach((card) => {
      const mouseMoveHandler = (e: Event) => handleMouseMove(e as MouseEvent, card);
      const mouseLeaveHandler = () => handleMouseLeave(card);

      card.addEventListener('mousemove', mouseMoveHandler);
      card.addEventListener('mouseleave', mouseLeaveHandler);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleMouseMove as any);
        card.removeEventListener('mouseleave', handleMouseLeave as any);
      });
    };
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
          {projects.map((project) => {
            const titleSegments = getTitleSegments(project.slug, project.title);

            return (
              <TransitionLink
                key={project.slug}
                to={`/work/${project.slug}`}
                className="work-card"
              >
                <h3 className="work-card__title" aria-label={project.title}>
                  {titleSegments.map((segment, index) => (
                    <span
                      key={segment.id}
                      style={{ viewTransitionName: segment.viewTransitionName } as any}
                    >
                      {segment.text}
                      {index < titleSegments.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </h3>
                <p className="work-card__subtitle">{project.subtitle}</p>
                <div className="work-card__meta">
                  {project.meta.role} · {project.meta.years} · {project.meta.location}
                </div>
                <p className="work-card__summary">{project.summary}</p>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
