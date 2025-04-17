# `useLogger` Hook

A development utility hook that logs component lifecycle events (mount, update, unmount) and optionally prop changes to the browser console. Logs are only output when `process.env.NODE_ENV` is equal to `'development'`.

## Usage

Call the hook at the top level of your component, providing a name for the component and optionally its props.

```typescript
import React, { useState, useEffect } from "react";
import { useLogger } from "@supunlakmal/hooks"; // Adjust path

interface MyComponentProps {
  id: number;
  label: string;
}

const MyComponent = (props: MyComponentProps) => {
  const { id, label } = props;
  const [internalState, setInternalState] = useState(0);

  // Use the logger hook
  useLogger("MyComponent", props);

  useEffect(() => {
    const interval = setInterval(() => {
      setInternalState((s) => s + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ border: "1px solid navy", padding: "10px", margin: "10px 0" }}
    >
      <h3>MyComponent (ID: {id})</h3>
      <p>Label: {label}</p>
      <p>Internal State: {internalState}</p>
      {/* Note: Changing internal state doesn't trigger the update log for props, 
          only changes to props passed from the parent will. */}
    </div>
  );
};

// Parent component to control MyComponent
function LoggerExample() {
  const [show, setShow] = useState(true);
  const [label, setLabel] = useState("Initial Label");
  const [id, setId] = useState(1);

  // Use logger for the parent too!
  useLogger("LoggerExample", { show, label, id });

  return (
    <div>
      <h1>useLogger Example</h1>
      <p>
        Check the browser console for lifecycle logs (only in development mode).
      </p>
      <button onClick={() => setShow((s) => !s)}>
        {show ? "Unmount Component" : "Mount Component"}
      </button>
      <button
        onClick={() => setLabel(`Updated Label ${Date.now()}`)}
        style={{ marginLeft: "10px" }}
      >
        Change Label Prop
      </button>
      <button
        onClick={() => setId((i) => i + 1)}
        style={{ marginLeft: "10px" }}
      >
        Change ID Prop
      </button>

      {show && <MyComponent id={id} label={label} />}
    </div>
  );
}

export default LoggerExample;
```

**(Make sure your development server sets `process.env.NODE_ENV = 'development'` for logs to appear)**

### Console Output Example:

```text
[Mount] LoggerExample {props: {…}}
[Mount] MyComponent {props: {…}}
[Update] LoggerExample {props: {…}, prevProps: {…}, changed: true}
[Update] MyComponent {props: {…}, prevProps: {…}, changed: true}
[Update] LoggerExample {props: {…}, prevProps: {…}, changed: true}
[Update] MyComponent {props: {…}, prevProps: {…}, changed: true}
[Update] LoggerExample {props: {…}, prevProps: {…}, changed: true}
[Unmount] MyComponent
```

## API

```typescript
function useLogger(componentName: string, props?: any): void;
```

### Parameters

- `componentName`: `string` - The name of the component being logged. This is used in the console output.
- `props`: `any` (Optional) - The props object of the component. If provided, the hook will log the props on mount and compare previous/current props on update, indicating if they have changed (using a simple shallow comparison).

### Returns

- `void` - This hook does not return any value; its purpose is the side effect of logging to the console.

## How it Works

1.  **Development Check**: It first checks if `process.env.NODE_ENV` is strictly equal to `'development'`. If not, the hook does nothing further.
2.  **Prop Storage**: It uses `useRef` (`prevPropsRef`) to keep track of the props from the previous render, allowing comparison on updates.
3.  **Lifecycle Hooks**: It leverages other custom hooks:
    - `useMount`: Logs a `[Mount]` message with the `componentName` and initial `props` (if provided).
    - `useUpdateEffect`: Logs an `[Update]` message. It performs a shallow comparison between `prevPropsRef.current` and the current `props`. It logs the current `props`, previous `props`, and whether a change was detected. It then updates `prevPropsRef.current`.
    - `useUnmount`: Logs an `[Unmount]` message with the `componentName`.
4.  **Console Styling**: Uses `%c` directives in `console.log` to apply basic color-coding and bolding to the log messages for better readability.
5.  **Shallow Comparison**: Includes a simple helper function `propsChanged` to perform a shallow comparison of prop objects.
