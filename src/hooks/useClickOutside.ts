import { useEffect, RefObject } from "react";

type EventType = "mousedown" | "mouseup" | "touchstart" | "touchend";

/**
 * Custom hook for detecting clicks outside of a specified element.
 *
 * @param {RefObject<HTMLElement>} ref The React ref attached to the element to monitor.
 * @param {() => void} handler The function to call when a click outside occurs.
 * @param {EventType} [eventType='mousedown'] The type of event to listen for ('mousedown', 'mouseup', 'touchstart', 'touchend').
 */
function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  eventType: EventType = "mousedown" // Default to mousedown
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener(eventType, listener);
    // If using touch events, add the corresponding mouse event listener as a fallback
    if (eventType.startsWith("touch")) {
      document.addEventListener("mousedown", listener);
    }

    return () => {
      document.removeEventListener(eventType, listener);
      if (eventType.startsWith("touch")) {
        document.removeEventListener("mousedown", listener);
      }
    };
  }, [ref, handler, eventType]); // Re-run if ref, handler, or eventType changes
}

export default useClickOutside;