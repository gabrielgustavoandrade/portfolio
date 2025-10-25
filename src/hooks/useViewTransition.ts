import { useCallback } from 'react';

type TransitionOptions = {
  onBeforeTransition?: () => void;
};

export type TransitionHandler = (
  options?: TransitionOptions,
) => Promise<void> | void;

export function useViewTransition() {
  const supportsViewTransition =
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof document.startViewTransition === 'function';

  return useCallback(
    (handler: TransitionHandler, options?: TransitionOptions) => {
      options?.onBeforeTransition?.();

      if (supportsViewTransition) {
        const doc = document as Document & {
          startViewTransition: (
            callback: () => void | Promise<void>,
          ) => ViewTransition;
        };

        return doc.startViewTransition(() => handler(options));
      }

      return handler(options);
    },
    [supportsViewTransition],
  );
}
