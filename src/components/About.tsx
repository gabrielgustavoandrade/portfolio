import { RevealText } from "./RevealText";
import "./About.css";

export function About() {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <h2 className="about__title">About Me</h2>
        <div className="about__content">
          <RevealText
            as="p"
            className="about__paragraph"
            stagger={true}
            delay={0}
          >
            I'm a Brazilian software engineer based in Madrid.
          </RevealText>
          <RevealText
            as="p"
            className="about__paragraph"
            stagger={true}
            delay={100}
          >
            Seven years building scalable full-stack applications for consumer
            platforms, e-commerce, and financial services. I've led
            modernization projects, improved performance in high-traffic systems,
            and mentored developers across distributed teams in the US and
            Europe.
          </RevealText>
          <RevealText
            as="p"
            className="about__paragraph"
            stagger={true}
            delay={200}
          >
            My approach emphasizes clean architecture, maintainability, and
            performance—ensuring every solution is both robust and measurable.
            I work across the stack with React, Node.js, TypeScript, and modern
            tooling, focusing on reliable, user-centric products that scale.
          </RevealText>
          <RevealText
            as="p"
            className="about__paragraph about__paragraph--muted"
            stagger={true}
            delay={300}
          >
            Currently exploring new projects across Europe.
          </RevealText>
        </div>
      </div>
    </section>
  );
}
