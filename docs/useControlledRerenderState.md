# `useControlledRerenderState` Hook

## Description

The `useControlledRerenderState` hook provides a mechanism to manually trigger re-renders of a component based on an external condition or state change. It's particularly useful when you need fine-grained control over when a component updates, decoupling the rendering process from the standard React state update cycle. It can be use to control if a component must re-render.

## Usage

Here's how to use the `useControlledRerenderState` hook in a React component:
```
typescript
import { useControlledRerenderState } from 'your-library'; // Replace 'your-library' with the actual library name

function MyComponent({ condition }: { condition: boolean }) {
  const [shouldRerender, triggerRerender] = useControlledRerenderState(condition);

  //...your logic here...
  
  return (
    <div>
        {/* the component render if the condition change */}
        {shouldRerender && <div>Render when condition changes</div>}
        <button onClick={() => triggerRerender(!condition)}>Force Re-render</button>
    </div>
  );
}
```
## API

### Types
```
typescript
type TriggerRerender = (condition: boolean) => void;
```
### Parameters

-   **condition**
    -   Type: `boolean`
    -   Description: A boolean value that determines whether a re-render should be triggered. When this value changes, the `shouldRerender` will be updated and the component will rerender.
    -   Optional: No

### Returns

-   **shouldRerender**
    -   Type: `boolean`
    -   Description: A boolean value that indicates if the component should render. It's updated when the `condition` changes.
-   **triggerRerender**
    -   Type: `TriggerRerender`
    -   Description: A function that allows you to manually force a re-render of the component.

## How it Works

The `useControlledRerenderState` hook uses the `useState` hook internally to manage a state variable (`shouldRerender`). This state variable is toggled each time the hook is invoked. The component re-renders when the `shouldRerender` changes its value, which only occurs when the `condition` changes.