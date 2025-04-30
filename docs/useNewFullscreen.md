# `useNewFullscreen` Hook

This hook provides a way to toggle an element into fullscreen mode and manage the fullscreen state.

## Usage
```
typescript
import useNewFullscreen from '@supunlakmal/hooks/useNewFullscreen';
import { useRef } from 'react';

function MyComponent() {
  const [isFullscreen, toggleFullscreen] = useNewFullscreen();
  const targetRef = useRef(null);

  return (
    <div ref={targetRef}>
      <p>Content to go fullscreen</p>
      <button onClick={() => toggleFullscreen(targetRef.current)}>
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>
    </div>
  );
}
```
## API
```
typescript
function useNewFullscreen(): [boolean, (element: Element) => void];
```
## Parameters

*   This hook takes no parameters.

## Returns

*   `[boolean, (element: Element) => void]`: An array containing:
    *   `boolean`: A boolean indicating whether the element is currently in fullscreen mode.
    *   `(element: Element) => void`: A function to toggle the fullscreen mode for the specified element.

## How it Works

The `useNewFullscreen` hook uses the browser's Fullscreen API to handle the fullscreen state. When the `toggleFullscreen` function is called with an element, it checks if that element is currently in fullscreen mode. If it is, it exits fullscreen mode; otherwise, it enters fullscreen mode. The hook uses `useState` to track the `isFullscreen` state. It also uses `useEffect` and `eventListeners` to listen for the fullscreen change events.