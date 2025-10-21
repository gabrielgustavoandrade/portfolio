import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay
  ttfb: number | null; // Time to First Byte
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
    memory: null,
  });

  useEffect(() => {
    // Get Navigation Timing metrics
    const getNavigationMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setMetrics((prev) => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
        }));
      }
    };

    // Get Paint Timing metrics
    const getPaintMetrics = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

      if (fcp) {
        setMetrics((prev) => ({
          ...prev,
          fcp: fcp.startTime,
        }));
      }
    };

    // Get Memory metrics (Chrome only)
    const getMemoryMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics((prev) => ({
          ...prev,
          memory: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          },
        }));
      }
    };

    // Use PerformanceObserver for LCP, CLS, FID
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics((prev) => ({
            ...prev,
            lcp: lastEntry.startTime,
          }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              setMetrics((prev) => ({
                ...prev,
                cls: clsValue,
              }));
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // FID Observer
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0];
          setMetrics((prev) => ({
            ...prev,
            fid: (firstEntry as any).processingStart - firstEntry.startTime,
          }));
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        return () => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
        };
      } catch (e) {
        console.warn('PerformanceObserver not fully supported', e);
      }
    }

    getNavigationMetrics();
    getPaintMetrics();
    getMemoryMetrics();

    // Update memory periodically
    const memoryInterval = setInterval(getMemoryMetrics, 1000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
}
