# `useDrag`

Provides basic drag event handling (`dragstart`, `drag`, `dragend`) for an element, allowing it to be dragged.

## Usage

```tsx
import React, { useRef, useState } from "react";
import { useDrag } from "your-hooks-library"; // Adjust the import path

const DraggableItem: React.FC<{ id: string; label: string }> = ({
  id,
  label,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useDrag(dragRef, {
    transferData: { id, type: "item" }, // Data to send on drop
    dataFormat: "application/json", // Format of the data
    dragEffect: "move", // Indicate the operation type
    onDragStart: (e) => console.log(`DragStart: ${label}`, e),
    onDrag: (e) => console.log(`Dragging: ${label}`),
    onDragEnd: (e) =>
      console.log(`DragEnd: ${label}`, e.dataTransfer?.dropEffect),
  });

  const style: React.CSSProperties = {
    padding: "10px",
    border: "1px solid black",
    marginBottom: "5px",
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "lightblue" : "white",
  };

  return (
    <div ref={dragRef} style={style}>
      {label}
    </div>
  );
};

// Basic Drop Zone (Does not use useDrag, just native event handlers)
const DropZone: React.FC = () => {
  const [droppedItem, setDroppedItem] = useState<any>(null);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = "move"; // Match the drag source effect
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
    try {
      const dataString = event.dataTransfer.getData("application/json");
      const data = JSON.parse(dataString);
      console.log("Dropped data:", data);
      setDroppedItem(data);
    } catch (e) {
      console.error("Error parsing dropped data:", e);
      setDroppedItem({ error: "Failed to parse data" });
    }
  };

  const style: React.CSSProperties = {
    padding: "20px",
    border: isOver ? "2px dashed blue" : "2px dashed grey",
    minHeight: "100px",
    marginTop: "20px",
    backgroundColor: isOver ? "lightyellow" : "#f9f9f9",
  };

  return (
    <div
      style={style}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <p>Drop items here</p>
      {droppedItem && (
        <pre>Last Dropped: {JSON.stringify(droppedItem, null, 2)}</pre>
      )}
    </div>
  );
};

export default function DragDemo() {
  return (
    <div>
      <h2>Draggable Items</h2>
      <DraggableItem id="item-1" label="Item 1" />
      <DraggableItem id="item-2" label="Item 2" />
      <DropZone />
    </div>
  );
}
```

## API

### `useDrag<T extends HTMLElement>(ref: React.RefObject<T>, options?: DragOptions): DragState`

#### Parameters

- `ref` (React.RefObject<T>, required): A React ref object attached to the HTML element that should become draggable.
- `options` (object, optional): Configuration for the drag behavior.
  - `transferData` (any, optional): The data payload to associate with the drag operation. This data can be retrieved by a drop target using `event.dataTransfer.getData()`. Should be serializable (e.g., string, object - will be JSON stringified).
  - `dataFormat` (string, optional): A string representing the format of the `transferData` (e.g., `'text/plain'`, `'application/json'`, `'text/uri-list'`). Defaults to `'text/plain'`. Matched with `event.dataTransfer.setData()`.
  - `dragEffect` (\'none\' | \'copy\' | \'copyLink\' | \'copyMove\' | \'link\' | \'linkMove\' | \'move\' | \'all\' | \'uninitialized\', optional): Sets the `event.dataTransfer.effectAllowed` property, indicating the type of operation(s) allowed (e.g., copy, move). Defaults to `'move'`.
  - `dragImage` (HTMLElement | null, optional): An `HTMLElement` to use as the custom drag ghost image that follows the cursor. If `null`, attempts to use a minimal transparent image (to hide the default ghost). If `undefined` (default), the browser uses its default ghost (usually a semi-transparent snapshot of the dragged element).
  - `dragImageOffset` ({ x: number; y: number }, optional): An object specifying the `{ x, y }` offset in pixels for the custom `dragImage` relative to the cursor position. Defaults to `{ x: 0, y: 0 }`.
  - `onDragStart` ((event: DragEvent) => void, optional): Callback function executed when the `dragstart` event fires on the element.
  - `onDrag` ((event: DragEvent) => void, optional): Callback function executed when the `drag` event fires (continuously while dragging).
  - `onDragEnd` ((event: DragEvent) => void, optional): Callback function executed when the `dragend` event fires (when the drag operation finishes, whether successful drop or cancellation).
  - `setDraggableAttribute` (boolean, optional): If `true` (default), the hook automatically adds the `draggable="true"` attribute to the element and removes it on cleanup. If `false`, you must manually add `draggable="true"` to your element.

#### Returns (`DragState` object)

- `isDragging` (boolean): A state variable that is `true` while the element is being dragged (between `dragstart` and `dragend`), and `false` otherwise.

## Notes

- This hook only sets up the _draggable_ element. You need to implement drop targets separately using standard HTML Drag and Drop API event handlers (`dragenter`, `dragover`, `dragleave`, `drop`) on the target elements.
- Ensure `event.preventDefault()` is called in the `dragover` handler of your drop target to allow dropping.
- The `dropEffect` property should typically be set in the `dragenter` or `dragover` handler of the _drop target_ to provide visual feedback (cursor changes), and it should match one of the `effectAllowed` values set by the drag source.
- Data set via `dataTransfer.setData` is generally only accessible in the `drop` event handler for security reasons.
- Browser compatibility for custom `dragImage` and hiding the default ghost can vary.
