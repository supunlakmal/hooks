import { useState, useCallback } from 'react';

/**
 * @name useResetState
 * @description - Hook that manages state and provides a function to reset it to its initial value.
 *
 * @template S The type of the state.
 * @param {S | (() => S)} initialState The initial state value or a function that returns it.
 * @returns {[S, React.Dispatch<React.SetStateAction<S>>, () => void]} A tuple containing the current state, the standard state setter function, and a function to reset the state to its initial value.
 *
 * @example
 * const [name, setName, resetName] = useResetState('Initial Name');
 *
 * setName('Updated Name');
 * // name is now 'Updated Name'
 *
 * resetName();
 * // name is now 'Initial Name'
 */
export const useResetState = <S>(
  initialState: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>, () => void] => {
  // Store the initial state value. If initialState is a function, call it once.
  // We use useState to hold the initial value itself, ensuring that if it was
  // calculated via a function, we don't recalculate it on every render.
  const [initialValue] = useState<S>(initialState);
  const [state, setState] = useState<S>(initialValue);

  const resetState = useCallback(() => {
    setState(initialValue);
  }, [initialValue]);

  return [state, setState, resetState];
};
