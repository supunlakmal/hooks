import { useRef, useCallback, useEffect, RefObject } from 'react';

// Define types for callbacks
type SwipeCallback = (event: TouchEvent) => void;

// Define types for options
interface UseSwipeOptions {
  threshold?: number; // Minimum distance in pixels to qualify as a swipe
  onSwipeLeft?: SwipeCallback;
  onSwipeRight?: SwipeCallback;
  onSwipeUp?: SwipeCallback;
  onSwipeDown?: SwipeCallback;
}

// Default options
const defaultOptions: Required<
  Omit<
    UseSwipeOptions,
    'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp' | 'onSwipeDown'
  >
> = {
  threshold: 50, // Minimum swipe distance of 50px
};

/**
 * Custom hook to detect swipe gestures (left, right, up, down) on a target element.
 *
 * @param ref - A React ref attached to the target element.
 * @param options - Configuration options including swipe callbacks and threshold.
 * @param options.threshold - Minimum distance (px) to be considered a swipe (default: 50).
 * @param options.onSwipeLeft - Callback for left swipe.
 * @param options.onSwipeRight - Callback for right swipe.
 * @param options.onSwipeUp - Callback for up swipe.
 * @param options.onSwipeDown - Callback for down swipe.
 */
export const useSwipe = <T extends HTMLElement>(
  ref: RefObject<T>,
  {
    threshold = defaultOptions.threshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  }: UseSwipeOptions = {}
): void => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    // Only track single touch swipes
    if (event.touches.length === 1) {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
      touchEndX.current = event.touches[0].clientX; // Initialize end to start
      touchEndY.current = event.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Update end coordinates as the touch moves
    if (event.touches.length === 1) {
      touchEndX.current = event.touches[0].clientX;
      touchEndY.current = event.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (
        touchStartX.current === null ||
        touchStartY.current === null ||
        touchEndX.current === null ||
        touchEndY.current === null
      ) {
        return; // No swipe detected if start/end points are missing
      }

      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if the swipe distance meets the threshold
      if (absDeltaX > threshold || absDeltaY > threshold) {
        // Determine primary direction (horizontal or vertical)
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.(event);
          } else {
            onSwipeLeft?.(event);
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.(event);
          } else {
            onSwipeUp?.(event);
          }
        }
      }

      // Reset coordinates after swipe ends
      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      touchEndY.current = null;
    },
    [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  // Add event listeners to the ref element
  useEffect(() => {
    const element = ref.current;

    if (element) {
      // Use passive listeners for touch events to improve scroll performance
      element.addEventListener(
        'touchstart',
        handleTouchStart as EventListener,
        { passive: true }
      );
      element.addEventListener('touchmove', handleTouchMove as EventListener, {
        passive: true,
      });
      element.addEventListener('touchend', handleTouchEnd as EventListener);
      // Optional: Add touchcancel listener to reset state if touch is interrupted
      const handleTouchCancel = () => {
        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        touchEndY.current = null;
      };
      element.addEventListener(
        'touchcancel',
        handleTouchCancel as EventListener,
        { passive: true }
      );

      // Cleanup listeners on component unmount or ref change
      return () => {
        element.removeEventListener(
          'touchstart',
          handleTouchStart as EventListener
        );
        element.removeEventListener(
          'touchmove',
          handleTouchMove as EventListener
        );
        element.removeEventListener(
          'touchend',
          handleTouchEnd as EventListener
        );
        element.removeEventListener(
          'touchcancel',
          handleTouchCancel as EventListener
        );
      };
    }

    // Add explicit return for when the element doesn't exist
    return () => {
      // No cleanup needed if element didn't exist
    };
  }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // This hook doesn't return anything directly, it attaches listeners
};
