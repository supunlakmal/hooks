# useLocalStorageQueue

Manages a stateful queue (First-In, First-Out) that is persisted in the browser's Local Storage.

This hook builds upon the `useLocalStorage` hook, providing the standard queue operations (`add`, `remove`, `peek`, `clear`) while automatically saving the queue's state to Local Storage whenever it changes. The queue state will be reloaded from Local Storage when the component mounts or the page is refreshed.

**Note:** Items stored in the queue must be JSON-serializable.

## Usage

```jsx
import React from 'react';
import { useLocalStorageQueue } from '@supunlakmal/hooks'; // Adjust import path

function PersistentTaskQueue() {
  // Use a unique key for Local Storage
  const { add, remove, peek, size, first, last, queue, clear } =
    useLocalStorageQueue < string > ('myAppTaskQueue', []); // Start empty if nothing in storage

  const handleAddTask = () => {
    const newTask = `Persisted Task ${Date.now()}`;
    add(newTask); // Queue is automatically saved to Local Storage
  };

  const handleProcessTask = () => {
    console.log('Processing persisted task:', first);
    remove(); // Queue update is saved to Local Storage
  };

  return (
    <div>
      <h2>Persisted Task Queue (Try refreshing the page!)</h2>
      <p>Current Queue Size: {size}</p>
      <p>Next Task (Peek): {peek() || 'None'}</p>
      <p>Last Task: {last || 'None'}</p>
      <button onClick={handleAddTask}>Add New Task</button>
      <button onClick={handleProcessTask} disabled={size === 0}>
        Process Next Task
      </button>
      <button onClick={clear} disabled={size === 0}>
        Clear Persistent Queue
      </button>

      <h3>Current Queue (from Local Storage):</h3>
      <ul>
        {queue.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default PersistentTaskQueue;
```

## API

`useLocalStorageQueue<T>(key, initialValue?)`

### Type Parameters

- **`T`**: The type of items the queue will hold. **Must be JSON-serializable.**

### Parameters

- **`key`**: `string`
  - The unique key under which the queue array will be stored in Local Storage.
- **`initialValue`**: `T[]` (optional)
  - An array of items to initialize the queue with _only if_ no value already exists in Local Storage for the given `key`.
  - Defaults to an empty array `[]`.

### Returns

- **`queueMethods`**: `object`
  An object containing the queue state and methods (identical interface to `useQueue`, but operates on the persisted state):
  - `add(item: T): void` - Adds an item to the end of the queue and saves to Local Storage.
  - `remove(): void` - Removes the item from the front of the queue and saves to Local Storage. Does nothing if the queue is empty.
  - `peek(): T | undefined` - Returns the item at the front of the queue without removing it. Reads from the current state derived from Local Storage.
  - `size`: `number` - The current number of items in the queue.
  - `first`: `T | undefined` - The first item in the queue, or `undefined` if empty.
  - `last`: `T | undefined` - The last item in the queue, or `undefined` if empty.
  - `queue`: `readonly T[]` - A read-only array representing the current items in the queue, reflecting the state in Local Storage.
  - `clear(): void` - Removes all items from the queue and saves the empty state to Local Storage.
