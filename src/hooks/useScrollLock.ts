import { useState, useEffect, useCallback } from 'react';

const isBrowser = typeof window !== 'undefined';

interface UseScrollLockReturn {
  isLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

let originalOverflow = '';
let originalPaddingRight = '';
let scrollbarWidth = 0;

/**
 * Hook to lock and unlock body scroll.
 *
 * Useful for modals, drawers, or overlays where background scrolling should be prevented.
 *
 * @returns {UseScrollLockReturn} Object with lock state and control functions.
 */
export function useScrollLock(): UseScrollLockReturn {
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const lockScroll = useCallback(() => {
    if (!isBrowser || isLocked) return;

    const body = document.body;
    // Save original styles
    originalOverflow = body.style.overflow;
    originalPaddingRight = body.style.paddingRight;

    // Calculate scrollbar width only once if needed
    if (scrollbarWidth === 0) {
      scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    }

    // Prevent scrolling
    body.style.overflow = 'hidden';

    // Add padding to compensate for scrollbar removal if necessary
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    setIsLocked(true);
  }, [isLocked]);

  const unlockScroll = useCallback(() => {
    if (!isBrowser || !isLocked) return;

    const body = document.body;
    body.style.overflow = originalOverflow;
    body.style.paddingRight = originalPaddingRight;

    setIsLocked(false);
  }, [isLocked]);

  // Optional: Automatically unlock scroll on component unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (isLocked) {
        // Ensure unlock is called if component unmounts while locked
        // Need to call the actual logic, not just setIsLocked
        if (isBrowser) {
          const body = document.body;
          body.style.overflow = originalOverflow;
          body.style.paddingRight = originalPaddingRight;
        }
      }
    };
    // We only want this effect to run the cleanup on unmount, related to the 'isLocked' state when it was mounted.
    // Adding 'isLocked' to deps would cause it to re-run cleanup logic on every lock/unlock cycle unnecessarily.
    // The `unlockScroll` useCallback already handles the state update correctly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]); // Rerun cleanup logic registration if lock state changes externally? Debatable, simplest might be [] or [unlockScroll]

  return { isLocked, lockScroll, unlockScroll };
}
