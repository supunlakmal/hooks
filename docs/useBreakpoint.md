# `useBreakpoint` Hook

Determines the currently active responsive breakpoint based on window width, using a predefined set of breakpoints or custom ones.

**Note:** This hook relies on the `window.matchMedia` API, which is not available during server-side rendering. It will return `null` on the server.

## Usage

### Using Default Breakpoints

The default breakpoints are inspired by Tailwind CSS:

- `sm`: (min-width: 640px)
- `md`: (min-width: 768px)
- `lg`: (min-width: 1024px)
- `xl`: (min-width: 1280px)
- `2xl`: (min-width: 1536px)

The hook returns the key of the largest matching breakpoint (e.g., 'lg'). If the screen width is below the smallest breakpoint (sm), it returns `null`.

```typescript
import React from "react";
import { useBreakpoint } from "@supunlakmal/hooks"; // Adjust path

function ResponsiveComponent() {
  const activeBreakpoint = useBreakpoint();

  let content = 'Screen size is below "sm" breakpoint (or SSR).';

  if (activeBreakpoint === "sm") {
    content = "Active breakpoint: sm (640px and up)";
  } else if (activeBreakpoint === "md") {
    content = "Active breakpoint: md (768px and up)";
  } else if (activeBreakpoint === "lg") {
    content = "Active breakpoint: lg (1024px and up)";
  } else if (activeBreakpoint === "xl") {
    content = "Active breakpoint: xl (1280px and up)";
  } else if (activeBreakpoint === "2xl") {
    content = "Active breakpoint: 2xl (1536px and up)";
  }

  return (
    <div>
      <h1>Breakpoint Demo</h1>
      <p>Resize your browser window to see the active breakpoint change.</p>
      <p
        style={{
          fontWeight: "bold",
          marginTop: "15px",
          padding: "10px",
          background: "#f0f0f0",
        }}
      >
        {content}
      </p>
    </div>
  );
}

export default ResponsiveComponent;
```

### Using Custom Breakpoints

```typescript
import React from "react";
import { useBreakpoint } from "@supunlakmal/hooks"; // Adjust path

const myBreakpoints = {
  mobile: "(max-width: 599px)", // Example using max-width
  tablet: "(min-width: 600px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
};

// For complex queries like max-width or ranges, the hook
// identifies the *first* matching query based on Object.keys order by default.
// For predictable behavior with complex/overlapping queries, consider ordering them
// or using a different hook/logic specialized for exclusive ranges.
// This hook is primarily designed for ascending min-width breakpoints.

// Correction: The hook actually iterates based on sorted min-width,
// so for mixed query types, the interpretation needs care.
// It finds the largest min-width match. If using max-width, logic might need adjusting.

function CustomBreakpointComponent() {
  // For this example, let's use standard min-width for clarity
  const customMinBreakpoints = {
    small: "(min-width: 500px)",
    medium: "(min-width: 900px)",
    large: "(min-width: 1400px)",
  };

  const activeBreakpoint = useBreakpoint(customMinBreakpoints);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Custom Breakpoints Demo</h2>
      <p>Using custom min-width breakpoints: 500px, 900px, 1400px.</p>
      <p
        style={{
          fontWeight: "bold",
          marginTop: "15px",
          padding: "10px",
          background: "#e0f0e0",
        }}
      >
        Active custom breakpoint: {activeBreakpoint ?? "Below 500px"}
      </p>
    </div>
  );
}

export default CustomBreakpointComponent;
```

## API

### Parameters

- `customBreakpoints`: (Optional) `Record<K, string>` - An object where keys are your custom breakpoint names (`K extends string`) and values are valid CSS media query strings. If provided, this object replaces the default breakpoints.

### Returns

- The key (`K` or `null`) of the largest currently active breakpoint based on the provided or default `min-width` media queries. It returns `null` if the window width is below the smallest defined `min-width` breakpoint or if running in an environment without `window.matchMedia`.

## How it Works

1.  **Breakpoints Definition**: Uses the provided `customBreakpoints` or falls back to a default set (`defaultBreakpoints`) containing common `min-width` queries.
2.  **State Initialization**: Uses `useState` (`activeBreakpoint`) to store the key of the currently active breakpoint, initialized to `null`.
3.  **Effect for Listeners & Checks**: A central `useEffect` hook manages the breakpoint logic.
    - **Environment Check**: Exits early if `window.matchMedia` is not available.
    - **`checkBreakpoints` Function**: This inner function determines the active breakpoint:
      - It sorts the breakpoint keys based on the `min-width` value found in their corresponding media query string (descending order).
      - It iterates through the sorted keys.
      - For each key, it uses `window.matchMedia(query).matches` to check if the media query is currently active.
      - The _first_ key encountered in the sorted (descending width) list that matches is considered the largest active breakpoint.
      - It calls `setActiveBreakpoint` to update the state.
    - **Initial Check**: Calls `checkBreakpoints()` immediately when the effect runs to set the initial state.
    - **Listeners Setup**: Iterates through the defined breakpoints.
      - For each breakpoint, it creates a `MediaQueryList` object using `window.matchMedia(query)`.
      - It defines a `listener` function that simply calls `checkBreakpoints()` again whenever _any_ of the media query statuses change.
      - It attaches this `listener` to the `change` event of the `MediaQueryList` (using `addEventListener` or the deprecated `addListener` for compatibility).
      - Keeps track of the listeners and `MediaQueryList` objects.
    - **Cleanup**: The `useEffect` returns a cleanup function that iterates through all created listeners and removes them from their respective `MediaQueryList` objects.
4.  **Dependency**: The main `useEffect` depends on the `breakpoints` object. If `customBreakpoints` is provided and its identity changes, the effect re-runs, clearing old listeners and setting up new ones based on the new breakpoints.
