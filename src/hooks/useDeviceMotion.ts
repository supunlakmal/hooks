import { useState, useEffect } from 'react';
import { useEventListener } from './useEventListener'; // Assuming useEventListener is in the same directory

interface DeviceMotionState {
  acceleration: DeviceMotionEventAcceleration | null;
  accelerationIncludingGravity: DeviceMotionEventAcceleration | null;
  rotationRate: DeviceMotionEventRotationRate | null;
  interval: number | null;
  isSupported: boolean;
  // Note: Unlike DeviceOrientation, DeviceMotion often requires explicit user permission.
  // Tracking permission state might be complex and is omitted here for simplicity.
  // A full implementation might integrate with the Permissions API (like usePermission).
}

const initialState: DeviceMotionState = {
  acceleration: null,
  accelerationIncludingGravity: null,
  rotationRate: null,
  interval: null,
  isSupported: false,
};

/**
 * Tracks device motion information like acceleration and rotation rate.
 * Requires HTTPS and often user permission.
 * Uses the `devicemotion` event.
 *
 * @returns {DeviceMotionState} The current state of device motion.
 */
export const useDeviceMotion = (): DeviceMotionState => {
  const [state, setState] = useState<DeviceMotionState>(initialState);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Feature detection
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleMotionChange = (event: DeviceMotionEvent) => {
    setState({
      acceleration: event.acceleration,
      accelerationIncludingGravity: event.accelerationIncludingGravity,
      rotationRate: event.rotationRate,
      interval: event.interval,
      isSupported: true, // We know it's supported if we get an event
    });
  };

  useEventListener('devicemotion', handleMotionChange, undefined, isSupported);

  // Combine internal isSupported with the rest of the state for the return value
  return { ...state, isSupported };
};
