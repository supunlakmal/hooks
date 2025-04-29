import { useState, useCallback } from 'react';

type Mediator<T> = (value: T) => T;

function useMediatedState<T>(
  initialState: T,
  mediator?: Mediator<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prevState) => {
        const nextState = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
        if (mediator) {
          return mediator(nextState);
        }
        return nextState;
      });
    },
    [mediator]
  );

  return [state, updateState];
}

export default useMediatedState;