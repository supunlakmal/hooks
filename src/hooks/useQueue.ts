import { useState, useCallback, useMemo } from 'react';

// Define the shape of the return value for useQueue
export interface QueueMethods<T> {
  /** Adds an item to the end of the queue. */
  add: (item: T) => void;
  /** Removes the item from the front of the queue. */
  remove: () => void;
  /** Returns the item at the front of the queue without removing it. Returns undefined if the queue is empty. */
  peek: () => T | undefined;
  /** The current number of items in the queue. */
  size: number;
  /** The first item in the queue (same as peek), or undefined if empty. */
  first: T | undefined;
  /** The last item in the queue, or undefined if empty. */
  last: T | undefined;
  /** Read-only access to the entire queue array. */
  queue: readonly T[];
  /** Removes all items from the queue. */
  clear: () => void;
}

/**
 * Manages a stateful queue (First-In, First-Out).
 * Provides methods to add, remove, peek, and clear the queue, along with its current state.
 *
 * @template T The type of items the queue will hold.
 * @param initialQueue An optional initial array of items to populate the queue.
 * @returns An object containing the queue state and methods to interact with it.
 */
export function useQueue<T>(initialQueue: T[] = []): QueueMethods<T> {
  const [queue, setQueue] = useState<T[]>(initialQueue);

  /** Adds an item to the end of the queue. */
  const add = useCallback((item: T) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  }, []);

  /** Removes the item from the front of the queue. */
  const remove = useCallback((): void => {
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        return [];
      }
      return prevQueue.slice(1); // Return new array excluding the first item
    });
  }, []);

  /** Returns the item at the front of the queue without removing it. */
  const peek = useCallback((): T | undefined => {
    return queue[0];
  }, [queue]); // Depends on the current queue state

  /** Removes all items from the queue. */
  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  // Memoize derived values to avoid recalculating on every render
  const size = useMemo(() => queue.length, [queue]);
  const first = useMemo(() => queue[0], [queue]);
  const last = useMemo(() => queue[queue.length - 1], [queue]);

  // Return the state and the memoized methods
  return {
    add,
    remove, // Use the corrected version
    peek,
    size,
    first,
    last,
    queue, // Provide read-only access
    clear,
  };
}
