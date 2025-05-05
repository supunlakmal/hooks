import { useEffect, useRef } from 'react';
import { useEventListener } from './useEventListener';

// Define the custom event name
const HISTORY_CHANGE_EVENT = 'historystatechange';

/**
 * Custom hook to execute a callback function when the browser's route changes.
 * This detects changes from popstate (back/forward buttons) and programmatic
 * navigation via history.pushState and history.replaceState.
 *
 * @param {() => void} onChange - The callback function to execute on route change.
 */
export function useRouteChange(onChange: () => void): void {
  const savedOnChange = useRef(onChange);

  // Update ref to latest callback instance on each render
  useEffect(() => {
    savedOnChange.current = onChange;
  }, [onChange]);

  // Listener for the custom event dispatched by patched methods
  const handleHistoryChange = () => {
    savedOnChange.current();
  };

  // Listen for popstate and our custom event
  useEventListener('popstate', handleHistoryChange); // Handles back/forward
  useEventListener(HISTORY_CHANGE_EVENT as any, handleHistoryChange); // Handles pushState/replaceState
  // Note: Cast needed as HISTORY_CHANGE_EVENT is not a standard WindowEventMap key

  // Effect to patch history methods
  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window === 'undefined' || !window.history) {
      return;
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Wrap pushState
    history.pushState = function (...args) {
      const result = originalPushState.apply(history, args);
      // Dispatch custom event after state change
      window.dispatchEvent(new CustomEvent(HISTORY_CHANGE_EVENT));
      return result;
    };

    // Wrap replaceState
    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(history, args);
      // Dispatch custom event after state change
      window.dispatchEvent(new CustomEvent(HISTORY_CHANGE_EVENT));
      return result;
    };

    // Cleanup: Restore original methods on unmount
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []); // Run only once on mount
}
