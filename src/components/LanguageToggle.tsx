import { useI18n } from '../i18n/I18nProvider';
import { HTML_LANG, LANGS } from '../i18n/messages';
import './LanguageToggle.css';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, t, setLang } = useI18n();

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset would break the nav row
    <div
      className={`lang-toggle micro ${className}`.trim()}
      role="group"
      aria-label={t.language.group}
    >
      {LANGS.map((option) => (
        <button
          key={option}
          type="button"
          className="lang-toggle__option"
          lang={HTML_LANG[option]}
          title={t.language[option]}
          aria-pressed={lang === option}
          onClick={() => setLang(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
