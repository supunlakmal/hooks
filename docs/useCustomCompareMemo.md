# `useCustomCompareMemo` Hook

**Description:**
The `useCustomCompareMemo` hook is a custom React hook that works like `useMemo` but allows you to define a custom comparison function for its dependencies. This is particularly useful when dealing with complex objects or arrays as dependencies, where a shallow comparison might not be sufficient to determine if the dependencies have changed.

**Usage:**

```
typescript
import { useCustomCompareMemo } from '@supunlakmal/hooks';

interface MyObject {
  id: number;
  value: string;
}

function MyComponent({ data }: { data: MyObject }) {
  const memoizedData = useCustomCompareMemo<MyObject>(
    () => {
      // Expensive computation
      console.log('Calculating memoizedData');
      return data;
    },
    [data],
    (prevData, nextData) => prevData.id === nextData.id // Custom comparison function
  );

  return (
    <div>
      <p>Memoized Data Value: {memoizedData.value}</p>
    </div>
  );
}
```

## API

```
typescript
function useCustomCompareMemo<T>(
  factory: () => T,
  dependencies: ReadonlyArray<any>,
  compare: (prevDeps: ReadonlyArray<any>, nextDeps: ReadonlyArray<any>) => boolean
): T;
```

## Parameters

- **`factory`**: `() => T`
  - Type: `function`
  - Description: A function that returns the value to be memoized. This function is only called if the dependencies have changed according to the `compare` function.
- **`dependencies`**: `ReadonlyArray<any>`
  - Type: `array`
  - Description: An array of dependencies. The `compare` function will be used to determine if these dependencies have changed.
- **`compare`**: `(prevDeps: ReadonlyArray<any>, nextDeps: ReadonlyArray<any>) => boolean`
  - Type: `function`
  - Description: A custom comparison function that takes two arrays (previous dependencies and next dependencies) and returns `true` if they are considered equal (i.e., no change), `false` otherwise. This function is crucial for customizing the memoization behavior.

## Returns

- **`T`**
  - Type: `any`
  - Description: The memoized value returned by the `factory` function. This value will only be recalculated if the `compare` function determines that the dependencies have changed.

## How it Works

The `useCustomCompareMemo` hook uses the `useRef` and `useMemo` hooks internally. Here's a breakdown:

1.  **Dependency Storage:** It maintains a `ref` to hold the previous dependencies.
2.  **Comparison:** When the component re-renders, it uses the provided `compare` function to compare the previous dependencies (stored in the `ref`) with the current dependencies.
3.  **Memoization:**
    - If the `compare` function returns `true` (indicating no change), it returns the previously memoized value.
    - If the `compare` function returns `false` (indicating a change), it calls the `factory` function to recalculate the value, updates the stored dependencies in the `ref`, and then returns the new value.
4.  **React hooks** The hook use `useRef` and `useMemo`
5.  **Logic and calculations**: `useCustomCompareMemo` hook uses a custom comparison function to determine if the dependencies have changed. If the dependencies are different, it calls the factory function to get a new memoized value. Otherwise, it returns the old value.
6.  **Cleanup procedures**: Not applicable, There are no cleanup procedures for this hook.
7.  **Reasoning behind implementation choices** The use of a custom compare function (`compare`) is the key choice here, as it allows the user to define exactly how dependencies should be compared. This is particularly helpful when standard equality checks (`===`) are insufficient, such as when dealing with objects, deep equality, or custom structures.
