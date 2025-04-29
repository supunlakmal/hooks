import { useState, useEffect } from 'react';
import useEventListener from './useEventListener';

interface OrientationState {
  angle: number;
  type: OrientationType;
  isPortrait: boolean;
  isLandscape: boolean;
}

/**
 * Custom hook to track the device's screen orientation and detect changes.
 *
 * @returns {OrientationState} An object containing the orientation information.
 */
function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>(() => {
    if (typeof window !== 'undefined' && window.screen && window.screen.orientation) {
      return {
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type,
        isPortrait: window.screen.orientation.type.includes('portrait'),
        isLandscape: window.screen.orientation.type.includes('landscape'),
      };
    }
    return {
      angle: 0,
      type: 'portrait-primary',
      isPortrait: true,
      isLandscape: false,
    };
  });

  const handleOrientationChange = () => {
    if (window.screen && window.screen.orientation) {
      setOrientation({
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type,
        isPortrait: window.screen.orientation.type.includes('portrait'),
        isLandscape: window.screen.orientation.type.includes('landscape'),
      });
    }
  };

  useEffect(() => {
    if (window.screen && window.screen.orientation) {
      handleOrientationChange()
    }
  }, [])

  useEventListener('change', handleOrientationChange, window.screen?.orientation);

  return orientation;
}

export default useOrientation;