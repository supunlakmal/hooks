# useDimensions

## Purpose

The `useDimensions` hook is a React hook designed to measure an element's size and manage responsive components efficiently. It leverages the `ResizeObserver` API for high performance. This hook provides an alternative solution to the container queries problem, allowing components to adapt their styles based on their container's dimensions rather than the viewport. It supports measuring with border-box size, conditionally updating state, and offers a flexible API suitable for a variety of use cases.

## Usage Instructions

To use the `useDimensions` hook, first import it into your component:
```
typescript
import useDimensions from './hooks/useDimensions'; // Adjust path as necessary
```
Then, call the hook inside your component, passing in an optional configuration object. The hook returns an `observe` function to be assigned to the `ref` of the element you wish to measure.
```
typescript
import React, { useRef } from 'react';
import useDimensions from './hooks/useDimensions';

const MyComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { observe, width, height } = useDimensions({
    onResize: ({ width, height }) => {
      console.log(`Element size: ${width} x ${height}`);
    },
  });

  return (
    <div ref={observe}>
      {/* Content to measure */}
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
};
```
### Responsive Components

The hook also supports responsive components by providing the `breakpoints` option.
```
typescript
import React, { useRef } from 'react';
import useDimensions from './hooks/useDimensions';

const ResponsiveComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: {
      small: 0,
      medium: 500,
      large: 1000,
    },
    onResize: ({ currentBreakpoint }) => {
      console.log(`Current breakpoint: ${currentBreakpoint}`);
    },
  });

  return (
    <div ref={observe}>
      {/* Responsive content */}
      <p>Current Breakpoint: {currentBreakpoint}</p>
    </div>
  );
};
```
### Conditionally Updating State

You can control when the state is updated using the `shouldUpdate` function:
```
typescript
import React, { useRef } from 'react';
import useDimensions from './hooks/useDimensions';

const ConditionalUpdateComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { observe, width, height } = useDimensions({
    shouldUpdate: ({ width }) => width > 200,
  });

  return (
    <div ref={observe}>
      <p>Width (updated only if > 200px): {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
};
```
### Border-box Size Measurement
```
typescript
import React, { useRef } from 'react';
import useDimensions from './hooks/useDimensions';

const BorderBoxComponent = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { observe, width, height } = useDimensions({
      useBorderBoxSize: true,
    });
  
    return (
      <div ref={observe} style={{width: '100px', height: '100px', border: '10px solid blue', padding: '10px'}}>
        <p>Width (including border and padding): {width}px</p>
        <p>Height (including border and padding): {height}px</p>
      </div>
    );
  };

```
## Parameters and Types

The `useDimensions` hook accepts an optional configuration object with the following properties:

-   **`breakpoints`**: `Record<string, number>` (optional) - Defines breakpoints for responsive behavior. Keys are breakpoint names, and values are the minimum width for each breakpoint.
-   **`updateOnBreakpointChange`**: `boolean` (optional) - If `true`, the state will only update when the breakpoint changes. Defaults to `false`.
-   **`useBorderBoxSize`**: `boolean` (optional) - If `true`, measures the element's size based on the border-box model. Defaults to `false`.
-   **`shouldUpdate`**: `({ width: number | null, height: number | null, currentBreakpoint: string, entry: ResizeObserverEntry }) => boolean` (optional) - A function to determine if the state should be updated. Receives current dimensions, breakpoint, and ResizeObserverEntry.
-   **`onResize`**: `({ width: number | null, height: number | null, currentBreakpoint: string, entry: ResizeObserverEntry, observe: (element?: Element) => void, unobserve: () => void }) => void` (optional) - Callback function triggered when the element resizes or breakpoint changes. Provides current dimensions, breakpoint, ResizeObserverEntry, and functions to start/stop observing.
- **`polyfill`**: `ResizeObserver` (optional) - Used to inject a polyfill.

## Return Values and Their Types

The `useDimensions` hook returns an object with the following properties:

-   **`observe`**: `(element?: Element) => void` - A function to attach to the `ref` of the element to be measured.
-   **`unobserve`**: `() => void` - A function to stop observing the current element.
-   **`width`**: `number | null` - The width of the element in pixels, or `null` if the element has not yet been mounted.
-   **`height`**: `number | null` - The height of the element in pixels, or `null` if the element has not yet been mounted.
-   **`currentBreakpoint`**: `string` - The name of the current breakpoint, or an empty string if no breakpoint is matched or breakpoints are not defined.
-   **`entry`**: `ResizeObserverEntry` - The `ResizeObserverEntry` object for the observed element.

## Important Behavior or Edge Cases

-   **ResizeObserver Support**: `ResizeObserver` is well-supported by modern browsers. Consider using a polyfill for older browsers.
-   **Server-Side Rendering**: The hook is compatible with server-side rendering.
-   **Conditional Updates**: When both `updateOnBreakpointChange` and `shouldUpdate` are used, `shouldUpdate` takes precedence.
-   **Breakpoint Behavior**: If no breakpoints are defined or none match the element's width, `currentBreakpoint` will be an empty string.
- **Border-Box Measurement**: When `useBorderBoxSize` is set to `true`, the `width` and `height` will include padding and border. Not all browsers may support this feature, requiring a polyfill.
- **Sharing a ref**: You can share a ref with the following: