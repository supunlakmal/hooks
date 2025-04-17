# `useDeepCompareEffect`

A drop-in replacement for `React.useEffect` that performs a **deep comparison** of its dependencies instead of the default shallow reference comparison.

## Usage

Use it exactly like `useEffect`, but be mindful that the deep comparison can be more computationally expensive.

```tsx
import React, { useState, useEffect } from "react";
import { useDeepCompareEffect } from "your-hooks-library"; // Adjust import path

interface ComplexObject {
  id: number;
  config: {
    enabled: boolean;
    values: number[];
  };
  name?: string;
}

const SettingsDisplay: React.FC<{ settings: ComplexObject }> = ({
  settings,
}) => {
  const [renderCount, setRenderCount] = useState(0);
  const [effectRunCount, setEffectRunCount] = useState(0);
  const [deepEffectRunCount, setDeepEffectRunCount] = useState(0);

  // Standard useEffect: Will run on every render if parent passes a new object reference
  useEffect(() => {
    console.log(
      "[useEffect] Running due to settings change (or initial render)."
    );
    setEffectRunCount((c) => c + 1);
    // Simulate some action based on settings
  }, [settings]); // Dependency array with the object

  // useDeepCompareEffect: Will only run if the *content* of settings changes
  useDeepCompareEffect(() => {
    console.log(
      "[useDeepCompareEffect] Running due to deep settings change (or initial render)."
    );
    setDeepEffectRunCount((c) => c + 1);
    // Simulate some action based on settings
  }, [settings]); // Dependency array with the object

  // Increment render count on each render
  useEffect(() => {
    setRenderCount((c) => c + 1);
  });

  return (
    <div
      style={{ border: "1px solid green", padding: "10px", marginTop: "10px" }}
    >
      <h4>Settings Display</h4>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
      <p>Component Render Count: {renderCount}</p>
      <p>Standard useEffect Run Count: {effectRunCount}</p>
      <p>Deep Compare useEffect Run Count: {deepEffectRunCount}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [id, setId] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const [forceRender, setForceRender] = useState(0);

  // IMPORTANT: Creating a new object on every render
  // This will trigger standard useEffect even if the values are the same.
  const currentSettings: ComplexObject = {
    id: id,
    config: {
      enabled: enabled,
      values: [10, 20, 30], // Keeping this array reference stable for simplicity here
    },
    // Add a name property that doesn't change to show it doesn't trigger deep compare
    name: "Stable Setting",
  };

  return (
    <div>
      <h2>useDeepCompareEffect Demo</h2>
      <p>
        This demo shows how `useDeepCompareEffect` avoids re-running when an
        object dependency has the same value but a different reference, unlike
        standard `useEffect`.
      </p>
      <button onClick={() => setId((i) => i + 1)}>
        Change ID (Deep Change)
      </button>
      <button onClick={() => setEnabled((e) => !e)}>
        Toggle Enabled (Deep Change)
      </button>
      <button onClick={() => setForceRender((c) => c + 1)}>
        Force Parent Render (No Change)
      </button>
      <p>Check console logs and run counts below.</p>

      <SettingsDisplay settings={currentSettings} />
    </div>
  );
};

export default App;
```

## API

### `useDeepCompareEffect(effect: EffectCallback, dependencies: DependencyList): void`

#### Parameters

- `effect` (`EffectCallback`, required): The function to run as the effect. It can optionally return a cleanup function.
- `dependencies` (`DependencyList`, required): An array of dependencies. The `effect` function will run after mount and whenever a **deep comparison** between the current dependencies and the dependencies from the previous render indicates inequality.

#### Returns

- `void`: This hook does not return any value.

## How it Works

1.  **Memoize Dependencies**: It uses an internal helper (`useDeepCompareMemoize`) which stores the previous dependencies in a ref (`useRef`).
2.  **Deep Comparison**: On each render, it performs a deep comparison between the incoming `dependencies` array and the stored previous dependencies.
3.  **Update Memoized Ref**: If the deep comparison shows the dependencies are different, the ref storing the memoized dependencies is updated with the current dependencies array.
4.  **Standard `useEffect`**: The hook then calls the standard `React.useEffect` hook, passing the original `effect` callback but using the _memoized_ dependencies array (the one stored in the ref) as its dependency list.
5.  **Effect Trigger**: Consequently, the standard `useEffect` only re-runs the `effect` callback when the reference of the _memoized_ dependencies array changes, which only happens when the deep comparison detects an actual change in the values within the dependencies.

## Notes & Warnings

- **Performance Cost**: Deep comparison is more computationally expensive than the shallow reference check performed by `useEffect`. Avoid using it unnecessarily.
- **Prefer Memoization**: Often, the need for deep comparison arises from dependencies (objects, arrays) being unintentionally recreated on every render. The preferred solution is usually to memoize the creation of those dependencies using `React.useMemo` or `React.useCallback` in the parent component or where they are defined.
- **Use Sparingly**: Only use `useDeepCompareEffect` when you have a legitimate reason why dependencies cannot be easily memoized or when the cost of the effect running unnecessarily outweighs the cost of the deep comparison.
- **Comparison Limitations**: The basic deep comparison function included might not handle all edge cases (e.g., cyclic objects, complex classes, Maps, Sets, Dates, RegExps). For robust comparison, consider integrating a well-tested library like `lodash.isequal`.
