import { flushSync } from 'react-dom';

/**
 * Hook to handle View Transitions API with fallback
 * Wraps state updates or navigation in a view transition if supported
 */
interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

type StartViewTransition = (callback: () => void) => ViewTransition;

export function useViewTransition() {
  return (callback: () => void): ViewTransition | undefined => {
    const doc = document as Document & { startViewTransition?: StartViewTransition };
    const start = doc.startViewTransition;

    if (typeof start === 'function') {
      return start.call(doc, () => {
        // Use flushSync to ensure React updates synchronously during the transition
        flushSync(() => {
          callback();
        });
      });
    }

    callback();
    return undefined;
  };
}
