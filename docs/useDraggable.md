# `useDraggable`

Adds draggability to an HTML element using pointer events. It tracks the element's position, handles dragging state, supports boundary constraints, and provides callbacks for drag events. Can operate in controlled or uncontrolled mode for position management.

_(Note: This hook focuses on direct element dragging via translation. For HTML Drag and Drop API integration for transferring data between elements, see `useDrag`.)_

## Usage

Attach a ref to the element you want to make draggable and pass it to the hook.

```tsx
import React, { useRef, useState } from "react";
import { useDraggable } from "your-hooks-library"; // Adjust import path

const DraggableBox: React.FC = () => {
  const dragRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null); // Ref for the constraining container

  // --- Uncontrolled Mode ---
  const { position, isDragging } = useDraggable(dragRef, {
    initialPosition: { x: 50, y: 50 },
    boundsRef: boundsRef, // Constrain within the parent
    onDragStart: (pos) => console.log("Drag Start:", pos),
    onDrag: (pos) => console.log("Dragging:", pos),
    onDragEnd: (pos) => console.log("Drag End:", pos),
  });

  // --- Controlled Mode Example (Comment out the uncontrolled hook above to use) ---
  // const [controlledPos, setControlledPos] = useState({ x: 50, y: 50 });
  // const { isDragging } = useDraggable(dragRef, {
  //    boundsRef: boundsRef,
  //    position: controlledPos,
  //    onPositionChange: setControlledPos, // Hook calls this to update state
  //    onDragStart: (pos) => console.log('Controlled Drag Start:', pos),
  //    onDrag: (pos) => console.log('Controlled Dragging:', pos),
  //    onDragEnd: (pos) => console.log('Controlled Drag End:', pos),
  // });
  // const position = controlledPos; // Use the controlled state for styling

  const boxStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    backgroundColor: isDragging ? "lightblue" : "coral",
    border: "2px solid black",
    position: "absolute", // IMPORTANT: Required for transform to position correctly
    left: 0, // Initial CSS position (transform handles movement)
    top: 0, // Initial CSS position
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none", // Prevent scrolling on touch devices while dragging
    userSelect: "none", // Prevent text selection
    // Transform is applied by the hook's useEffect
  };

  const boundsStyle: React.CSSProperties = {
    width: "500px",
    height: "400px",
    border: "2px dashed grey",
    position: "relative", // Needed for absolute positioning of the child
    marginTop: "20px",
    overflow: "hidden", // Hide parts of the box that go outside
  };

  return (
    <div>
      <h2>Draggable Element</h2>
      <p>Drag the coral box within the dashed bounds.</p>
      <div ref={boundsRef} style={boundsStyle}>
        <div ref={dragRef} style={boxStyle}>
          Drag Me!
          <p style={{ fontSize: "0.8em", margin: "2px" }}>
            ({position.x.toFixed(0)}, {position.y.toFixed(0)})
          </p>
        </div>
      </div>
      {/* Example button to reset controlled state */}
      {/* {controlledPos && <button onClick={() => setControlledPos({x: 0, y: 0})}>Reset Controlled</button>} */}
    </div>
  );
};

export default DraggableBox;
```

## API

### `useDraggable<T extends HTMLElement>(ref: React.RefObject<T>, options?: DraggableOptions): DraggableState`

#### Generics

- `T` (extends `HTMLElement`, required): The type of the HTML element the ref is attached to.

#### Parameters

- `ref` (`React.RefObject<T>`, required): A React ref object attached to the HTML element that should become draggable.
- `options` (`DraggableOptions`, optional): Configuration object:
  - `initialPosition` (`{ x: number; y: number }`, optional): The starting position (`{ x, y }`) for the element when uncontrolled. Defaults to `{ x: 0, y: 0 }`. Position is applied via `style.transform: translate(x, y)`.
  - `boundsRef` (`React.RefObject<HTMLElement>`, optional): A ref attached to a container element. If provided, dragging will be constrained within the boundaries of this element.
  - `bounds` (`{ top: number; left: number; right: number; bottom: number }`, optional): Specific coordinates defining the draggable area. Overrides `boundsRef` if both are provided. Coordinates are relative to the element's offset parent.
  - `onDragStart` (`(position: { x: number; y: number }, event: PointerEvent) => void`, optional): Callback fired when dragging starts. Receives the current position and the pointer event.
  - `onDrag` (`(position: { x: number; y: number }, event: PointerEvent) => void`, optional): Callback fired continuously as the element is dragged. Receives the current position and the pointer event.
  - `onDragEnd` (`(position: { x: number; y: number }, event: PointerEvent) => void`, optional): Callback fired when dragging stops. Receives the final position and the pointer event.
  - `position` (`{ x: number; y: number }`, optional): If provided along with `onPositionChange`, the hook operates in **controlled mode**. The element's position is determined by this prop.
  - `onPositionChange` (`(position: { x: number; y: number }) => void`, optional): Required if `position` is provided (controlled mode). This callback is invoked by the hook whenever the internal drag logic calculates a new position. You should use this to update the state that feeds the `position` prop.

#### Returns (`DraggableState` object)

- `position` (`{ x: number; y: number }`): The current position of the draggable element. In uncontrolled mode, this is the internal state. In controlled mode, this reflects the `position` prop passed in.
- `isDragging` (boolean): `true` while the element is being actively dragged, `false` otherwise.

## How it Works

1.  **Event Listeners**: Attaches `pointerdown` listener to the target element (`ref`) and `pointermove`, `pointerup`, `pointercancel` listeners to the `window`.
2.  **State**: Uses `useState` to manage the `isDragging` flag and the element's `position` (in uncontrolled mode).
3.  **Pointer Down**: When dragging starts (`pointerdown` on the element):
    - Records the pointer's starting coordinates and the element's starting position.
    - Sets `isDragging` to `true`.
    - Captures pointer events on the target element.
    - Calls `onDragStart` callback.
4.  **Pointer Move**: While dragging (`pointermove` on the window):
    - Calculates the delta (`dx`, `dy`) from the pointer start position.
    - Calculates the potential new position based on the element's start position and the delta.
    - **Constraints**: If `bounds` or `boundsRef` are provided, calculates the constrained position, ensuring the element stays within the defined boundaries.
    - **Position Update**: In uncontrolled mode, updates the internal position state using `setInternalPosition`. In controlled mode, calls the `onPositionChange` callback with the new (constrained) position.
    - Calls `onDrag` callback.
5.  **Pointer Up/Cancel**: When dragging ends (`pointerup` or `pointercancel` on the window):
    - Sets `isDragging` to `false`.
    - Releases pointer capture.
    - Calls `onDragEnd` callback.
6.  **Styling**: Uses an effect (`useEffect`) to apply the current `position` to the element's `style.transform` property (`translate(x, y)`). Also updates cursor and user-select styles during drag.

## Notes

- The draggable element **must** have CSS `position: relative;` or `position: absolute;` applied for `transform: translate()` to work correctly relative to its normal flow or containing block.
- The hook uses `pointer events`, which consolidate mouse, touch, and pen events.
- `touch-action: none;` is recommended CSS on the draggable element to prevent page scrolling on touch devices during drag.
- Boundary calculations assume the element's position is relative to its offset parent or the specified `boundsRef` element.
- When using `boundsRef`, the calculation assumes the bounds start at `{ top: 0, left: 0 }` relative to the `boundsRef` element.
