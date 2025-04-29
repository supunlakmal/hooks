import { useState, useCallback } from 'react';

type Updater<T> = (prev: T) => T;
type Setter<T> = (value: T | Updater<T>) => void;

function useFunctionalState<T>(initialValue: T): [T, Setter<T>] {
  const [state, setState] = useState<T>(initialValue);

  const updateState = useCallback<Setter<T>>(
    (valueOrUpdater) => {
      setState((prev) => {
        if (typeof valueOrUpdater === 'function') {
          return (valueOrUpdater as Updater<T>)(prev);
        }
        return valueOrUpdater;
      });
    },
    [],
  );

  return [state, updateState];
}

export default useFunctionalState;