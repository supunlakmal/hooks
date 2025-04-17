# `useResizeObserver` Hook

Monitors changes to the dimensions (content rect and border box) of a target DOM element using the `ResizeObserver` API.

## Usage

```typescript
import React, { useRef, useState } from "react";
import { useResizeObserver } from "@supunlakmal/hooks"; // Adjust path

function ResizableTextArea() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const resizeEntry = useResizeObserver(textAreaRef);

  const width = resizeEntry?.contentRect?.width;
  const height = resizeEntry?.contentRect?.height;

  // Example state to manually control textarea size
  const [boxSize, setBoxSize] = useState({ width: 200, height: 100 });

  return (
    <div
      style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc" }}
    >
      <h2>Resizable Text Area</h2>
      <p>Use the handles to resize the text area below.</p>
      <textarea
        ref={textAreaRef}
        placeholder="Resize me..."
        style={{
          width: `${boxSize.width}px`,
          height: `${boxSize.height}px`,
          resize: "both", // Allow manual resize for demo
          overflow: "auto",
          border: "1px solid blue",
          display: "block",
        }}
      />
      <h3>Observed Dimensions:</h3>
      {resizeEntry ? (
        <ul>
          <li>Content Width: {width?.toFixed(2)}px</li>
          <li>Content Height: {height?.toFixed(2)}px</li>
          <li>
            BorderBox Width:{" "}
            {resizeEntry.borderBoxSize?.[0]?.inlineSize.toFixed(2)}px
          </li>
          <li>
            BorderBox Height:{" "}
            {resizeEntry.borderBoxSize?.[0]?.blockSize.toFixed(2)}px
          </li>
        </ul>
      ) : (
        <p>Observing...</p>
      )}

      {/* Example controls to change size programmatically */}
      {/* <div>
        <button onClick={() => setBoxSize({ width: 300, height: 150 })}>Set Size 1</button>
        <button onClick={() => setBoxSize({ width: 150, height: 200 })}>Set Size 2</button>
      </div> */}
    </div>
  );
}

export default ResizableTextArea;
```

## API

### Parameters

- `ref`: A React ref object (`RefObject<T>`) attached to the DOM element whose size you want to monitor. `T` should extend `Element`.

### Returns

- A `ResizeObserverEntry` object or `null`. It returns the latest entry provided by the `ResizeObserver` callback, which contains information about the element's dimensions (`contentRect`, `borderBoxSize`, `contentBoxSize`, `devicePixelContentBoxSize`). It returns `null` initially or if `ResizeObserver` is not supported by the browser.

## How it Works

1.  **State Initialization**: Uses `useState` to store the latest `ResizeObserverEntry`, initialized to `null`.
2.  **Effect Setup**: An `useEffect` hook manages the observer lifecycle.
3.  **Browser Support & Element Check**: It checks if `window.ResizeObserver` is supported and if the `ref.current` (the DOM node) exists. If either is missing, it exits.
4.  **Observer Creation**: If supported and the node exists, it creates a new `ResizeObserver` instance.
    - The callback function provided to the observer receives an array of entries (typically just one for this hook). It updates the state by calling `setEntry` with the first entry (`entries[0]`)).
5.  **Observing**: It calls `observer.observe(element)` to start monitoring the target element for size changes.
6.  **Cleanup**: The `useEffect` returns a cleanup function that calls `observer.disconnect()` to stop observing when the component unmounts or when the dependency (`ref.current`) changes.
7.  **Dependency Array**: The effect depends on `ref.current`. This ensures that if the ref points to a different element, the observer is disconnected from the old one and attached to the new one.
