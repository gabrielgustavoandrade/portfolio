import { forwardRef } from 'react';
import { heroWorkCards } from '../data/heroWork';
import { LiveSmartDateInput } from './LiveSmartDateInput';
import { RailLabel } from './system/RailLabel';
import { TransitionLink } from './TransitionLink';
import './HeroWorkRail.css';

function CardStill({ id }: { id: (typeof heroWorkCards)[number]['id'] }) {
  if (id === 'earth') {
    return (
      <div className="sys-card hero-rail__still--earth" aria-hidden="true">
        <div className="hero-rail__earth-sphere" />
      </div>
    );
  }

  if (id === 'smart-date-input') {
    return (
      <div className="sys-card sys-card--live">
        <LiveSmartDateInput />
      </div>
    );
  }

  return (
    <div className="sys-card hero-rail__still--hole">
      <span className="sys-kicker">Still to come</span>
    </div>
  );
}

export const HeroWorkRail = forwardRef<HTMLUListElement>(
  function HeroWorkRail(_props, ref) {
    return (
      <ul className="hero-rail" ref={ref}>
        {heroWorkCards.map((card) => {
          const label = <RailLabel index={card.index}>{card.title}</RailLabel>;

          return (
            <li
              key={card.id}
              className={`hero-rail__item${
                card.kind === 'placeholder'
                  ? ' hero-rail__item--placeholder'
                  : ''
              }${
                card.id === 'smart-date-input' ? ' hero-rail__item--live' : ''
              }`}
            >
              {card.kind === 'placeholder' ? (
                <div className="sys-card-block">
                  {label}
                  <CardStill id={card.id} />
                </div>
              ) : card.id === 'smart-date-input' ? (
                <>
                  <TransitionLink to={card.href} className="sys-card-block">
                    {label}
                  </TransitionLink>
                  <CardStill id={card.id} />
                </>
              ) : card.href.startsWith('#') ? (
                <a href={card.href} className="sys-card-block">
                  {label}
                  <CardStill id={card.id} />
                </a>
              ) : (
                <TransitionLink to={card.href} className="sys-card-block">
                  {label}
                  <CardStill id={card.id} />
                </TransitionLink>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
);
