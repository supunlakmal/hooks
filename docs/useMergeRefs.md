# `useMergeRefs` Hook

A utility hook that merges multiple React refs (either callback refs or object refs created with `useRef`) into a single callback ref. This is useful when you need to attach multiple refs to the same component or DOM node, for example, combining a local ref with a ref forwarded from a parent component (`forwardRef`).

## Usage

Pass all the refs you want to merge as arguments to the `useMergeRefs` hook. It returns a single callback ref that you can then attach to your element or component.

```typescript
import React, { useRef, useEffect, forwardRef } from "react";
import { useMergeRefs } from "@supunlakmal/hooks"; // Adjust path

// Example component that uses an internal ref and forwards one
const FancyInput = forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, forwardedRef) => {
    // Internal ref for local logic (e.g., focusing)
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge the internal ref and the forwarded ref
    const mergedRef = useMergeRefs<HTMLInputElement>(internalRef, forwardedRef);

    // Example of using the internal ref
    useEffect(() => {
      console.log("Internal ref current:", internalRef.current);
      // You could focus the input using internalRef.current.focus()
    }, []);

    return (
      <div>
        <label>{label}: </label>
        <input ref={mergedRef} type="text" />
      </div>
    );
  }
);

FancyInput.displayName = "FancyInput";

// Parent component using the FancyInput
function MergeRefsExample() {
  // Ref in the parent component to get access to the FancyInput's input element
  const parentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Accessing the input element via the parent ref after mount
    if (parentRef.current) {
      console.log("Parent ref current:", parentRef.current);
      parentRef.current.style.borderColor = "blue"; // Example: Modify style
    }
  }, []);

  return (
    <div>
      <h1>useMergeRefs Example</h1>
      <p>
        This input uses both an internal ref and a forwarded ref (parentRef).
      </p>
      <FancyInput ref={parentRef} label="My Input" />
    </div>
  );
}

export default MergeRefsExample;
```

## API

```typescript
type ReactRef<T> =
  | React.RefCallback<T>
  | React.MutableRefObject<T>
  | null
  | undefined;

function useMergeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T>;
```

### Parameters

- `...refs`: `ReactRef<T>[]` - A variable number of arguments, each being a React ref. These can be:
  - Object refs created by `useRef` (`React.MutableRefObject<T>`).
  - Callback refs (`React.RefCallback<T>`).
  - `null` or `undefined` (these are ignored).

### Returns

- `React.RefCallback<T>` - A single, memoized callback ref. When this callback ref is attached to a component or DOM element, it receives the instance (`T | null`). It then iterates through all the refs provided to `useMergeRefs` and appropriately assigns the instance to each one (either by calling the callback ref or setting the `.current` property of the object ref).

## How it Works

1.  **`useCallback`**: The hook returns a memoized callback function using `useCallback`. The dependency array for `useCallback` includes the `refs` passed to the hook, ensuring the callback ref is updated if the list of refs changes.
2.  **Callback Logic**: The returned callback function receives the `instance` (the DOM node or component instance) as its argument.
3.  **Iteration**: It iterates through the original `refs` array provided to the hook.
4.  **Ref Assignment**: For each `ref` in the array:
    - If the `ref` is a function (a callback ref), it calls the function with the `instance`.
    - If the `ref` is a non-null object (an object ref like one from `useRef`), it assigns the `instance` to the `ref.current` property.
    - `null` or `undefined` refs are skipped.

```

```
