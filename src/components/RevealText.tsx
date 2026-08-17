import { Fragment } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './RevealText.css';

interface RevealTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: boolean;
  delay?: number;
}

export function RevealText({
  children,
  as: Component = 'p',
  className = '',
  stagger = true,
  delay = 0,
}: RevealTextProps) {
  const { ref, isVisible } = useScrollReveal();

  if (!stagger) {
    return (
      <Component
        ref={ref as any}
        className={`reveal-text ${isVisible ? 'is-visible' : ''} ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </Component>
    );
  }

  const words = children.trim().split(/\s+/).filter(Boolean);

  return (
    <Component
      ref={ref as any}
      className={`reveal-text reveal-text--stagger ${className}`}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          <span
            className={`reveal-text__word ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: `${delay + index * 50}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Component>
  );
}
