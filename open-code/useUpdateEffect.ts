import { useEffect, useRef, EffectCallback, DependencyList } from "react";

/**
 * Custom hook that behaves like `useEffect` but skips the effect execution on the initial render.
 * The effect callback is only run when the dependencies change, starting from the second render onwards.
 *
 * @param effect - Imperative function that can return a cleanup function.
 * @param deps - Array of dependencies. The effect runs only when these dependencies change (after the initial render).
 */
function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const isMounted = useRef(false);

  useEffect(() => {
    // Check if the component is already mounted
    if (isMounted.current) {
      // If mounted, run the effect and store the potential cleanup function
      return effect();
    } else {
      // On the first render (mount), just mark it as mounted
      isMounted.current = true;
      // Return undefined explicitly as no cleanup is needed for the skipped first run
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useUpdateEffect;
