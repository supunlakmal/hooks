import { useEffect, useCallback } from 'react';
import { useEventCallback } from './useEventCallback'; // Assuming useEventCallback exists

const isBrowser = typeof window !== 'undefined';

/**
 * Hook that triggers a callback when the user's mouse cursor leaves the viewport area.
 *
 * @param {() => void} onPageLeave The callback function to execute when the mouse leaves the page.
 * @param {boolean} [enabled=true] Optional boolean to enable or disable the hook.
 */
export function usePageLeave(onPageLeave: () => void, enabled: boolean = true): void {
  const handlePageLeave = useEventCallback(onPageLeave);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    // Check if the mouse is truly leaving the viewport
    // event.clientY is the vertical coordinate within the application's viewport
    // event.relatedTarget is the element the mouse is moving to (null if leaving window)
    // event.target is the element the event originated from (document in this case)
    const from = event.target;
    const to = event.relatedTarget;

    // Trigger if the mouse moves outside the document boundaries
    if (!to && from === document.documentElement) {
        handlePageLeave();
    }
    // An alternative simpler check might be just based on clientY, but less robust:
    // if (event.clientY <= 0) {
    //     handlePageLeave();
    // }

  }, [handlePageLeave]);

  useEffect(() => {
    if (!isBrowser || !enabled) {
      return;
    }

    // Using 'mouseout' on the documentElement is a common way to detect leaving the window
    document.documentElement.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.documentElement.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [enabled, handleMouseLeave]); // Re-attach if enabled status changes
}
