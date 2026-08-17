import type { V2Hover } from './useV2Motion';

interface WorkPlateProps {
  scroll: number;
  hover: V2Hover;
  workOpen: boolean;
  onHover: (active: boolean) => void;
  onOpen: () => void;
}

export function WorkPlate({
  scroll,
  hover,
  workOpen,
  onHover,
  onOpen,
}: WorkPlateProps) {
  const progress = workOpen ? 1 : scroll;
  const lifted = hover === 'work' && !workOpen;
  const scale = 0.42 + progress * 0.78;
  const lift = lifted ? -14 : 0;
  const shiftY = 26 - progress * 34;

  return (
    <button
      type="button"
      className={`v2-plate${workOpen ? ' is-frame' : ''}`}
      style={
        workOpen
          ? undefined
          : {
              transform: `translate(-50%, ${shiftY}%) scale(${scale}) translateY(${lift}px)`,
              opacity: 0.28 + progress * 0.72,
            }
      }
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={onOpen}
      aria-label="Selected work"
    >
      <span className="v2-plate__still" aria-hidden="true">
        <svg
          className="v2-plate__art"
          viewBox="0 0 640 420"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="v2-linen" cx="50%" cy="42%" r="70%">
              <stop offset="0%" stopColor="#f4e6cc" />
              <stop offset="70%" stopColor="#e7d3b3" />
              <stop offset="100%" stopColor="#d4bc96" />
            </radialGradient>
            <radialGradient id="v2-dish" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#fff8ee" />
              <stop offset="62%" stopColor="#f0e2cc" />
              <stop offset="100%" stopColor="#d8c4a6" />
            </radialGradient>
            <filter id="v2-soft">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <rect width="640" height="420" fill="url(#v2-linen)" />
          <ellipse
            cx="328"
            cy="268"
            rx="196"
            ry="58"
            fill="#b08958"
            opacity="0.22"
            filter="url(#v2-soft)"
          />
          <ellipse cx="320" cy="228" rx="188" ry="92" fill="url(#v2-dish)" />
          <ellipse
            cx="320"
            cy="228"
            rx="168"
            ry="78"
            fill="none"
            stroke="#ead9c0"
            strokeWidth="10"
          />
          <Candy cx={268} cy={206} fill="#c43b2c" />
          <Candy cx={312} cy={188} fill="#e3b125" />
          <Candy cx={354} cy={208} fill="#2f6fbf" />
          <Candy cx={292} cy={236} fill="#2f8a4a" />
          <Candy cx={338} cy={244} fill="#6b3a24" />
          <Candy cx={376} cy={230} fill="#c43b2c" />
          <Candy cx={248} cy={232} fill="#e3b125" />
          <ellipse
            cx="168"
            cy="168"
            rx="46"
            ry="18"
            fill="#d7b48a"
            opacity="0.55"
            transform="rotate(-18 168 168)"
          />
        </svg>
      </span>
    </button>
  );
}

function Candy({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g>
      <ellipse
        cx={cx + 3}
        cy={cy + 6}
        rx="22"
        ry="10"
        fill="#8a6a3e"
        opacity="0.18"
      />
      <circle cx={cx} cy={cy} r="20" fill={fill} />
      <ellipse
        cx={cx - 6}
        cy={cy - 7}
        rx="8"
        ry="5"
        fill="#fff"
        opacity="0.35"
      />
    </g>
  );
}
