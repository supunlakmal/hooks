import { useState, useEffect, RefObject } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {}

/**
 * Custom hook to track the visibility of an element within the viewport or a specified ancestor element.
 *
 * @param {RefObject<Element | null>} elementRef - The ref attached to the target element to observe.
 * @param {UseIntersectionObserverOptions} [options] - Configuration options for the IntersectionObserver.
 * @param {Element | null} [options.root=null] - The element that is used as the viewport for checking visibility. Defaults to the browser viewport.
 * @param {string} [options.rootMargin='0px'] - Margin around the root. Can have values similar to the CSS margin property.
 * @param {number | number[]} [options.threshold=0] - A single number or an array of numbers indicating at what percentage of the target's visibility the observer's callback should be executed.
 * @returns {IntersectionObserverEntry | null} The latest IntersectionObserverEntry for the observed element, or null if not intersecting or not yet observed.
 */
function useIntersectionObserver( 
  elementRef: RefObject<Element | null>,
  options?: UseIntersectionObserverOptions
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) {
      // Consider setting an 'unsupported' or initial state if needed
      // For now, just don't observe if no node or no support
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      // Update state with the latest entry
      setEntry(entry);
    }, options);

    observer.observe(node);

    // Cleanup function
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef?.current,
    options?.root,
    options?.rootMargin,
    options?.threshold,
  ]);
  // Re-run effect if element, root, rootMargin, or threshold changes
  // Stringifying/deep comparing options might be needed for complex objects

  return entry;
}

export default useIntersectionObserver;
