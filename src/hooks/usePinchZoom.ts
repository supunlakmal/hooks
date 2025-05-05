import { useRef, useEffect } from 'react';
import { useEventCallback } from './useEventCallback'; // Assuming useEventCallback exists

interface PinchZoomState {
  scale: number;
  delta: number;
  origin: { x: number; y: number }; // Center point of the pinch
}

interface PinchZoomOptions {
  onPinchStart?: (state: PinchZoomState, event: TouchEvent) => void;
  onPinchMove?: (state: PinchZoomState, event: TouchEvent) => void;
  onPinchEnd?: (state: PinchZoomState, event: TouchEvent) => void;
  minScale?: number;
  maxScale?: number;
}

const isBrowser = typeof window !== 'undefined';

// Helper function to calculate distance between two touches
const getDistance = (touches: TouchList): number => {
  const touch1 = touches[0];
  const touch2 = touches[1];
  return Math.sqrt(
    Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
  );
};

// Helper function to calculate the center point between two touches
const getCenter = (touches: TouchList): { x: number; y: number } => {
  const touch1 = touches[0];
  const touch2 = touches[1];
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
};

/**
 * Hook to detect pinch-to-zoom gestures on a target element.
 *
 * @param {React.RefObject<HTMLElement>} targetRef Ref to the target HTML element.
 * @param {PinchZoomOptions} options Configuration options and callbacks.
 */
export function usePinchZoom(
  targetRef: React.RefObject<HTMLElement>,
  options: PinchZoomOptions
): void {
  const {
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    minScale = 0.5,
    maxScale = 4,
  } = options;

  const pinchStateRef = useRef<{
    isPinching: boolean;
    initialDistance: number;
    currentScale: number;
    lastScale: number;
    origin: { x: number; y: number };
  }>({
    isPinching: false,
    initialDistance: 0,
    currentScale: 1,
    lastScale: 1,
    origin: { x: 0, y: 0 },
  });

  const stableOnPinchStart = useEventCallback(
    (state: PinchZoomState, event: TouchEvent) => onPinchStart?.(state, event)
  );
  const stableOnPinchMove = useEventCallback(
    (state: PinchZoomState, event: TouchEvent) => onPinchMove?.(state, event)
  );
  const stableOnPinchEnd = useEventCallback(
    (state: PinchZoomState, event: TouchEvent) => onPinchEnd?.(state, event)
  );

  useEffect(() => {
    const element = targetRef.current;
    if (!isBrowser || !element) {
      return;
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        event.preventDefault(); // Prevent default scroll/zoom behavior
        const initialDistance = getDistance(event.touches);
        const origin = getCenter(event.touches);
        pinchStateRef.current = {
          isPinching: true,
          initialDistance,
          currentScale: pinchStateRef.current.lastScale, // Start from last scale
          lastScale: pinchStateRef.current.lastScale,
          origin,
        };
        const state: PinchZoomState = {
          scale: pinchStateRef.current.currentScale,
          delta: 0,
          origin: pinchStateRef.current.origin,
        };
        stableOnPinchStart(state, event);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!pinchStateRef.current.isPinching || event.touches.length !== 2) {
        return;
      }
      event.preventDefault();

      const currentDistance = getDistance(event.touches);
      const scaleDelta =
        currentDistance / pinchStateRef.current.initialDistance;
      let newScale = pinchStateRef.current.lastScale * scaleDelta;

      // Clamp scale within bounds
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      const scaleChange = newScale - pinchStateRef.current.currentScale;
      pinchStateRef.current.currentScale = newScale;
      // Update origin if needed (can make movement feel more natural)
      pinchStateRef.current.origin = getCenter(event.touches);

      const state: PinchZoomState = {
        scale: pinchStateRef.current.currentScale,
        delta: scaleChange,
        origin: pinchStateRef.current.origin,
      };
      stableOnPinchMove(state, event);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (pinchStateRef.current.isPinching) {
        const state: PinchZoomState = {
          scale: pinchStateRef.current.currentScale,
          delta:
            pinchStateRef.current.currentScale -
            pinchStateRef.current.lastScale,
          origin: pinchStateRef.current.origin,
        };

        pinchStateRef.current.isPinching = false;
        pinchStateRef.current.lastScale = pinchStateRef.current.currentScale; // Save the final scale

        stableOnPinchEnd(state, event);
      }
    };

    // Add passive: false for touchstart/touchmove to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true }); // Also handle cancel

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [
    targetRef,
    minScale,
    maxScale,
    stableOnPinchStart,
    stableOnPinchMove,
    stableOnPinchEnd,
  ]);
}
