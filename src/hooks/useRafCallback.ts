import { useCallback, useRef } from 'react';
// Assuming these exist and work as expected
import { isBrowser } from '../util/const'; // Utility to check if running in a browser
import { useSyncedRef } from './useSyncedRef'; // Hook to keep a ref updated with the latest value
import { useUnmountEffect } from './useUnmountEffect'; // Hook to run cleanup on unmount

/**
 * Makes passed function to be called within next animation frame.
 * Consequential calls, before the animation frame occurred, cancel previously scheduled call.
 *
 * @param callback Callback to fire within animation frame.
 */
export const useRafCallback = <T extends (...args: any[]) => any>(
  callback: T
): ((...args: Parameters<T>) => void) => {
  // Added more specific typing
  const cbRef = useSyncedRef(callback); // Use synced ref to always call the latest callback
  const frame = useRef<number>(0); // Stores the requestAnimationFrame ID

  // Cleanup function to cancel pending frame
  const cancel = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
  }, []);

  // Ensure cancellation on unmount
  useUnmountEffect(cancel);

  // The function that schedules the callback
  const rafCallback = useCallback(
    (...args: Parameters<T>) => {
      // Use Parameters<T> for args type
      if (!isBrowser) {
        return;
      }
      cancel(); // Cancel any previous scheduled frame

      frame.current = requestAnimationFrame(() => {
        frame.current = 0; // Reset frame ID *before* calling callback
        cbRef.current(...args); // Call the *latest* callback with args
      });
    },
    [cancel, cbRef] // Dependencies: only cancel and cbRef (which is stable)
    // Note: cbRef itself is stable, useSyncedRef handles the update internally.
    // So the rafCallback function identity is stable.
  );

  return rafCallback;
};
