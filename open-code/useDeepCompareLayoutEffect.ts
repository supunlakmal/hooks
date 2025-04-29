import { useLayoutEffect, useRef, EffectCallback, DependencyList } from 'react';


const depsEqual = (aDeps: DependencyList, bDeps: DependencyList = []): boolean => {
  if (aDeps === bDeps) return true;
  if (aDeps.length !== bDeps.length) return false;
  return aDeps.every((dep, index) => Object.is(dep, bDeps[index]));
};

function createDeepCompareHook(useHook: typeof useLayoutEffect) {
  return (effect: EffectCallback, deps: DependencyList) => {
    const ref = useRef<DependencyList>([]);
    const signalRef = useRef<number>(0);

    if (!depsEqual(deps, ref.current)) {
      ref.current = deps;
      signalRef.current += 1;
    }

    useHook(effect, [signalRef.current]);
  };
}

const useDeepCompareLayoutEffect = createDeepCompareHook(useLayoutEffect);

export default useDeepCompareLayoutEffect;