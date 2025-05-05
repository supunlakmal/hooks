import { useEffect, useState, useRef, useCallback } from 'react';

interface RovingTabIndexOptions {
  /** Selector for focusable elements within the container (default: '[role="option"], button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') */
  focusableSelector?: string;
  /** Initial index to be focused (default: 0) */
  initialIndex?: number;
  /** Allow focus to wrap around (default: true) */
  wrapAround?: boolean;
  /** Orientation of the group for arrow key navigation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Function to call when the active index changes */
  onIndexChange?: (newIndex: number, element: HTMLElement) => void;
}

const defaultFocusableSelector =
  '[role="gridcell"], [role="option"], [role="menuitem"], button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Implements the roving tabindex accessibility pattern for keyboard navigation within a group.
 * Manages focus among a set of descendants of a container element.
 *
 * @param containerRef Ref object pointing to the container element.
 * @param options Configuration options for the roving tabindex behavior.
 */
export const useRovingTabIndex = <T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  options: RovingTabIndexOptions = {}
) => {
  const {
    focusableSelector = defaultFocusableSelector,
    initialIndex = 0,
    wrapAround = true,
    orientation = 'horizontal',
    onIndexChange,
  } = options;

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const onIndexChangeRef = useRef(onIndexChange);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  const updateFocusableElements = useCallback(() => {
    if (containerRef.current) {
      focusableElementsRef.current = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
      // Ensure initial tabindex setup
      focusableElementsRef.current.forEach((el, index) => {
        el.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
      });
      // Validate initialIndex
      if (
        initialIndex >= focusableElementsRef.current.length ||
        initialIndex < 0
      ) {
        setActiveIndex(0);
      }
    }
  }, [containerRef, focusableSelector, activeIndex, initialIndex]);

  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  // Effect to handle dynamic children changes (basic)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      updateFocusableElements();
      // Adjust activeIndex if the focused element disappears
      if (
        activeIndex >= focusableElementsRef.current.length &&
        focusableElementsRef.current.length > 0
      ) {
        setActiveIndex(focusableElementsRef.current.length - 1);
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef, updateFocusableElements, activeIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      const elements = focusableElementsRef.current;
      if (!elements.length) return;

      let newIndex = activeIndex;
      let shouldPreventDefault = false;

      const isHorizontal =
        orientation === 'horizontal' || orientation === 'both';
      const isVertical = orientation === 'vertical' || orientation === 'both';

      switch (event.key) {
        case 'ArrowRight':
          if (isHorizontal) {
            newIndex = activeIndex + 1;
            shouldPreventDefault = true;
          }
          break;
        case 'ArrowLeft':
          if (isHorizontal) {
            newIndex = activeIndex - 1;
            shouldPreventDefault = true;
          }
          break;
        case 'ArrowDown':
          if (isVertical) {
            newIndex = activeIndex + 1;
            shouldPreventDefault = true;
          }
          break;
        case 'ArrowUp':
          if (isVertical) {
            newIndex = activeIndex - 1;
            shouldPreventDefault = true;
          }
          break;
        case 'Home':
          newIndex = 0;
          shouldPreventDefault = true;
          break;
        case 'End':
          newIndex = elements.length - 1;
          shouldPreventDefault = true;
          break;
        default:
          return; // Exit if key is not handled
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }

      if (wrapAround) {
        if (newIndex < 0) newIndex = elements.length - 1;
        if (newIndex >= elements.length) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, elements.length - 1));
      }

      if (newIndex !== activeIndex) {
        elements[activeIndex].setAttribute('tabindex', '-1');
        const newElement = elements[newIndex];
        newElement.setAttribute('tabindex', '0');
        newElement.focus();
        setActiveIndex(newIndex);
        onIndexChangeRef.current?.(newIndex, newElement);
      }
    },
    [activeIndex, wrapAround, orientation, onIndexChangeRef]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Attach keydown listener to the container
    container.addEventListener('keydown', handleKeyDown as EventListener);

    // Initial focus setup if needed (e.g., on mount)
    // This might conflict with autoFocus or other focus management, use carefully.
    // if (activeIndex >= 0 && activeIndex < focusableElementsRef.current.length) {
    //   focusableElementsRef.current[activeIndex]?.focus();
    // }

    return () => {
      container.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [containerRef, handleKeyDown]);

  // Return focus management utilities or state if needed
  // For now, the hook primarily manages focus internally
  return {
    activeIndex,
    setActiveIndex, // Allow external control if necessary
    focusableElements: focusableElementsRef.current, // Expose the elements
  };
};
