import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting when a specific key is pressed down.
 *
 * @param {string} targetKey The key to monitor (e.g., 'Enter', 'Escape', 'a', 'ArrowUp').
 *                             Uses `event.key`. See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * @returns {boolean} Returns `true` if the target key is currently pressed, `false` otherwise.
 */
export const useKeyPress = (targetKey: string): boolean => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  // If pressed key is our target key then set to true
  const downHandler = ({ key }: KeyboardEvent): void => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent): void => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey]); // Empty array ensures effect is only run on mount and unmount, targetKey added for correctness if it changes

  return keyPressed;
};
