import { useState, useEffect, useCallback } from 'react';
import { useThrottledCallback } from './useThrottledCallback'; // Assuming signature

interface ScrollPosition {
  scrollX: number;
  scrollY: number;
}

// Define throttle options type explicitly
interface ThrottleOptions {
  leading?: boolean; // Standard throttle option
  trailing?: boolean; // Standard throttle option
  noTrailing?: boolean; // Specific option from useThrottledCallback
}

const isBrowser = typeof window !== 'undefined';

/**
 * A hook that tracks window scroll position, but throttles the updates.
 * Useful for performance optimizations when components depend on scroll position.
 *
 * @param delay The throttle delay in milliseconds.
 * @param throttleOptions Optional options for throttling (e.g., noTrailing).
 * @returns An object containing the throttled `scrollX` and `scrollY` positions.
 */
export function useThrottledScroll(
  delay: number,
  throttleOptions?: ThrottleOptions
): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    scrollX: isBrowser ? window.scrollX : 0,
    scrollY: isBrowser ? window.scrollY : 0,
  });

  // handleScroll is stable because setPosition is stable
  const handleScroll = useCallback(() => {
    setPosition({
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
  }, []);

  // Throttle the scroll handler with correct arguments
  const throttledHandleScroll = useThrottledCallback(
    handleScroll,               // The callback
    [],                         // Deps for the callback (empty as handleScroll is stable)
    delay,                      // wait (throttle delay)
    throttleOptions?.noTrailing // noTrailing option
  );

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    // Attach the throttled listener
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      // Note: Cancellation logic might depend on useThrottledCallback implementation
      // if it returns a cancel function or modifies the returned function.
      // The current useUnmountEffect within useThrottledCallback should handle timer cleanup.
    };
    // useEffect depends on the throttled function instance
  }, [throttledHandleScroll]);

  return position;
}
