# `usePortal` Hook

Simplifies the creation and management of [React Portals](https://reactjs.org/docs/portals.html). It handles creating a target DOM node (if it doesn't exist), mounting children into it using `createPortal`, and cleaning up the target node when the component unmounts (if the hook created it).

## Usage

The hook returns a `Portal` component. Render this component and pass the content you want to portal as its children.

```typescript
import React, { useState } from "react";
import { usePortal } from "@supunlakmal/hooks"; // Adjust path

function ModalContent({ onClose }: { onClose: () => void }) {
  // Example modal styling
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    background: "white",
    border: "1px solid #ccc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1001, // Ensure it's above the overlay
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  };

  // Get the Portal component from the hook
  // It will create/use a div with id 'modal-portal-root'
  const Portal = usePortal({ id: "modal-portal-root" });

  return (
    <Portal>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <h2>Modal Title</h2>
        <p>This content is rendered inside a portal element.</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    </Portal>
  );
}

function PortalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>React Portal Example</h1>
      <p>
        The modal below will be rendered outside the main component's DOM
        hierarchy, directly under `document.body` in a div with the id
        `modal-portal-root`.
      </p>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

      {isModalOpen && <ModalContent onClose={() => setIsModalOpen(false)} />}

      <p style={{ marginTop: "20px" }}>Other content in the main component.</p>
    </div>
  );
}

export default PortalExample;
```

## API

### Parameters

The hook takes an optional configuration object (`UsePortalOptions`) with the following properties:

- `id`: (Optional) `string` - The `id` attribute to assign to the portal container `div`. Defaults to `'react-portal-root'`.
- `attributes`: (Optional) `Record<string, string>` - An object containing additional HTML attributes (key-value pairs) to set on the portal container `div`.

### Returns

- `Portal`: `FunctionComponent<{ children: ReactNode }>` - A React functional component.
  - Render this component in your JSX.
  - Pass the content you want to render into the portal as the `children` prop.
  - The component internally uses `createPortal` to render its children into the target DOM node managed by the hook.
  - It renders `null` until the portal target element is ready in the DOM (client-side).

## How it Works

1.  **Helper `getOrCreatePortalRoot`**: This function checks if an element with the given `id` already exists in the document. If not, it creates a `div`, sets the `id` and any provided `attributes`, and appends it to `document.body`. It returns the element and a boolean indicating if it was newly created.
2.  **Refs and State**: The hook uses `useRef` (`portalElementRef`) to hold a reference to the target DOM node and `useRef` (`portalCreatedByHook`) to track if the current hook instance created the node. It also uses `useState` (`isMounted`) to signal when the portal node is ready on the client side.
3.  **Effect for DOM Management**: An `useEffect` hook runs when the component mounts or when `id` or `attributes` change.
    - **Environment Check**: Ensures it runs only on the client-side (`typeof document !== 'undefined'`).
    - **Get/Create Root**: Calls `getOrCreatePortalRoot` to get or create the target DOM element.
    - **Update Refs/State**: Stores the element reference in `portalElementRef`, records whether the hook created it in `portalCreatedByHook`, and sets `isMounted` to `true`.
    - **Cleanup**: Returns a cleanup function that runs when the component unmounts or before the effect re-runs.
      - It checks if this hook instance created the portal element (`portalCreatedByHook.current`).
      - If so, it removes the element from the DOM (`portalElementRef.current.remove()`).
      - It resets the refs and `isMounted` state.
4.  **Portal Component**: Defines the `Portal` component using `useCallback` to ensure a stable reference.
    - This component receives `children` as props.
    - It checks if the hook is mounted (`isMounted`) and if the `portalElementRef.current` exists.
    - If both are true, it uses `createPortal(children, portalElementRef.current)` to render the children into the target DOM node.
    - Otherwise, it returns `null` (rendering nothing, common during SSR or before the DOM node is ready).
5.  **Return Value**: The hook returns the memoized `Portal` component.
