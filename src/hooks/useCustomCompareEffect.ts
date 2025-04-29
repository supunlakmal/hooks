import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

type CompareFunction<T> = (prev: T | undefined, next: T) => boolean;

function useCustomCompareEffect<T>(
  effect: EffectCallback,
  value: T,
  compare: CompareFunction<T>
) {
  const prevRef = useRef<T>();

  useEffect(() => {
    if (prevRef.current === undefined || !compare(prevRef.current, value)) {
      return effect();
    }
  }, [value, compare, effect]);
  
  useEffect(() => {
    prevRef.current = value
  });
}

export default useCustomCompareEffect;