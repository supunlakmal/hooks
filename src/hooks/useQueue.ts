import { useState, useCallback } from 'react';

interface Queue<T> {
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  peek: () => T | undefined;
  getSize: () => number;
  clear: () => void;
  isEmpty: () => boolean;
}

/**
 * Custom hook to manage a queue data structure.
 *
 * @returns {Queue<T>} An object containing queue operations.
 */
function useQueue<T>(): Queue<T> {
  const [queue, setQueue] = useState<T[]>([]);

  const enqueue = useCallback((item: T) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  }, []);

  const dequeue = useCallback(() => {
    if (queue.length === 0) {
      return undefined;
    }
    const item = queue[0];
    setQueue((prevQueue) => prevQueue.slice(1));
    return item;
  }, [queue]);

  const peek = useCallback(() => {
    return queue.length > 0 ? queue[0] : undefined;
  }, [queue]);

  const getSize = useCallback(() => {
    return queue.length;
  }, [queue]);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  const isEmpty = useCallback(() => {
    return queue.length === 0;
  }, [queue]);

  return { enqueue, dequeue, peek, getSize, clear, isEmpty };
}

export default useQueue;