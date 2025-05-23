import { useState, useCallback } from 'react';

export interface ArrayActions<T> {
  /** Adds an element to the end of the array. */
  push: (item: T) => void;
  /** Removes the last element from the array and returns it. Note: This hook's pop won't return the element directly like array.pop, it just updates state. */
  pop: () => void;
  /** Replaces the entire array with a new array. */
  set: (newArray: T[]) => void;
  /** Clears the array, making it empty. */
  clear: () => void;
  /** Removes an element at a specific index. */
  removeIndex: (index: number) => void;
  /** Removes the first occurrence of a specific value from the array. */
  remove: (item: T) => void;
  /** Filters the array based on a predicate function. */
  filter: (predicate: (value: T, index: number, array: T[]) => boolean) => void;
  /** Sorts the array using a compare function. */
  sort: (compareFn?: (a: T, b: T) => number) => void;
  /** Reverses the order of elements in the array. */
  reverse: () => void;
  /** Inserts an element at a specific index. */
  insert: (index: number, item: T) => void;
  /** Sets the value of an element at a specific index. */
  setIndex: (index: number, item: T) => void;
  /** Concatenates one or more arrays to the current array. */
  concat: (...items: (T | ConcatArray<T>)[]) => void;
}

/**
 * @name useArray
 * @description A hook to manage array state in React with common helper functions.
 * Provides a more convenient API for array manipulations than directly using useState with arrays.
 *
 * @template T The type of elements in the array.
 * @param {T[]} initialArray The initial array or a function that returns the initial array.
 * @returns {[T[], ArrayActions<T>]} A tuple where the first element is the current array state,
 * and the second element is an object with actions to manipulate the array.
 *
 * @example
 * const MyComponent = () => {
 *   const [list, { push, pop, clear, filter, removeIndex }] = useArray([1, 2, 3]);
 *
 *   return (
 *     <div>
 *       <p>Current Array: {list.join(', ')}</p>
 *       <button onClick={() => push(Math.floor(Math.random() * 10))}>Add Random</button>
 *       <button onClick={() => pop()}>Pop</button>
 *       <button onClick={() => filter(n => n % 2 === 0)}>Filter Even</button>
 *       <button onClick={() => removeIndex(0)}>Remove First</button>
 *       <button onClick={() => clear()}>Clear</button>
 *     </div>
 *   );
 * };
 */
export const useArray = <T>(
  initialArray: T[] | (() => T[])
): [T[], ArrayActions<T>] => {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((item: T) => {
    setArray((prevArray) => [...prevArray, item]);
  }, []);

  const pop = useCallback(() => {
    setArray((prevArray) => prevArray.slice(0, -1));
  }, []);

  const set = useCallback((newArray: T[]) => {
    setArray(newArray);
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const removeIndex = useCallback((index: number) => {
    setArray((prevArray) => {
      if (index < 0 || index >= prevArray.length) return prevArray; // Index out of bounds
      return [...prevArray.slice(0, index), ...prevArray.slice(index + 1)];
    });
  }, []);

  const remove = useCallback((item: T) => {
    setArray((prevArray) => {
      const index = prevArray.indexOf(item);
      if (index === -1) return prevArray; // Item not found
      return [...prevArray.slice(0, index), ...prevArray.slice(index + 1)];
    });
  }, []);

  const filter = useCallback(
    (predicate: (value: T, index: number, array: T[]) => boolean) => {
      setArray((prevArray) => prevArray.filter(predicate));
    },
    []
  );

  const sort = useCallback((compareFn?: (a: T, b: T) => number) => {
    setArray((prevArray) => [...prevArray].sort(compareFn));
  }, []);

  const reverse = useCallback(() => {
    setArray((prevArray) => [...prevArray].reverse());
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setArray((prevArray) => {
      if (index < 0 || index > prevArray.length) return prevArray; // Index out of bounds for insert
      return [...prevArray.slice(0, index), item, ...prevArray.slice(index)];
    });
  }, []);

  const setIndex = useCallback((index: number, item: T) => {
    setArray((prevArray) => {
      if (index < 0 || index >= prevArray.length) return prevArray; // Index out of bounds
      const newArray = [...prevArray];
      newArray[index] = item;
      return newArray;
    });
  }, []);
  
  const concat = useCallback((...items: (T | ConcatArray<T>)[]) => {
    setArray(prevArray => prevArray.concat(...items));
  }, []);

  return [
    array,
    {
      push,
      pop,
      set,
      clear,
      removeIndex,
      remove,
      filter,
      sort,
      reverse,
      insert,
      setIndex,
      concat,
    },
  ];
};

export default useArray;
