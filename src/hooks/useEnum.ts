import { useState, useCallback } from 'react';

/**
 * @name useEnum
 * @description - Hook that manages state constrained to the values of a given enum object.
 * Allows cycling through enum values.
 *
 * @template T The enum object type.
 * @param {T} enumObject The enum object itself (e.g., MyEnum).
 * @param {T[keyof T]} initialValue The initial enum value.
 * @returns {[T[keyof T], { set: (value: T[keyof T]) => void; next: () => void; prev: () => void; }]} A tuple containing the current enum value and an object with functions to set, go to the next, or go to the previous enum value.
 * @throws If the initialValue is not a valid value within the enumObject.
 *
 * @example
 * enum Direction { North, East, South, West }
 * const [direction, { set: setDirection, next, prev }] = useEnum(Direction, Direction.North);
 *
 * next(); // direction becomes Direction.East
 * prev(); // direction becomes Direction.North again
 * setDirection(Direction.South); // direction becomes Direction.South
 */
export const useEnum = <T extends Record<string | number, string | number>>(
  enumObject: T,
  initialValue: T[keyof T]
): [
  T[keyof T],
  {
    set: (value: T[keyof T]) => void;
    next: () => void;
    prev: () => void;
  },
] => {
  // Get both string and numeric keys/values, filter duplicates for standard enums
  const enumValues = Object.values(enumObject).filter(
    (v) => typeof v === 'number' || typeof enumObject[v as any] !== 'number'
  ) as T[keyof T][];

  if (!enumValues.includes(initialValue)) {
    throw new Error(
      'useEnum initialValue must be a valid value from the enumObject.'
    );
  }

  const [currentValue, setCurrentValue] = useState<T[keyof T]>(initialValue);

  const currentIndex = enumValues.indexOf(currentValue);

  const set = useCallback(
    (value: T[keyof T]) => {
      if (enumValues.includes(value)) {
        setCurrentValue(value);
      } else {
        console.warn(
          `useEnum set: Provided value is not a valid member of the enum.`
        );
      }
    },
    [enumValues]
  );

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % enumValues.length;
    setCurrentValue(enumValues[nextIndex]);
  }, [currentIndex, enumValues]);

  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + enumValues.length) % enumValues.length;
    setCurrentValue(enumValues[prevIndex]);
  }, [currentIndex, enumValues]);

  return [currentValue, { set, next, prev }];
};
