import { useMemo, useRef, useState, useCallback } from 'react';
import { isFunction } from '../utils';
import useMemoizedFn from '../useMemoizedFn';

interface ControlOptions<T> {
  defaultValue?: T;
  defaultProp?: string;
  controlledProp?: string;
  trigger?: string;
}

type Props = Record<string, any>;

interface ControlProps<T> {
  value: T;
  defaultValue?: T;
  onChange: (val: T) => void;
}

function useControllableValue<T = any>(
  props: ControlProps<T>,
): [T, (v: T) => void];
function useControllableValue<T = any>(
  props?: Props,
  options?: ControlOptions<T>,
): [T, (v: T, ...args: any[]) => void];
function useControllableValue<T = any>(
  defaultProps: Props,
  options: ControlOptions<T> = {},
) {
  const props = defaultProps ?? {};

  const {
    defaultValue,
    defaultProp = 'defaultValue',
    controlledProp = 'value',
    trigger = 'onChange',
  } = options;

  const controlledValue = props[controlledProp] as T;
  const isControlled = Object.prototype.hasOwnProperty.call(
    props,
    controlledProp,
  );

  const initialValue = useMemo(() => {
    if (isControlled) {
      return controlledValue;
    }
    if (Object.prototype.hasOwnProperty.call(props, defaultProp)) {
      return props[defaultProp];
    }
    return defaultValue;
  }, [isControlled, controlledValue, props[defaultProp]]);

  const [internalValue, setInternalValue] = useState<T>(initialValue);
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (v: T, ...args: any[]) => {
      const newValue = isFunction(v) ? v(value) : v;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      if (props[trigger]) {
        props[trigger](newValue, ...args);
      }
    },
    [isControlled, value, props[trigger]],
  );

  return [value, useMemoizedFn(setValue)] as const;
}

export default useControllableValue;