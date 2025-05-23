import { type DependencyList, useEffect, useMemo, useRef } from 'react';

/**
 * Like `useRef`, but it returns immutable ref that contains actual value.
 *
 * @param value
 */
const useSyncedRef = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);

  ref.current = value;

  return useMemo(
    () =>
      Object.freeze({
        get current() {
          return ref.current;
        },
      }),
    []
  );
};

/**
 * Run effect only when component is unmounted.
 *
 * @param effect Effector to run on unmount
 */
const useUnmountEffect = (effect: CallableFunction): void => {
  const effectRef = useSyncedRef(effect);

  useEffect(
    () => () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      effectRef.current();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

export type DebouncedFunction<Fn extends (...args: any[]) => any> = (
  this: ThisParameterType<Fn>,
  ...args: Parameters<Fn>
) => void;

/**
 * Makes passed function debounced, otherwise acts like `useCallback`.
 *
 * @param callback Function that will be debounced.
 * @param deps Dependencies list when to update callback. It also replaces invoked
 * 	callback for scheduled debounced invocations.
 * @param delay Debounce delay.
 * @param maxWait The maximum time `callback` is allowed to be delayed before
 * it's invoked. 0 means no max wait.
 */
export const useDebouncedCallback = <Fn extends (...args: any[]) => any>(
  callback: Fn,
  deps: DependencyList,
  delay: number,
  maxWait = 0
): DebouncedFunction<Fn> => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const waitTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cb = useRef(callback);
  const lastCall = useRef<{
    args: Parameters<Fn>;
    this: ThisParameterType<Fn>;
  }>(undefined);

  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }

    if (waitTimeout.current) {
      clearTimeout(waitTimeout.current);
      waitTimeout.current = undefined;
    }
  };

  // Cancel scheduled execution on unmount
  useUnmountEffect(clear);

  useEffect(() => {
    cb.current = callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useMemo(() => {
    const execute = () => {
      clear();

      if (!lastCall.current) {
        return;
      }

      const context = lastCall.current;
      lastCall.current = undefined;

      cb.current.apply(context.this, context.args);
    };

    const wrapped = function (this, ...args) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      lastCall.current = { args, this: this };

      // Plan regular execution
      timeout.current = setTimeout(execute, delay);

      // Plan maxWait execution if required
      if (maxWait > 0 && !waitTimeout.current) {
        waitTimeout.current = setTimeout(execute, maxWait);
      }
    } as DebouncedFunction<Fn>;

    Object.defineProperties(wrapped, {
      length: { value: callback.length },
      name: { value: `${callback.name || 'anonymous'}__debounced__${delay}` },
    });

    return wrapped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, maxWait, ...deps]);
};
