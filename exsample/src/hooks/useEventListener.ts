import { useRef, useEffect, RefObject } from 'react';

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
  handler: (event: Event) => void, // Changed any to Event
  element?: EventTargetLike, // Default removed, will be handled in useEffect
  options?: boolean | AddEventListenerOptions
): void => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Default to window if element is not provided and window is defined
    const effectiveElement = element ?? (typeof window !== 'undefined' ? window : undefined);

    const targetElement =
      effectiveElement && typeof effectiveElement === 'object' && 'current' in effectiveElement
        ? effectiveElement.current
        : effectiveElement;

    // Ensure targetElement is valid and supports addEventListener
    if (
      !targetElement ||
      typeof (targetElement as EventTarget).addEventListener !== 'function' // Changed as any to as EventTarget
    ) {
      console.warn(
        'useEventListener: Target element does not support addEventListener.',
        targetElement
      );
      return;
    }

    const eventListener = (event: Event) => {
      savedHandler.current(event);
    };

    // Add event listener
    (targetElement as EventTarget).addEventListener(eventName, eventListener, options); // Changed as any to as EventTarget

    // Remove event listener on cleanup
    return () => {
      (targetElement as EventTarget).removeEventListener( // Changed as any to as EventTarget
        eventName,
        eventListener,
        options
      );
    };
  }, [eventName, element, options]);
};
