# `useScrollSpy`

Monitors the scroll position of a container (or the window) and determines which target section element is currently considered "active" based on its position relative to the viewport top.

## Usage

Create refs for each section you want to track, pass them as an array to the hook, and optionally provide a container ref and offset.

```tsx
import React, { useRef, useEffect } from "react";
import { useScrollSpy } from "your-hooks-library"; // Adjust import path

const sectionsData = [
  { id: "section-1", title: "Section 1", color: "#ffdddd" },
  { id: "section-2", title: "Section 2", color: "#ddffdd" },
  { id: "section-3", title: "Section 3", color: "#ddddff" },
  { id: "section-4", title: "Section 4", color: "#ffffdd" },
  { id: "section-5", title: "Section 5", color: "#ffddff" },
];

const ScrollSpyComponent: React.FC = () => {
  // Create refs for each section
  const sectionRefs = sectionsData.map(() =>
    useRef<HTMLDivElement | null>(null)
  );

  // Use the hook - get the ID of the active section
  const activeSectionId = useScrollSpy(sectionRefs, {
    // containerRef: // Optional: ref to a scrollable div container
    offset: 100, // Section becomes active when its top is 100px from the container top
    throttleMs: 150,
  });

  useEffect(() => {
    console.log("Active Section:", activeSectionId);
  }, [activeSectionId]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: "0",
    backgroundColor: "white",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    zIndex: 10,
    display: "flex",
    gap: "15px",
  };

  const sectionStyle: React.CSSProperties = {
    height: "80vh", // Make sections taller than viewport
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2em",
    borderBottom: "1px dashed #aaa",
  };

  return (
    <div>
      {/* Sticky Navigation */}
      <nav style={navStyle}>
        <strong>Active: {activeSectionId || "None"} | Jump To:</strong>
        {sectionsData.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(sectionRefs[index])}
            style={{
              fontWeight: activeSectionId === section.id ? "bold" : "normal",
              color: activeSectionId === section.id ? "blue" : "black",
            }}
          >
            {section.title}
          </button>
        ))}
      </nav>

      {/* Content Sections */}
      <div>
        {sectionsData.map((section, index) => (
          <div
            key={section.id}
            id={section.id} // ID is crucial for the hook to return
            ref={sectionRefs[index]} // Assign ref
            style={{ ...sectionStyle, backgroundColor: section.color }}
          >
            {section.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollSpyComponent;
```

## API

### `useScrollSpy(sectionRefs: React.RefObject<HTMLElement | null>[], options?: ScrollSpyOptions): string | null`

#### Parameters

- `sectionRefs` (`React.RefObject<HTMLElement | null>[]`, required): An array of React ref objects. Each ref should be attached to a section element that you want to monitor. **Crucially, each monitored section element must have a unique `id` attribute**, as this `id` is what the hook returns.
- `options` (`ScrollSpyOptions`, optional): Configuration object:
  - `containerRef` (`React.RefObject<HTMLElement | null>`, optional): A ref attached to the scrollable container element. If not provided, the `window` object is used as the scroll container.
  - `offset` (number, optional): A pixel value offset from the top of the scroll container. A section is considered active when its top edge passes this offset scrolling down. Can be negative to activate earlier. Defaults to `0`.
  - `throttleMs` (number, optional): The throttle delay in milliseconds for processing scroll events. Reduces the frequency of calculations during scrolling. Defaults to `100`.

#### Returns

- `string | null`: The `id` attribute of the currently active section element, or `null` if no section is determined to be active (e.g., when scrolled above the first section, considering the offset).

## How it Works

1.  **State**: Uses `useState` to store the `id` of the currently active section.
2.  **Scroll Container**: Determines the scroll container (either `window` or the provided `containerRef.current`).
3.  **Scroll Handler**: Defines a `handleScroll` function that:
    - Gets the current scroll top position of the container.
    - Adds the specified `offset`.
    - Iterates through the `sectionRefs` (from bottom to top for efficiency).
    - For each section, calculates its `offsetTop` relative to the scroll container.
    - If the container's `scrollTop` (plus offset) is greater than or equal to the section's calculated `offsetTop`, that section is considered the active one, its `id` is stored, and the loop breaks.
    - Updates the `activeSectionId` state.
4.  **Throttling**: Wraps the `handleScroll` logic in a throttled handler (`throttledHandleScroll`) using `setTimeout` to limit how often the scroll calculations run during rapid scrolling.
5.  **Event Listeners**: Uses `useEffect` to:
    - Perform an initial check when the component mounts.
    - Attach the `throttledHandleScroll` listener to the `scroll` event of the container and the `resize` event of the `window`.
    - Clean up the listeners and any pending throttle timeout when the component unmounts or dependencies change.

## Notes

- The accuracy of `offsetTop` calculations, especially within nested or complex layouts when using a specific `containerRef`, might require adjustments. The current implementation uses `getBoundingClientRect` for non-window containers, which should be generally reliable but might have edge cases.
- Ensure that the target section elements passed via `sectionRefs` have unique and valid `id` attributes.
- The order of refs in the `sectionRefs` array matters. They should generally correspond to the visual order of sections in the document.
- Performance is managed via throttling, but for extremely complex pages or very large numbers of sections, consider further optimizations if needed.
