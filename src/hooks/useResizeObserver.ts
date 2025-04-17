import { useState, useEffect, RefObject } from "react";

interface ResizeObserverEntryExtended extends ResizeObserverEntry {
  // Add any custom properties if needed, though usually not necessary
}

/**
 * Custom hook that uses the ResizeObserver API to monitor changes to an element's size.
 *
 * @template T The type of the element being observed (defaults to Element).
 * @param {RefObject<T>} ref The ref attached to the element to observe.
 * @returns {ResizeObserverEntryExtended | null} The latest ResizeObserverEntry for the observed element, or null initially.
 */
function useResizeObserver<T extends Element>(
  ref: RefObject<T>
): ResizeObserverEntryExtended | null {
  const [entry, setEntry] = useState<ResizeObserverEntryExtended | null>(null);

  useEffect(() => {
    const element = ref?.current;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current]); // Depend on the ref's current value

  return entry;
}

export default useResizeObserver;
