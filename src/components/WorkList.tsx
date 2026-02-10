import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import { TransitionLink } from "./TransitionLink";
import "./WorkList.css";

interface WorkListProps {
  projects: Project[];
}

function WorkCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`work-card ${isExpanded ? 'work-card--expanded' : ''}`}>
      <div className="work-card__main">
        <TransitionLink
          to={`/work/${project.slug}`}
          className="work-card__link"
        >
          <h3 className="work-card__title" aria-label={project.title}>
            {project.title}
          </h3>
        </TransitionLink>
        <p className="work-card__subtitle">{project.subtitle}</p>
        <p className="work-card__summary">{project.summary}</p>

        <button
          type="button"
          className="work-card__preview-toggle"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={`preview-${project.slug}`}
          aria-label={isExpanded ? 'Hide preview' : 'Show preview'}
        >
          {isExpanded ? 'Hide details' : 'Show preview'}
        </button>
      </div>

      {isExpanded && (
        <div className="work-card__preview" id={`preview-${project.slug}`}>
          <div className="work-card__preview-section">
            <h4 className="work-card__preview-title">Tech Stack</h4>
            <div className="work-card__stack">
              {project.stack.map((tech) => (
                <span key={tech} className="work-card__stack-item">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="work-card__preview-section">
            <h4 className="work-card__preview-title">Key Challenges</h4>
            <ul className="work-card__list">
              {project.challenges.slice(0, 3).map((challenge, idx) => (
                <li key={idx}>{challenge}</li>
              ))}
            </ul>
          </div>

          <div className="work-card__preview-section">
            <h4 className="work-card__preview-title">Solutions</h4>
            <ul className="work-card__list">
              {project.solutions.slice(0, 3).map((solution, idx) => (
                <li key={idx}>{solution}</li>
              ))}
            </ul>
          </div>

          <TransitionLink
            to={`/work/${project.slug}`}
            className="work-card__full-link"
          >
            View full case study →
          </TransitionLink>
        </div>
      )}
    </div>
  );
}

export function WorkList({ projects }: WorkListProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".work-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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
