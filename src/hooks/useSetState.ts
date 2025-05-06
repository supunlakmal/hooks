import { useState, useCallback } from 'react';

/**
 * @name useSetState
 * @description - Hook that manages an object state, merging updates like `this.setState` in class components.
 *
 * @template T The type of the state object.
 * @param {T | (() => T)} initialState The initial state object or a function that returns it.
 * @returns {[T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void]} A tuple containing the current state object and a function to merge updates into it.
 *
 * @example
 * const [state, setState] = useSetState({ count: 0, name: 'Default' });
 * // Update only count
 * setState({ count: 1 });
 * // Update name using a function
 * setState(prevState => ({ name: prevState.name.toUpperCase() }));
 */
export const useSetState = <T extends object>(
  initialState: T | (() => T)
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, setState] = useState<T>(initialState);

  const mergeState = useCallback(
    (patch: Partial<T> | ((prevState: T) => Partial<T>)) => {
      setState((prevState) => {
        const newStatePatch = typeof patch === 'function' ? patch(prevState) : patch;
        // Ensure we don't mutate the previous state, especially if initialState was a function
        // that might return the same object reference on multiple calls.
        return { ...prevState, ...newStatePatch };
      });
    },
    []
  );

  return [state, mergeState];
};
