import { useEnterList } from '../hooks/useEnterList';
import './Contact.css';

export function Contact() {
  const rootRef = useEnterList();

  return (
    <section className="contact home-block" id="contact" ref={rootRef}>
      <div className="home-block__inner contact__inner">
        <div className="contact__actions enter" data-enter>
          <a
            href="mailto:gabrielgustavoandrade@gmail.com"
            className="contact__link"
            aria-label="Send me an email"
          >
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/gabrielgustavoandrade"
            className="contact__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
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
