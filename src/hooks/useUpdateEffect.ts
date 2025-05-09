import { type DependencyList, type EffectCallback, useEffect } from 'react';
import { noop } from '../util/const';
import { useFirstMountState } from './useFirstMountState';

/**
 * Effect hook that ignores the first render (not invoked on mount).
 *
 * @param effect Effector to run on updates
 * @param deps Dependencies list, as for `useEffect` hook
 */
export const useUpdateEffect = (
  effect: EffectCallback,
  deps?: DependencyList
): void => {
  const isFirstMount = useFirstMountState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(isFirstMount ? noop : effect, deps);
};
