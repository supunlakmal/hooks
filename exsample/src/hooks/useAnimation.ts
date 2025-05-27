import { useRef, useCallback, useState, useEffect } from 'react';

// Define the callback type
type AnimationCallback = (progress: number, elapsed: number) => void;

interface UseAnimationOptions {
  duration: number; // Duration in milliseconds
  onComplete?: () => void; // Optional callback when animation finishes
}

interface UseAnimationControls {
  start: () => void;
  stop: () => void; // Stop immediately
  reset: () => void; // Stop and reset progress
  isRunning: boolean;
}

/**
 * Custom hook to manage a basic animation loop using requestAnimationFrame.
 *
 * @param callback - Function called on each animation frame. Receives progress (0-1) and elapsed time (ms).
 * @param options - Configuration object.
 * @param options.duration - Total duration of the animation in milliseconds.
 * @param options.onComplete - Optional callback triggered when the animation completes its duration.
 * @returns Controls object with start, stop, reset functions and running status.
 */
export const useAnimation = (
  callback: AnimationCallback,
  { duration, onComplete }: UseAnimationOptions
): UseAnimationControls => {
  const [isRunning, setIsRunning] = useState(false);
  const frameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);
  const onCompleteRef = useRef(onComplete);

  // Update refs if callbacks change
  callbackRef.current = callback;
  onCompleteRef.current = onComplete;

  const loop = useCallback(
    (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime; // Set start time on first frame
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration); // Clamp progress between 0 and 1

      // Execute the user's callback
      callbackRef.current(progress, elapsed);

      if (progress < 1) {
        // Continue the loop
        frameIdRef.current = requestAnimationFrame(loop);
      } else {
        // Animation finished
        setIsRunning(false);
        startTimeRef.current = null;
        frameIdRef.current = null;
        onCompleteRef.current?.(); // Call completion callback if provided
      }
    },
    [duration]
  );

  const start = useCallback(() => {
    if (isRunning || typeof window === 'undefined') return; // Prevent starting if already running or SSR

    setIsRunning(true);
    startTimeRef.current = null; // Reset start time
    frameIdRef.current = requestAnimationFrame(loop);
  }, [isRunning, loop]);

  const stop = useCallback(() => {
    if (!isRunning || frameIdRef.current === null) return;

    cancelAnimationFrame(frameIdRef.current);
    setIsRunning(false);
    // Keep startTimeRef as is, allows potential resume?
    // For a simple stop, maybe resetting startTimeRef isn't needed.
    frameIdRef.current = null;
  }, [isRunning]);

  const reset = useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
    }
    setIsRunning(false);
    startTimeRef.current = null;
    frameIdRef.current = null;
    // Optionally call callback with initial state (progress 0)?
    // callbackRef.current(0, 0);
  }, []);

  // Ensure animation is cancelled on unmount
  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return { start, stop, reset, isRunning };
};
