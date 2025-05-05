import { RefObject, useCallback, useEffect, useRef } from 'react';

// Define the type for the callback function
type LongPressCallback = (event: MouseEvent | TouchEvent) => void;

// Define the type for the options object
interface UseLongPressOptions {
  threshold?: number; // Duration in milliseconds to qualify as a long press
  onStart?: (event: MouseEvent | TouchEvent) => void; // Callback when pressing starts
  onEnd?: (event: MouseEvent | TouchEvent) => void; // Callback when pressing ends (regardless of long press)
  onCancel?: (event: MouseEvent | TouchEvent) => void; // Callback if press is cancelled (e.g., mouse leaves)
}

// Default options
const defaultOptions: Required<
  Omit<UseLongPressOptions, 'onStart' | 'onEnd' | 'onCancel'>
> = {
  threshold: 400, // Default long press duration
};

/**
 * Custom hook to detect long press events on an element.
 *
 * @param ref - A React ref attached to the target element.
 * @param callback - Function to call when a long press is detected.
 * @param options - Optional configuration for the long press behavior.
 * @param options.threshold - Duration in ms until the press is considered long (default: 400).
 * @param options.onStart - Callback fired when the press starts.
 * @param options.onEnd - Callback fired when the press ends.
 * @param options.onCancel - Callback fired if the press is cancelled before duration.
 */
export const useLongPress = (
  ref: RefObject<HTMLElement | null>,
  callback: LongPressCallback,
  {
    threshold = defaultOptions.threshold,
    onStart,
    onEnd,
    onCancel,
  } = {} as UseLongPressOptions
): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<EventTarget | null>(null); // Store the target element

  // Clears any active timer and resets target
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    targetRef.current = null; // Reset target
  }, []);

  // Function called when the threshold is met
  const onLongPress = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (callback && targetRef.current === event.target) {
        // Ensure target hasn't changed
        callback(event);
      }
      clearTimer(); // Clear timer after long press is triggered
    },
    [callback, clearTimer]
  );

  // Start the timer on press down
  const start = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Prevent default behavior for touch events, like scrolling
      if (event.type === 'touchstart') {
        // event.preventDefault(); // Consider adding an option for this
      }

      // Ensure the ref is current and not already pressing
      if (ref.current && ref.current.contains(event.target as Node)) {
        targetRef.current = event.target; // Store the initial target
        onStart?.(event); // Fire onStart callback

        // Clear any existing timer
        clearTimer();

        // Set a new timer
        timeoutRef.current = setTimeout(() => onLongPress(event), threshold);
      }
    },
    [ref, threshold, onStart, onLongPress, clearTimer]
  );

  // Clear the timer on press up or leave
  const cancel = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Fire onEnd if a press was in progress on the target
      if (targetRef.current === event.target) {
        onEnd?.(event);
      }

      // Fire onCancel if a timer was active (press was ongoing)
      if (timeoutRef.current && targetRef.current === event.target) {
        onCancel?.(event);
      }

      clearTimer(); // Always clear timer on cancel/end actions
    },
    [onEnd, onCancel, clearTimer]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (event: MouseEvent) => start(event),
    [start]
  );
  const handleMouseUp = useCallback(
    (event: MouseEvent) => cancel(event),
    [cancel]
  );
  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      // Cancel only if the mouse truly leaves the original target element
      if (targetRef.current === event.target) {
        cancel(event);
      }
    },
    [cancel]
  );

  // Touch event handlers
  const handleTouchStart = useCallback(
    (event: TouchEvent) => start(event),
    [start]
  );
  const handleTouchEnd = useCallback(
    (event: TouchEvent) => cancel(event),
    [cancel]
  );
  // Touch cancel might happen for various reasons (e.g., moving finger off screen)
  const handleTouchCancel = useCallback(
    (event: TouchEvent) => cancel(event),
    [cancel]
  );

  // Add event listeners to the ref element
  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown as EventListener);
      element.addEventListener('mouseup', handleMouseUp as EventListener);
      element.addEventListener('mouseleave', handleMouseLeave as EventListener);
      element.addEventListener(
        'touchstart',
        handleTouchStart as EventListener,
        { passive: true }
      ); // Use passive for touchstart for performance
      element.addEventListener('touchend', handleTouchEnd as EventListener);
      element.addEventListener(
        'touchcancel',
        handleTouchCancel as EventListener
      );

      // Cleanup listeners on component unmount or ref change
      return () => {
        element.removeEventListener(
          'mousedown',
          handleMouseDown as EventListener
        );
        element.removeEventListener('mouseup', handleMouseUp as EventListener);
        element.removeEventListener(
          'mouseleave',
          handleMouseLeave as EventListener
        );
        element.removeEventListener(
          'touchstart',
          handleTouchStart as EventListener
        );
        element.removeEventListener(
          'touchend',
          handleTouchEnd as EventListener
        );
        element.removeEventListener(
          'touchcancel',
          handleTouchCancel as EventListener
        );

        // Also clear timer on unmount
        clearTimer();
      };
    }

    // Add explicit return for when the element doesn't exist
    return () => {
      // Clean up any timers if the element wasn't available
      clearTimer();
    };

    // Intentionally not including clearTimer in the dependency array,
    // as its definition is stable due to useCallback([]).
  }, [
    ref,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
  ]);

  // This hook doesn't return anything directly, it attaches listeners
};
