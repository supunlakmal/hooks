import { useState, useCallback } from 'react';

/**
 * @name useCycle
 * @description - Hook that cycles through a predefined list of values.
 *
 * @template T The type of the values in the list.
 * @param {T[]} items An array of items to cycle through.
 * @param {number} [initialIndex=0] The index of the item to start with.
 * @returns {[T, { next: () => void; prev: () => void; goTo: (index: number) => void; }]} A tuple containing the current item and an object with functions to cycle (`next`, `prev`) or jump (`goTo`) to a specific item.
 * @throws If the items array is empty.
 * @throws If the initialIndex is out of bounds.
 *
 * @example
 * const [currentTheme, { next: cycleTheme, prev: previousTheme }] = useCycle(['light', 'dark']);
 * const [currentValue, actions] = useCycle([10, 20, 30], 1);
 */
export const useCycle = <T>(
  items: T[],
  initialIndex: number = 0
): [
  T,
  {
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
  },
] => {
  if (items.length === 0) {
    throw new Error('useCycle requires a non-empty array of items.');
  }

  if (initialIndex < 0 || initialIndex >= items.length) {
    throw new Error(
      `useCycle initialIndex (${initialIndex}) is out of bounds (0-${items.length - 1}).`
    );
  }

  const [index, setIndex] = useState<number>(initialIndex);

  const next = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const goTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex >= 0 && targetIndex < items.length) {
        setIndex(targetIndex);
      } else {
        console.warn(
          `useCycle goTo: index (${targetIndex}) is out of bounds (0-${items.length - 1}).`
        );
      }
    },
    [items.length]
  );

  return [items[index], { next, prev, goTo }];
};
