import { useEffect, useRef } from 'react';
import type { Project } from '../data/projects';
import './WorkDetail.css';

interface WorkDetailProps {
  project: Project;
  onClose: () => void;
}

export function WorkDetail({ project, onClose }: WorkDetailProps) {
  const detailRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Opened ${project.title} details.`;
    document.body.appendChild(announcement);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    };
  }, [project.title, onClose]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionsRef.current?.querySelectorAll(
        '.work-detail__section',
      );
      if (!sections) return;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const scrollPercent =
          (window.innerHeight - rect.top) / window.innerHeight;
        const translateY = Math.max(0, (1 - scrollPercent) * 20);

        (section as HTMLElement).style.transform =
          `translateY(${translateY}px)`;
        (section as HTMLElement).style.opacity = String(
          Math.min(1, scrollPercent * 1.5),
        );
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="work-detail" ref={detailRef}>
      <div className="work-detail__container">
        <button
          type="button"
          className="work-detail__back"
          onClick={onClose}
          aria-label="Go back to work list"
        >
          ← Back to Work
        </button>

        <article className="work-detail__content" ref={sectionsRef}>
          <h2
            ref={titleRef}
            className="work-detail__title"
            tabIndex={-1}
            aria-label={project.title}
          >
            {project.title}
          </h2>

          <p className="work-detail__subtitle">{project.subtitle}</p>

          <div className="work-detail__meta">
            {project.meta.role} · {project.meta.location}
          </div>

          <div className="work-detail__section">
            <h3 className="work-detail__section-title">Overview</h3>
            <p className="work-detail__text">{project.overview}</p>
          </div>

          <div className="work-detail__section">
            <h3 className="work-detail__section-title">Key Challenges</h3>
            <ul className="work-detail__list">
              {project.challenges.map((challenge) => (
                <li key={challenge} className="work-detail__list-item">
                  {challenge}
                </li>
              ))}
            </ul>
          </div>

          <div className="work-detail__section">
            <h3 className="work-detail__section-title">Solutions</h3>
            <ul className="work-detail__list">
              {project.solutions.map((solution) => (
                <li key={solution} className="work-detail__list-item">
                  {solution}
                </li>
              ))}
            </ul>
          </div>

          <div className="work-detail__section">
            <p className="work-detail__impact">{project.impact}</p>
          </div>

          <div className="work-detail__section">
            <h3 className="work-detail__section-title">Stack</h3>
            <div className="work-detail__stack">
              {project.stack.map((tech, index) => (
                <span
                  key={tech}
                  className="work-detail__stack-badge"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
