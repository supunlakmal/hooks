import { useMemo } from 'react';

/**
 * Custom hook that returns a default value if the provided value is null or undefined.
 *
 * @template T The type of the value.
 * @param value The potentially null or undefined value.
 * @param defaultValue The default value to return if `value` is null or undefined.
 * @returns The original value if it's not null/undefined, otherwise the default value.
 */
export function useDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return useMemo(() => {
    return value ?? defaultValue;
  }, [value, defaultValue]);
}
