import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useSyncedRef } from './useSyncedRef'; // Assuming this exists and works

// --- Overload Signatures ---

// Overload 1: No initial state provided (defaults S to undefined)
export function useFunctionalState<S = undefined>(): [
  () => S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];

// Overload 2: Initial state is provided
export function useFunctionalState<S>(
  initialState: S | (() => S)
): [() => S, Dispatch<SetStateAction<S>>];

// --- Implementation ---

/**
 * Like `useState` but returns a stable state getter function `() => S`
 * instead of the raw state value `S`. This can be useful to prevent
 * unnecessary re-renders of consumers that only need to read the latest
 * state on demand, not reactively.
 *
 * @param initialState The initial state value or a function to compute it.
 * @returns A tuple containing a stable getter function and the state dispatcher.
 */
export function useFunctionalState<S>(
  initialState?: S | (() => S) // Implementation takes optional initialState
): [
  () => S | undefined, // Implementation return type covers both cases
  Dispatch<SetStateAction<S | undefined>>, // Implementation return type covers both cases
] {
  // useState handles the initial state (value or function) correctly.
  // If initialState is undefined (from overload 1), state starts as undefined.
  const [state, setState] = useState<S | undefined>(initialState);

  // Use a synced ref to always have access to the latest state
  // within the useCallback without needing 'state' in the dependency array.
  const stateRef = useSyncedRef(state);

  // Create a stable getter function using useCallback.
  // It reads the latest state from the ref when called.
  const getState = useCallback(() => stateRef.current, []); // No dependencies needed due to ref

  // Return the stable getter and the original setState dispatcher.
  // The types returned match the implementation signature. TypeScript will
  // correctly narrow the types for the caller based on the matched overload.
  return [getState, setState];
}
