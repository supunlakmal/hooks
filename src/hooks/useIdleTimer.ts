import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerProps {
  onIdle: () => void;
  onActive?: () => void;
  timeout: number; // in milliseconds
  debounce?: number; // Debounce time for activity events
}

const defaultEvents: (keyof WindowEventMap)[] = [
  'mousemove',
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
];

/**
 * Custom hook to detect user inactivity.
 *
 * @param {UseIdleTimerProps} options - Configuration options.
 * @param {() => void} options.onIdle - Callback function to execute when the user becomes idle.
 * @param {() => void} [options.onActive] - Optional callback function to execute when the user becomes active after being idle.
 * @param {number} options.timeout - Idle timeout duration in milliseconds.
 * @param {number} [options.debounce=0] - Debounce time in milliseconds for handling frequent activity events.
 * @returns {boolean} Returns the current idle state (`true` if idle, `false` otherwise).
 */
export const useIdleTimer = ({
  onIdle,
  onActive,
  timeout,
  debounce = 0,
}: UseIdleTimerProps) => {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const eventDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTime = useRef<number>(Date.now());

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    onIdle();
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(handleIdle, timeout);
  }, [handleIdle, timeout]);

  const handleActivity = useCallback(() => {
    lastActivityTime.current = Date.now();
    if (isIdle) {
      setIsIdle(false);
      if (onActive) {
        onActive();
      }
    }
    resetTimer();
  }, [isIdle, onActive, resetTimer]);

  const debouncedActivityHandler = useCallback(() => {
    if (debounce > 0) {
      if (eventDebounceTimer.current) {
        clearTimeout(eventDebounceTimer.current);
      }
      eventDebounceTimer.current = setTimeout(handleActivity, debounce);
    } else {
      handleActivity();
    }
  }, [handleActivity, debounce]);

  useEffect(() => {
    // Initial setup
    resetTimer();

    // Attach event listeners
    defaultEvents.forEach((event) => {
      window.addEventListener(event, debouncedActivityHandler, {
        passive: true,
      });
    });

    // Cleanup
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      if (eventDebounceTimer.current) {
        clearTimeout(eventDebounceTimer.current);
      }
      defaultEvents.forEach((event) => {
        window.removeEventListener(event, debouncedActivityHandler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTimer, debouncedActivityHandler]); // Add dependencies correctly

  return isIdle;
};
