import { useRef } from 'react';

type Initializer<T> = () => T;

// Inspired by similar implementations in libraries like `constate` or `ahooks`

/**
 * Initializes and returns a constant value that persists across component renders.
 *
 * This is useful for creating object instances, arrays, or other values that should only be
 * created once per component instance and remain stable.
 *
 * It uses a `useRef` internally to store the value.
 *
 * @template T The type of the constant value.
 * @param {Initializer<T> | T} initializer A function that returns the initial value, or the initial value itself.
 *                                       If a function is provided, it's guaranteed to be called only once.
 * @returns {T} The constant value.
 */
export function useConst<T>(initializer: Initializer<T> | T): T {
  const ref = useRef<{ value: T } | null>(null);

  if (ref.current === null) {
    // Initialize the ref's value
    ref.current = {
      value:
        typeof initializer === 'function'
          ? (initializer as Initializer<T>)() // Call the function if it's an initializer
          : initializer, // Otherwise, use the value directly
    };
  }

  // Return the stored value
  return ref.current.value;
}
