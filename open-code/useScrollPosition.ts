import { useState, useEffect, useRef, RefObject } from "react";
import useEventListener from "./useEventListener";

interface ScrollPosition {
  x: number;
  y: number;
}

const isBrowser = typeof window !== "undefined";

function getScrollPosition(
  element?: RefObject<Element> | Window | null
): ScrollPosition {
  if (!isBrowser) {
    return { x: 0, y: 0 };
  }

  const target = element
    ? "current" in element
      ? element.current
      : element
    : window;

  if (!target) {
    return { x: 0, y: 0 };
  }

  if (target === window) {
    return { x: window.scrollX, y: window.scrollY };
  } else if (target instanceof Element) {
    return { x: target.scrollLeft, y: target.scrollTop };
  } else {
    // Should not happen with current types, but fallback
    return { x: 0, y: 0 };
  }
}

/**
 * Custom hook to track the scroll position of the window or a specific element.
 *
 * @param {RefObject<Element> | Window | null} [element] - The target element or window to track scroll position for. Defaults to window.
 * @param {number} [throttleMs=100] - Throttle time in milliseconds to limit scroll event handling. Set to 0 to disable throttling.
 * @returns {ScrollPosition} An object containing the current x and y scroll position.
 */
function useScrollPosition(
  element?: RefObject<Element> | Window | null,
  throttleMs: number = 100
): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>(() =>
    getScrollPosition(element)
  );
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    setPosition(getScrollPosition(element));
    throttleTimeout.current = null; // Clear timeout ref after execution
  };

  const throttledHandleScroll = () => {
    if (throttleMs <= 0) {
      handleScroll();
      return;
    }

    if (throttleTimeout.current === null) {
      throttleTimeout.current = setTimeout(handleScroll, throttleMs);
    }
  };

  // Determine the event target
  const target = element ?? window;

  useEventListener("scroll", throttledHandleScroll, target as any);

  // Re-calculate on element change
  useEffect(() => {
    setPosition(getScrollPosition(element));
  }, [element]); // Depend on the element/ref object itself

  return position;
}

export default useScrollPosition;
