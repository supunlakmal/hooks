# `useArray`

## Overview

The `useArray` hook simplifies array state management in React components. It takes an initial array and returns the current array state along with a collection of convenient action functions to manipulate that array. This avoids the need to manually write `useState` update logic (like spreading arrays) for common array operations.

## API

```typescript
const [array, actions] = useArray<T>(
  initialArray: T[] | (() => T[])
): [T[], ArrayActions<T>];
```

### Parameters

-   **`initialArray: T[] | (() => T[])`**
    -   The initial array for the state.
    -   Can be a direct array or a function that returns an array (for lazy initialization).
    -   Type: `T[] | (() => T[])`

### Return Value

Returns a tuple `[array, actions]`:

1.  **`array: T[]`**
    -   The current state of the array.
    -   Type: `T[]`

2.  **`actions: ArrayActions<T>`**
    -   An object containing functions to manipulate the array.
    -   Type: `ArrayActions<T>`

### `ArrayActions<T>` Interface

The `actions` object provides the following methods:

-   **`push(item: T): void`**: Adds one element to the end of the array.
-   **`pop(): void`**: Removes the last element from the array.
-   **`set(newArray: T[]): void`**: Replaces the entire array with `newArray`.
-   **`clear(): void`**: Empties the array.
-   **`removeIndex(index: number): void`**: Removes the element at the specified `index`. Does nothing if the index is out of bounds.
-   **`remove(item: T): void`**: Removes the first occurrence of `item` from the array. Uses `indexOf` for comparison. Does nothing if the item is not found.
-   **`filter(predicate: (value: T, index: number, array: T[]) => boolean): void`**: Filters the array in place using the provided `predicate` function, similar to `Array.prototype.filter`.
-   **`sort(compareFn?: (a: T, b: T) => number): void`**: Sorts the array in place. Takes an optional `compareFn` similar to `Array.prototype.sort`.
-   **`reverse(): void`**: Reverses the order of elements in the array in place.
-   **`insert(index: number, item: T): void`**: Inserts `item` at the specified `index`. Does nothing if the index is out of bounds for insertion (i.e., `index < 0` or `index > array.length`).
-   **`setIndex(index: number, item: T): void`**: Replaces the element at the specified `index` with `item`. Does nothing if the index is out of bounds.
-   **`concat(...items: (T | ConcatArray<T>)[]): void`**: Concatenates the provided items (which can be individual elements or arrays of elements) to the end of the current array, similar to `Array.prototype.concat`.

## Example Usage

```tsx
import React from 'react';
import { useArray } from './useArray'; // Adjust path as needed

const TodoList = () => {
  const [todos, { push, pop, filter, removeIndex, clear, set, insert, setIndex, concat }] = useArray<string>([
    'Learn React',
    'Build a project',
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      push(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={() => insert(0, '--- START ---')}>Insert at Start</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeIndex(index)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
            <button onClick={() => setIndex(index, todo.toUpperCase())} style={{ marginLeft: '5px' }}>
              Uppercase
            </button>
          </li>
        ))}
      </ul>

      <h3>Actions:</h3>
      <button onClick={pop}>Pop Last</button>
      <button onClick={() => filter((todo) => todo.toLowerCase().includes('react'))}>
        Filter "React"
      </button>
      <button onClick={() => concat(['More item 1', 'More item 2'])}>Concat Items</button>
      <button onClick={() => set(['Reset to this'])}>Set New Array</button>
      <button onClick={clear}>Clear All</button>
    </div>
  );
};

export default TodoList;
```

### Explanation of Actions:

-   **`push(item)`**: Adds `item` to `todos`.
-   **`pop()`**: Removes the last todo item.
-   **`filter(predicate)`**: Keeps only todos that satisfy the `predicate`.
-   **`removeIndex(index)`**: Removes the todo at the given `index`.
-   **`clear()`**: Removes all todos.
-   **`set(newArray)`**: Replaces `todos` with `newArray`.
-   **`insert(index, item)`**: Inserts `item` at `index`.
-   **`setIndex(index, item)`**: Replaces the todo at `index` with `item`.
-   **`concat(...items)`**: Adds multiple items to the end of the `todos` array.
-   `sort` and `reverse` can be used similarly to sort or reverse the `todos`.

This hook provides a declarative way to manage array state, making component logic cleaner and easier to understand.
