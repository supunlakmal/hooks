# `useHover` Hook

Tracks whether the mouse pointer is currently hovering over a specific DOM element. Returns a ref to attach to the element and a boolean state indicating the hover status.

## Usage

```typescript
import React from "react";
import { useHover } from "@supunlakmal/hooks"; // Adjust the import path as needed

function HoverableBox() {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>(); // Specify element type if needed

  return (
    <div
      ref={hoverRef} // Attach the ref here
      style={{
        padding: "20px",
        border: "1px solid black",
        backgroundColor: isHovered ? "lightblue" : "white",
        transition: "background-color 0.3s ease",
        cursor: "pointer",
      }}
    >
      {isHovered ? "You are hovering over me!" : "Hover over me!"}
    </div>
  );
}

function AnotherHoverExample() {
  const [buttonRef, isButtonHovered] = useHover<HTMLButtonElement>();

  return (
    <button ref={buttonRef} style={{ marginTop: "20px", padding: "10px 20px" }}>
      {isButtonHovered ? "Hovering on Button!" : "Button"}
    </button>
  );
}

function App() {
  return (
    <div>
      <h1>useHover Demo</h1>
      <HoverableBox />
      <AnotherHoverExample />
    </div>
  );
}

export default App;
```

## API

### Parameters

None.

### Returns

A tuple `[ref, isHovered]` containing:

1.  `ref`: A React ref object (`RefObject<T | null>`). This ref should be assigned to the `ref` prop of the DOM element you want to monitor for hover events. `T` defaults to `HTMLElement` but can be specified (e.g., `useHover<HTMLButtonElement>()`). The ref might be `null` initially.
2.  `isHovered`: A boolean (`boolean`) state variable. It is `true` when the mouse pointer is currently over the element associated with the `ref`, and `false` otherwise.

## How it Works

1.  **State and Ref Initialization**: Uses `useState` to store the `isHovered` boolean state (initially `false`). Uses `useRef` to create a `ref` object, initialized to `null`.
2.  **Event Handlers**: Defines two simple event handlers:
    - `handleMouseOver`: Sets the `isHovered` state to `true`.
    - `handleMouseOut`: Sets the `isHovered` state to `false`.
3.  **Effect Setup**: Uses `useEffect` to attach and detach event listeners.
    - The effect runs once when the component mounts (due to the empty dependency array `[]`).
    - It gets the current DOM node from `ref.current`.
    - If the node exists, it adds `mouseover` and `mouseout` event listeners to it, calling `handleMouseOver` and `handleMouseOut` respectively.
4.  **Cleanup**: The `useEffect` returns a cleanup function.
    - This function is executed when the component unmounts.
    - It removes the `mouseover` and `mouseout` event listeners from the DOM node, preventing memory leaks.
5.  **Return Value**: The hook returns a tuple containing the `ref` object and the current `isHovered` state.
