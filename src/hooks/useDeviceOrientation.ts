import { useState, useEffect } from 'react';
import { useEventListener } from './useEventListener'; // Assuming useEventListener handles window

export interface DeviceOrientationState {
  alpha: number | null; // Rotation around Z-axis (0-360)
  beta: number | null; // Tilt front-back (-180 to 180)
  gamma: number | null; // Tilt left-right (-90 to 90)
  absolute: boolean; // Indicates if orientation is absolute or relative to initial
  isSupported: boolean;
}

const initialOrientationState: Omit<DeviceOrientationState, 'isSupported'> = {
  alpha: null,
  beta: null,
  gamma: null,
  absolute: false,
};

/**
 * Custom hook to track the physical orientation of the device.
 * Uses the 'deviceorientation' event.
 *
 * @returns {DeviceOrientationState} An object containing orientation angles (alpha, beta, gamma) and support status.
 */
export const useDeviceOrientation = (): DeviceOrientationState => {
  const [state, setState] = useState<
    Omit<DeviceOrientationState, 'isSupported'>
  >(initialOrientationState);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const handleOrientationChange = (event: DeviceOrientationEvent) => {
    setState({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute,
    });
  };

  useEffect(() => {
    // Check for API support on mount
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      console.warn('DeviceOrientationEvent API not supported by this browser.');
    }
  }, []);

  // Use useEventListener hook to manage the listener
  useEventListener(
    'deviceorientation',
    handleOrientationChange as EventListener, // Cast handler to basic EventListener
    isSupported && typeof window !== 'undefined' ? window : undefined
  );

  // Note: Some browsers might require HTTPS or user permission for orientation data.
  // This basic hook doesn't handle requesting permissions.

  return { ...state, isSupported };
};
