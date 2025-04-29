import { useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';

type EffectCallback = () => (void | (() => void | undefined));
type DependencyList = ReadonlyArray<any>;

function useDebouncedEffect(
  effect: EffectCallback,
  delay: number,
  deps?: DependencyList
) {
  const debouncedCallback = useDebounce(effect, delay);

  const cleanupRef = useRef<ReturnType<EffectCallback>>();

  useEffect(() => {
    cleanupRef.current = undefined;
    debouncedCallback();
  }, [debouncedCallback, ...(deps ?? [])]);

  useEffect(() => {
    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, []);
}

export { useDebouncedEffect };