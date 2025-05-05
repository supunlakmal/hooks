import { useEffect, useRef } from 'react';

// Helper hook to get the latest value of a variable (useful for callbacks in intervals/timeouts)
function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef(value);
  // No dependency array, updates on every render
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * A custom hook similar to `setInterval`, but the interval only runs when a specific
 * condition (`when`) is true. It clears the interval automatically on unmount or
 * when the `delay` or `when` condition changes appropriately.
 *
 * @param {() => void} callback The function to execute at each interval.
 * @param {number | null | undefined} delay The interval duration in milliseconds.
 *        The interval is paused if `delay` is `null` or `undefined`, or if `when` is `false`.
 * @param {object} [options] Optional configuration options.
 * @param {boolean} [options.when=true] A boolean condition. The interval runs only when this is true.
 * @param {boolean} [options.startImmediate=false] If true, the callback is executed immediately
 *        when the interval starts or resumes (i.e., when `when` becomes true and `delay` is valid).
 */
export const useIntervalWhen = (
  callback: () => void,
  delay: number | null | undefined,
  options?: { when?: boolean; startImmediate?: boolean }
): void => {
  // Default options
  const { when = true, startImmediate = false } = options || {};

  // Use refs to manage state across renders without triggering re-renders unnecessarily
  const savedCallback = useLatest(callback); // Store the latest callback
  const firstRunDoneRef = useRef(false); // Track if the immediate call was executed for the current active cycle

  useEffect(() => {
    // Determine the effective delay based on the 'when' condition and the provided delay
    const effectiveDelay =
      when && delay !== null && typeof delay !== 'undefined' ? delay : null;

    // If the interval should not be active, reset the immediate run tracker
    if (effectiveDelay === null) {
      firstRunDoneRef.current = false;
      return; // Exit early, no interval to set or clear (cleanup from previous effect handles it)
    }

    // --- Interval is active from this point ---

    const tick = () => savedCallback.current();

    // Handle immediate execution if requested and not already done for this cycle
    if (startImmediate && !firstRunDoneRef.current) {
      tick(); // Execute immediately
      firstRunDoneRef.current = true; // Mark as executed
    }

    // Set up the interval using the effective delay
    const intervalId = setInterval(tick, effectiveDelay);

    // Return the cleanup function to clear the interval
    return () => {
      clearInterval(intervalId);
      // Reset the immediate run tracker *only* when the interval is cleared due to deps change
      // This allows immediate run again if `when` becomes true again after being false
      firstRunDoneRef.current = false;
    };
  }, [delay, when, startImmediate, savedCallback]); // Dependencies that trigger effect re-run
};
