```
typescript
import { useCustomCompareEffect } from '@supunlakmal/hooks';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  age: number;
}

function MyComponent() {
  const [user, setUser] = useState<User | null>(null);

  useCustomCompareEffect(() => {
    // This effect will run when the 'user' object changes based on the custom comparison
    if (user) {
      console.log('User data changed:', user);
      // Perform side effect here (e.g., fetch data based on user)
    }
  }, [user], (prevUser, nextUser) => {
    // Custom comparison function
    if (prevUser === null || nextUser === null) {
        return prevUser === nextUser;
      }
    return prevUser.id === nextUser.id && prevUser.name === nextUser.name;
  });

  // ... rest of component logic ...

  return(
    <div>
        {user?.name}
    </div>
  )
}
```

## API

```
typescript
function useCustomCompareEffect<T>(
  effect: React.EffectCallback,
  dependencies: React.DependencyList,
  compare: (prevDeps: T, nextDeps: T) => boolean
): void;
```

## Parameters

- **`effect`**:
  - Type: `React.EffectCallback`
  - Description: The function containing the side effect to be performed. It can optionally return a cleanup function.
- **`dependencies`**:
  - Type: `React.DependencyList`
  - Description: An array of values that the effect depends on. The effect will re-run whenever any of these values change according to the `compare` function.
- **`compare`**:
  - Type: `(prevDeps: T, nextDeps: T) => boolean`
  - Description: A custom comparison function that takes two values (the previous and next dependency values) and returns `true` if they are considered equal (no effect re-run), `false` otherwise (effect re-run).

## Returns

- **`void`**:
  - Type: `void`
  - Description: This hook does not return any value. It is used for its side-effect behavior.

## How it Works

- **Custom Comparison:** The `useCustomCompareEffect` hook relies on a user-provided `compare` function to determine whether the dependencies have changed. This is in contrast to `useEffect`, which uses a shallow comparison (or reference equality).
- **Effect Execution:** The `effect` function is only executed if the `compare` function returns `false` when comparing the previous and next dependency values.
- **Cleanup:** If the `effect` function returns a cleanup function, that function will be executed before the next effect re-run or when the component unmounts.
- **React Hooks:**
  - Internally uses `useEffect` and `useRef`.
  - `useRef` stores the previous dependency values.
- **Logic**
  - Compares dependencies against the previous dependencies using the compare function.
  - Executes the effect if the comparison returns false.
- **Cleanup**
  - The cleanup function returned by the effect is executed before the next effect or when the component unmounts
- **Reasoning**
  - Offers granular control over when side effects are performed.
  - Enables performance optimization by reducing unnecessary rerenders and effect executions.
