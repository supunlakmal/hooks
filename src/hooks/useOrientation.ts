import { useState, useEffect } from 'react';

// Define the structure for the orientation state
interface OrientationState {
  angle: number;
  type: OrientationType;
  /** True if the API is supported, false otherwise */
  isSupported: boolean;
}

const isBrowser = typeof window !== 'undefined';
const initialOrientation = (): OrientationState => {
  if (!isBrowser || !window.screen || !window.screen.orientation) {
    return { angle: 0, type: 'landscape-primary', isSupported: false };
  }
  return {
    angle: window.screen.orientation.angle,
    type: window.screen.orientation.type,
    isSupported: true,
  };
};

/**
 * Tracks the device's screen orientation using the Screen Orientation API.
 * Provides the current angle and type (e.g., 'portrait-primary').
 *
 * @returns An object containing the current orientation angle and type.
 */
export function useOrientation(): OrientationState {
  const [orientation, setOrientation] =
    useState<OrientationState>(initialOrientation);

  useEffect(() => {
    if (!orientation.isSupported) {
      return; // API not supported, nothing to listen for
    }

    const screenOrientation = window.screen.orientation;

    const handleChange = () => {
      setOrientation({
        angle: screenOrientation.angle,
        type: screenOrientation.type,
        isSupported: true,
      });
    };

    // Add the event listener
    screenOrientation.addEventListener('change', handleChange);

    // Cleanup function to remove the listener
    return () => {
      screenOrientation.removeEventListener('change', handleChange);
    };
  }, [orientation.isSupported]); // Only run effect if support changes (or on mount)

  return orientation;
}
