import { useState, RefObject } from 'react';
import useEventListener from './useEventListener';

interface PointerState {
  x: number;
  y: number;
  isDown: boolean;
  event: PointerEvent | null;
}

/**
 * Custom hook to track pointer events on an element.
 *
 * @param {RefObject<HTMLElement | null>} ref - The ref attached to the element to listen to, or null to listen to the window.
 * @returns {PointerState} An object containing the pointer information and the event.
 */
function usePointer(ref: RefObject<HTMLElement | null>): PointerState {
  const [pointerState, setPointerState] = useState<PointerState>({
    x: 0,
    y: 0,
    isDown: false,
    event: null,
  });

  const handlePointerDown = (event: PointerEvent) => {
    setPointerState({
      x: event.clientX,
      y: event.clientY,
      isDown: true,
      event,
    });
  };

  const handlePointerMove = (event: PointerEvent) => {
    setPointerState((prevState) => ({
      ...prevState,
      x: event.clientX,
      y: event.clientY,
      event,
    }));
  };

  const handlePointerUp = (event: PointerEvent) => {
    setPointerState((prevState) => ({
      ...prevState,
      isDown: false,
      event,
    }));
  };

  const handlePointerCancel = (event: PointerEvent) => {
    setPointerState({
        x: 0,
        y: 0,
        isDown: false,
        event,
      });
  };

  useEventListener('pointerdown', handlePointerDown, ref.current ? ref : window);
  useEventListener('pointermove', handlePointerMove, ref.current ? ref : window);
  useEventListener('pointerup', handlePointerUp, ref.current ? ref : window);
  useEventListener('pointercancel', handlePointerCancel, ref.current ? ref : window);

  return pointerState;
}

export default usePointer;