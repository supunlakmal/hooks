# `useRenderCount` Hook

Tracks the number of times a component has rendered. Useful for debugging performance issues or understanding component lifecycles.

## Usage

```typescript
import React, { useState } from "react";
import { useRenderCount } from "@supunlakmal/hooks"; // Adjust path

function RenderCounterComponent() {
  const [value, setValue] = useState("");
  const renderCount = useRenderCount();

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "15px", margin: "20px 0" }}
    >
      <h2>Render Count Tracker</h2>
      <p>
        This component has rendered <strong>{renderCount}</strong> times.
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something to trigger re-renders..."
      />
      <p>
        <small>
          Check console logs in development mode for strict mode double renders.
        </small>
      </p>
    </div>
  );
}

export default RenderCounterComponent;
```

## API

### Parameters

None.

### Returns

- `renderCount`: `number` - The number of times the component calling the hook has rendered. The count starts at 1 for the initial render.

## How it Works

1.  **Ref Initialization**: Uses `useRef` to create a mutable `renderCount` ref object, initialized to `0`.
2.  **Increment on Render**: Directly increments `renderCount.current` by 1 during the component's render phase.
3.  **Return Value**: Returns the _updated_ `renderCount.current`. Since the ref is incremented _before_ the return statement within the render phase, the returned value reflects the count of the current render (1 for the first render, 2 for the second, and so on).

**Note on React Strict Mode:** In development mode with `<React.StrictMode>`, components might render twice initially to help detect side effects. This hook will reflect those double renders, so you might see the count jump from 1 to 3 quickly during development. This is expected behavior and does not occur in production builds.
