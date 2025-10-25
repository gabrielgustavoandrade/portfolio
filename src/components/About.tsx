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
            Over six years I've worked on consumer and commerce products —
            blending UX thinking with strong engineering foundations.
          </RevealText>
          <RevealText
            as="p"
            className="about__paragraph"
            stagger={true}
            delay={200}
          >
            I focus on speed, clarity, and design systems that scale.
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
