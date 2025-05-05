# useTextSelection

The `useTextSelection` hook tracks the text currently selected by the user within the document and provides details about the selection, such as the selected text content and its position.

## Usage

```jsx
import React from 'react';
import { useTextSelection } from '@supunlakmal/hooks'; // Assuming installation

function SelectionTracker() {
  const selection = useTextSelection();

  // Function to format the rect for display
  const formatRect = (rect) => {
    if (!rect) return 'N/A';
    return `(${rect.left.toFixed(0)}, ${rect.top.toFixed(0)}) [${rect.width.toFixed(0)}x${rect.height.toFixed(0)}]`;
  };

  return (
    <div>
      <h2>useTextSelection Example</h2>
      <p>Select some text on this page to see the details below.</p>
      <textarea
        defaultValue="Try selecting text inside this text area as well."
        rows={3}
        style={{ width: '90%', margin: '10px 0' }}
      />

      <h3>Selection Details:</h3>
      {selection.text ? (
        <pre
          style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            border: '1px solid #ccc',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          Text: "{selection.text}"
          <br />
          Rect: {formatRect(selection.rect)}
          <br />
          Start Offset: {selection.startOffset ?? 'N/A'}
          <br />
          End Offset: {selection.endOffset ?? 'N/A'}
          {/* Displaying nodes might be complex, showing tag name if element */}
          <br />
          Start Node: {selection.startNode?.nodeName ?? 'N/A'}
          <br />
          End Node: {selection.endNode?.nodeName ?? 'N/A'}
        </pre>
      ) : (
        <p>No text selected.</p>
      )}
    </div>
  );
}

export default SelectionTracker;
```

## API

### Parameters

None.

### Return Value

The hook returns a `TextSelectionState` object with the following properties:

- `text`: `string`
  - The content of the currently selected text.
- `rect`: `DOMRect | null`
  - A `DOMRect` object describing the bounding box of the selection, or `null` if no selection exists or the rect could not be determined.
- `startOffset`: `number | null`
  - The offset within the start node where the selection begins.
- `endOffset`: `number | null`
  - The offset within the end node where the selection ends.
- `startNode`: `Node | null`
  - The DOM Node where the selection begins.
- `endNode`: `Node | null`
  - The DOM Node where the selection ends.
- `range`: `Range | null`
  - The underlying `Range` object representing the selection.

## Behavior

- Initializes state with empty/null values.
- Uses `useEffect` to add an event listener for the `selectionchange` event on the `document`.
- When the selection changes:
  - It retrieves the current selection using `window.getSelection()`.
  - If a selection exists and is not collapsed (i.e., has a length), it extracts the text, range, start/end nodes, and offsets.
  - It attempts to get the bounding rectangle using `range.getBoundingClientRect()` (includes basic error handling).
  - It compares the new selection details (text, offsets, nodes) with the previous state to avoid unnecessary state updates if the selection hasn't meaningfully changed.
  - If the selection is different, it updates the state with the new details.
  - If the selection is empty or collapsed, it resets the state to the initial empty/null values.
- Includes a check for browser environment (`typeof window !== 'undefined'`).
- Removes the event listener on component unmount.
- Calls the handler initially on mount to capture any pre-existing selection.
