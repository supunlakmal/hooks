<!-- docs/useDelete.md -->

# `useDelete`

This hook is a specialized version of `useFetch` for making DELETE requests. It provides a convenient way to delete a resource at a given URL using the HTTP DELETE method.

## Usage

```typescript
import { useDelete } from './useDelete';

const DeleteItemComponent = ({ itemId }: { itemId: string }) => {
  const { data, loading, error, refetch } = useDelete<void>(`/api/items/${itemId}`);

  const handleDelete = () => {
    refetch(); // Trigger the DELETE request
  };

  return (
    <>
      <h2>Delete Item {itemId}</h2>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Item'}
      </button>

      {data && <p>Item {itemId} deleted successfully.</p>}
      {error && <p>Error deleting item: {error.message}</p>}
    </>
  );
};
```

## Parameters

- `url`: The URL of the resource to delete. Can be `string`, `null`, or `undefined`. If `null` or `undefined`, the fetch request will not be made.
- `options`: Optional. An object extending `RequestInit` (excluding `method` and `body`). You can provide headers, mode, credentials, etc.

## Return Value

The hook returns an object with the following properties:

- `data`: The data returned from the DELETE request, or `null` if loading or an error occurred. The type is `T`, which is inferred from the generic parameter (often `void` for delete operations).
- `loading`: A boolean indicating whether the request is currently in progress.
- `error`: An `Error` object if the request failed, or `null` otherwise.
- `refetch`: A function to manually trigger the DELETE request.

This hook is built on top of the `useFetch` hook and inherits its core functionality and state management.
