# useQueue

Manages a stateful queue (First-In, First-Out).

Provides methods to add items to the end, remove items from the front, peek at the front item, clear the queue, and access its current state (size, first/last items, and the full queue array).

## Usage

```jsx
import React from 'react';
import { useQueue } from '@supunlakmal/hooks'; // Adjust import path

function TaskQueueComponent() {
  const { add, remove, peek, size, first, last, queue, clear } = useQueue<string>([
    'Initial Task 1',
    'Initial Task 2',
  ]);

  const handleAddTask = () => {
    const newTask = `Task ${size + 1}`;
    add(newTask);
  };

  const handleProcessTask = () => {
    console.log('Processing:', first);
    remove(); // Remove the first task
  };

  return (
    <div>
      <h2>Task Queue</h2>
      <p>Current Queue Size: {size}</p>
      <p>Next Task (Peek): {peek() || 'None'}</p>
      <p>Last Task: {last || 'None'}</p>
      <button onClick={handleAddTask}>Add New Task</button>
      <button onClick={handleProcessTask} disabled={size === 0}>
        Process Next Task
      </button>
      <button onClick={clear} disabled={size === 0}>
        Clear Queue
      </button>

      <h3>Current Queue:</h3>
      <ul>
        {queue.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskQueueComponent;

```

## API

`useQueue<T>(initialQueue?)`

### Type Parameters

-   **`T`**: The type of items the queue will hold.

### Parameters

-   **`initialQueue`**: `T[]` (optional)
    -   An array of items to initialize the queue with. Defaults to an empty array `[]`.

### Returns

-   **`queueMethods`**: `object`
    An object containing the queue state and methods:
    -   `add(item: T): void` - Adds an item to the end of the queue.
    -   `remove(): void` - Removes the item from the front of the queue. Does nothing if the queue is empty.
    -   `peek(): T | undefined` - Returns the item at the front of the queue without removing it. Returns `undefined` if the queue is empty.
    -   `size`: `number` - The current number of items in the queue.
    -   `first`: `T | undefined` - The first item in the queue (same as `peek()`), or `undefined` if empty.
    -   `last`: `T | undefined` - The last item added to the queue, or `undefined` if empty.
    -   `queue`: `readonly T[]` - A read-only array representing the current items in the queue.
    -   `clear(): void` - Removes all items from the queue.
