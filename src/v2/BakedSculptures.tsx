import type { V2Hover } from './useV2Motion';

interface BakedSculpturesProps {
  intro: number;
  scroll: number;
  hover: V2Hover;
  workOpen: boolean;
  onHover: (target: 'teatro' | 'palacio' | null) => void;
}

export function BakedSculptures({
  intro,
  scroll,
  hover,
  workOpen,
  onHover,
}: BakedSculpturesProps) {
  const recede = workOpen || hover === 'work' ? 1 : scroll;
  const rise = (1 - intro) * 18;
  const dim = hover === 'work' || workOpen ? 0.4 : 1;

  return (
    <div
      className="v2-baked"
      style={{
        opacity: dim,
        transform: `translateY(${rise + recede * 36}px) scale(${1 - recede * 0.28})`,
      }}
      aria-hidden="true"
    >
      <button
        type="button"
        className={`v2-baked__teatro${hover === 'teatro' ? ' is-hot' : ''}`}
        onMouseEnter={() => onHover('teatro')}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover('teatro')}
        onBlur={() => onHover(null)}
        aria-label="Sculpture"
      >
        <span className="v2-baked__tower" />
        <span className="v2-baked__hull">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => (
            <i key={id} className="v2-baked__porthole" />
          ))}
        </span>
      </button>
      <button
        type="button"
        className={`v2-baked__palacio${hover === 'palacio' ? ' is-hot' : ''}`}
        onMouseEnter={() => onHover('palacio')}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover('palacio')}
        onBlur={() => onHover(null)}
        aria-label="Sculpture"
      >
        <span className="v2-baked__base" />
        <span className="v2-baked__body">
          {[
            'w0',
            'w1',
            'w2',
            'w3',
            'w4',
            'w5',
            'w6',
            'w7',
            'w8',
            'w9',
            'w10',
          ].map((id) => (
            <i
              key={id}
              className={`v2-baked__window${id === 'w6' ? ' is-warm' : ''}`}
            />
          ))}
        </span>
        <span className="v2-baked__rail" />
      </button>
    </div>
  );
}
