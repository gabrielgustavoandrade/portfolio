import type { V2Hover } from './useV2Motion';

interface PostcardProps {
  hover: V2Hover;
  onHover: (active: boolean) => void;
}

export function Postcard({ hover, onHover }: PostcardProps) {
  return (
    <button
      type="button"
      className={`v2-postcard${hover === 'postcard' ? ' is-hot' : ''}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label="Postcard"
    >
      <span className="v2-postcard__inner">
        <span
          className="v2-postcard__face v2-postcard__face--a"
          aria-hidden="true"
        >
          <span className="v2-postcard__sky" />
          <span className="v2-postcard__mass" />
          <span className="v2-postcard__ports">
            <i />
            <i />
            <i />
            <i />
          </span>
        </span>
        <span
          className="v2-postcard__face v2-postcard__face--b"
          aria-hidden="true"
        >
          <span className="v2-postcard__sky v2-postcard__sky--dusk" />
          <span className="v2-postcard__stone" />
          <span className="v2-postcard__grid">
            {['g0', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7'].map((id) => (
              <i key={id} className={id === 'g3' ? 'is-warm' : undefined} />
            ))}
          </span>
        </span>
      </span>
    </button>
  );
}
