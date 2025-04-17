# `useIsFirstRender`

A React hook that returns `true` if the component is rendering for the first time, and `false` for all subsequent renders. This is useful for executing logic only once when the component mounts.

## Usage

```jsx
import React from "react";
import { useIsFirstRender } from "@supunlakmal/hooks"; // Adjust the import path if necessary

function MyComponent() {
  const isFirstRender = useIsFirstRender();

  React.useEffect(() => {
    if (isFirstRender) {
      console.log("Component rendered for the first time!");
      // Perform initial setup or data fetching here
    } else {
      console.log("Component re-rendered.");
    }
  }, [isFirstRender]); // Dependency array includes isFirstRender

  return <div>{isFirstRender ? "First Render!" : "Subsequent Render."}</div>;
}

export default MyComponent;
```

## Return Value

| Type      | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `boolean` | Returns `true` during the initial render cycle, `false` thereafter. |

## Use Cases

- Running effects or fetching data only on the initial mount.
- Avoiding expensive computations on subsequent renders.
- Conditional rendering based on whether it's the first render.
