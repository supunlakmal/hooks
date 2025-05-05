# useDebouncedMediaQuery

A custom React hook that determines if a CSS media query matches the current environment, but with a debounced result. It wraps `useMediaQuery` and `useDebouncedState` to provide a boolean value that only updates after a specified delay following the last change in the media query's match status.

This is useful for preventing rapid UI changes or component re-renders that might occur during events like window resizing, where the media query match status can fluctuate quickly.

## Usage

```jsx
import { useDebouncedMediaQuery } from '@supunlakmal/hooks'; // Adjust import path
import { useState, useEffect } from 'react';

function ResponsiveComponent() {
  // Check for medium-sized screens (e.g., tablets) with a 300ms debounce
  const isMediumScreen = useDebouncedMediaQuery('(min-width: 768px)', 300);

  const [layoutMode, setLayoutMode] = useState('mobile');

  // Update layout only after the debounced state settles
  useEffect(() => {
    if (isMediumScreen) {
      console.log('Debounced state: Switching to medium layout');
      setLayoutMode('medium');
    } else {
      console.log('Debounced state: Switching to mobile layout');
      setLayoutMode('mobile');
    }
  }, [isMediumScreen]); // Only run when the debounced value changes

  return (
    <div>
      <h1>Responsive Component</h1>
      <p>Current Layout Mode (Debounced): {layoutMode}</p>
      <p>(Resize the window to see changes after a 300ms delay)</p>
      {/* Render different components based on layoutMode */}
    </div>
  );
}

export default ResponsiveComponent;
```

## Parameters

- **`query`**: `string` (Required)
  - The CSS media query string to evaluate (e.g., `'(max-width: 600px)'`, `'(prefers-color-scheme: dark)'`).
- **`delay`**: `number` (Required)
  - The debounce delay in milliseconds. The hook's return value will only update `delay` milliseconds after the _last_ change in the media query's actual match status.

## Return Value

- **`boolean`**
  - A boolean value indicating whether the media query currently matches, updated after the specified debounce `delay`.

## Notes

- This hook internally uses `useMediaQuery` to get the live match status and `useDebouncedState` to manage the debounced value.
- The initial returned value will reflect the media query's status at the time of the component's first render, and subsequent updates will be debounced.
