import { type CSSProperties, useRef } from 'react';
import { contactLinks, EMAIL } from '../data/contact';
import { useInView } from '../hooks/useInView';
import './Contact.css';

const [emailUser, emailDomain] = EMAIL.split('@');

export function Contact({ reducedMotion }: { reducedMotion: boolean }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(bodyRef, { skip: reducedMotion });

  return (
    <section
      id="contact"
      className="section contact"
      aria-labelledby="contact-label"
    >
      <div className="contact__backdrop" aria-hidden="true" />
      <h2 id="contact-label" className="section__label micro">
        Contact
      </h2>
      <div
        ref={bodyRef}
        className={`section__body contact__body${inView ? ' is-in' : ''}`}
      >
        <a
          className="contact__email"
          href={`mailto:${EMAIL}`}
          aria-label={EMAIL}
        >
          <span>{emailUser}</span>
          <span>@{emailDomain}</span>
        </a>
        <ul className="contact__links">
          {contactLinks.map((link, order) => (
            <li key={link.url} style={{ '--i': order } as CSSProperties}>
              <a href={link.url} target="_blank" rel="noreferrer">
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-url">{link.display}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
