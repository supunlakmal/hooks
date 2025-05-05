# `useRerender` Hook

## Description

The `useRerender` hook is a utility hook that provides a function to force a component to re-render. This can be useful in scenarios where React's automatic re-rendering mechanism doesn't trigger an update, such as when dealing with mutable objects or external state changes.

## Usage

The following example demonstrates how to use the `useRerender` hook to force a re-render of a component when a button is clicked.

```
typescript
import { useRerender } from '@supunlakmal/hooks';

function MyComponent() {
  const rerender = useRerender();

  const handleClick = () => {
    // Some logic that might not trigger a re-render automatically
    console.log('Button clicked!');
    rerender(); // Force the component to re-render
  };

  return (
    <div>
      <p>This component might need to rerender manually.</p>
      <button onClick={handleClick}>Force Rerender</button>
    </div>
  );
}
```

## API

```
typescript
type RerenderFunction = () => void;
```

## Parameters

This hook does not accept any parameters.

## Returns

- **Type:** `RerenderFunction`
- **Details:** A function that, when called, forces the component to re-render.
- **Behavior:** Calling the returned function will cause the component to re-render.

## How it Works

The `useRerender` hook internally uses the `useState` hook to manage a state variable. When the returned `rerender` function is called, it updates this state variable. Updating a state variable, even if the new value is the same as the old one, will trigger a re-render in React.

- **React hooks used:** `useState`.
- **Logic and calculations:** The hook initializes a state variable with a default value (e.g., 0). The `rerender` function increments this value.
- **Cleanup procedures:** No specific cleanup is required as this hook does not create side effects outside the component.
- **Reasoning behind implementation choices:** This method ensures a re-render even when the component's props or other state haven't changed.
