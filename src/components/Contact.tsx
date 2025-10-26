import { useMagneticHover } from '../hooks/useMagneticHover';
import './Contact.css';

export function Contact() {
  const emailButtonRef = useMagneticHover<HTMLAnchorElement>({
    strength: 0.2,
    maxDistance: 60,
  });
  const linkedinButtonRef = useMagneticHover<HTMLAnchorElement>({
    strength: 0.2,
    maxDistance: 60,
  });
  const githubButtonRef = useMagneticHover<HTMLAnchorElement>({
    strength: 0.2,
    maxDistance: 60,
  });

  return (
    <section className="contact" id="contact">
      <div className="contact__container">
        <h2 className="contact__title">Let's work together.</h2>
        <p className="contact__text">
          Available for remote and hybrid roles across Europe.
        </p>

        <div className="contact__actions">
          <a
            ref={emailButtonRef}
            href="mailto:gabrielgustavoandrade@gmail.com"
            className="button button--primary"
            aria-label="Send me an email"
          >
            Email me
          </a>
          <a
            ref={linkedinButtonRef}
            href="https://www.linkedin.com/in/gabrielgustavoandrade"
            className="contact__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
            ref={githubButtonRef}
            href="https://github.com/gabrielgustavoandrade"
            className="contact__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my GitHub profile"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
