# `useList` Hook

## Description

The `useList` hook provides a convenient way to manage a list of items with common operations like adding, removing, updating, and clearing. It simplifies working with arrays and state management within functional components.

## Usage

Here's a basic example of how to use the `useList` hook:
```
typescript
import { useList } from '@supunlakmal/hooks';

function MyComponent() {
  const { list, add, remove, update, clear } = useList<string>(['initial', 'items']);

  return (
    <div>
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={() => add('new item')}>Add Item</button>
      <button onClick={() => remove(0)}>Remove First Item</button>
      <button onClick={() => update(0, 'updated item')}>Update First Item</button>
      <button onClick={clear}>Clear List</button>
    </div>
  );
}
```
## API
```
typescript
type ListActions<T> = {
  list: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, newItem: T) => void;
  clear: () => void;
};

function useList<T>(initialList: T[]): ListActions<T>;
```
## Parameters

*   **`initialList`**: `T[]`
    *   The initial array of items for the list. This is an array of type `T`.

## Returns

The `useList` hook returns an object with the following properties:

*   **`list`**: `T[]`
    *   The current list of items.
*   **`add`**: `(item: T) => void`
    *   A function to add a new item to the end of the list.
*   **`remove`**: `(index: number) => void`
    *   A function to remove an item from the list at the specified index.
*   **`update`**: `(index: number, newItem: T) => void`
    *   A function to update an existing item at the specified index with a new item.
*   **`clear`**: `() => void`
    *   A function to remove all items from the list.

## How it Works

The `useList` hook internally uses the `useState` hook to manage the list of items. The `add`, `remove`, `update`, and `clear` functions are designed to update this state with immutable operations:

*   **`useState`**: Manages the list state.
*   **`add`**: Creates a new array with the new item appended and updates the state.
*   **`remove`**: Creates a new array excluding the item at the specified index and updates the state.
*   **`update`**: Creates a new array with the item at the specified index replaced and updates the state.
*   **`clear`**: Clears the array and updates the state.
*   **Immutability**: Each operation creates a new array instead of modifying the existing one, which is essential for predictable state management in React.