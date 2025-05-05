import { useState, useEffect, RefObject } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver'; // Assuming signature

/**
 * A hook that tracks if an element has ever become visible in the viewport.
 * Uses useIntersectionObserver internally. Once the element is visible,
 * the hook consistently returns true, even if it scrolls out of view later.
 *
 * @param elementRef The React ref attached to the element to observe.
 * @param observerOptions Optional options for the IntersectionObserver.
 * @returns `true` if the element has been visible at least once, `false` otherwise.
 */
export function useHasBeenVisible(
  elementRef: RefObject<Element>,
  observerOptions?: IntersectionObserverInit
): boolean {
  // State to track if the element has ever been visible
  const [hasBeenVisible, setHasBeenVisible] = useState<boolean>(false);

  // Get the intersection observer entry for the element
  const entry = useIntersectionObserver(elementRef, observerOptions);

  // Check if the element is currently intersecting
  const isIntersecting = entry?.isIntersecting;

  useEffect(() => {
    // If the element is intersecting and we haven't marked it as visible yet,
    // update the state.
    if (isIntersecting && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
    // Effect depends on the intersection state and the current visibility flag.
    // We only want to set true *once*.
  }, [isIntersecting, hasBeenVisible]);

  return hasBeenVisible;
}
