import { DependencyList, useEffect, useRef } from 'react';

/**
 * Custom hook to perform an async operation inside a useEffect-like hook.
 * The async operation is allowed to be a function that returns a cleanup function.
 *
 * @param effect - The async function to be executed as the effect.
 * @param deps - Dependency array, just like useEffect.
 */
function useAsyncEffect(
  effect: (signal: AbortSignal) => Promise<(() => void) | void>,
  deps: DependencyList
): void {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    const abortController = new AbortController();
    const cleanupPromise = effectRef.current(abortController.signal);

    return () => {
      abortController.abort();
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, deps);
}

export default useAsyncEffect;