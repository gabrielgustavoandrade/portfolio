import { useEffect, useState } from 'react';
import './Hero.css';

interface HeroProps {
  onWorkClick: () => void;
  onContactClick: () => void;
}

export function Hero({ onWorkClick, onContactClick }: HeroProps) {
  const [showScrollCue, setShowScrollCue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollCue(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Gabriel Andrade</h1>
        <p className="hero__subtitle">
          Frontend / Full-stack Engineer crafting fast, aesthetic, reliable
          interfaces.
        </p>
        <p className="hero__tagline">I build software that feels invisible.</p>

        <div className="hero__cta">
          <button
            type="button"
            className="button button--primary"
            onClick={onWorkClick}
            aria-label="Navigate to selected work section"
          >
            See my work
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={onContactClick}
            aria-label="Navigate to contact section"
          >
            Contact
          </button>
        </div>

        {showScrollCue && (
          <div className="hero__scroll-cue" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
