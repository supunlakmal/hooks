# `useAnimationFrame` Hook

## Description

The `useAnimationFrame` hook takes a callback function as an argument. This callback function will be executed on each frame of the `requestAnimationFrame` loop. The hook automatically starts the animation loop when the component mounts and stops it when the component unmounts.

## Example

```typescript
import React, { useRef, useState, useEffect } from 'react';
import { useAnimationFrame } from '@supunlakmal/hooks'; // Adjust the import path

function AnimationCounter() {
  const [count, setCount] = useState(0);

  const animationCallback = (deltaTime: number) => {
    // Example: Increment count over time
    // deltaTime is the time in milliseconds since the last frame
    setCount(prevCount => prevCount + deltaTime * 0.01); // Increment based on time
  };

  useAnimationFrame(animationCallback);

  return (
    <div>
      <h1>useAnimationFrame Example</h1>
      <p>Animating Count: {count.toFixed(2)}</p>
      <p>This counter increments every frame.</p>
    </div>
  );
}

export default AnimationCounter;
```

## API

```typescript
function useAnimationFrame(callback: (deltaTime: number) => void): void;
```

### Parameters

- **callback**: `(deltaTime: number) => void`
  - Type: `function`
  - Description: The function to be executed on each animation frame. It receives `deltaTime` (time in milliseconds since the last frame) as an argument.

## How it Works

The `useAnimationFrame` hook uses `React.useRef` to store the request ID returned by `requestAnimationFrame` and `React.useEffect` to manage the animation loop lifecycle. The `useEffect` sets up the animation loop when the component mounts and ensures the loop is cancelled using `cancelAnimationFrame` when the component unmounts or the dependencies change.
