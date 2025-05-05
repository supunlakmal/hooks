import { useState, useRef, useCallback } from 'react';

// Define the shape of the state and history controls
interface StateWithHistory<T> {
  state: T;
  setState: (newState: T | ((currentState: T) => T)) => void;
  history: T[];
  pointer: number; // Index of the current state in the history array
  back: () => void;
  forward: () => void;
  go: (index: number) => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Custom hook that manages state like `useState` but keeps a history of changes,
 * allowing for undo (back) and redo (forward) operations.
 *
 * @template T The type of the state.
 * @param initialState - The initial value for the state.
 * @param capacity - The maximum number of history entries to keep (default: 10).
 * @returns An object containing the current state, state setter, history, navigation functions, and flags.
 */
export const useStateWithHistory = <T>(
  initialState: T,
  capacity: number = 10
): StateWithHistory<T> => {
  const [state, setInternalState] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const pointerRef = useRef<number>(0); // Points to the current state index in history

  // Use refs for capacity to avoid triggering updates if capacity changes
  const capacityRef = useRef(capacity);
  capacityRef.current = capacity; // Keep it updated if capacity prop changes

  const setState = useCallback((newStateOrFn: T | ((currentState: T) => T)) => {
    setInternalState((currentState) => {
      const newState =
        typeof newStateOrFn === 'function'
          ? (newStateOrFn as (currentState: T) => T)(currentState)
          : newStateOrFn;

      // If the pointer is not at the end of history (i.e., after an undo),
      // subsequent state changes should overwrite the future history.
      if (pointerRef.current < historyRef.current.length - 1) {
        historyRef.current.splice(pointerRef.current + 1);
      }

      // Add the new state to history
      historyRef.current.push(newState);

      // Maintain capacity: remove the oldest entry if needed
      while (historyRef.current.length > capacityRef.current) {
        historyRef.current.shift(); // Remove the first (oldest) element
      }

      // Update the pointer to the new latest state
      pointerRef.current = historyRef.current.length - 1;

      return newState; // Return the new state for React's useState
    });
  }, []); // No dependencies needed as refs handle capacity

  const go = useCallback((index: number) => {
    const newPointer = Math.max(
      0,
      Math.min(historyRef.current.length - 1, index)
    );
    if (newPointer === pointerRef.current) return; // No change

    pointerRef.current = newPointer;
    setInternalState(historyRef.current[pointerRef.current]);
  }, []);

  const back = useCallback(() => {
    go(pointerRef.current - 1);
  }, [go]);

  const forward = useCallback(() => {
    go(pointerRef.current + 1);
  }, [go]);

  const canUndo = pointerRef.current > 0;
  const canRedo = pointerRef.current < historyRef.current.length - 1;

  return {
    state,
    setState,
    history: historyRef.current,
    pointer: pointerRef.current,
    back,
    forward,
    go,
    canUndo,
    canRedo,
  };
};
