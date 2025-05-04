import { useMemo, DependencyList } from "react";

/**
 * Calculates derived state based on other values (props, state, etc.).
 * The factory function is re-executed only when the specified dependencies change.
 * This is essentially a semantic wrapper around `useMemo` for clarifying intent.
 *
 * @template T The type of the derived state.
 * @param factoryFn A function that computes the derived state.
 * @param dependencies An array of dependencies. The factory function will re-run if any dependency changes.
 * @returns The computed derived state.
 */
export const useDerivedState = <T>(
  factoryFn: () => T,
  dependencies: DependencyList
): T => {
  // Directly use useMemo as the core implementation
  const derivedState = useMemo(factoryFn, dependencies);
  return derivedState;
}


