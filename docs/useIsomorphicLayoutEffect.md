# `useIsomorphicLayoutEffect` Hook

## Description

This hook is a utility that uses `useLayoutEffect` on the client side and `useEffect` on the server side. This is useful for avoiding server-side rendering mismatches when using `useLayoutEffect`, which can cause warnings or errors.

## Usage
```
typescript
import { useIsomorphicLayoutEffect } from './src/hooks/useIsomorphicLayoutEffect';

function MyComponent() {
  useIsomorphicLayoutEffect(() => {
    // Code that should run in useLayoutEffect on the client
    // and useEffect on the server
    console.log('This runs after layout');
  }, []);

  return <div>My Component</div>;
}
```
## API
```
typescript
type EffectCallback = () => void | (() => void);

declare function useIsomorphicLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void;

type DependencyList = ReadonlyArray<unknown>;
```
## Parameters

*   **effect**: `EffectCallback`
    *   A function that contains the effect logic. It may optionally return a cleanup function.
    *   This function will be called after the component has rendered.
*   **deps**: `DependencyList` (optional)
    *   An optional array of dependencies. If any value in this array changes between renders, the effect will be re-run.
    *   If not provided, the effect will run after every render.

## Returns

*   **void**: This hook does not return any value. It is used for performing side effects.

## How it Works

This hook internally checks if the code is running in a browser environment. If it is, it uses `useLayoutEffect`. If it's not (e.g., during server-side rendering), it falls back to `useEffect`. This approach ensures that layout effects are handled correctly in both client and server environments, preventing potential hydration mismatches. It's a simple wrapper around React's built-in effects to make them safe for isomorphic applications.