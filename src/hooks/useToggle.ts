import { useState, useCallback } from 'react';

/**
 * Type definition for the return value of useToggle.
 * It includes the current boolean state and functions to manipulate it.
 */
type UseToggleReturn = [
  boolean, // currentValue
  () => void, // toggle function
  () => void, // setOn function
  () => void, // setOff function
];

/**
 * A simple hook to manage boolean state with a toggle function.
 *
 * @param initialValue - The initial boolean state (defaults to false).
 * @returns An array containing:
 *          - The current boolean value.
 *          - A function to toggle the value.
 *          - A function to explicitly set the value to true.
 *          - A function to explicitly set the value to false.
 */
export const useToggle = (initialValue: boolean = false): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initialValue);

  // useCallback ensures the toggle function identity is stable across re-renders
  // unless its dependencies change (which they don't here).
  const toggle = useCallback(() => {
    // Use the functional update form to ensure we always toggle based on the latest state
    setValue((prevValue) => !prevValue);
  }, []); // No dependencies, function never needs to be recreated

  // Explicit setters using useCallback for stability
  const setOn = useCallback(() => {
    setValue(true);
  }, []);

  const setOff = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setOn, setOff];
};
