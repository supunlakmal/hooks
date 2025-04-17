# `usePageVisibility` Hook

Tracks the visibility state of the current browser tab/page using the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

This is useful for pausing/resuming activities (like videos, animations, or data fetching) when the user switches tabs or minimizes the window, saving resources and preventing unnecessary background work.

## Usage

Call the hook to get a boolean state indicating whether the page is currently visible.

```typescript
import React, { useState, useEffect } from "react";
import { usePageVisibility } from "@supunlakmal/hooks"; // Adjust path

function PageVisibilityExample() {
  const isVisible = usePageVisibility();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    if (isVisible) {
      setLog((prev) => [...prev, `${timestamp}: Page became VISIBLE`]);
      // Example: Resume background tasks, play video, etc.
    } else {
      setLog((prev) => [...prev, `${timestamp}: Page became HIDDEN`]);
      // Example: Pause background tasks, pause video, etc.
    }
  }, [isVisible]);

  return (
    <div>
      <h1>usePageVisibility Example</h1>
      <p>
        Switch tabs or minimize the window to see the visibility state change.
      </p>
      <h2>Page is currently: {isVisible ? "Visible" : "Hidden"}</h2>
      <h3>Event Log:</h3>
      <ul
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {log
          .slice()
          .reverse()
          .map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
      </ul>
    </div>
  );
}

export default PageVisibilityExample;
```

## API

```typescript
function usePageVisibility(): boolean;
```

### Parameters

- None.

### Returns

- `boolean`: A state variable that is `true` if the page is currently considered visible by the browser, and `false` if it is hidden (e.g., tab is in the background, window is minimized). If the Page Visibility API is not supported, it defaults to `true`.

## How it Works

1.  **Feature Detection**: A helper function `getVisibilityProperties` checks for the existence of `document.hidden` or its vendor-prefixed equivalents (`msHidden`, `webkitHidden`) and returns the correct property name and the corresponding event name (`visibilitychange`, `msvisibilitychange`, `webkitvisibilitychange`).
2.  **Initial State**: Uses `useState` to store the `isVisible` boolean. It initializes the state by checking the relevant `hidden` property (`!document[hiddenProp]`). If the API isn't supported or in an SSR environment, it defaults to `true`.
3.  **Event Listener**: An `useEffect` hook runs on mount (if the API is supported).
    - It defines `handleVisibilityChange` which updates the `isVisible` state based on the current value of the `hidden` property.
    - It adds an event listener to the `document` for the appropriate `visibilityChange` event, calling `handleVisibilityChange` when the event fires.
    - It returns a cleanup function that removes the event listener when the component unmounts.
