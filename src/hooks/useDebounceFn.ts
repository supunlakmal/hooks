import { useCallback, useRef } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';

const isFunction = (value: any): value is Function =>
  typeof value === 'function';
  
interface DebounceFnConfig extends DebounceOptions {
  delay?: number;
  leading?: boolean;
}

type DebouncedFunction<T extends any[]> = (...args: T) => void;

function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  options?: DebounceFnConfig,
): {
  run: DebouncedFunction<T>;
  cancel: () => void;
  flush: () => void;
} {
  if (!isFunction(fn)) {
    console.error('useDebounceFn expected parameter is a function');
  }

  const { delay = 1000, leading = false, ...rest } = options || {};

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const debouncedFunction = useCallback(
    (...args: T) => {
      if (timer.current && !leading) {
        clearTimeout(timer.current);
      }
      if(!timer.current && leading){
        fn(...args)
      }
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [delay, fn],
  );

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  const flush = useCallback(() => {
    cancel();
    debouncedFunction()
  }, []);

  return {
    run: debouncedFunction,
    cancel,
    flush,
  };
}

export default useDebounceFn;