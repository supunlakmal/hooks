import { useEffect, useRef } from "react";

/**
 * Custom hook for setting an interval that executes a callback function repeatedly.
 * Handles clearing the interval automatically on unmount or when the delay changes.
 *
 * @param {() => void} callback The function to execute at each interval.
 * @param {number | null} delay The interval duration in milliseconds. If null, the interval is not set/cleared.
 */
function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if delay is null or undefined
    if (delay === null || typeof delay === "undefined") {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);

    // Clear interval if the component unmounts or delay changes
    return () => clearInterval(id);
  }, [delay]); // Re-run effect only if delay changes
}

export default useInterval;
