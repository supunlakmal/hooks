# `useRovingTabIndex`

Implements the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/roving-tabindex/) accessibility pattern, enabling keyboard navigation (arrow keys, Home, End) within a group of focusable elements contained within a specified element.

## Usage

```tsx
import React, { useRef } from "react";
import { useRovingTabIndex } from "your-hooks-library"; // Adjust the import path

const Toolbar: React.FC = () => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  useRovingTabIndex(toolbarRef, {
    orientation: "horizontal", // Navigate with left/right arrows
    wrapAround: true, // Wrap focus from last to first element
  });

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Formatting options"
      style={{
        border: "1px solid grey",
        padding: "5px",
        display: "flex",
        gap: "5px",
      }}
    >
      <button>Bold</button>
      <button>Italic</button>
      <button disabled>Underline (Disabled)</button>
      <a href="#">Link</a>
      <button>List</button>
    </div>
  );
};

const SelectableList: React.FC = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const { activeIndex } = useRovingTabIndex(listRef, {
    orientation: "vertical", // Navigate with up/down arrows
    initialIndex: 1,
    focusableSelector: '[role="option"]', // Only target elements with role="option"
    onIndexChange: (index, element) => {
      console.log(`Selected item ${index + 1}: ${element.textContent}`);
    },
  });

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-label="Choose an option"
      style={{
        border: "1px solid lightblue",
        padding: "10px",
        listStyle: "none",
      }}
    >
      <li role="option" id="opt1">
        Option 1
      </li>
      <li role="option" id="opt2">
        Option 2 (Initially Focused)
      </li>
      <li role="option" id="opt3">
        Option 3
      </li>
    </ul>
  );
};

export default function RovingDemo() {
  return (
    <div>
      <h2>Toolbar Example (Horizontal)</h2>
      <Toolbar />
      <h2>Listbox Example (Vertical)</h2>
      <SelectableList />
      <p>Use Arrow Keys, Home, and End to navigate within each group.</p>
    </div>
  );
}
```

## API

### `useRovingTabIndex<T extends HTMLElement>(containerRef: React.RefObject<T>, options?: RovingTabIndexOptions)`

#### Parameters

- `containerRef` (React.RefObject<T>, required): A React ref object attached to the container element whose focusable descendants will be managed.
- `options` (object, optional): Configuration options.
  - `focusableSelector` (string, optional): A CSS selector string to identify the focusable elements within the container. Defaults to a common selector for interactive elements (`[role="gridcell"], [role="option"], [role="menuitem"], button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`).
  - `initialIndex` (number, optional): The index of the element within the selected focusable elements that should be initially focusable (tabindex="0"). Defaults to `0`.
  - `wrapAround` (boolean, optional): If `true`, navigation wraps from the last element to the first and vice versa. Defaults to `true`.
  - `orientation` (\'horizontal\' | \'vertical\' | \'both\', optional): Determines which arrow keys control navigation.
    - `\'horizontal\'`: Left/Right arrows.
    - `\'vertical\'`: Up/Down arrows.
    - `\'both\'`: All four arrow keys move focus (useful for grids, though linear movement might feel unnatural).
    - Defaults to `\'horizontal\'`.
  - `onIndexChange` ((newIndex: number, element: HTMLElement) => void, optional): A callback function invoked whenever the active focusable element changes via keyboard navigation. Receives the new index and the newly focused element.

#### Returns

An object containing:

- `activeIndex` (number): The index of the currently active (tabindex="0") element within the `focusableElements` array.
- `setActiveIndex` (React.Dispatch<React.SetStateAction<number>>): A function to programmatically set the active index. Use with caution as it might conflict with user interaction.
- `focusableElements` (HTMLElement[]): An array of the focusable descendant elements identified by the `focusableSelector`.

## How it Works

1.  **Identify Focusable Elements**: Finds all descendants of the `containerRef` element matching the `focusableSelector`.
2.  **Manage Tabindex**: Sets `tabindex="0"` on the _active_ element (initially determined by `initialIndex`) and `tabindex="-1"` on all other focusable elements in the group.
3.  **Keyboard Navigation**: Listens for `keydown` events on the container.
    - **Arrow Keys**: Moves focus to the next/previous element based on `orientation` and `wrapAround` settings. Updates `tabindex` attributes accordingly (`0` for the new element, `-1` for the old one) and calls `.focus()` on the new element.
    - **Home/End**: Moves focus to the first/last element, updates `tabindex`, and focuses.
4.  **Dynamic Updates**: Uses a `MutationObserver` to automatically update the list of focusable elements if the children of the container change dynamically. It attempts to maintain a valid `activeIndex`.

## Accessibility Considerations

- Ensure the container element has an appropriate ARIA `role` (e.g., `toolbar`, `listbox`, `menu`, `grid`) and label (`aria-label` or `aria-labelledby`).
- Ensure the focusable descendant elements also have appropriate roles if necessary (e.g., `menuitem`, `option`, `gridcell`).
- This hook manages the `tabindex` attribute to control which element is reachable via the Tab key. Only one element in the group should be in the tab order at any time.
