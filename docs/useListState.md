# `useListState` Hook

## Description

The `useListState` hook provides a way to manage an array state with helper functions for common array operations. It allows you to easily push new items, filter the list, update existing items, remove items, set a new list, and clear the list entirely. This simplifies state management for arrays in React components.

## Usage

A clear code example demonstrating how to use the hook.
```
typescript
import { useListState } from '@supunlakmal/hooks';

function MyComponent() {
  const [myList, push, filter, update, remove, set, clear] = useListState<number>([1, 2, 3]);

  const handleAddItem = () => {
    push(4); // Adds 4 to the end of the list
  };

  const handleFilter = () => {
    filter((item) => item > 2); // Filters the list, keeping only items greater than 2
  };

  const handleUpdate = () => {
      update(0,5) //update index 0 to be 5
  }

  const handleRemove = () => {
      remove(0) // remove item in index 0
  }

  const handleSet = () =>{
      set([10,20,30]);
  }

  const handleClear = () => {
    clear(); // clear all items
  };

  return (
    <div>
      <ul>
        {myList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={handleFilter}>Filter</button>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleRemove}>Remove</button>
      <button onClick={handleSet}>Set</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
```
## API
```
typescript
type ListStateHelpers<T> = [
  T[], // The current list state
  (item: T) => void, // push: Adds an item to the end of the list
  (predicate: (item: T) => boolean) => void, // filter: Filters the list based on a predicate
  (index: number, item: T) => void, // update: Updates an item at a specific index
  (index: number) => void, // remove: Removes an item at a specific index
  (newList: T[]) => void, //set : set a new array
  ()=> void // clear all elements
];
```
## Parameters

-   `initialState`:
    -   Type: `T[]`
    -   Description: The initial array state for the list.
    -   Optional: Yes. Defaults to `[]` (empty array)

## Returns

-   **Return type**: `ListStateHelpers<T>`
    -   `list`: `T[]`: The current array state.
    -   `push`: `(item: T) => void`: A function to add an item to the end of the list.
    -   `filter`: `(predicate: (item: T) => boolean) => void`: A function to filter the list, keeping only items that satisfy the given predicate.
    -   `update`: `(index: number, item: T) => void`: A function to update the item at the specified index.
    -   `remove`: `(index: number) => void`: A function to remove the item at the specified index.
    - `set`: `(newList: T[]) => void`: A function to set a new array as the current state.
    - `clear`: `()=> void`: A function to remove all items from the list.

## How it Works

-   **React hooks used:** `useState`, `useCallback`.
-   **Logic and calculations:**
    -   `useState` is used to maintain the current list state.
    -   `useCallback` is used to memoize the helper functions (`push`, `filter`, `update`, `remove`, `set`, `clear`), ensuring they only change when necessary.
    - The `push` function adds a new item to the end of the array and updates the state.
    - The `filter` function creates a new array with the filtered elements and updates the state.
    - The `update` function creates a new array, replacing the element at the specified index with the given item, and updates the state.
    - The `remove` function creates a new array, removing the element at the specified index, and updates the state.
    - The `set` function receives a new array to be set as the current state.
    - the `clear` function will set an empty array as a current state.
-   **Cleanup procedures:** No specific cleanup procedures are needed in this hook, as there are no side effects that require explicit cleanup.
-   **Reasoning behind implementation choices:** The use of `useState` is straightforward for managing the list state. `useCallback` helps optimize performance by preventing unnecessary re-renders of components that depend on these helper functions. Creating new arrays when modifying the list state ensures immutability, which is a good practice in React for predictable state management.