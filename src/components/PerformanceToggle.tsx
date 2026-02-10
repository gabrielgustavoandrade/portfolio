import { useState } from 'react';
import { useFPS } from '../hooks/useFPS';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import './PerformanceToggle.css';

// Performance metric thresholds based on Google's Core Web Vitals (2026)
const METRIC_THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  cls: { good: 0.1, poor: 0.25 },
  inp: { good: 200, poor: 500 }, // Replaced FID in March 2024
  ttfb: { good: 800, poor: 1800 },
  fps: { good: 55, poor: 30 },
} as const;

type MetricType = keyof typeof METRIC_THRESHOLDS;

export function PerformanceToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const metrics = usePerformanceMetrics();
  const fps = useFPS();

  const formatMs = (value: number | null) => {
    if (value === null) return '—';
    return `${value.toFixed(0)}ms`;
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'neutral';

    const threshold = METRIC_THRESHOLDS[metric as MetricType];
    if (!threshold) return 'neutral';

    // FPS uses >= comparison (higher is better), others use < (lower is better)
    if (metric === 'fps') {
      return value >= threshold.good
        ? 'good'
        : value >= threshold.poor
          ? 'needs-improvement'
          : 'poor';
    }

    return value < threshold.good
      ? 'good'
      : value < threshold.poor
        ? 'needs-improvement'
        : 'poor';
  };

  return (
    <>
      <button
        type="button"
        className="performance-toggle__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle performance metrics"
        aria-expanded={isOpen}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 6V10L13 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Performance</span>
      </button>

      {isOpen && (
        <div className="performance-panel">
          <div className="performance-panel__header">
            <h3>Performance Metrics</h3>
            <button
              type="button"
              className="performance-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close performance panel"
            >
              ×
            </button>
          </div>

          <div className="performance-panel__content custom-scrollbar">
            {/* FPS */}
            <div className="performance-metric">
              <div className="performance-metric__label">
                <span>Frames Per Second</span>
                <span
                  className="performance-metric__info"
                  title="Current rendering performance"
                >
                  ℹ
                </span>
              </div>
              <div
                className={`performance-metric__value performance-metric__value--${getScoreColor('fps', fps)}`}
              >
                {fps} fps
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="performance-section">
              <h4>Core Web Vitals</h4>

              <div className="performance-metric">
                <div className="performance-metric__label">
                  <span>First Contentful Paint</span>
                  <span
                    className="performance-metric__info"
                    title="Time until first content is rendered"
                  >
                    ℹ
                  </span>
                </div>
                <div
                  className={`performance-metric__value performance-metric__value--${getScoreColor('fcp', metrics.fcp)}`}
                >
                  {formatMs(metrics.fcp)}
                </div>
              </div>

              <div className="performance-metric">
                <div className="performance-metric__label">
                  <span>Largest Contentful Paint</span>
                  <span
                    className="performance-metric__info"
                    title="Time until largest content element is rendered"
                  >
                    ℹ
                  </span>
                </div>
                <div
                  className={`performance-metric__value performance-metric__value--${getScoreColor('lcp', metrics.lcp)}`}
                >
                  {formatMs(metrics.lcp)}
                </div>
              </div>

              <div className="performance-metric">
                <div className="performance-metric__label">
                  <span>Cumulative Layout Shift</span>
                  <span
                    className="performance-metric__info"
                    title="Visual stability score"
                  >
                    ℹ
                  </span>
                </div>
                <div
                  className={`performance-metric__value performance-metric__value--${getScoreColor('cls', metrics.cls)}`}
                >
                  {metrics.cls?.toFixed(3) ?? '—'}
                </div>
              </div>

              <div className="performance-metric">
                <div className="performance-metric__label">
                  <span>Interaction to Next Paint</span>
                  <span
                    className="performance-metric__info"
                    title="Responsiveness - worst interaction latency (replaced FID in 2024)"
                  >
                    ℹ
                  </span>
                </div>
                <div
                  className={`performance-metric__value performance-metric__value--${getScoreColor('inp', metrics.inp)}`}
                >
                  {formatMs(metrics.inp)}
                </div>
              </div>

              <div className="performance-metric">
                <div className="performance-metric__label">
                  <span>Time to First Byte</span>
                  <span
                    className="performance-metric__info"
                    title="Server response time"
                  >
                    ℹ
                  </span>
                </div>
                <div
                  className={`performance-metric__value performance-metric__value--${getScoreColor('ttfb', metrics.ttfb)}`}
                >
                  {formatMs(metrics.ttfb)}
                </div>
              </div>
            </div>

            {/* Memory */}
            {metrics.memory && (
              <div className="performance-section">
                <h4>Memory Usage</h4>
                <div className="performance-metric">
                  <div className="performance-metric__label">
                    <span>JS Heap Size</span>
                    <span
                      className="performance-metric__info"
                      title="Current JavaScript memory usage"
                    >
                      ℹ
                    </span>
                  </div>
                  <div className="performance-metric__value performance-metric__value--neutral">
                    {formatBytes(metrics.memory.used)} /{' '}
                    {formatBytes(metrics.memory.limit)}
                  </div>
                </div>
                <div className="performance-memory-bar">
                  <div
                    className="performance-memory-bar__fill"
                    style={{
                      width: `${(metrics.memory.used / metrics.memory.limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="performance-panel__footer">
              <p>
                💡 Tip: Open DevTools → Performance tab for detailed profiling
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
