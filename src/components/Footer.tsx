import { contactLinks, EMAIL } from '../data/contact';
import { useI18n } from '../i18n/I18nProvider';
import './Footer.css';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer micro">
      <span>Gabriel Andrade · {new Date().getFullYear()}</span>
      <nav className="footer__links" aria-label={t.footer.label}>
        <a href={`mailto:${EMAIL}`}>{t.footer.email}</a>
        {contactLinks.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
