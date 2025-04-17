# `useVirtualList`

A performance optimization hook for rendering long lists. It calculates which items should be visible within a scrollable container based on scroll position and renders only those items (plus an optional overscan amount), significantly reducing the number of DOM nodes.

**Note:** This implementation assumes all list items have the **same fixed height**.

## Usage

Provide the full list data, the fixed height of each item, and a ref to the scrollable container.

```tsx
import React, { useRef } from "react";
import { useVirtualList } from "your-hooks-library"; // Adjust import path

// Generate a large list of items
const allItems = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  text: `Item ${index + 1}`,
}));

const ITEM_HEIGHT = 35; // Each item will be 35px tall

const VirtualListComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    virtualItems, // The items to render
    totalHeight, // Total scrollable height
    innerRef, // Ref for the inner container element
  } = useVirtualList({
    list: allItems,
    itemHeight: ITEM_HEIGHT,
    containerRef: containerRef,
    overscan: 10, // Render 10 extra items above/below viewport
  });

  const containerStyle: React.CSSProperties = {
    height: "500px", // Height of the scrollable viewport
    width: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    position: "relative", // Needed for positioning context of innerRef
  };

  // Style for the inner container that has the total height
  // This is managed by the hook via innerRef
  // const innerStyle = { position: 'relative', height: `${totalHeight}px` };

  // Style for each absolutely positioned virtual item
  const itemStyleBase: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: `${ITEM_HEIGHT}px`,
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
    borderBottom: "1px solid #eee",
  };

  return (
    <div>
      <h2>Virtual List (10,000 Items)</h2>
      <p>Inspect the DOM - only a small subset of items are rendered.</p>
      <div ref={containerRef} style={containerStyle}>
        {/* The inner div holds the total height and acts as positioning context */}
        <div ref={innerRef}>
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.index} // Use index as key for virtual items
              style={{
                ...itemStyleBase,
                top: `${virtualItem.offsetTop}px`, // Position item correctly
                // Alternate background for visibility
                backgroundColor:
                  virtualItem.index % 2 === 0 ? "#f9f9f9" : "white",
              }}
            >
              {virtualItem.data.text}
            </div>
          ))}
        </div>
      </div>
      <p>Total theoretical list height: {totalHeight}px</p>
    </div>
  );
};

export default VirtualListComponent;
```

## API

### `useVirtualList<T>(options: UseVirtualListOptions<T>): UseVirtualListResult<T>`

#### Generics

- `T`: The type of the items in the original `list` array.

#### Parameters (`options` object)

- `list` (`T[]`, required): The entire array of data items to be virtualized.
- `itemHeight` (number, required): The fixed height (in pixels) of each rendered list item. **Must be consistent for all items** for this implementation.
- `containerRef` (`React.RefObject<HTMLElement | null>`, required): A React ref attached to the scrollable container element (the element with `overflow: auto` or `overflow: scroll`).
