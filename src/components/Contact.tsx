import './Contact.css';

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__container">
        <h2 className="contact__title">Let's work together.</h2>
        <p className="contact__text">
          Available for remote and hybrid roles across Europe.
        </p>

        <div className="contact__actions">
          <a
            href="mailto:your.email@example.com"
            className="button button--primary"
            aria-label="Send me an email"
          >
            Email me
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            className="contact__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
