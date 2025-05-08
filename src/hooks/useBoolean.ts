import { useState, useCallback } from 'react';

/**
 * @name useBoolean
 * @description - Hook that manages a boolean state, providing explicit setTrue, setFalse, and toggle functions.
 *
 * @param {boolean} [initialValue=false] The initial value of the boolean state.
 * @returns {[boolean, { setTrue: () => void; setFalse: () => void; toggle: () => void; }]} A tuple containing the current boolean value and an object with functions to manipulate it.
 *
 * @example
 * const [isVisible, { setTrue: openModal, setFalse: closeModal, toggle: toggleModal }] = useBoolean(false);
 */
export const useBoolean = (
  initialValue: boolean = false
): [
  boolean,
  {
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
  },
] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, { setTrue, setFalse, toggle }];
};
