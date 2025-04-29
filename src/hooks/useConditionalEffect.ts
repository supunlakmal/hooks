import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

function useConditionalEffect(
  effect: EffectCallback,
  dependencies: DependencyList,
  condition: boolean
): void {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (condition && (hasMounted.current || dependencies.length === 0 )) {
      return effect();
    }
    hasMounted.current = true;
    return;
  }, dependencies);
}

export default useConditionalEffect;