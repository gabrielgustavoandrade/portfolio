import { useEnterList } from '../hooks/useEnterList';
import './Contact.css';

export function Contact() {
  const rootRef = useEnterList();

  return (
    <section className="sys-section contact" id="contact" ref={rootRef}>
      <div className="sys-section__inner contact__inner">
        <div className="contact__actions enter" data-enter>
          <a
            href="mailto:gabrielgustavoandrade@gmail.com"
            className="sys-link"
            aria-label="Send me an email"
          >
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/gabrielgustavoandrade"
            className="sys-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/gabrielgustavoandrade"
            className="sys-link"
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
