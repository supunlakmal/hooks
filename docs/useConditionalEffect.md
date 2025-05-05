**Description:**
The `useConditionalEffect` hook is a custom React hook designed to run a side effect (like data fetching or DOM manipulation) only when a specific condition is met. It's a variation on `useEffect` that includes a conditional check to determine if the effect should execute. This hook is useful in scenarios where you want to perform an action based on changes in certain dependencies, but only if a specific condition related to those dependencies is true.

**Usage:**

```
typescript
import useConditionalEffect from '@supunlakmal/hooks/useConditionalEffect';

function MyComponent({ isActive, data }) {
  useConditionalEffect(
    () => {
      console.log('Effect is running because isActive is true');
      return () => {
        console.log('Cleanup from the effect');
      };
    },
    isActive, // Only run if isActive is true
    [data] // Re-run the effect if data changes
  );

  return <div>My Component</div>;
}
```

## API

```
typescript
function useConditionalEffect(
  effect: EffectCallback,
  condition: boolean,
  deps?: DependencyList
): void;
```

## Parameters

- **effect**: `EffectCallback`
  - Type: `() => void | (() => void)`
  - Description: The function containing the side effect logic. This function can optionally return a cleanup function, which will be executed when the component unmounts or the effect is re-run.
- **condition**: `boolean`
  - Type: `boolean`
  - Description: A boolean value that determines whether the `effect` should be executed. If `true`, the effect is run; otherwise, it is skipped.
- **deps**: `DependencyList` (optional)
  - Type: `Array<any>`
  - Description: An array of dependencies. If `condition` is `true` and any of the values in this array change between renders, the `effect` will be re-run. This array functions similarly to the dependency array in `useEffect`.

## Returns

- `void`: This hook does not return any value.

## How it Works

The `useConditionalEffect` hook evaluates the `condition` parameter on every render. If the `condition` is `true`, the hook proceeds to execute the `effect` function. If the `effect` function returns a cleanup function, this cleanup function is stored and will be called before the next execution of `effect` or when the component unmounts. If the `condition` is `false`, the `effect` function and its associated cleanup function are skipped. The `deps` array is used to determine if the effect should be re-run when the `condition` is true, functioning the same way as it does in the standard `useEffect` hook.
