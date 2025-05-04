import { useEffect, useRef, EffectCallback, DependencyList } from "react";

// Basic deep comparison function (consider using lodash.isequal for robustness)
export const isDeepEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !isDeepEqual(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}

function useDeepCompareMemoize(value: DependencyList): DependencyList {
  const ref = useRef<DependencyList>([]);

  if (!isDeepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * A custom effect hook that deeply compares its dependencies instead of using
 * shallow reference comparison (like the standard `useEffect`).
 *
 * Useful when effect dependencies are objects or arrays that might be recreated
 * on each render but are structurally identical.
 *
 * **Warning:** Deep comparison can be computationally expensive. Use judiciously
 * and prefer memoizing complex dependencies with `useMemo` or `useCallback` where possible.
 * Consider using a more robust deep comparison library (e.g., `lodash.isequal`).
 *
 * @param effect Imperative function that can return a cleanup function.
 * @param dependencies Array of dependencies. The effect runs only if these dependencies are deeply unequal compared to the previous render.
 */
export const useDeepCompareEffect = (
  effect: EffectCallback,
  dependencies: DependencyList
): void => {
  // Memoize the dependencies array based on deep comparison
  const memoizedDependencies = useDeepCompareMemoize(dependencies);

  // Use the memoized dependencies for the standard useEffect
  useEffect(effect, memoizedDependencies);
}


