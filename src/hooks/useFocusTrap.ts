import { useRef, useEffect, useCallback, RefObject } from "react";

// Selectors for focusable elements
const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

/**
 * Traps focus within a specified container element.
 *
 * @param containerRef - Ref object pointing to the container element.
 * @param isActive - Boolean indicating if the focus trap should be active.
 * @param initialFocusRef - Optional ref object pointing to the element that should receive focus initially.
 */
function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T>,
  isActive: boolean,
  initialFocusRef?: RefObject<HTMLElement>
): void {
  const previousActiveElement = useRef<Element | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    // Query all potentially focusable elements within the container
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => el.offsetParent !== null); // Ensure they are visible/rendered
  }, [containerRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !isActive || !containerRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentFocusedElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: Move focus backwards
        if (
          currentFocusedElement === firstElement ||
          !containerRef.current.contains(currentFocusedElement)
        ) {
          // If focus is on the first element or outside the trap, wrap to the last
          event.preventDefault();
          lastElement.focus();
        }
        // Otherwise, allow default browser behavior (tabbing within the trap)
      } else {
        // Tab: Move focus forwards
        if (
          currentFocusedElement === lastElement ||
          !containerRef.current.contains(currentFocusedElement)
        ) {
          // If focus is on the last element or outside the trap, wrap to the first
          event.preventDefault();
          firstElement.focus();
        }
        // Otherwise, allow default browser behavior (tabbing within the trap)
      }
    },
    [isActive, containerRef, getFocusableElements]
  );

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Save the element that was focused before the trap became active
      previousActiveElement.current = document.activeElement;

      // Focus the initial element if provided, otherwise the first focusable element
      const targetFocusElement =
        initialFocusRef?.current ?? getFocusableElements()[0];
      targetFocusElement?.focus();

      document.addEventListener("keydown", handleKeyDown);
    } else {
      // If deactivated, remove the listener
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the previously active element
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
      previousActiveElement.current = null; // Clear the ref
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Ensure focus is restored if component unmounts while trap is active
      if (isActive && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [
    isActive,
    containerRef,
    initialFocusRef,
    handleKeyDown,
    getFocusableElements,
  ]);
}

export default useFocusTrap;
