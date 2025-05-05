import { useState, useCallback, useRef, RefObject, useEffect } from 'react';

/**
 * Tracks whether the referenced element or any of its descendants have focus.
 * Similar to the :focus-within CSS pseudo-class.
 *
 * @param elementRef The React ref attached to the container element.
 * @returns `true` if the element or a descendant has focus, `false` otherwise.
 */
export function useFocusWithinState(
  elementRef: RefObject<HTMLElement>
): boolean {
  const [isFocusWithin, setIsFocusWithin] = useState<boolean>(false);
  // Ref to track if the blur event is happening due to a focus shift *within* the element
  const internalFocusChange = useRef(false);

  const handleFocusIn = useCallback(() => {
    // When focus enters the element or its descendants
    setIsFocusWithin(true);
    internalFocusChange.current = false; // Reset flag on focus in
  }, []);

  const handleFocusOut = useCallback(() => {
    // Set a flag to check in a microtask if focus moved outside
    internalFocusChange.current = true;
    // Use a microtask (Promise) to check after the potential relatedTarget focus event
    Promise.resolve().then(() => {
      // Check if focus is still within the element after focusout potentially triggered a focusin
      // Also check if the ref is still attached
      if (
        internalFocusChange.current &&
        elementRef.current &&
        !elementRef.current.contains(document.activeElement)
      ) {
        setIsFocusWithin(false);
      }
      internalFocusChange.current = false; // Reset flag
    });
  }, [elementRef]); // Depend on elementRef

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      // focusin/focusout bubble, making them suitable here
      element.addEventListener('focusin', handleFocusIn);
      element.addEventListener('focusout', handleFocusOut);

      // Initial check in case focus is already within on mount
      if (element.contains(document.activeElement)) {
        setIsFocusWithin(true);
      }

      return () => {
        element.removeEventListener('focusin', handleFocusIn);
        element.removeEventListener('focusout', handleFocusOut);
      };
    }
    // Explicitly return undefined if element is null to satisfy TS7030
    return undefined;
  }, [elementRef, handleFocusIn, handleFocusOut]); // Re-attach if ref or handlers change

  return isFocusWithin;
}
