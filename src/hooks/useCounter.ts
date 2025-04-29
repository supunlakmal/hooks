import { useState, useCallback } from 'react';

type UpdateFunction = (prev: number) => number;

interface CounterControls {
  value: number;
  increment: (step?: number) => void;
  decrement: (step?: number) => void;
  set: (newValue: number | UpdateFunction) => void;
  reset: () => void;
}

function useCounter(initialValue: number = 0): CounterControls {
  const [value, setValue] = useState<number>(initialValue);

  const increment = useCallback((step: number = 1) => {
    setValue((prev) => prev + step);
  }, []);

  const decrement = useCallback((step: number = 1) => {
    setValue((prev) => prev - step);
  }, []);

  const set = useCallback((newValue: number | UpdateFunction) => {
    setValue((prev) => {
        if (typeof newValue === 'function') {
            return newValue(prev);
        }
        return newValue
    });
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, increment, decrement, set, reset };
}

export default useCounter;