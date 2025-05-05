import { RefObject, useEffect } from 'react';
import { useClickOutside } from './useClickOutside';
import { useKeyPress } from './useKeyPress';

/**
 * A hook that triggers a callback when the user clicks outside a specified element
 * OR presses the 'Escape' key.
 * Combines useClickOutside and useKeyPress.
 *
 * @param ref The RefObject pointing to the element to monitor for outside clicks.
 * @param callback The function to call when an outside click or Escape key press occurs.
 */
export function useClickOutsideWithEscape<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void // Simplified callback signature
): void {
  // Use useClickOutside with a parameterless handler
  useClickOutside(ref, () => {
    // Call the provided callback when an outside click occurs
    if (callback) {
      callback();
    }
  });

  // Use useKeyPress to detect if 'Escape' is pressed
  const isEscapePressed = useKeyPress('Escape');

  // Use useEffect to trigger the callback when Escape is pressed
  useEffect(() => {
    if (isEscapePressed && callback) {
      callback();
    }
    // Dependency array includes isEscapePressed and callback
    // This effect runs whenever isEscapePressed changes or the callback reference changes
  }, [isEscapePressed, callback]);
}
