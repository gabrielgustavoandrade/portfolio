import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });

  if (!('IntersectionObserver' in globalThis)) {
    class IntersectionObserverMock implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '0px';
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(
        private readonly callback: IntersectionObserverCallback = () => {},
      ) {}

      disconnect() {}
      observe(target: Element) {
        this.callback(
          [
            {
              isIntersecting: true,
              target,
            } as IntersectionObserverEntry,
          ],
          this,
        );
      }
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      unobserve() {}
    }

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      writable: true,
      value: IntersectionObserverMock,
    });
  }

  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }

  if (!('startViewTransition' in document)) {
    Object.defineProperty(document, 'startViewTransition', {
      writable: true,
      value: (callback: () => void) => {
        callback?.();
        const resolved = Promise.resolve();
        return {
          ready: resolved,
          finished: resolved,
          updateCallbackDone: resolved,
          skipTransition: vi.fn(),
        };
      },
    });
  }

  if (!HTMLElement.prototype.scrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      value: vi.fn(),
      writable: true,
    });
  }
});
