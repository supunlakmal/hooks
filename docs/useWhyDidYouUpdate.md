# `useWhyDidYouUpdate`

A simple hook that helps debug component re-renders by logging the props that changed since the last render.

## Usage

Call this hook inside the component you want to monitor, passing a name for the component (for logging clarity) and the component's `props` object.

```tsx
import React, { useState, useMemo } from 'react';
import { useWhyDidYouUpdate } from 'your-hooks-library'; // Adjust import path

interface CounterProps {
  count: number;
  // This prop is an object, prone to causing re-renders if not memoized
  style?: React.CSSProperties;
  // This prop is a function, also prone to causing re-renders
  onClick?: () => void;
}

const Counter: React.FC<CounterProps> = (props) => {
  // Use the hook to track prop changes
  useWhyDidYouUpdate(\'Counter\', props);

  return (
    <div style={props.style}>
      <p>Count: {props.count}</p>
      <button onClick={props.onClick}>Increment (External)</button>
    </div>
  );
};

// Wrap Counter with React.memo for optimization
const MemoizedCounter = React.memo(Counter);

const ParentComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState(\'light\');

  // --- Problematic Props (will cause Counter to re-render unnecessarily) ---
  // 1. New style object created on every render
  // const counterStyle = { padding: '10px', backgroundColor: theme === \'light\' ? \'#eee\' : \'#333\' };
  // 2. New function created on every render
  // const handleIncrement = () => setCount(c => c + 1);

  // --- Optimized Props ---
  // 1. Memoize the style object
  const counterStyle = useMemo(() => ({
     padding: '10px',
     backgroundColor: theme === \'light\' ? \'#eee\' : \'#333\'
  }), [theme]);
  // 2. Memoize the callback function
  const handleIncrement = useCallback(() => {
      setCount(c => c + 1);
  }, []);

  // Track renders for the Parent itself
  useWhyDidYouUpdate(\'ParentComponent\', { count, theme, counterStyle, handleIncrement });

  console.log(\'ParentComponent rendered\');

  return (
    <div>
      <h2>Why Did You Update Demo</h2>
      <button onClick={() => setTheme(t => t === \'light\' ? \'dark\' : \'light\')}>
        Toggle Theme (Theme: {theme})
      </button>
      <hr />
      {/* Using the non-memoized version might show unnecessary re-renders */}
       {/* <Counter count={count} style={counterStyle} onClick={handleIncrement} /> */}

      {/* Using the memoized version + memoized props is optimal */}
       <MemoizedCounter count={count} style={counterStyle} onClick={handleIncrement} />

      <p>Check the console logs to see which props caused the \'Counter\' component to re-render when you interact with the buttons.</p>
      <p>If using `MemoizedCounter` with memoized props, changing the theme should *not* cause `Counter` to log any prop changes, even though `ParentComponent` re-renders.</p>

    </div>
  );
};

export default ParentComponent;

```

## API

### `useWhyDidYouUpdate(componentName: string, props: { [key: string]: any }): void`

#### Parameters

- `componentName` (string, required): The name of the component being debugged. This is used in the console log output.
- `props` (object, required): The current props object of the component.

#### Returns

- `void`: This hook does not return any value. Its purpose is purely side-effects (logging to the console).

## How it Works

1.  **Store Previous Props**: It uses `useRef` to keep track of the `props` object from the previous render.
2.  **Run After Render**: It uses `useEffect` (with no dependency array, so it runs after every render) to compare the current `props` with the `previousProps` stored in the ref.
3.  **Compare Props**: It iterates over all keys present in either the previous or current props.
4.  **Identify Changes**: For each key, it checks if the prop was added, removed, or changed value (using strict inequality `!==`).
5.  **Log Changes**: If any changes are detected, it logs an object to the console, keyed by the prop name, showing the `from` and `to` values.
6.  **Update Ref**: Finally, it updates the ref with the current props, so they become the `previousProps` for the next render cycle.

## Notes

- This hook is intended for **development and debugging purposes only**. It relies on `console.log` and performs extra work on every render. Remove it from your production build.
- It performs a shallow comparison (`!==`) between prop values. If you pass objects or arrays that are structurally the same but have different references (e.g., `{}` vs `{}` or `[]` vs `[]`), this hook will report them as changed. This is often the exact behavior you want to debug (i.e., identifying props that should have been memoized with `useMemo` or `useCallback`).
- Use this in conjunction with `React.memo` to understand why a memoized component might still be re-rendering.
