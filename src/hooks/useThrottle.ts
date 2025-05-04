import { useState, useEffect, useRef } from "react";

/**
 * Throttles a value.
 *
 * @template T The type of the value to throttle.
 * @param {T} value The value to throttle.
 * @param {number} limit The minimum time interval in milliseconds between updates.
 * @returns {T} The throttled value.
 */
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    // Set throttledValue immediately on the first render or when the value changes significantly
    // This ensures responsiveness for the initial value or large jumps
    if (throttledValue !== value && Date.now() - lastRan.current >= limit) {
      setThrottledValue(value);
      lastRan.current = Date.now();
    }

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, limit]); // Recalculate effect if value or limit changes

  return throttledValue;
}


