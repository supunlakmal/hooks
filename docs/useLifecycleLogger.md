# `useLifecycleLogger` Hook

## Description

This hook logs the component's lifecycle events to the console, such as mount, update, and unmount. It's useful for debugging and understanding how a component behaves over time.

## Usage

```
typescript
import { useLifecycleLogger } from '@supunlakmal/hooks';
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  useLifecycleLogger('MyComponent');

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
function useLifecycleLogger(componentName: string): void;
```

## Parameters

- **componentName**
  - `string`
  - The name of the component, used in the console logs.

## Returns

- `void`
  - This hook does not return any value. It only performs side effects (logging).

## How it Works

- It utilizes the `useEffect` hook to track the component's lifecycle.
- On mount, it logs "\[componentName\] mounted".
- On every update, it logs "\[componentName\] updated".
- On unmount, it logs "\[componentName\] unmounted".
- no Logic and calculations.
- Cleanup procedures: The useEffect cleanup function handles the unmount log.
- Reasoning behind implementation choices: `useEffect` is suitable for side effects like logging, and the cleanup function ensures that the unmount log is fired correctly.
