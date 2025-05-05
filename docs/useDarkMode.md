# `useDarkMode` Hook

Manages application theme preference (dark/light mode). It detects the user's operating system preference using `useMediaQuery` and persists the user's choice (override) using `useLocalStorage`. It also applies a `dark` or `light` class to the `<html>` element for easy CSS styling.

**Dependencies:** This hook relies on `useMediaQuery` and `useLocalStorage` hooks being available.

## Usage

**1. Basic Setup (App Component)**

```typescript
// App.tsx or similar root component
import React from "react";
import { useDarkMode } from "@supunlakmal/hooks"; // Adjust path
import "./styles.css"; // Import your global styles

function App() {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  return (
    <div>
      {" "}
      {/* No need for className='dark' here, it's applied to <html> */}
      <h1>Dark Mode Demo</h1>
      <p>Current mode: {isDarkMode ? "Dark" : "Light"}</p>
      <button onClick={toggle}>Toggle Mode</button>
      <button onClick={enable}>Enable Dark Mode</button>
      <button onClick={disable}>Disable Dark Mode</button>
      <div className="content-box">
        This box will have styles applied based on the dark/light theme.
      </div>
    </div>
  );
}

export default App;
```

**2. Example CSS**

Create a CSS file (e.g., `styles.css`) to define styles based on the `dark` and `light` classes applied to the `<html>` element.

```css
/* Default styles (can be light mode or common styles) */
body {
  font-family: sans-serif;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.content-box {
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  border: 1px solid;
}

/* Light mode styles (applied when <html> has class 'light') */
html.light body {
  background-color: #ffffff;
  color: #333333;
}

html.light .content-box {
  background-color: #f0f0f0;
  border-color: #cccccc;
}

/* Dark mode styles (applied when <html> has class 'dark') */
html.dark body {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

html.dark .content-box {
  background-color: #2a2a2a;
  border-color: #555555;
}

/* Example button styles */
button {
  margin: 5px;
  padding: 8px 15px;
  cursor: pointer;
}

html.light button {
  background-color: #e0e0e0;
  border: 1px solid #cccccc;
  color: #333;
}

html.dark button {
  background-color: #444444;
  border: 1px solid #666666;
  color: #e0e0e0;
}
```

## API

### Parameters

- `defaultValue`: (Optional) `boolean` - An initial value for dark mode. If provided, it overrides both the persisted value in local storage and the OS preference on the initial render.

### Returns

An object (`UseDarkModeOutput`) containing:

- `isDarkMode`: `boolean` - The current state, `true` if dark mode is active, `false` otherwise.
- `toggle`: `() => void` - A function to toggle the dark mode state (persists the change).
- `enable`: `() => void` - A function to explicitly enable dark mode (persists the change).
- `disable`: `() => void` - A function to explicitly disable dark mode (persists the change).
- `set`: `(value: boolean) => void` - A function to set the dark mode state to a specific boolean value (persists the change).

## How it Works

1.  **System Preference**: Uses `useMediaQuery('(prefers-color-scheme: dark)')` to detect if the user's operating system is set to dark mode (`isSystemDark`).
2.  **Local Storage**: Uses `useLocalStorage<boolean>('usehooks-ts-dark-mode', defaultValue ?? isSystemDark)` to manage the user's preference.
    - It attempts to read the value from local storage under the key `'usehooks-ts-dark-mode'`.
    - If no value is found in local storage, it initializes it with the `defaultValue` if provided, otherwise it falls back to the `isSystemDark` value obtained from `useMediaQuery`.
    - It returns the stored value (`isDarkModeStored`) and a function to update it (`setDarkModeStored`).
3.  **Determine Current State**: The definitive `isDarkMode` state is determined by checking the `isDarkModeStored` value from local storage. If it exists (i.e., the user has made a choice), it takes precedence. Otherwise, it falls back to the `isSystemDark` preference.
4.  **Apply Theme Class**: An `useEffect` hook runs whenever `isDarkMode` changes.
    - It targets the `<html>` element (`document.documentElement`).
    - If `isDarkMode` is `true`, it adds the `dark` class and removes the `light` class.
    - If `isDarkMode` is `false`, it adds the `light` class and removes the `dark` class.
5.  **Control Functions**: Provides `toggle`, `enable`, `disable`, and `set` functions that wrap the `setDarkModeStored` function from `useLocalStorage` to allow easy manipulation of the persisted dark mode state.
