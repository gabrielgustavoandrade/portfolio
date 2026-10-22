import { HARNESS, HARNESS_SESSION } from '../data/harness';
import { useSeekParam } from '../hooks/useSeekParam';
import { useI18n } from '../i18n/I18nProvider';
import { TerminalReplay } from './TerminalReplay';
import './Harness.css';

export function Harness({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  // `?replay=end` (or 0–1) freezes the terminal for screenshots.
  const seek = useSeekParam('replay');

  return (
    <section
      id="harness"
      className="section section--frame harness"
      aria-labelledby="harness-label"
    >
      <h2 id="harness-label" className="section__label micro">
        {t.harness.label}
      </h2>

      <div className="section__body section__split harness__layout">
        <div className="section__intro">
          <div className="section__copy">
            <div className="harness__heading">
              <h3 className="section__title">{HARNESS.name}</h3>
              <span className="status-badge micro">
                <span className="status-badge__dot" aria-hidden="true" />
                {t.harness.status}
              </span>
            </div>
            <p className="section__lede">{t.harness.lede}</p>
            <span className="section__note">{t.harness.note}</span>
          </div>

          <ul className="section__facts">
            {t.harness.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <figure className="section__figure harness__figure">
          <TerminalReplay
            steps={HARNESS_SESSION}
            title={HARNESS.binary}
            reducedMotion={reducedMotion}
            seek={seek}
          />
          <figcaption>{t.harness.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
