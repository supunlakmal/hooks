import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useSyncedRef } from './useSyncedRef'; // Assuming this exists and works

// --- Overload Signatures ---

// Overload 2: Initial state is provided
export function useFunctionalState<S>(
  initialState: S | (() => S)
): [() => S, Dispatch<SetStateAction<S>>];
// Overload 1: No initial state provided (defaults S to undefined)
export function useFunctionalState<S = undefined>(): [() => S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useFunctionalState<S>(
  initialState?: S | (() => S)
): [(() => S | undefined), Dispatch<SetStateAction<S | undefined>>] {
  return useFunctionalStateFn<S>(initialState);
}
const useFunctionalStateFn = <S>(initialState?: S | (() => S)) : [() => S | undefined, Dispatch<SetStateAction<S | undefined>>]=> {
  // useState handles the initial state (value or function) correctly.
  // If initialState is undefined (from overload 1), state starts as undefined.
  const [state, setState] = useState<S | undefined>(initialState);

  // Use a synced ref to always have access to the latest state
  // within the useCallback without needing 'state' in the dependency array.
  const stateRef = useSyncedRef(state);

  const getState = useCallback(() => stateRef.current, []); // No dependencies needed due to ref

  return [getState, setState];
};
