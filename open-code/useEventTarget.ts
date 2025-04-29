import { useCallback, useState, useRef } from 'react';

const isFunction = (value: any): value is Function => typeof value === 'function';

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

interface TargetWithdValue<U> {
  target: {
    value: U;
  };
}

export interface EventTargetOptions<T, U> {
  initialValue?: T;
  transformer?: (value: U) => T;
}

function useEventTarget<T, U = T>(options?: EventTargetOptions<T, U>) {
  const { initialValue, transformer } = options || {};
  const [value, setValue] = useState(initialValue);

  const transformerRef = useLatest(transformer);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  const onChange = useCallback(
    (e: TargetWithdValue<U>) => {
      const _value = e.target.value;
      if (isFunction(transformerRef.current)) {
        return setValue(transformerRef.current(_value));
      }
      // no transformer => U and T should be the same
      return setValue(_value as unknown as T);
    },
    [],
  );

  return [
    value,
    {
      onChange,
      reset,
    },
  ] as const;
}

export default useEventTarget;