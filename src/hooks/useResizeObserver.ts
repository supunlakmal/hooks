import { useState, useEffect, RefObject } from 'react';

export interface ResizeObserverEntryExtended extends ResizeObserverEntry {
  // Add any custom properties if needed, though usually not necessary
}

/**
 * Custom hook that uses the ResizeObserver API to monitor changes to an element's size.
 *
 * @param {RefObject<HTMLElement | null>} ref The ref attached to the element to observe.
 * @returns {ResizeObserverEntryExtended | null} The latest ResizeObserverEntry for the observed element, or null initially.
 */
export const useResizeObserver = <T extends Element = HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true
): ResizeObserverEntryExtended | null => {
  const [entry, setEntry] = useState<ResizeObserverEntryExtended | null>(null);
  useEffect(() => {
    const element = ref.current;
    const hasResizeObserverSupport =
      typeof window.ResizeObserver !== 'undefined';

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
  }, [ref, enabled]); // Depend on the ref

  return entry;
};
