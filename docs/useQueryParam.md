# `useQueryParam` Hook

Synchronizes a React state variable with a URL query parameter. It reads the initial value from the URL, updates the URL when the state changes, and listens for browser navigation events (back/forward) to keep the state consistent.

**Note:** This basic implementation primarily handles **string** values. Serializing/deserializing other types (numbers, booleans, arrays, objects) would require additional logic.

**Dependency:** Relies on `useEventListener`.

## Usage

```typescript
import React from "react";
import { useQueryParam } from "@supunlakmal/hooks"; // Adjust path

function SearchFilter() {
  // Synchronize the 'searchTerm' state with the ?search=... query parameter
  const [searchTerm, setSearchTerm] = useQueryParam("search", ""); // Default to empty string
  const [category, setCategory] = useQueryParam("category", "all"); // Default to 'all'

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Updates state and URL
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value); // Updates state and URL
  };

  const clearSearch = () => {
    setSearchTerm(null); // Set to null to remove the param from URL
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "15px", margin: "20px 0" }}
    >
      <h2>Search & Filter (State synced with URL)</h2>
      <p>Change the values below and observe the URL query parameters.</p>
      <p>Try using the browser's back/forward buttons after changing values.</p>

      <div>
        <label htmlFor="search">Search Term: </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter search term..."
        />
        <button
          onClick={clearSearch}
          style={{ marginLeft: "5px" }}
          disabled={searchTerm === ""}
        >
          Clear Search
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="category">Category: </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      <div
        style={{
          marginTop: "15px",
          backgroundColor: "#f0f0f0",
          padding: "10px",
        }}
      >
        <strong>Current State:</strong>
        <pre>
          Search Term: {JSON.stringify(searchTerm)}\nCategory:{" "}
          {JSON.stringify(category)}
        </pre>
        <small>(URL should reflect this state)</small>
      </div>
    </div>
  );
}

export default SearchFilter;
```

## API

### Parameters

- `paramName`: `string` - The name of the URL query parameter key (e.g., `'search'`, `'page'`).
- `initialValue`: (Optional) `string` - The default value for the state if the query parameter is not present in the URL upon initial load. Defaults to `''` (empty string).

### Returns

A tuple `[value, setValue]` containing:

1.  `value`: `string` - The current value of the state, synchronized with the URL query parameter.
2.  `setValue`: `(newValue: string | null) => void` - A function to update the state.
    - Passing a `string` updates the state and sets the corresponding query parameter in the URL.
    - Passing `null` updates the state (to `initialValue`) and **removes** the query parameter from the URL.

## How it Works

1.  **Helper Functions**:
    - `getQueryParamValue`: Safely reads a specific query parameter from `window.location.search` using `URLSearchParams`, handling server-side rendering (SSR) where `window` might be undefined.
    - `updateUrlQueryParam`: Updates or removes a query parameter in the URL using `URLSearchParams` and `window.history.replaceState`. `replaceState` is used to modify the URL without adding a new entry to the browser's history stack.
2.  **State Initialization**: Uses `useState` to manage the `value`. The initial state is determined by calling `getQueryParamValue(paramName)`. If the parameter is not found in the URL, it falls back to the provided `initialValue`.
3.  **Update Function**: Provides a memoized `updateParam` function using `useCallback`.
    - When called with a new value (`string`), it updates the React state using `setValue` and calls `updateUrlQueryParam` to modify the URL.
    - When called with `null`, it sets the React state back to the `initialValue` (as the param is being removed) and calls `updateUrlQueryParam` with `null` to remove the parameter from the URL.
4.  **Browser Navigation Listener**: Uses `useEventListener` to listen for the `popstate` event on the `window`. This event fires when the user navigates using the browser's back or forward buttons.
    - The `handlePopState` callback reads the current value from the URL using `getQueryParamValue` and updates the React state using `setValue`, ensuring the state reflects the URL after navigation.
5.  **Sync Effect**: An additional `useEffect` runs if `paramName` or `initialValue` changes, or on mount. It reads the value directly from the URL and updates the state _only if_ it differs from the current state. This acts as a safeguard for cases where the URL might change through means other than `popstate` or the `updateParam` function (though less common) and ensures consistency if the hook's props change.
