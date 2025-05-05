# useLocalStorage

A React hook that provides an easy way to use `localStorage` for state persistence across page refreshes and browser sessions.

## Installation

This hook is included in the `@supunlakmal/hooks` package:

```bash
npm install @supunlakmal/hooks
# or
yarn add @supunlakmal/hooks
```

## Usage

```jsx
import { useLocalStorage } from '@supunlakmal/hooks';

function ProfileSettings() {
  // Similar to useState but persists in localStorage
  const [username, setUsername] = useLocalStorage('username', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
```

## API

### `useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>]`

A hook that syncs state with localStorage.

#### Parameters

| Name           | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `key`          | `string` | The localStorage key to store the value under        |
| `initialValue` | `T`      | The initial value if no value exists in localStorage |

#### Return Value

Returns a tuple with:

| Index | Type          | Description                                   |
| ----- | ------------- | --------------------------------------------- |
| `[0]` | `T`           | The current state value                       |
| `[1]` | `SetValue<T>` | Function to update the state and localStorage |

Where `SetValue<T>` is a function with signature:

```typescript
(value: T | ((prevValue: T) => T)) => void
```

## Features

- State persists through page refreshes and browser restarts
- Type-safe with full TypeScript support
- Syncs state across multiple tabs/windows
- Handles errors gracefully (e.g., when localStorage is disabled or full)
- API is identical to React's `useState`, making it easy to use

## Implementation Details

- Uses JSON.stringify/parse for storing and retrieving values
- Automatically updates all tabs/windows when localStorage changes
- Falls back to provided initialValue if localStorage access fails
- Properly handles functional updates (passing a function to the setter)
- Compatible with server-side rendering (checks for window object)

## Example: Dark Mode with Persistence

```jsx
import React from 'react';
import { useLocalStorage } from '@supunlakmal/hooks';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  React.useEffect(() => {
    // Apply the dark mode to the document
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode((prevMode) => !prevMode)}>
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```
