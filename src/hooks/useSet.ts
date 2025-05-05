import { useMemo, useState } from 'react';

// Define the actions interface for manipulating the set
interface SetActions<T> {
  add: (value: T) => void;
  remove: (value: T) => void;
  toggle: (value: T) => void;
  reset: () => void; // Reset to initial state
  clear: () => void; // Clear to empty set
  has: (value: T) => boolean;
}

// Define the return type of the hook
type UseSetResult<T> = [Set<T>, SetActions<T>];

/**
 * Custom hook to manage state as a Set, providing helper functions.
 *
 * @template T - The type of the values in the Set.
 * @param initialSet - Optional initial Set or an iterable of values.
 * @returns A tuple containing the current Set state and an actions object.
 */
export const useSet = <T>(
  initialSet?: Set<T> | Iterable<T>
): UseSetResult<T> => {
  const [set, setSet] = useState<Set<T>>(() => new Set(initialSet));

  const actions = useMemo(
    () => ({
      add: (value: T) => {
        setSet((prevSet) => {
          if (prevSet.has(value)) {
            return prevSet; // No change if value already exists
          }
          const newSet = new Set(prevSet);
          newSet.add(value);
          return newSet;
        });
      },
      remove: (value: T) => {
        setSet((prevSet) => {
          if (!prevSet.has(value)) {
            return prevSet; // No change if value doesn't exist
          }
          const newSet = new Set(prevSet);
          newSet.delete(value);
          return newSet;
        });
      },
      toggle: (value: T) => {
        setSet((prevSet) => {
          const newSet = new Set(prevSet);
          if (newSet.has(value)) {
            newSet.delete(value);
          } else {
            newSet.add(value);
          }
          return newSet;
        });
      },
      reset: () => {
        // Reset back to the initial state provided when the hook was first called
        setSet(new Set(initialSet));
      },
      clear: () => {
        // Clear the set completely
        setSet(new Set());
      },
      has: (value: T): boolean => {
        // Direct check on the current set state
        return set.has(value);
      },
    }),
    [initialSet]
  ); // Recalculate actions only if initialSet reference changes

  return [set, actions];
};
