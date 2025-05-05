import { type DependencyList, useMemo, useRef } from 'react';

export type DependenciesComparator<
  Deps extends DependencyList = DependencyList,
> = (a: Deps, b: Deps) => boolean;

export const basicDepsComparator: DependenciesComparator = (
  prevDeps,
  nextDeps
): boolean =>
  prevDeps.length === nextDeps.length &&
  prevDeps.every((item, i) => item === nextDeps[i]);

/**
 * Like `useMemo` but uses provided comparator function to validate dependency changes.
 *
 * @param factory Function calculating the value to be memoized.
 * @param deps Dependency list like the one passed to `useMemo`.
 * @param comparator Function that compares two dependency arrays,
 * and returns `true` if they're equal.
 */
export const useCustomCompareMemo = <
  T,
  Deps extends DependencyList = DependencyList,
>(
  factory: () => T,
  deps: Deps,
  comparator: DependenciesComparator<Deps> = basicDepsComparator
): T => {
  const dependencies = useRef<Deps>(undefined);
  const result = useRef<T>(undefined as T);

  return useMemo(() => {
    if (
      dependencies.current === undefined ||
      !comparator(dependencies.current, deps)
    ) {
      dependencies.current = deps;
      return factory();
    } else {
      return result.current as T;
    }
  }, deps);
};
