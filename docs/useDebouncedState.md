# useDebouncedState

This hook provides a way to debounce state updates. It's useful when you want to update a piece of state based on user input, but you want to delay the update until the user has stopped typing for a short period.

## API

### Parameters

*   `initialValue`: `T` - The initial value of the state.
*   `delay`: `number` (optional) - The delay in milliseconds before the state is updated. Defaults to 500ms.

### Return Value

*   `debouncedValue`: `T` - The debounced value of the state. This is the value that will be updated after the delay.
*   `setValue`: `(value: T) => void` - The function to update the state. This will update the internal state and trigger the debounce.

## Examples
```
tsx
import { useDebouncedState } from  '@supunlakmal/hooks';
import React, { ChangeEvent } from 'react';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>('', 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>Search Term: {searchTerm}</p>
    </div>
  );
}
```
In this example, `searchTerm` will only be updated 300ms after the user stops typing.

## How it Works

1.  **State:** Uses `useState` to track both the immediate `value` and the `debouncedValue`.
2.  **Timeout:** Uses `setTimeout` to delay updating the `debouncedValue` after each change to `value`.
3.  **Cleanup:** Clears the timeout if `value` or `delay` changes to avoid race conditions.