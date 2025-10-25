// View Transitions API types
interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
}

// CSS View Transition Name
declare namespace React {
  interface CSSProperties {
    viewTransitionName?: string;
  }
}

// Performance Memory API (Chrome only)
interface Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Layout Shift Entry
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// First Input Entry
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}
