import { useCallback } from 'react';

// Type definition for a Ref, which can be a callback or an object ref
type ReactRef<T> =
  | React.RefCallback<T>
  | React.MutableRefObject<T>
  | null
  | undefined;

/**
 * Custom hook that merges multiple refs (callback refs or MutableRefObject refs) into a single callback ref.
 * This allows a single DOM element or component instance to be referenced by multiple sources.
 *
 * @template T The type of the element or component being referenced.
 * @param refs - An array of refs (React.RefCallback<T> or React.MutableRefObject<T>) to merge.
 * @returns {React.RefCallback<T>} A single memoized callback ref that assigns the instance to all provided refs.
 */
export const useMergeRefs = <T>(
  ...refs: ReactRef<T>[]
): React.RefCallback<T> => {
  return useCallback(
    (instance: T | null) => {
      // Iterate through the refs and assign the instance to each one
      for (const ref of refs) {
        if (typeof ref === 'function') {
          // If it's a callback ref, call it with the instance
          ref(instance);
        } else if (ref != null && typeof ref === 'object') {
          // If it's an object ref (MutableRefObject), set its .current property
          // We explicitly check `ref != null` to satisfy TypeScript, though it should be handled by the type
          (ref as React.MutableRefObject<T | null>).current = instance;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs // Re-run the callback creation if the refs array changes
  );
};
