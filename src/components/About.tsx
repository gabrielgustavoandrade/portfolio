import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import './About.css';

export function About({ reducedMotion }: { reducedMotion: boolean }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(textRef, { skip: reducedMotion });

  return (
    <section
      id="about"
      className="section section--frame about"
      aria-labelledby="about-label"
    >
      <h2 id="about-label" className="section__label micro">
        About
      </h2>
      <p
        ref={textRef}
        className={`section__body about__text${inView ? ' is-in' : ''}`}
      >
        Brazilian senior full stack engineer. Seven years building scalable
        full-stack applications for consumer platforms, e-commerce and financial
        services; led modernization projects, improved performance in
        high-traffic systems, mentored developers across distributed teams in
        the US and Europe.
      </p>
    </section>
  );
}
