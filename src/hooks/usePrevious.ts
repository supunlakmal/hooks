import { useRef, useEffect } from "react";

/**
 * Custom hook to get the previous value of a prop or state.
 *
 * @template T The type of the value to track.
 * @param {T} value The current value.
 * @returns {T | undefined} The value from the previous render, or undefined on the initial render.
 */
export const usePrevious = <T>(value: T): T | undefined => {
  // Initialize ref with undefined
  const ref = useRef<T | undefined>(undefined);

  // Store current value in ref *after* rendering
  useEffect(() => {
    ref.current = value;
  }, [value]); // Re-run effect only when value changes

  // Return previous value (value from previous render)
  return ref.current;
}


