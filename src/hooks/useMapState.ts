import { useState, useCallback } from 'react';

type MapState<K extends string | number | symbol, V> = {
  [key in K]: V;
};

export function useMapState<K extends string | number | symbol, V>(
  initialState: MapState<K, V> = {} as MapState<K, V>
): [MapState<K, V>, (key: K, value: V) => void, (key: K) => void, () => void] {
  const [state, setState] = useState<MapState<K, V>>(initialState);

  const set = useCallback((key: K, value: V) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const remove = useCallback((key: K) => {
    setState((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, set, remove, reset];
}
