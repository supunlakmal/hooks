import type { DependencyList } from 'react';
import { useRef } from 'react';
import dependenciesAreEqual from '../utils/depsAreSame';

function useCreation<T>(initialValue: () => T, deps: DependencyList) {
  const state = useRef<{
    deps: DependencyList;
    obj: T | undefined;
    isInitialized: boolean;
  }>({
    deps,
    obj: undefined,
    isInitialized: false,
  });

  if (!state.current.isInitialized || !dependenciesAreEqual(state.current.deps, deps)) {
    state.current.deps = deps;
    state.current.obj = initialValue();
    state.current.isInitialized = true;
  }

  return state.current.obj as T;
}

export default useCreation;
```
```typescript
import { useEffect, useState } from 'react';
import type { DependencyList, EffectCallback } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
import useDebounceFn from '../useDebounceFn';
import useUpdateEffect from '../useUpdateEffect';

interface DebounceConfig extends DebounceOptions {}

function useDebounceEffect(
  asyncEffect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceConfig,
) {
  const [debouncedFlag, setDebouncedFlag] = useState({});

  const { run: debouncedRun } = useDebounceFn(() => {
    setDebouncedFlag({});
  }, options);

  useEffect(() => {
    return debouncedRun();
  }, deps);

  useUpdateEffect(asyncEffect, [debouncedFlag]);
}

export default useDebounceEffect;
```
```
print(default_api.delete_file(path = "test/useCreation/index.ts"))
```
```
print(default_api.delete_file(path = "test/useCreation/__tests__/index.test.ts"))
```
```
print(default_api.delete_file(path = "test/useDebounceEffect/index.ts"))
```
```
print(default_api.delete_file(path = "test/useDebounceEffect/__tests__/index.test.ts"))