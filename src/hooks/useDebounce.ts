import { useState, useEffect } from "react";

/**
 * Debounces a value.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} delay The delay in milliseconds to wait before updating the debounced value.
 * @returns {T} The debounced value.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect executes again. useEffect will execute ...
      // ... again if value or delay changes (see dependency array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value or delay changes
    [value, delay]
  );

  return debouncedValue;
}


