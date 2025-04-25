import { useState, useEffect, RefObject } from "react";

interface ResizeObserverEntryExtended extends ResizeObserverEntry {
  // Add any custom properties if needed, though usually not necessary
}

/**
 * Custom hook that uses the ResizeObserver API to monitor changes to an element's size.
 *
 * @param {RefObject<HTMLElement | null>} ref The ref attached to the element to observe.
 * @returns {ResizeObserverEntryExtended | null} The latest ResizeObserverEntry for the observed element, or null initially.
 */
function useResizeObserver(
  ref: RefObject<HTMLElement | null>
): ResizeObserverEntryExtended | null {
  const [entry, setEntry] = useState<ResizeObserverEntryExtended | null>(null);

  useEffect(() => {
    const element = ref.current;
    const hasResizeObserverSupport =
      typeof window.ResizeObserver !== "undefined";

    if (!element || !hasResizeObserverSupport) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      // Update state with the resize observer entry
      setEntry(entry as ResizeObserverEntryExtended);
    });

    observer.observe(element);

    // Cleanup function to disconnect the observer
    return () => {
      observer.disconnect();
    };
  }, [ref]); // Depend on the ref

  return entry;
}

export default useResizeObserver;