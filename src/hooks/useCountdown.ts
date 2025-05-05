import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownOptions {
  /** Initial number of seconds for the countdown. */
  seconds: number;
  /** Interval in milliseconds for the countdown updates (default: 1000). */
  interval?: number;
  /** Callback function executed when the countdown completes. */
  onComplete?: () => void;
  /** Start the countdown automatically on mount (default: true). */
  autoStart?: boolean;
}

interface CountdownControls {
  /** Current remaining seconds. */
  remainingSeconds: number;
  /** Boolean indicating if the countdown is currently running. */
  isRunning: boolean;
  /** Function to start or resume the countdown. */
  start: () => void;
  /** Function to pause the countdown. */
  pause: () => void;
  /** Function to reset the countdown to the initial seconds. */
  reset: () => void;
}

/**
 * Manages a countdown timer with start, pause, and reset controls.
 *
 * @param options Configuration options for the countdown timer.
 * @returns Controls and state for the countdown timer.
 */
export const useCountdown = ({
  seconds,
  interval = 1000,
  onComplete,
  autoStart = true,
}: CountdownOptions): CountdownControls => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setRemainingSeconds((prevSeconds) => {
      // Use interval seconds calculation instead of decrementing by 1
      const secondsToDecrement = interval / 1000;
      if (prevSeconds <= secondsToDecrement) {
        clearExistingInterval();
        setIsRunning(false);
        onCompleteRef.current?.();
        return 0;
      }
      return prevSeconds - secondsToDecrement;
    });
  }, [interval, clearExistingInterval]);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(tick, interval);
    } else {
      clearExistingInterval();
    }

    return clearExistingInterval; // Cleanup interval on unmount or when isRunning/interval changes
  }, [isRunning, interval, tick, remainingSeconds, clearExistingInterval]);

  const start = useCallback(() => {
    if (!isRunning && remainingSeconds > 0) {
      setIsRunning(true);
    }
  }, [isRunning, remainingSeconds]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    clearExistingInterval();
    setRemainingSeconds(seconds);
    setIsRunning(autoStart);
  }, [seconds, autoStart, clearExistingInterval]);

  // Effect to handle changes in the initial seconds prop
  useEffect(() => {
    setRemainingSeconds(seconds);
    // Optionally restart timer if it was running
    // setIsRunning(autoStart); // Decided against auto-restart on prop change
  }, [seconds]);

  return { remainingSeconds, isRunning, start, pause, reset };
};
