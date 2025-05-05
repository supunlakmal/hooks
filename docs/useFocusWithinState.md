# useFocusWithinState

A custom React hook that determines if a specified DOM element or any of its descendant elements currently have focus. It provides a boolean state mirroring the behavior of the CSS `:focus-within` pseudo-class.

This is useful for applying styles or changing component behavior based on whether any part of a component tree (like a form group or a complex widget) has user focus.

## Usage

```jsx
import { useRef } from 'react';
import { useFocusWithinState } from '@supunlakmal/hooks'; // Adjust import path

function FocusGroup() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track if the container or its children have focus
  const isFocusedWithin = useFocusWithinState(containerRef);

  const containerStyle = {
    padding: '20px',
    border: '2px solid',
    borderColor: isFocusedWithin ? 'blue' : 'lightgray', // Change border when focused within
    marginTop: '10px',
    transition: 'border-color 0.3s ease',
  };

  return (
    <div ref={containerRef} style={containerStyle} tabIndex={-1} /* Optional: Make div focusable if needed, but not required for children */>
      <h2>Focus Within Example</h2>
      <p>Container border turns blue when focus is inside.</p>
      <div>
        <label htmlFor="input1">Input 1: </label>
        <input id="input1" type="text" />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="input2">Input 2: </label>
        <input id="input2" type="text" />
      </div>
       <div style={{ marginTop: '10px' }}>
         <button>Button Inside</button>
       </div>
      <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
        Is Focus Within? {isFocusedWithin.toString()}
      </p>
    </div>
  );
}

function App() {
    return (
        <div>
            <FocusGroup />
            <div style={{marginTop: '20px'}}>
                <label htmlFor="outside">Input Outside: </label>
                <input id="outside" type="text" />
            </div>
        </div>
    )
}

export default App;
```

## Parameters

-   **`elementRef`**: `RefObject<HTMLElement>` (Required)
    -   A React ref object attached to the container DOM element you want to monitor for focus within its boundaries.

## Return Value

-   **`boolean`**
    -   Returns `true` if the element referenced by `elementRef` or any of its descendants currently holds the document's focus.
    -   Returns `false` otherwise.

## Notes

-   This hook attaches `focusin` and `focusout` event listeners to the referenced element. These events bubble, allowing detection of focus changes within the element's subtree.
-   It uses a microtask (`Promise.resolve().then()`) within the `focusout` handler to accurately determine if focus has truly moved *outside* the container element, rather than just between elements *within* it. This handles cases where blurring one child element immediately focuses another child element.
-   Provides a programmatic way to achieve effects similar to the CSS `:focus-within` pseudo-class.
