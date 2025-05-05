import { useState, useCallback, useEffect } from 'react';

/**
 * Represents the vibration pattern.
 * Can be a single duration, or an array of durations and pauses.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 */
type VibrationPattern = number | number[];

interface UseVibrationReturn {
  /** Indicates if the Vibration API is supported by the browser. */
  isSupported: boolean;
  /**
   * Triggers vibration on the device.
   * @param pattern The vibration pattern (duration or array of durations/pauses).
   */
  vibrate: (pattern: VibrationPattern) => void;
  /**
   * Cancels any ongoing vibration pattern.
   */
  cancelVibration: () => void;
}

const noop = () => {};

/**
 * Custom hook to interact with the browser's Vibration API.
 *
 * @returns An object containing vibration controls and support status.
 */
export function useVibration(): UseVibrationReturn {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check support only on the client side
    setIsSupported(typeof window !== 'undefined' && 'vibrate' in navigator);
  }, []);

  const vibrate = useCallback(
    (pattern: VibrationPattern) => {
      if (isSupported) {
        try {
            navigator.vibrate(pattern);
        } catch (error) {
            console.error("Vibration failed:", error);
        }
      } else {
        console.warn('Vibration API not supported.');
      }
    },
    [isSupported]
  );

  const cancelVibration = useCallback(() => {
    if (isSupported) {
      try {
        navigator.vibrate(0); // Passing 0 cancels vibration
      } catch (error) {
        console.error("Failed to cancel vibration:", error);
      }
    } else {
      console.warn('Vibration API not supported.');
    }
  }, [isSupported]);

  return {
    isSupported,
    vibrate: isSupported ? vibrate : noop,
    cancelVibration: isSupported ? cancelVibration : noop,
  };
}
