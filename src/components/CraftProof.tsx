import { SMART_DATE_INPUT_LINKS } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';
import { LiveSmartDateInput } from './LiveSmartDateInput';
import './CraftProof.css';

const KEYS = ['↑', '↓', 'Enter', 'Tab'];

export function CraftProof({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  return (
    <section
      id="projects"
      className="section section--frame craft"
      aria-labelledby="craft-label"
    >
      <h2 id="craft-label" className="section__label micro">
        {t.craft.label}
      </h2>

      <div className="section__body section__split craft__layout">
        <div className="section__intro craft__intro">
          <div className="section__copy craft__copy">
            <h3 className="section__title">smart-date-input</h3>
            <p className="section__lede">{t.craft.lede}</p>
            <span className="section__note craft__package">
              {SMART_DATE_INPUT_LINKS.packageName}
            </span>
          </div>

          <div className="craft__keys">
            <span className="micro">{t.craft.keyboard}</span>
            <div className="craft__keys-row">
              {KEYS.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
              <span>{t.craft.keysHint}</span>
            </div>
          </div>

          <div className="craft__links">
            <a
              className="pill"
              href={SMART_DATE_INPUT_LINKS.npm}
              target="_blank"
              rel="noreferrer"
            >
              npm ↗
            </a>
            <a
              className="pill"
              href={SMART_DATE_INPUT_LINKS.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <figure className="section__figure craft__demo">
          <LiveSmartDateInput
            autoType={!reducedMotion}
            instant={reducedMotion}
          />
          <figcaption>{t.craft.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
