// @flow
// $FlowIssue: thanks to that react type defs are provided as built-ins to flow distribution they're always late
import { useState } from 'react';

type StateInitializerType<T: Object> =
  | T
  | () => T;

type StateUpdateType<T: Object> =
  | $Shape<T>
  | (T) => $Shape<T>;

type StateUpdaterType<T: Object> = (StateUpdateType<T>) => void;

export function useObjectState<T: Object>(initialState: StateInitializerType<T>): [T, StateUpdaterType<T>] {
  const [state, setStateRaw] = useState(initialState);

  const setState = (partialState) => setStateRaw({
    ...state,
    ...(
      typeof partialState === 'function'
        ? partialState(state)
        : partialState
    ),
  });

  return [state, setState];
}
