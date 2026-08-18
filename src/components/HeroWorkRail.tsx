import type { CSSProperties } from 'react';
import { heroWorkCards } from '../data/heroWork';
import { TransitionLink } from './TransitionLink';
import './HeroWorkRail.css';

interface HeroWorkRailProps {
  progress: number;
}

function CalendarMark() {
  return (
    <svg
      className="hero-rail__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function CardStill({ id }: { id: (typeof heroWorkCards)[number]['id'] }) {
  if (id === 'earth') {
    return (
      <div
        className="hero-rail__still hero-rail__still--earth"
        aria-hidden="true"
      >
        <div className="hero-rail__earth-sphere" />
      </div>
    );
  }

  if (id === 'smart-date-input') {
    return (
      <div
        className="hero-rail__still hero-rail__still--input"
        aria-hidden="true"
      >
        <div className="hero-rail__field">
          <span className="hero-rail__field-text">Next Friday at 9am</span>
          <span className="hero-rail__caret" />
          <CalendarMark />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-rail__still hero-rail__still--hole">
      <span className="hero-rail__hole-label">Still to come</span>
    </div>
  );
}

export function HeroWorkRail({ progress }: HeroWorkRailProps) {
  const style = {
    '--rail-progress': progress,
  } as CSSProperties;

  return (
    <ul className="hero-rail" style={style}>
      {heroWorkCards.map((card) => {
        const body = (
          <>
            <p className="hero-rail__label">
              <span>{card.index}</span> {card.title}
            </p>
            <CardStill id={card.id} />
          </>
        );

        return (
          <li
            key={card.id}
            className={`hero-rail__item${
              card.kind === 'placeholder' ? ' hero-rail__item--placeholder' : ''
            }`}
          >
            {card.kind === 'placeholder' ? (
              body
            ) : card.href.startsWith('#') ? (
              <a href={card.href} className="hero-rail__link">
                {body}
              </a>
            ) : (
              <TransitionLink to={card.href} className="hero-rail__link">
                {body}
              </TransitionLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
