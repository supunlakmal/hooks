# usePersistentCounter

A custom React hook that provides a counter state which automatically persists its value in the browser's local storage. It combines the functionality of a typical counter (increment, decrement, set, reset) with the persistence provided by `useLocalStorage`.

## Usage

```jsx
import { usePersistentCounter } from '@supunlakmal/hooks'; // Adjust the import path as needed

function PersistentCounterComponent() {
  const { count, increment, decrement, reset, set } = usePersistentCounter(
    'myAppCounter', // Key for local storage
    0, // Initial value if not found in storage
    { min: 0, max: 10, step: 2 } // Optional: Define bounds and step
  );

  return (
    <div>
      <h1>Persistent Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={increment}>Increment (+2)</button>
      <button onClick={decrement}>Decrement (-2)</button>
      <button onClick={() => set(5)}>Set to 5</button>
      <button onClick={reset}>Reset to Initial (0)</button>
      <p>
        (Counter value will be saved in local storage under the key
        'myAppCounter')
      </p>
    </div>
  );
}

export default PersistentCounterComponent;
```

## Parameters

The hook accepts the following parameters:

- **`key`**: `string` (Required)
  - The unique key used to store and retrieve the counter's value in `localStorage`.
- **`initialValue`**: `number` (Optional, defaults to `0`)
  - The initial value of the counter if no value is found for the given `key` in `localStorage`.
- **`options`**: `object` (Optional)
  - An optional object to configure the counter's behavior:
    - `min`: `number` (Optional) - The minimum allowed value for the counter. `decrement` will not go below this value, and `set` will clamp to this minimum.
    - `max`: `number` (Optional) - The maximum allowed value for the counter. `increment` will not go above this value, and `set` will clamp to this maximum.
    - `step`: `number` (Optional, defaults to `1`) - The amount by which the counter increments or decrements.

## Return Value

The hook returns an object with the following properties:

- **`count`**: `number`
  - The current value of the persistent counter.
- **`increment`**: `() => void`
  - A function to increase the counter by the defined `step`, respecting the `max` limit.
- **`decrement`**: `() => void`
  - A function to decrease the counter by the defined `step`, respecting the `min` limit.
- **`set`**: `(newCount: number) => void`
  - A function to set the counter to a specific `newCount`, clamped between `min` and `max` if they are defined.
- **`reset`**: `() => void`
  - A function to reset the counter back to the `initialValue` provided when the hook was initialized.

## Notes

- This hook relies internally on `useLocalStorage` to handle the persistence.
- The counter state will be preserved even if the user closes the browser tab/window and reopens it, as long as the `localStorage` data isn't cleared.
