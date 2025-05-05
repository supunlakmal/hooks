# `usePagination` Hook

Manages pagination logic for client-side data sets (e.g., arrays displayed in tables or lists). It calculates page numbers, indices, and provides functions to navigate between pages.

## Usage

```typescript
import React from "react";
import { usePagination } from "@supunlakmal/hooks"; // Adjust path

// Sample data (replace with your actual data)
const ALL_ITEMS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

function PaginatedList() {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    canGoPreviousPage,
    canGoNextPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage,
  } = usePagination({
    totalItems: ALL_ITEMS.length,
    initialPage: 1,
    initialItemsPerPage: 5,
  });

  // Get the items for the current page
  const currentItems = ALL_ITEMS.slice(startIndex, endIndex + 1);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>Paginated List</h1>

      {/* Items Display */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentItems.map((item) => (
          <li
            key={item.id}
            style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button onClick={goToPreviousPage} disabled={!canGoPreviousPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={!canGoNextPage}>
          Next
        </button>

        {/* Optional: Go to specific page */}
        {/* <input
             type="number"
             min="1"
             max={totalPages}
             value={currentPage}
             onChange={(e) => goToPage(parseInt(e.target.value, 10) || 1)}
             style={{ width: '50px' }}/> */}

        {/* Optional: Items per page selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          style={{ marginLeft: "auto" }}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>
      <p style={{ fontSize: "0.9em", color: "#555" }}>
        Showing items {startIndex + 1} - {endIndex + 1} of {ALL_ITEMS.length}
      </p>
    </div>
  );
}

export default PaginatedList;
```

## API

### Parameters

The hook takes a single configuration object (`UsePaginationProps`) with the following properties:

- `totalItems`: `number` - The total number of items available in the dataset.
- `initialPage`: (Optional) `number` - The page number to start on (1-indexed). Defaults to `1`.
- `initialItemsPerPage`: (Optional) `number` - The number of items to display per page initially. Defaults to `10`.

### Returns

An object (`UsePaginationReturn`) containing:

- `currentPage`: `number` - The current active page number (1-indexed).
- `totalPages`: `number` - The total number of pages calculated based on `totalItems` and `itemsPerPage`.
- `itemsPerPage`: `number` - The current number of items displayed per page.
- `startIndex`: `number` - The 0-based index of the first item on the current page.
- `endIndex`: `number` - The 0-based index of the last item on the current page.
- `canGoPreviousPage`: `boolean` - `true` if there is a page before the current one.
- `canGoNextPage`: `boolean` - `true` if there is a page after the current one.
- `goToPage`: `(pageNumber: number) => void` - Function to navigate directly to a specific page number. Invalid page numbers are clamped within the valid range [1, totalPages].
- `goToNextPage`: `() => void` - Function to navigate to the next page (if possible).
- `goToPreviousPage`: `() => void` - Function to navigate to the previous page (if possible).
- `setItemsPerPage`: `(newItemsPerPage: number) => void` - Function to change the number of items displayed per page. This recalculates `totalPages` and resets `currentPage` to `1`.

## How it Works

1.  **State Management**: Uses `useState` to manage the `currentPage` and `itemsPerPage`.
2.  **Calculate Total Pages**: Uses `useMemo` to calculate `totalPages` based on `totalItems` and `itemsPerPage`. It ensures `totalPages` is at least 1.
3.  **Validate Current Page**: Uses `useMemo` to create `validatedCurrentPage`, ensuring the stored `currentPage` state stays within the valid range [1, `totalPages`]. This derived state is used in other calculations and returned.
4.  **Navigation Functions**: Provides memoized `goToPage`, `goToNextPage`, and `goToPreviousPage` functions using `useCallback`. These functions handle page boundary checks.
5.  **Set Items Per Page**: Provides a memoized `setItemsPerPage` function using `useCallback`. It updates the `itemsPerPage` state and resets the `currentPage` to 1 to avoid being on an invalid page.
6.  **Derived State**: Calculates `canGoPreviousPage`, `canGoNextPage`, `startIndex`, and `endIndex` based on the current validated state.
7.  **Boundary Effect**: Uses `useEffect` to check if `currentPage` becomes invalid after `totalPages` decreases (e.g., due to `setItemsPerPage` or `totalItems` changing externally). If so, it resets `currentPage` to the new `totalPages`.
8.  **Return Value**: Returns an object containing all the calculated state values and control functions.
