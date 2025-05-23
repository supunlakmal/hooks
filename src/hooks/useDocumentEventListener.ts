import { useEffect, useRef, DependencyList } from 'react';

/**
 * Custom hook to attach an event listener to the document.
 * Automatically cleans up the event listener on component unmount or when dependencies change.
 *
 * @param eventName - The name of the event to listen for (e.g., 'click', 'keydown').
 * @param handler - The callback function to execute when the event occurs.
 * @param options - (Optional) Options to pass to document.addEventListener.
 * @param dependencies - (Optional) React.DependencyList to re-attach listener if changed.
 */
export const useDocumentEventListener = (
  eventName: string,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions,
  dependencies?: DependencyList
): void => {
  const savedHandler = useRef<(event: Event) => void>(handler);

  useEffect((): void => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect((): (() => void) | void => {
    if (typeof document === 'undefined') {
      return;
    }

    const eventListener = (event: Event): void => {
      if (savedHandler.current) {
        savedHandler.current(event);
      }
    };

    document.addEventListener(eventName, eventListener, options);

    return (): void => {
      document.removeEventListener(eventName, eventListener, options);
    };
  }, dependencies ? [eventName, options, ...dependencies] : [eventName, options]);
};
