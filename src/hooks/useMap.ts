import { useMemo, useState } from "react";

// Define the actions interface for manipulating the map
interface MapActions<K, V> {
  set: (key: K, value: V) => void;
  setAll: (entries: Iterable<readonly [K, V]>) => void;
  remove: (key: K) => void;
  reset: () => void; // Reset to initial state
  clear: () => void; // Clear to empty map
  get: (key: K) => V | undefined;
}

// Define the return type of the hook
type UseMapResult<K, V> = [Map<K, V>, MapActions<K, V>];

/**
 * Custom hook to manage state as a Map, providing helper functions.
 *
 * @template K - The type of the keys in the Map.
 * @template V - The type of the values in the Map.
 * @param initialMap - Optional initial Map or an iterable of key-value pairs.
 * @returns A tuple containing the current Map state and an actions object.
 */
export function useMap<K, V>(
  initialMap?: Map<K, V> | Iterable<readonly [K, V]>
): UseMapResult<K, V> {
  const [map, setMap] = useState<Map<K, V>>(() => new Map(initialMap));

  const actions = useMemo(
    () => ({
      set: (key: K, value: V) => {
        setMap((prevMap) => {
          // Create a new map to ensure immutability and trigger re-render
          const newMap = new Map(prevMap);
          newMap.set(key, value);
          return newMap;
        });
      },
      setAll: (entries: Iterable<readonly [K, V]>) => {
        setMap((prevMap) => {
          // Allow setting multiple entries, potentially merging or replacing
          const newMap = new Map(prevMap); // Start with previous entries

          // Use Array.from to convert Iterable to Array to avoid the downlevelIteration issue
          Array.from(entries).forEach(([key, value]) => {
            newMap.set(key, value);
          });

          return newMap;
        });
      },
      remove: (key: K) => {
        setMap((prevMap) => {
          if (!prevMap.has(key)) {
            return prevMap; // No change if key doesn't exist
          }
          const newMap = new Map(prevMap);
          newMap.delete(key);
          return newMap;
        });
      },
      reset: () => {
        // Reset back to the initial state provided when the hook was first called
        setMap(new Map(initialMap));
      },
      clear: () => {
        // Clear the map completely
        setMap(new Map());
      },
      get: (key: K): V | undefined => {
        // Directly access the current map state. Since map is state,
        // this will reflect the latest version on re-render.
        // Note: This doesn't cause a re-render if only `get` is used.
        return map.get(key);
      },
    }),
    [initialMap]
  ); // Recalculate actions only if initialMap reference changes

  return [map, actions];
}


