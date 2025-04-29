import { useRef, useEffect, MutableRefObject } from 'react';

type RefCallback<T> = (instance: T | null) => void;

function useHookableRef<T>(callback: RefCallback<T>): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    callback(ref.current);
  }, [callback]);

  return ref;
}

export default useHookableRef;