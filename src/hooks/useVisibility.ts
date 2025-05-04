import { useState, useEffect, RefObject } from "react";

interface UseVisibilityOptions extends IntersectionObserverInit {
  // IntersectionObserverInit includes root, rootMargin, threshold
  initialIsVisible?: boolean;
  disconnectOnVisible?: boolean; // Optional: disconnect observer once element becomes visible
}

/**
 * Custom hook to track whether an element is visible in the viewport or a scrollable ancestor.
 * Uses the IntersectionObserver API.
 *
 * @template T - The type of the element being observed.
 * @param {RefObject<T>} elementRef - A ref attached to the element to observe.
 * @param {UseVisibilityOptions} [options] - Configuration options for the IntersectionObserver.
 * @param {Element | null} [options.root=null] - The element that is used as the viewport for checking visibility. Defaults to the browser viewport.
 * @param {string} [options.rootMargin='0px'] - Margin around the root. Can have values similar to the CSS margin property.
 * @param {number | number[]} [options.threshold=0] - A single number or an array of numbers indicating the percentage of the target's visibility the observer triggers at.
 * @param {boolean} [options.initialIsVisible=false] - Initial state before the observer runs.
 * @param {boolean} [options.disconnectOnVisible=false] - If true, the observer disconnects after the element first becomes visible.
 * @returns {boolean} True if the element is currently intersecting/visible based on the options, false otherwise.
 */
export const useVisibility = <T extends Element>(
  elementRef: RefObject<T>,
  {
    initialIsVisible = false,
    disconnectOnVisible = false,
    ...observerOptions
  }: UseVisibilityOptions = {}
): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(initialIsVisible);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      // Ensure element exists and IntersectionObserver is supported
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      // Update state based on intersection
      const currentlyVisible = entry.isIntersecting;
      setIsVisible(currentlyVisible);

      // Disconnect if option is set and element is now visible
      if (disconnectOnVisible && currentlyVisible) {
        observer.disconnect();
      }
    }, observerOptions);

    observer.observe(element);

    // Cleanup: disconnect the observer when the component unmounts or ref changes
    return () => {
      observer.disconnect();
    };
    // Re-run effect if elementRef or observer options change
    // Note: observerOptions are stringified for reliable comparison in deps array,
    // as object identity changes on every render otherwise.
  }, [elementRef, JSON.stringify(observerOptions), disconnectOnVisible]);

  return isVisible;
}


