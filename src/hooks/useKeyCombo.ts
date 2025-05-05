import { useEffect, useCallback, useRef } from 'react';

interface KeyComboOptions {
  /** Target element for the listener (default: document) */
  target?: EventTarget | null | (() => EventTarget | null);
  /** Prevent default behavior (default: false) */
  preventDefault?: boolean;
  /** Stop propagation (default: false) */
  stopPropagation?: boolean;
  /** Trigger on keyup instead of keydown (default: false) */
  event?: 'keydown' | 'keyup';
}

const parseCombo = (combo: string): Set<string> => {
  return new Set(
    combo
      .toLowerCase()
      .split('+')
      .map((key) => key.trim())
  );
};

/**
 * Detects specific keyboard combinations (shortcuts) being pressed.
 *
 * @param combo The key combination string (e.g., 'ctrl+s', 'alt+shift+k'). Case-insensitive.
 * @param callback The function to call when the combo is detected.
 * @param options Optional configuration for the event listener.
 */
export const useKeyCombo = (
  combo: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyComboOptions = {}
) => {
  const {
    target = typeof window !== 'undefined' ? window.document : null,
    preventDefault = false,
    stopPropagation = false,
    event = 'keydown',
  } = options;

  const targetElement = typeof target === 'function' ? target() : target;

  const requiredKeys = useRef<Set<string>>(parseCombo(combo));
  const pressedKeys = useRef<Set<string>>(new Set());
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (event === 'keydown') {
        pressedKeys.current.add(key);
        // Add modifiers if they are pressed
        if (e.ctrlKey) pressedKeys.current.add('ctrl');
        if (e.altKey) pressedKeys.current.add('alt');
        if (e.shiftKey) pressedKeys.current.add('shift');
        if (e.metaKey) pressedKeys.current.add('meta'); // Handle Cmd key on Mac

        let comboMatched = true;
        // Check if all required keys are currently pressed
        // Use Array.from to convert Set to array to avoid iteration error
        Array.from(requiredKeys.current).forEach((reqKey) => {
          if (!pressedKeys.current.has(reqKey)) {
            comboMatched = false;
          }
        });

        // Ensure *only* the required keys are pressed (stricter check)
        if (
          comboMatched &&
          pressedKeys.current.size !== requiredKeys.current.size
        ) {
          comboMatched = false;
        }

        if (comboMatched) {
          if (preventDefault) e.preventDefault();
          if (stopPropagation) e.stopPropagation();
          callbackRef.current(e);
          // Optional: Reset keys after combo is triggered if it shouldn't repeat while holding
          // pressedKeys.current.clear();
        }
      }
    },
    [preventDefault, stopPropagation, event]
  ); // Dependencies for the handler

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    pressedKeys.current.delete(key);
    // Also remove modifiers if they are released
    if (key === 'control') pressedKeys.current.delete('ctrl');
    if (key === 'alt') pressedKeys.current.delete('alt');
    if (key === 'shift') pressedKeys.current.delete('shift');
    if (key === 'meta') pressedKeys.current.delete('meta');
  }, []);

  useEffect(() => {
    if (!targetElement) return;

    // Function to handle attaching listeners
    const addListeners = () => {
      targetElement.addEventListener(event, handleKeyEvent as EventListener);
      targetElement.addEventListener('keyup', handleKeyUp as EventListener);
    };

    // Function to handle removing listeners
    const removeListeners = () => {
      targetElement.removeEventListener(event, handleKeyEvent as EventListener);
      targetElement.removeEventListener('keyup', handleKeyUp as EventListener);
    };

    // Add listeners
    addListeners();

    // Update required keys if combo changes
    requiredKeys.current = parseCombo(combo);

    return () => {
      removeListeners();
      pressedKeys.current.clear(); // Clear keys on unmount
    };
  }, [targetElement, event, handleKeyEvent, handleKeyUp, combo]); // Re-attach if target, event type, handlers, or combo changes
};
