import { SMART_DATE_INPUT_LINKS } from '../data/projects';
import { LiveSmartDateInput } from './LiveSmartDateInput';
import './CraftProof.css';

const KEYS = ['↑', '↓', 'Enter', 'Tab'];

export function CraftProof({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="craft"
      className="section section--frame craft"
      aria-labelledby="craft-title"
    >
      <span className="section__label micro">Craft proof</span>

      <div className="section__body craft__layout">
        <div className="craft__intro">
          <div className="craft__copy">
            <h2 id="craft-title" className="craft__title">
              smart-date-input
            </h2>
            <p className="craft__lede">
              React/TypeScript date and time input with natural-language parsing
              and keyboard navigation, published as an npm component.
            </p>
            <span className="craft__package">
              {SMART_DATE_INPUT_LINKS.packageName}
            </span>
          </div>

          <div className="craft__keys">
            <span className="micro">Keyboard</span>
            <div className="craft__keys-row">
              {KEYS.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
              <span>Move through suggestions and select</span>
            </div>
          </div>

          <div className="craft__links">
            <a
              href={SMART_DATE_INPUT_LINKS.npm}
              target="_blank"
              rel="noreferrer"
            >
              npm ↗
            </a>
            <a
              href={SMART_DATE_INPUT_LINKS.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <figure className="craft__demo">
          <LiveSmartDateInput
            autoType={!reducedMotion}
            instant={reducedMotion}
          />
          <figcaption>
            Rendered by the published package. Output above is the component’s
            own.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
