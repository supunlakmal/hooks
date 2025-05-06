import { useEffect, useRef, useCallback } from 'react';

/**
 * @name useAnimationFrame
 * @description - Hook that runs a callback function repeatedly using `requestAnimationFrame`.
 * It automatically stops the loop when the component unmounts.
 *
 * @param {() => void} callback The function to be called on each animation frame.
 *
 * @example
 * useAnimationFrame(() => {
 *   // Update animation state here
 *   console.log('Animating...');
 * });
 */
export const useAnimationFrame = (callback: () => void): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // Always keep the latest callback

  const animationFrameId = useRef<number | null>(null);

  const loop = useCallback(() => {
    // Use the latest callback
    callbackRef.current();
    // Request the next frame
    animationFrameId.current = requestAnimationFrame(loop);
  }, []); // Dependencies intentionally empty because loop uses callbackRef.current


  useEffect(() => {
    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(loop);

    // Cleanup: Cancel the animation frame on unmount
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [loop]); // Re-run effect if the loop function identity changes (it won't with useCallback)
};
