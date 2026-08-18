import type { CSSProperties } from 'react';
import { useEnterList } from '../hooks/useEnterList';
import { SectionHeader } from './system/SectionHeader';
import './About.css';

const paragraphs = [
  "I'm a Brazilian software engineer based in Madrid.",
  "Seven years building scalable full-stack applications for consumer platforms, e-commerce, and financial services. I've led modernization projects, improved performance in high-traffic systems, and mentored developers across distributed teams in the US and Europe.",
  'My approach emphasizes clean architecture, maintainability, and performance—ensuring every solution is both robust and measurable. I work across the stack with React, Node.js, TypeScript, and modern tooling, focusing on reliable, user-centric products that scale.',
];

export function About() {
  const rootRef = useEnterList();

  return (
    <section className="sys-section" id="about" ref={rootRef}>
      <div className="sys-section__inner">
        <SectionHeader index="04" title="About Me" />
        <div className="about__content">
          {paragraphs.map((text, index) => (
            <p
              key={text}
              className="sys-body about__paragraph enter"
              data-enter
              style={{ '--enter-delay': `${index * 45}ms` } as CSSProperties}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
