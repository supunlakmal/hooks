import { useState, useEffect } from 'react';
import useTimeout from './useTimeout';

interface UseTransitionReturn<T> {
  isPending: boolean;
  value: T;
}

/**
 * Custom hook to manage a state that can transition between values.
 *
 * @param {T} value - The value to track.
 * @param {number} delay - The duration of the transition in milliseconds.
 * @returns {UseTransitionReturn<T>} An object containing the transition state.
 */
function useTransition<T>(value: T, delay: number): UseTransitionReturn<T> {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<T>(value);

  useTimeout(() => {
    setIsPending(false);
  }, isPending ? delay : null);

  useEffect(() => {
    if (currentValue !== value) {
      setIsPending(true);
      setCurrentValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { isPending, value: currentValue };
}

export default useTransition;