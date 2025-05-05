import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Interface for the state returned by useScreenOrientation.
 */
interface ScreenOrientationState {
  /** The type of the screen orientation (e.g., 'portrait-primary'). */
  type: OrientationType | null;
  /** The angle of the screen orientation. */
  angle: number;
  /** Indicates if the API is supported. */
  isSupported: boolean;
}

const initialState: ScreenOrientationState = {
  type: null,
  angle: 0,
  isSupported: false,
};

/**
 * Custom hook to track the screen orientation state.
 *
 * @returns An object containing the current screen orientation type and angle.
 */
export function useScreenOrientation(): Readonly<ScreenOrientationState> {
  const [state, setState] = useState<ScreenOrientationState>(initialState);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
      setState(prevState => ({ ...prevState, isSupported: true }));
    } else {
      setState(prevState => ({ ...prevState, isSupported: false }));
      return;
    }

    const screenOrientation = window.screen.orientation;

    const updateOrientation = () => {
      setState({
        type: screenOrientation.type,
        angle: screenOrientation.angle,
        isSupported: true,
      });
    };

    updateOrientation(); // Initial read

    screenOrientation.addEventListener('change', updateOrientation);

    return () => {
      screenOrientation.removeEventListener('change', updateOrientation);
    };
  }, []);

  return state;
}
