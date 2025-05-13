<!-- docs/usePut.md -->

# `usePut`

This hook is a specialized version of `useFetch` for making PUT requests. It provides a convenient way to update or replace a resource at a given URL using the HTTP PUT method.

## Usage

```typescript
import { usePut } from './usePut';
import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const UpdateTodoComponent = ({ todoId, initialTodo }: { todoId: string, initialTodo: Todo }) => {
  const [todoTitle, setTodoTitle] = useState(initialTodo.title);
  const { data, loading, error, refetch } = usePut<Todo>(`/api/todos/${todoId}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...initialTodo, title: todoTitle }),
  });

  const handleUpdate = () => {
    refetch(); // Trigger the PUT request
  };

  return (
    <>
      <h2>Update Todo {todoId}</h2>
      <input
        type="text"
        value={todoTitle}
        onChange={(e) => setTodoTitle(e.target.value)}
        placeholder="Todo title"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Todo'}
      </button>

      {data && <p>Todo {todoId} updated successfully.</p>}
      {error && <p>Error updating todo: {error.message}</p>}
    </>
  );
};
```

## Parameters

- `url`: The URL of the resource to update or replace. Can be `string`, `null`, or `undefined`. If `null` or `undefined`, the fetch request will not be made.
- `options`: Optional. An object extending `RequestInit` (excluding `method`). You should provide the `body` with the complete updated data and `headers` (e.g., `'Content-Type': 'application/json'`) in the options.

## Return Value

The hook returns an object with the following properties:

- `data`: The data returned from the PUT request (often the updated or replaced resource), or `null` if loading or an error occurred. The type is `T`, which is inferred from the generic parameter.
- `loading`: A boolean indicating whether the request is currently in progress.
- `error`: An `Error` object if the request failed, or `null` otherwise.
- `refetch`: A function to manually trigger the PUT request.

This hook is built on top of the `useFetch` hook and inherits its core functionality and state management.
