# `useInfiniteScroll` Hook

Facilitates the implementation of infinite scrolling by using the `IntersectionObserver` API. It triggers a callback to load more data when a specified target element becomes visible in the viewport or a scrollable parent.

**Note:** This hook provides a _callback ref_ function, not a ref object. Attach this function to the `ref` prop of the element you want to act as the trigger for loading more data.

## Usage

```typescript
import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteScroll } from "@supunlakmal/hooks"; // Adjust path

interface Item {
  id: number;
  name: string;
}

// Simulate fetching data with pagination
const fetchItems = async (
  page: number,
  limit: number = 10
): Promise<{ items: Item[]; hasNextPage: boolean }> => {
  console.log(`Fetching page ${page}...`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  const startId = (page - 1) * limit + 1;
  const items = Array.from({ length: limit }, (_, i) => ({
    id: startId + i,
    name: `Item ${startId + i}`,
  }));
  const hasNextPage = startId + limit <= 50; // Assume 50 items total
  return { items, hasNextPage };
};

function InfiniteScrollList() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const { items: newItems, hasNextPage: morePages } = await fetchItems(
        page
      );
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
      setHasNextPage(morePages);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, page]);

  // Get the callback ref from the hook
  const infiniteScrollRef = useInfiniteScroll<HTMLDivElement>({
    loading,
    hasNextPage,
    onLoadMore: loadMoreItems,
    threshold: 0.5, // Trigger when 50% visible
  });

  // Load initial data
  useEffect(() => {
    loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load only on mount

  return (
    <div
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        border: "1px solid #ccc",
      }}
    >
      <h1>Infinite Scroll Demo</h1>
      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            style={{ padding: "15px", borderBottom: "1px solid #eee" }}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Attach the callback ref to the trigger element */}
      <div
        ref={infiniteScrollRef}
        style={{
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading && <p>Loading more items...</p>}
        {!loading && !hasNextPage && items.length > 0 && (
          <p>No more items to load.</p>
        )}
      </div>
    </div>
  );
}

export default InfiniteScrollList;
```

## API

### Parameters

The hook takes a single configuration object (`UseInfiniteScrollOptions`) with the following properties:

- `loading`: `boolean` - Should be `true` while data is being fetched, `false` otherwise. This prevents multiple simultaneous load requests.
- `hasNextPage`: `boolean` - Should be `true` if there is more data available to load, `false` if the end has been reached.
- `onLoadMore`: `() => void` - The callback function to execute when the trigger element becomes visible and more data needs to be loaded. This function is typically responsible for fetching the next page of data.
- `root`: (Optional) `Element | null` - The ancestor element relative to which the intersection is checked. Defaults to the browser viewport (`null`).
- `rootMargin`: (Optional) `string` - Margin around the `root` element's bounds. Defaults to `'0px'`.
- `threshold`: (Optional) `number` - The percentage of the target element's visibility required to trigger `onLoadMore`. Defaults to `0.1` (10%).

### Returns

- A callback ref setter function: `(node: T | null) => void`. This function should be passed to the `ref` prop of the element that should trigger the loading of more data when it scrolls into view (usually an element at or near the bottom of the list).

## How it Works

1.  **Observer Ref**: Uses `useRef` to hold the `IntersectionObserver` instance.
2.  **Callback Ref**: The core of the hook is a _callback ref_ created with `useCallback`. React calls this function with the DOM node whenever the ref is attached or detached.
3.  **Inside the Callback Ref**:
    - It first checks if `loading` is `true` or `hasNextPage` is `false`. If so, it exits early to avoid unnecessary observation or multiple loads.
    - It disconnects any previous `IntersectionObserver` stored in `observer.current` to clean up before creating a new one (necessary if dependencies change).
    - It creates a new `IntersectionObserver` instance:
      - The observer's callback checks if the observed entry (`entries[0]`) `isIntersecting` and if `hasNextPage` is true. If both conditions are met, it calls the provided `onLoadMore` function.
      - The `root`, `rootMargin`, and `threshold` options are passed directly to the observer's configuration.
    - If the `node` (the element the ref is attached to) exists, it starts observing it with `observer.current.observe(node)`.
4.  **Cleanup Effect**: An `useEffect` hook with an empty dependency array (`[]`) is used solely for cleanup on component unmount. It returns a function that disconnects the current observer, if it exists.
5.  **Dependencies**: The `useCallback` hook has dependencies (`loading`, `hasNextPage`, `onLoadMore`, `root`, `rootMargin`, `threshold`). If any of these change, `useCallback` provides a new callback ref function, which React then uses to re-attach the ref, triggering the logic inside the callback ref again to potentially set up a new observer with the updated configuration.
6.  **Return Value**: The hook returns the memoized callback ref function.
