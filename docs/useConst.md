# useConst

The `useConst` hook initializes and returns a value that remains constant throughout the component's lifecycle. It guarantees that the initializer function (if provided) is called only once.

This is useful for creating expensive objects, class instances, or any value that should be instantiated only once per component instance and never change.

## Usage

```jsx
import React, { useState } from 'react';
import { useConst } from '@supunlakmal/hooks'; // Assuming installation

// Example: A class that might be expensive to create
class ComplexObject {
  constructor(id) {
    console.log(`Creating ComplexObject instance with id: ${id}`);
    this.id = id;
    this.createdAt = new Date();
  }

  getId() {
    return this.id;
  }
}

function ConstComponent() {
  const [count, setCount] = useState(0); // State to trigger re-renders

  // Use useConst to create the ComplexObject instance only once.
  // The initializer function `() => new ComplexObject('unique-abc')` runs only on the first render.
  const myConstantObject = useConst(() => new ComplexObject('unique-abc'));

  // You can also pass a value directly if it's already computed (less common for expensive values)
  // const myConstantValue = useConst({ data: 'initial' }); 

  console.log('Rendering ConstComponent...');

  return (
    <div>
      <h2>useConst Example</h2>
      <p>Component Render Count (Triggered by button): {count}</p>
      <p>Constant Object ID: {myConstantObject.getId()}</p>
      <p>Constant Object Created At: {myConstantObject.createdAt.toLocaleTimeString()}</p>
      <button onClick={() => setCount(c => c + 1)}>Force Re-render</button>
      <p><i>Check the console. 'Creating ComplexObject...' should only appear once.</i></p>
    </div>
  );
}

export default ConstComponent;
```

## API

### Parameters

-   `initializer`: `Initializer<T> | T`
    -   **Required**. Can be either:
        -   An initializer function (`() => T`): A function that returns the value to be treated as constant. This function is guaranteed to be executed only **once** during the initial render.
        -   A value (`T`): The value itself to be treated as constant. If you pass a value directly, ensure it's truly constant or already memoized if it's expensive to compute on every render.

### Return Value

-   `constantValue`: `T`
    -   The constant value. This value is guaranteed to be the same across all renders of the component instance.

## Behavior

-   Uses a `useRef` internally to store the value.
-   During the first render, if the ref is empty, it initializes the ref's value by either calling the `initializer` function or using the provided value directly.
-   On subsequent renders, it simply returns the value already stored in the ref.
-   This ensures the initializer function logic runs only once, making it suitable for expensive computations or object instantiations that should persist for the component's lifetime.

## Comparison to `useRef` and `useState`

-   **vs `useRef`**: While `useRef` can also store values that persist across renders, `useConst` explicitly signals the intent that the value *should not* change after initialization and guarantees the initializer runs only once.
-   **vs `useState`**: `useState` is for values that *can* change and trigger re-renders. `useConst` is for values that are initialized once and remain static. It does not provide a setter function.
-   **vs `useMemo`**: `useMemo` memoizes a value based on dependencies. If dependencies change, `useMemo` recomputes. `useConst` computes only once, regardless of dependencies (as it takes none).
