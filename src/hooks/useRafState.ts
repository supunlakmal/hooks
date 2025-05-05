import { useState, useCallback, useRef, useEffect } from 'react';

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

/**
 * A custom hook similar to `useState` but delays state updates
 * until the next animation frame using `requestAnimationFrame`.
 * This can be useful for performance-critical updates tied to rendering.
 *
 * @template S The type of the state.
 * @param initialState The initial state value or a function to compute it.
 * @returns A tuple containing the current state and a dispatch function to update it.
 */
export function useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);
  const rafRef = useRef<number>(0);

  const dispatch = useCallback((value: SetStateAction<S>) => {
    // Cancel any pending updates
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setState(value); // Pass the value/function directly to setState
      rafRef.current = 0; // Reset ref after update
    });
  }, []);

  // Cleanup function to cancel frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return [state, dispatch];
}
