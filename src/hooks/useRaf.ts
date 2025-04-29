import { useEffect, useRef } from 'react';

/**
 * Custom hook to run a callback function on each animation frame.
 *
 * @param {FrameRequestCallback} callback - A function to be executed on each animation frame.
 */
function useRaf(callback: FrameRequestCallback): void {
  const callbackRef = useRef<FrameRequestCallback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let animationFrameId: number;

    const tick: FrameRequestCallback = (time) => {
      callbackRef.current(time);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
}

export default useRaf;