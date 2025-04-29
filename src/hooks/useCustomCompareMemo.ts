import { useRef, useMemo, DependencyList } from 'react';

function useCustomCompareMemo<T>(factory: () => T, deps: DependencyList, comparator: (prevDeps: DependencyList, nextDeps: DependencyList) => boolean): T {
  const prevDepsRef = useRef<DependencyList>(deps);
  const memoizedValue = useMemo(() => {
    return factory();
  }, [
    ...deps,
    (prevDeps: DependencyList, nextDeps: DependencyList) => {
        if(prevDepsRef.current === undefined){
            prevDepsRef.current=nextDeps
            return false;
        }
        const isEqual = comparator(prevDepsRef.current, nextDeps);
      
        if (!isEqual) {
          prevDepsRef.current = nextDeps;
        }
      
        return isEqual;
      }
  ]);
  return memoizedValue;
}

export default useCustomCompareMemo;