import { useState, useCallback, useMemo } from 'react';

type Queue<T> = {
  add: (item: T) => void;
  remove: () => T | null;
  first: () => T | null;
  count: () => number;
  reset: () => void;
  empty: () => boolean;
};

function useQueue<T>(): Queue<T> {
  const [internalQueue, updateQueue] = useState<T[]>([]);

  const add = useCallback((item: T) => {
    updateQueue((prev) => [...prev, item]);
  }, []);

  const remove = useCallback(() => {
    if (internalQueue.length === 0) {
      return null;
    }
    const itemToReturn = internalQueue[0];
    updateQueue((prev) => prev.slice(1));
    return itemToReturn;
  }, [internalQueue]);

  const first = useCallback(() => {
    return internalQueue.length > 0 ? internalQueue[0] : null;
  }, [internalQueue]);

  const count = useCallback(() => internalQueue.length, [internalQueue]);

  const reset = useCallback(() => {
    updateQueue([]);
  }, []);

  const empty = useCallback(() => internalQueue.length === 0, [internalQueue]);

  return useMemo(() => ({ add, remove, first, count, reset, empty }), [add, remove, first, count, reset, empty]);
}
export default useQueue;