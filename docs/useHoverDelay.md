# useHoverDelay

A custom React hook that tracks whether a user has hovered over a specific element for a minimum duration. It provides a ref to attach to the target element and a boolean state that becomes `true` only after the hover has persisted for the specified `delay`.

This is useful for delaying the appearance of tooltips, popovers, or other UI elements until the user has intentionally hovered over an element for a short period, preventing flickering or accidental triggers during quick mouse movements.

## Usage

```jsx
import { useHoverDelay } from '@supunlakmal/hooks'; // Adjust import path

function DelayedTooltipButton() {
  const delay = 500; // Show tooltip after 500ms of hover
  // Get the ref and the delayed hover state
  const [hoverRef, isHoveringDelayed] = useHoverDelay<HTMLButtonElement>(delay);

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
      <button ref={hoverRef}>Hover Me (for {delay}ms)</button>

      {/* Conditionally render the tooltip based on the delayed state */}
      {isHoveringDelayed && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%', // Position above the button
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '5px',
            padding: '5px 10px',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.9em',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          Delayed Tooltip!
        </div>
      )}
       <p>Is Hovering (Delayed): {isHoveringDelayed.toString()}</p>
    </div>
  );
}

export default DelayedTooltipButton;
```

## Parameters

-   **`delay`**: `number` (Required)
    -   The minimum duration in milliseconds that the user must hover over the element before the returned boolean state becomes `true`.

## Return Value

-   **`[RefObject<T | null>, boolean]`**: A tuple containing:
    -   **`hoverRef`**: `RefObject<T | null>` - A React ref object that **must** be attached to the DOM element you want to track for hover events. `T` defaults to `HTMLElement`.
    -   **`isDelayedHover`**: `boolean` - The stateful boolean value. It becomes `true` only when the element referenced by `hoverRef` has been continuously hovered over for at least the specified `delay`. It resets to `false` immediately when the hover ends (the mouse leaves the element).

## Notes

-   This hook internally uses `useHover` to detect the basic hover state and `useTimeout` to manage the delay.
-   The `isDelayedHover` state becomes `true` *after* the delay completes. If the user stops hovering before the delay is met, the state remains `false`.
-   When the user stops hovering, the `isDelayedHover` state immediately returns to `false`, regardless of whether the delay was met or not.
