import './About.css';

export function About() {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <h2 className="about__title">About Me</h2>
        <div className="about__content">
          <p className="about__paragraph">
            I'm a Brazilian software engineer based in Madrid.
          </p>
          <p className="about__paragraph">
            Over six years I've worked on consumer and commerce products — blending UX thinking
            with strong engineering foundations.
          </p>
          <p className="about__paragraph">
            I focus on speed, clarity, and design systems that scale.
          </p>
          <p className="about__paragraph about__paragraph--muted">
            Currently exploring new projects across Europe.
          </p>
        </div>
      </div>
    </section>
  );
}
