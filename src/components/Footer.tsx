import { contactLinks, EMAIL } from '../data/contact';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer micro">
      <span>Gabriel Andrade · {new Date().getFullYear()}</span>
      <nav className="footer__links" aria-label="Footer">
        <a href={`mailto:${EMAIL}`}>Email</a>
        {contactLinks.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
