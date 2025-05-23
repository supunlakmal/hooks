import { useEffect } from 'react';
import { useSyncedRef } from './useSyncedRef';

/**
 * Run effect only when component is unmounted.
 *
 * @param effect Effector to run on unmount
 */
export const useUnmountEffect = (effect: CallableFunction): void => {
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
