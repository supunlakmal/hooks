import { useEffect, useRef, DependencyList } from 'react';

/**
 * @name useThrottledEffect
 * @description - A custom useEffect hook that throttles the effect execution.
 * The effect will run at most once per every `delay` milliseconds.
 *
 * @param {() => void} effect The effect function to run.
 * @param {DependencyList} deps The dependency array for the effect.
 * @param {number} delay The throttling delay in milliseconds.
 *
 * @example
 * useThrottledEffect(
 *   () => {
 *     // This effect will run at most once every 200ms when `value` changes
 *     console.log('Throttled effect ran', value);
 *   },
 *   [value],
 *   200
 * );
 */
export const useThrottledEffect = (
  effect: () => void,
  deps: DependencyList,
  delay: number
): void => {
  const lastRan = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEffect = useRef(effect);
  lastEffect.current = effect; // Always keep the latest effect

  useEffect(() => {
    const handler = () => {
      lastRan.current = Date.now();
      lastEffect.current();
    };

    if (Date.now() - lastRan.current >= delay) {
      handler();
    } else {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
      timeoutRef.current = setTimeout(() => {
        handler();
      }, delay - (Date.now() - lastRan.current));
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  // Ensure cleanup runs on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
