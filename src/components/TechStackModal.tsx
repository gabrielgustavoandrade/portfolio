import { useEffect } from 'react';
import {
  architecturalDecisions,
  buildPipeline,
  metrics,
  performanceOptimizations,
  techStack,
} from '../data/techStack';
import './TechStackModal.css';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechStackModal({ isOpen, onClose }: TechStackModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tech-modal-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="tech-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="tech-modal__header">
          <h2 className="tech-modal__title">How I Built This</h2>
          <button
            type="button"
            className="tech-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="tech-modal__content">
          {/* Metrics Overview */}
          <section className="tech-modal__section">
            <h3 className="tech-modal__section-title">Performance Metrics</h3>
            <div className="tech-modal__metrics-grid">
              <div className="tech-modal__metric-card">
                <h4>Lighthouse Scores</h4>
                <div className="tech-modal__metric-values">
                  <span>Performance: {metrics.lighthouse.performance}</span>
                  <span>Accessibility: {metrics.lighthouse.accessibility}</span>
                  <span>
                    Best Practices: {metrics.lighthouse.bestPractices}
                  </span>
                  <span>SEO: {metrics.lighthouse.seo}</span>
                </div>
              </div>
              <div className="tech-modal__metric-card">
                <h4>Core Web Vitals</h4>
                <div className="tech-modal__metric-values">
                  <span>FCP: {metrics.vitals.fcp}</span>
                  <span>LCP: {metrics.vitals.lcp}</span>
                  <span>CLS: {metrics.vitals.cls}</span>
                  <span>INP: {metrics.vitals.inp}</span>
                </div>
              </div>
              <div className="tech-modal__metric-card">
                <h4>Bundle Size</h4>
                <div className="tech-modal__metric-values">
                  <span>Total: {metrics.bundle.totalSize}</span>
                  <span>Gzipped: {metrics.bundle.gzipped}</span>
                  <span>Chunks: {metrics.bundle.chunks}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="tech-modal__section">
            <h3 className="tech-modal__section-title">Tech Stack</h3>
            <div className="tech-modal__stack-grid">
              {techStack.map((category) => (
                <div key={category.name} className="tech-modal__stack-category">
                  <h4 className="tech-modal__stack-category-name">
                    {category.name}
                  </h4>
                  <div className="tech-modal__stack-items">
                    {category.items.map((item) => (
                      <div key={item.name} className="tech-modal__stack-item">
                        <div className="tech-modal__stack-info">
                          <span className="tech-modal__stack-name">
                            {item.name}
                          </span>
                          <span className="tech-modal__stack-desc">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architectural Decisions */}
          <section className="tech-modal__section">
            <h3 className="tech-modal__section-title">
              Architectural Decisions
            </h3>
            <div className="tech-modal__decisions">
              {architecturalDecisions.map((decision) => (
                <div key={decision.title} className="tech-modal__decision">
                  <h4 className="tech-modal__decision-title">
                    {decision.title}
                  </h4>
                  <p className="tech-modal__decision-text">
                    <strong>Decision:</strong> {decision.decision}
                  </p>
                  <p className="tech-modal__decision-text">
                    <strong>Why:</strong> {decision.rationale}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Optimizations */}
          <section className="tech-modal__section">
            <h3 className="tech-modal__section-title">
              Performance Optimizations
            </h3>
            <div className="tech-modal__optimizations">
              {performanceOptimizations.map((category) => (
                <div
                  key={category.category}
                  className="tech-modal__optimization"
                >
                  <h4 className="tech-modal__optimization-title">
                    {category.category}
                  </h4>
                  <ul className="tech-modal__optimization-list">
                    {category.optimizations.map((opt) => (
                      <li key={opt}>{opt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Build Pipeline */}
          <section className="tech-modal__section">
            <h3 className="tech-modal__section-title">Build & Deployment</h3>
            <div className="tech-modal__pipeline">
              <div className="tech-modal__pipeline-stage">
                <h4>Development</h4>
                <ul>
                  {buildPipeline.development.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="tech-modal__pipeline-stage">
                <h4>Production Build</h4>
                <ul>
                  {buildPipeline.production.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="tech-modal__pipeline-stage">
                <h4>Deployment</h4>
                <ul>
                  {buildPipeline.deployment.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="tech-modal__footer">
            <p>
              <strong>Open Source:</strong> This portfolio uses only open-source
              technologies. No proprietary dependencies.
            </p>
            <p>
              <strong>Want to see more?</strong> Check out the browser console
              and Performance panel for additional technical details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
