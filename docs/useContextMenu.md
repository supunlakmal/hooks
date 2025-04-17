# `useContextMenu` Hook

Provides state and logic for implementing a custom context menu (right-click menu).

## Usage

Attach a ref to the element that should trigger the custom menu. Use the `isOpen` and `position` state returned by the hook to conditionally render your custom menu component at the correct coordinates.

```typescript
import React, { useRef, CSSProperties } from "react";
import { useContextMenu } from "@supunlakmal/hooks"; // Adjust path

// Your custom context menu component
const CustomMenu = ({
  position,
  onClose,
  onSelect,
}: {
  position: { x: number; y: number };
  onClose: () => void;
  onSelect: (option: string) => void;
}) => {
  const menuStyle: CSSProperties = {
    position: "absolute",
    top: position.y,
    left: position.x,
    background: "white",
    border: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    padding: "5px 0",
    zIndex: 1100,
    minWidth: "100px",
  };

  const itemStyle: CSSProperties = {
    padding: "8px 15px",
    cursor: "pointer",
  };

  const handleSelect = (option: string) => {
    onSelect(option);
    onClose(); // Close menu after selection
  };

  return (
    <div style={menuStyle}>
      <div style={itemStyle} onClick={() => handleSelect("Option 1")}>
        Option 1
      </div>
      <div style={itemStyle} onClick={() => handleSelect("Option 2")}>
        Option 2
      </div>
      <hr
        style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }}
      />
      <div style={itemStyle} onClick={() => handleSelect("Close")}>
        Close Menu
      </div>
    </div>
  );
};

// Component using the hook
function ContextMenuExample() {
  const targetAreaRef = useRef<HTMLDivElement>(null);
  const {
    isOpen,
    position,
    close: closeMenu, // Renamed close for clarity
  } = useContextMenu(targetAreaRef);

  const handleMenuSelect = (option: string) => {
    alert(`Selected: ${option}`);
  };

  const targetStyle: CSSProperties = {
    width: "300px",
    height: "200px",
    backgroundColor: "#e0f7fa",
    border: "2px dashed #00796b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    marginTop: "20px",
  };

  return (
    <div>
      <h1>useContextMenu Example</h1>
      <p>Right-click inside the blue dashed area below:</p>

      <div ref={targetAreaRef} style={targetStyle}>
        Right-click here
      </div>

      {isOpen && (
        <CustomMenu
          position={position}
          onClose={closeMenu}
          onSelect={handleMenuSelect}
        />
      )}
    </div>
  );
}

export default ContextMenuExample;
```

## API

```typescript
import { RefObject } from "react";

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
}

interface UseContextMenuResult extends ContextMenuState {
  open: (event: MouseEvent) => void; // Function to manually open at event coords
  close: () => void;
}

function useContextMenu(
  targetRef: RefObject<HTMLElement>
): UseContextMenuResult;
```

### Parameters

- `targetRef`: `RefObject<HTMLElement>` - A React ref object attached to the HTML element that should trigger the context menu on right-click.

### Returns

- `UseContextMenuResult`: An object containing:
  - `isOpen`: `boolean` - Indicates whether the context menu should be considered open.
  - `position`: `{ x: number; y: number }` - An object containing the `clientX` and `clientY` coordinates where the `contextmenu` event occurred. Use these to position your custom menu component.
  - `open`: `(event: MouseEvent) => void` - A function to programmatically open the menu at the coordinates of a given MouseEvent. Useful for triggering the menu via other means (e.g., a button click).
  - `close`: `() => void` - A function to programmatically close the menu (sets `isOpen` to `false`).

## How it Works

1.  **State**: Uses `useState` to manage the `isOpen` boolean flag and the `position` (x, y coordinates) for the menu.
2.  **Event Handlers**: Uses `useCallback` to memoize handlers for different events:
    - `handleContextMenu`: Attached to the `document`'s `contextmenu` event. If the event target is within the `targetRef` element, it calls `event.preventDefault()` to stop the default browser menu, sets `isOpen` to true, and updates the `position` state with the event's client coordinates. If the event is outside the target, it ensures the menu is closed.
    - `handleClickOutside`: Attached to the `document`'s `click` event. If the menu `isOpen`, it closes it. A `setTimeout` is used to ensure that clicks _inside_ a potential custom menu component can be processed by that component before the menu is closed by this listener.
    - `handleScroll`: Attached to the `document`'s `scroll` event (using capture phase). If the menu `isOpen`, it closes it when the user scrolls.
3.  **`useEventListener`**: Leverages the `useEventListener` hook (created earlier) to attach the `contextmenu`, `click`, and `scroll` listeners to the `document`.
4.  **Manual Controls**: Provides memoized `open` and `close` functions for programmatic control over the menu state.
5.  **Return Value**: Returns the `isOpen` state, `position` state, and the `open`/`close` control functions.
