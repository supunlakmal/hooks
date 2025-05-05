# `useAnimation` Hook

A hook to manage a simple time-based animation loop using `requestAnimationFrame`. It allows running a callback function on each frame over a specified duration, providing progress and elapsed time information.

## Usage

Provide a callback function that performs the animation updates and a duration. The hook returns controls to start, stop, and reset the animation, along with its running status.

```typescript
import React, { useState, useCallback, CSSProperties } from "react";
import { useAnimation } from "@supunlakmal/hooks"; // Adjust path

function AnimationExample() {
  const [position, setPosition] = useState(0); // State to animate (e.g., horizontal position)

  // Animation callback: Update position based on progress
  const animationCallback = useCallback((progress: number, elapsed: number) => {
    // Example: Linear movement from 0 to 200 pixels
    const newPosition = progress * 200;
    setPosition(newPosition);
    // console.log(`Elapsed: ${elapsed.toFixed(0)}ms, Progress: ${progress.toFixed(2)}, Position: ${newPosition.toFixed(2)}px`);
  }, []);

  const handleComplete = () => {
    console.log("Animation complete!");
  };

  const { start, stop, reset, isRunning } = useAnimation(animationCallback, {
    duration: 1500, // Animate over 1.5 seconds
    onComplete: handleComplete,
  });

  const boxStyle: CSSProperties = {
    width: "50px",
    height: "50px",
    backgroundColor: "dodgerblue",
    position: "relative",
    left: `${position}px`, // Apply the animated position
    marginTop: "20px",
  };

  return (
    <div>
      <h1>useAnimation Example</h1>
      <p>Controls a `requestAnimationFrame` loop over a duration.</p>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button
        onClick={stop}
        disabled={!isRunning}
        style={{ marginLeft: "10px" }}
      >
        Stop
      </button>
      <button onClick={reset} style={{ marginLeft: "10px" }}>
        Reset
      </button>
      <p>Status: {isRunning ? "Running" : "Stopped"}</p>

      <div
        style={{
          width: "250px",
          height: "60px",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        <div style={boxStyle}></div>
      </div>
    </div>
  );
}

export default AnimationExample;
```

## API

```typescript
type AnimationCallback = (progress: number, elapsed: number) => void;

interface UseAnimationOptions {
  duration: number; // Duration in milliseconds
  onComplete?: () => void; // Optional callback when animation finishes
}

interface UseAnimationControls {
  start: () => void;
  stop: () => void; // Stop immediately
  reset: () => void; // Stop and reset progress/state
  isRunning: boolean;
}

function useAnimation(
  callback: AnimationCallback,
  options: UseAnimationOptions
): UseAnimationControls;
```

### Parameters

- `callback`: `AnimationCallback` - A function that will be executed on each animation frame. It receives two arguments:
  - `progress`: `number` - A value from 0 to 1 indicating the progress of the animation through its duration (0 at the start, 1 at the end).
  - `elapsed`: `number` - The time in milliseconds that has elapsed since the animation started.
- `options`: `UseAnimationOptions` - An object containing:
  - `duration`: `number` - The total duration for the animation cycle in milliseconds.
  - `onComplete`: `() => void` (Optional) - A callback function that is triggered once the animation reaches its full duration (`progress` becomes 1).

### Returns

- `UseAnimationControls`: An object with control functions and status:
  - `start`: `() => void` - Starts the animation loop. If already running, it does nothing.
  - `stop`: `() => void` - Stops the animation loop immediately at the current frame. Does not reset progress or elapsed time.
  - `reset`: `() => void` - Stops the animation loop (if running) and resets the internal start time, effectively resetting the progress to 0 for the next `start()` call.
  - `isRunning`: `boolean` - True if the animation loop is currently active, false otherwise.

## How it Works

1.  **State and Refs**: Uses `useState` for `isRunning` status. Uses `useRef` to hold the `requestAnimationFrame` ID (`frameIdRef`), the animation start timestamp (`startTimeRef`), and the latest versions of the `callback` and `onComplete` functions (to avoid stale closures).
2.  **`loop` Function**: A memoized `useCallback` function that forms the core of the animation loop.
    - It's called by `requestAnimationFrame`.
    - It calculates the `elapsed` time since the animation started (`startTimeRef`).
    - It calculates the `progress` by dividing `elapsed` by `duration`, clamping the value between 0 and 1 using `Math.min()`.
    - It executes the user-provided `callback` with the current `progress` and `elapsed` time.
    - If `progress` is less than 1, it requests the next animation frame, recursively calling itself (`frameIdRef.current = requestAnimationFrame(loop)`).
    - If `progress` reaches 1, it stops the loop, sets `isRunning` to false, resets refs, and calls the `onComplete` callback if provided.
3.  **Control Functions**: `start`, `stop`, and `reset` are memoized `useCallback` functions.
    - `start`: Sets `isRunning` to true, resets `startTimeRef`, and initiates the loop using `requestAnimationFrame(loop)`.
    - `stop`: Cancels the pending animation frame using `cancelAnimationFrame()` and sets `isRunning` to false.
    - `reset`: Cancels any pending frame, sets `isRunning` to false, and resets `startTimeRef` and `frameIdRef`.
4.  **Cleanup**: An `useEffect` hook with an empty dependency array ensures that `cancelAnimationFrame` is called if the component unmounts while the animation is running, preventing memory leaks or errors.
