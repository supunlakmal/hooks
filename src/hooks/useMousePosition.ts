import { useState } from 'react';
import useEventListener from './useEventListener';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Custom hook to track the mouse position on the screen.
 *
 * @returns {MousePosition} An object containing the x and y coordinates of the mouse.
 */
function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEventListener('mousemove', handleMouseMove, window);

  return mousePosition;
}

export default useMousePosition;