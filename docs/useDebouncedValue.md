# `useDebouncedValue`

## Overview

The `useDebouncedValue` hook provides a debounced version of a rapidly changing value. It only updates its returned value after a specified delay has passed without the input value changing.

This is particularly useful for scenarios where you want to react to user input or other frequently changing values, but you want to wait until changes have "settled" before performing an action. For example, triggering an API call based on text input, but only after the user has paused typing.

It differs from `useDebounce` (which typically debounces a callback function) by directly debouncing the *value* itself.

## API

```typescript
const debouncedValue = useDebouncedValue<T>(
  value: T,
  delay: number
): T;
```

### Parameters

-   **`value: T`**
    -   The original value that you want to debounce.
    -   The hook will monitor this value for changes.
    -   Type: `T` (generic)

-   **`delay: number`**
    -   The debounce delay in milliseconds.
    -   The `debouncedValue` will only be updated if this amount of time elapses without the input `value` changing.
    -   Type: `number`

### Return Value

-   **`debouncedValue: T`**
    -   The debounced version of the input `value`.
    -   Initially, this will be the initial input `value`. It will subsequently update only after the `delay` period has passed since the last change to the input `value`.
    -   Type: `T` (same as the input value)

## Example Usage

```tsx
import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from './useDebouncedValue'; // Adjust path as needed

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500); // Debounce with 500ms delay

  useEffect(() => {
    // This effect runs when `debouncedSearchTerm` changes
    if (debouncedSearchTerm) {
      console.log(`Performing search for: ${debouncedSearchTerm}`);
      // Replace console.log with actual API call or other expensive operation
      // e.g., fetch(`/api/search?query=${debouncedSearchTerm}`);
    } else {
      console.log('Search term is empty.');
    }
  }, [debouncedSearchTerm]); // Dependency array includes only the debounced value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={handleChange}
      />
      <p>Input: {searchTerm}</p>
      <p>Debounced: {debouncedSearchTerm}</p>
    </div>
  );
};

export default SearchComponent;
```

### Explanation:

1.  The user types into the input field, updating `searchTerm` on every keystroke.
2.  `useDebouncedValue` receives the `searchTerm`.
3.  If the user types "hello", `debouncedSearchTerm` will not immediately become "hello".
4.  If the user pauses typing for 500ms (the specified `delay`), `debouncedSearchTerm` will then update to "hello".
5.  The `useEffect` hook, which depends on `debouncedSearchTerm`, will then execute, performing the search action.
6.  If the user continues typing before the 500ms delay is up (e.g., changes "hello" to "hello world"), the previous timer in `useDebouncedValue` is cleared, and a new one starts. The search action is only triggered once the user pauses for 500ms.

This behavior prevents excessive API calls or computations while the user is actively providing input.

## When to Use

-   When you need to perform actions based on a value that changes frequently, but only after the changes have stabilized (e.g., user input in search bars, sliders, text areas).
-   To improve performance by reducing the number of times an expensive operation is triggered.
-   When you need the debounced *value* itself to use in dependency arrays or pass as props, rather than debouncing a callback function.
