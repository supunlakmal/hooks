# `useDebounce` Hook

Debounces a value. This hook is useful when you want to delay the execution of a function or the update of a value until a certain amount of time has passed without the source value changing. A common use case is for input fields where you want to wait until the user stops typing before performing an action like an API call.

## Usage

```typescript
import React, { useState, useEffect } from "react";
import { useDebounce } from "@supunlakmal/hooks";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  useEffect(() => {
    // Effect for API call or other action
    if (debouncedSearchTerm) {
      // Perform the search or action with the debounced term
      console.log(`Searching for "${debouncedSearchTerm}"...`);
      // Example: fetch(`/api/search?q=${debouncedSearchTerm}`)
    } else {
      // Handle empty search term case if needed
      console.log("Search term is empty.");
    }
  }, [debouncedSearchTerm]); // This effect runs only when debouncedSearchTerm changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Typing: {searchTerm}</p>
      <p>Debounced: {debouncedSearchTerm}</p>
    </div>
  );
}

export default SearchComponent;
```

## API

### Parameters

- `value`: The value to be debounced. Can be of any type `T`.
- `delay`: The debounce delay in milliseconds (`number`).

### Returns

- `debouncedValue`: The debounced value, which will only update after the specified `delay` has passed without the `value` changing. Initially, it holds the initial `value`.

## How it Works

The `useDebounce` hook utilizes `useState` to store the debounced value and `useEffect` to manage the timing logic.

1.  **State Initialization**: It initializes a state variable `debouncedValue` with the initial `value` passed to the hook.
2.  **Effect Trigger**: An effect is set up to run whenever the `value` or `delay` changes.
3.  **Timeout**: Inside the effect, `setTimeout` is used to schedule an update to `debouncedValue` after the specified `delay`. The update sets `debouncedValue` to the current `value`.
4.  **Cleanup**: The `useEffect` hook returns a cleanup function. This function calls `clearTimeout` on the scheduled timeout. This cleanup runs:
    - Before the effect runs again (if `value` or `delay` changes).
    - When the component unmounts.
5.  **Debouncing Logic**: If the `value` changes again before the `delay` period is over, the cleanup function clears the previous timeout, and a new timeout is set with the new `value`. This ensures that `debouncedValue` only updates once the `value` has stopped changing for the duration of the `delay`.
