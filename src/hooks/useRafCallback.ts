import { useCallback, useEffect, useRef } from 'react';

type RafCallback = (time: DOMHighResTimeStamp) => void;

function useRafCallback(callback: RafCallback, deps: unknown[] = []) {
  const rafRef = useRef<number | null>(null);
  const savedCallback = useRef<RafCallback>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const loop = useCallback((time: DOMHighResTimeStamp) => {
    savedCallback.current(time);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  useEffect(() => {
      start()
    return stop
  }, deps)

  return { start, stop };
}

export default useRafCallback;