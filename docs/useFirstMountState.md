# `useFirstMountState` Hook

## Description

The `useFirstMountState` hook provides a boolean value indicating whether the component is being mounted for the first time. This is useful for distinguishing the initial render from subsequent updates within a component's lifecycle.

## Usage

```
typescript
import { useFirstMountState } from '@supunlakmal/hooks';

function MyComponent() {
  const isFirstMount = useFirstMountState();

  if (isFirstMount) {
    console.log('Component is mounting for the first time.');
  } else {
    console.log('Component has been updated.');
  }

  return <div>My Component</div>;
}
```

## API

```
typescript
function useFirstMountState(): boolean;
```

## Parameters

This hook does not take any parameters.

## Returns

- **Return type:** `boolean`
- **Details:** Returns `true` if the component is being mounted for the first time; otherwise, it returns `false`.

## How it Works

The `useFirstMountState` hook internally uses a `useRef` hook to keep track of whether it's the first mount. It initializes the `ref` to `true` and then sets it to `false` after the first render. Subsequent calls to the hook will then return `false`. It leverages the fact that refs persist across renders without causing re-renders.
