import { useEffect, useState } from "react";
import { useMagneticHover } from "../hooks/useMagneticHover";
import "./Hero.css";
import { EarthCanvas } from "./earth/EarthCanvas";
import { HandwrittenNote } from "./HandwrittenNote";
import { HeroStarfield } from "./HeroStarfield";
import { RevealText } from "./RevealText";

interface HeroProps {
  onWorkClick: () => void;
  onContactClick: () => void;
}

export function Hero({ onWorkClick, onContactClick }: HeroProps) {
  const [showScrollCue, setShowScrollCue] = useState(false);
  const primaryButtonRef = useMagneticHover<HTMLButtonElement>({
    strength: 0.2,
    maxDistance: 60,
  });
  const secondaryButtonRef = useMagneticHover<HTMLButtonElement>({
    strength: 0.2,
    maxDistance: 60,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollCue(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <HeroStarfield />
      <div className="hero__layout">
        <div className="hero__content">
          <RevealText as="h1" className="hero__title" stagger={true} delay={0}>
            Gabriel Andrade
          </RevealText>
          <p className="hero__subtitle">
            Software Engineer | React, Node.js, TypeScript
          </p>
          <p className="hero__tagline">
            Six years designing and delivering scalable applications across
            consumer and commerce platforms. Full-stack engineer focused on
            performance, maintainability, and measurable impact.
          </p>

          <div className="hero__cta">
            <button
              ref={primaryButtonRef}
              type="button"
              className="button button--primary"
              onClick={onWorkClick}
              aria-label="Navigate to selected work section"
            >
              See my work
            </button>
            <button
              ref={secondaryButtonRef}
              type="button"
              className="button button--secondary"
              onClick={onContactClick}
              aria-label="Navigate to contact section"
            >
              Contact
            </button>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <EarthCanvas />
          <HandwrittenNote text="You can spin it!" delay={1500} />
        </div>
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
    </section>
  );
}
