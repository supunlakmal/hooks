import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Define return type locally as useCounter doesn't export it
type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  set: (newCount: number) => void;
  reset: () => void;
};

/**
 * A hook that provides a counter state that persists in local storage,
 * supporting min, max, and step options.
 *
 * @param key The key to use in local storage.
 * @param initialValue The initial value for the counter if not found in storage, defaults to 0.
 * @param options Options for the counter (min, max, step).
 * @returns An object containing the current count and counter manipulation functions.
 */
export function usePersistentCounter(
  key: string,
  initialValue: number = 0,
  options?: { min?: number; max?: number; step?: number }
): UseCounterReturn { 
  const [count, setCount] = useLocalStorage<number>(key, initialValue);

  // Destructure options with default step
  const { min, max, step = 1 } = options ?? {};

  const increment = useCallback(() => {
    setCount((currentCount) => {
      const newValue = currentCount + step;
      // Apply max constraint if defined
      if (max !== undefined && newValue > max) {
        return currentCount; // Or return max; depends on desired behavior
      }
      return newValue;
    });
  }, [setCount, max, step]);

  const decrement = useCallback(() => {
    setCount((currentCount) => {
      const newValue = currentCount - step;
      // Apply min constraint if defined
      if (min !== undefined && newValue < min) {
        return currentCount; // Or return min; depends on desired behavior
      }
      return newValue;
    });
  }, [setCount, min, step]);

  const set = useCallback((newCount: number) => {
     // Clamp the new value according to min/max if defined
     const clampedValue = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, newCount));
     setCount(clampedValue);
  }, [setCount, min, max]);

  const reset = useCallback(() => {
    // Reset sets back to the initial value provided to the hook
    setCount(initialValue);
  }, [setCount, initialValue]);

  // Return the state from useLocalStorage and the newly defined functions
  return { count, increment, decrement, set, reset };
}
