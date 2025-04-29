import { useState, RefObject } from 'react';
import useEventListener from './useEventListener';

interface MouseWheelState {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  event: WheelEvent | null;
}

/**
 * Custom hook to track mouse wheel events and scroll direction.
 *
 * @param {RefObject<HTMLElement | null>} ref - The ref attached to the element to listen to, or null to listen to the window.
 * @returns {MouseWheelState} An object containing the scroll information and the event.
 */
function useMouseWheel(ref: RefObject<HTMLElement | null>): MouseWheelState {
  const [mouseWheelState, setMouseWheelState] = useState<MouseWheelState>({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    event: null,
  });

  const handleWheel = (event: WheelEvent) => {
    setMouseWheelState({
      x: event.clientX,
      y: event.clientY,
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      event,
    });
  };

  useEventListener('wheel', handleWheel, ref.current ? ref : window);

  return mouseWheelState;
}

export default useMouseWheel;