import { useEffect, useRef } from 'react';

/**
 * Custom hook for setting a timeout that can be cleared.
 *
 * @param {() => void} callback The function to execute after the timeout.
 * @param {number | null} delay The delay in milliseconds. If null, the timeout is not set.
 */
export const useTimeout = (callback: () => void, delay: number | null): void => {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    // Don't schedule if delay is null or undefined
    if (delay === null || typeof delay === 'undefined') {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setTimeout(tick, delay);

    // Clear timeout if the component unmounts or delay/callback changes
    return () => clearTimeout(id);
  }, [delay]); // Re-run effect only if delay changes
};
