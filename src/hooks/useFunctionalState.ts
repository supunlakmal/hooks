import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';
import {useSyncedRef} from './useSyncedRef';

export const useFunctionalState = <S>(initialState: S | (() => S)): [() => S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(initialState);
  const stateRef = useSyncedRef(state);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return [useCallback(() => stateRef.current, []), setState];
};

export const useFunctionalState = <S = undefined>(): [() => S | undefined, Dispatch<SetStateAction<S | undefined>>] => useFunctionalState<S | undefined>(undefined);

/**
 * Like `useState` but instead of raw state, state getter returned.
 */

