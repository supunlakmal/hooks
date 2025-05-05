import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage'; // Import the existing hook

// Re-use the QueueMethods interface shape (or define a similar one if needed)
export interface LocalStorageQueueMethods<T> {
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
 * Manages a stateful queue (First-In, First-Out) persisted in Local Storage.
 * Utilizes the `useLocalStorage` hook internally.
 *
 * @template T The type of items the queue will hold. Must be JSON-serializable.
 * @param key The key to use for storing the queue in Local Storage.
 * @param initialValue An optional initial array to use if nothing is in Local Storage for the key.
 * @returns An object containing the queue state and methods to interact with it.
 */
export function useLocalStorageQueue<T>(
    key: string,
    initialValue: T[] = []
): LocalStorageQueueMethods<T> {
    // Use the useLocalStorage hook to manage the queue array
    // The third argument to useLocalStorage handles options like raw storage or custom serializers if needed
    const [queue, setQueue] = useLocalStorage<T[]>(key, initialValue);

    /** Adds an item to the end of the queue. */
    const add = useCallback((item: T) => {
        setQueue((prevQueue) => [...(prevQueue || []), item]); // Handle potential null/undefined from storage initially
    }, [setQueue]);

    /** Removes the item from the front of the queue. */
    const remove = useCallback((): void => {
        setQueue((prevQueue) => {
            if (!prevQueue || prevQueue.length === 0) {
                return [];
            }
            // Return new array excluding the first item
            return prevQueue.slice(1);
        });
    }, [setQueue]);


    /** Returns the item at the front of the queue without removing it. */
    const peek = useCallback((): T | undefined => {
        return queue?.[0];
    }, [queue]);

    /** Removes all items from the queue. */
    const clear = useCallback(() => {
        setQueue([]);
    }, [setQueue]);


    // Memoize derived values
    // Ensure queue is treated as an empty array if null/undefined from storage initially
    const currentQueue = queue || [];
    const size = useMemo(() => currentQueue.length, [currentQueue]);
    const first = useMemo(() => currentQueue[0], [currentQueue]);
    const last = useMemo(() => currentQueue[currentQueue.length - 1], [currentQueue]);


    // Return the state and the memoized methods
    return {
        add,
        remove,
        peek,
        size,
        first,
        last,
        queue: currentQueue, // Provide read-only access to the current queue state
        clear
    };
}
