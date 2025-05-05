import { type MutableRefObject, useMemo } from 'react';
import { useSyncedRef } from './useSyncedRef';

export type HookableRefHandler<T> = (v: T) => T;

// --- Overload Signatures ---

// Overload 1: No initial state provided (defaults to null | undefined)
export function useHookableRef<T = undefined>(): MutableRefObject<T | null | undefined>;

// Overload 2: Initial state, onSet, onGet are provided
export function useHookableRef<T>(initialValue: T, onSet: HookableRefHandler<T>, onGet: HookableRefHandler<T>): MutableRefObject<T>;

// Implementation
export function useHookableRef<T>(
  initialValue?: T,
  onSet?: HookableRefHandler<T>,
  onGet?: HookableRefHandler<T>
): MutableRefObject<T | null | undefined> | MutableRefObject<T> {
  return useHookableRefFn<T>(initialValue, onSet, onGet) as MutableRefObject<T | null | undefined> | MutableRefObject<T>;
}

/**
 * Like `React.useRef` but it is possible to define get and set handlers
 *
 * @param initialValue Initial value of a hook.
 * @param onSet Function to be called while ref.current value set. Return value
 * will be stored in ref.
 * @param onGet Function to be called while ref.current value accessed. Return
 * value will be used as a return value.
 */
const useHookableRefFn = <T>(
  initialValue?: T,
  onSet?: HookableRefHandler<T>, 
  onGet?: HookableRefHandler<T>
): MutableRefObject<T | null | undefined> => {
    const onSetRef = useSyncedRef(onSet);
  const onGetRef = useSyncedRef(onGet);

  return useMemo(() => {
    let v = initialValue;

    return {
      get current() { 
        return onGetRef.current === undefined ? v : onGetRef.current(v as T);
      },

      set current(value) {
        v = onSetRef.current === undefined ? value : onSetRef.current(value as T);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
