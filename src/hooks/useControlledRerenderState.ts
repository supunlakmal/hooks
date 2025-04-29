import { useState, useCallback } from 'react';

type Dispatch<A> = (value: A) => void;

function useControlledRerenderState<S>(
  initialState: S | (() => S)
): [S, Dispatch<S>, () => void] {
  const [state, setState] = useState<S>(initialState);
  const [, forceUpdate] = useState({});

  const controlledSetState = useCallback(
    (newState: S) => {
      setState(newState);
    },
    []
  );

  const triggerRerender = useCallback(() => {
    forceUpdate({});
  }, []);

  return [state, controlledSetState, triggerRerender];
}

export default useControlledRerenderState;