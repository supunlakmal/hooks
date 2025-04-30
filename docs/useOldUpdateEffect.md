# `useOldUpdateEffect` Hook

## Description

The `useOldUpdateEffect` hook is a custom React hook designed to mimic the behavior of `useEffect`, but with the key difference that it skips running on the initial render. This is particularly useful when you need to perform side effects only on subsequent updates, not during the initial component mount.

## Usage

Here's how you can use the `useOldUpdateEffect` hook in your React components:
```
typescript
import { useOldUpdateEffect } from '@supunlakmal/hooks';
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  useOldUpdateEffect(() => {
    console.log('Count updated:', count);
    // Perform side effects here, e.g., data fetching, DOM manipulation
    return () => {
        //Clean up function
    };
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
## API
```
typescript
function useOldUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
```
## Parameters

*   **effect:** `React.EffectCallback`
    *   Type: `() => void | (() => void)`
    *   Detailed description: A function containing the side effect logic. It can optionally return a cleanup function.
*   **deps:** `React.DependencyList` (optional)
    *   Type: `readonly any[]`
    *   Detailed description: An array of dependencies. The effect will only run if any of the dependencies have changed since the last render. If not provided, the effect will run after every render.

## Returns

*   **void**
    *   Type: `void`
    *   Behavior explanation: The hook does not return any value. Its purpose is to execute side effects.

## How it Works

The `useOldUpdateEffect` hook internally uses the `useRef` and `useEffect` hooks. It employs a ref (`isFirstRender`) to track whether the component is rendering for the first time.

*   **Initial Render Check:** On the initial render, the `isFirstRender` ref is `true`. The hook skips executing the provided `effect`.
*   **Subsequent Renders:** On subsequent renders, `isFirstRender` becomes `false`, and the hook executes the `effect` function if the dependencies (`deps`) have changed.
*   **Dependency Management:** The `deps` array (if provided) determines when the effect should re-run. It functions identically to `useEffect`'s dependency array.
*   **Cleanup:** If the `effect` function returns a cleanup function, this cleanup function is executed before the next effect run or before the component unmounts.
*   **React Hooks:** `useRef`, `useEffect`.
* The hook checks if it's the first render using `isFirstRender` and if it is, it won't run the effect. Otherwise, it will run the effect like `useEffect`. If dependencies are provided, it will only run if they change. A cleanup function can also be returned by the `effect`.
* When we don't want an effect to run on the initial render, we use this hook.