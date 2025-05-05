import { useEffect, useRef } from 'react'; 
import { useEventListener } from './useEventListener'; 
import { useThrottledCallback } from './useThrottledCallback'; 

type EventTargetRef = React.RefObject<EventTarget> | EventTarget | Window | Document | null | undefined; 

/**
 * Attaches an event listener to a target element but throttles the callback execution.
 *
 * @param eventName The name of the event to listen for (e.g., 'scroll', 'resize').
 * @param handler The function to execute when the event occurs.
 * @param delay The throttle delay in milliseconds.
 * @param element The target element or ref to attach the listener to (compatible with useEventListener).
 * @param options Event listener options (capture, passive, once).
 */
export function useThrottledEventListener(
  eventName: string,
  handler: (event: Event) => void,
  delay: number,
  element?: EventTargetRef, 
  options?: AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const throttledCallback = useThrottledCallback(
    (event: Event) => {
      savedHandler.current?.(event);
    },
    [], 
    delay
  );

  useEventListener(eventName, throttledCallback, element, options);
}
