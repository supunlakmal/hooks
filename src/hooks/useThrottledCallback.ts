import { type DependencyList, useMemo, useRef } from 'react';
import { useUnmountEffect } from './useUnmountEffect';

export type ThrottledFunction<Fn extends (...args: any[]) => any> = (
  this: ThisParameterType<Fn>,
  ...args: Parameters<Fn>
) => void;

/**
 * Makes passed function throttled, otherwise acts like `useCallback`.
 *
 * @param callback Function that will be throttled.
 * @param deps Dependencies list when to update callback.
 * @param delay Throttle delay.
 * @param noTrailing If `noTrailing` is true, callback will only execute every
 * `delay` milliseconds, otherwise, callback will be executed one final time
 * after the last throttled-function call.
 * @returns Returns a throttled version of the function.
 */
export const useThrottledCallback = <Fn extends (...args: any[]) => any>(
  callback: Fn,
  deps: DependencyList,
  wait: number,
  noTrailing = false
): ((...args: Parameters<Fn>) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastCall = useRef<{
    args: Parameters<Fn>;
    this: ThisParameterType<Fn>;
  }>(undefined);

  if (typeof wait !== 'number') {
    console.error('Wait must be a number.');
    return () => {};
  }

  if (typeof callback !== 'function') {
    console.error('Callback must be a function.');
    return () => {};
  }

  useUnmountEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  });

  return useMemo((): ((...args: Parameters<Fn>) => void) => {
    let delay = wait;

    const execute = (context: ThisParameterType<Fn>, args: Parameters<Fn>) => {
      lastCall.current = undefined;
      callback.apply(context, args);
      setTimeout(() => {
        // If trailing execution is not disabled, call callback with last
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // received arguments and context
        if (!noTrailing && lastCall.current) {
          execute(lastCall.current.this, lastCall.current.args);

          lastCall.current = undefined;
        }
      }, delay);
    };

    const wrapped = function (
      this: ThisParameterType<Fn>,
      ...args: Parameters<Fn>
    ): void {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

      if (timerRef.current) {
        // If we cant execute callback immediately - save its arguments and
        // context to execute it when delay is passed
        lastCall.current = { args, this: this };

        return;
      }

      execute(this, args);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, delay);
    };

    Object.defineProperties(wrapped, {
      length: { value: callback.length },
      name: { value: `${callback.name || 'anonymous'}__throttled__${delay}` },
    });

    return wrapped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wait, noTrailing, callback, ...deps]);
};
