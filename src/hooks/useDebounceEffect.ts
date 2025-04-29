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