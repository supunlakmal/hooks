import { useRef, useEffect, RefObject } from "react";

// Define a type for possible event targets
type EventTargetLike =
  | EventTarget
  | RefObject<EventTarget>
  | Window
  | Document
  | null
  | undefined;

/**
 * Custom hook to attach an event listener to a target element (window, document, or a ref element).
 * Ensures the listener always uses the latest handler function and cleans up automatically.
 *
 * @param {string} eventName The name of the event to listen for.
 * @param {(event: Event) => void} handler The callback function to execute when the event occurs.
 * @param {EventTargetLike} [element=window] The target element. Defaults to `window`.
 * @param {boolean | AddEventListenerOptions} [options] Optional event listener options.
 */
export const useEventListener = (
  eventName: string,
  handler: (event: any) => void, // Use 'any' for handler event type for broader compatibility
  element: EventTargetLike = window,
  options?: boolean | AddEventListenerOptions
): void => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const target = element ?? window;
    const targetElement =
      target && typeof target === "object" && "current" in target
        ? target.current
        : target;

    // Ensure targetElement is valid and supports addEventListener
    if (
      !targetElement ||
      typeof (targetElement as any).addEventListener !== "function"
    ) {
      console.warn(
        "useEventListener: Target element does not support addEventListener.",
        targetElement
      );
      return;
    }

    const eventListener = (event: Event) => {
      savedHandler.current(event);
    };

    // Add event listener
    (targetElement as any).addEventListener(eventName, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      (targetElement as any).removeEventListener(
        eventName,
        eventListener,
        options
      );
    };
  }, [eventName, element, options]);
}


