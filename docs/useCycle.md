# `useCycle` Hook

## Description

`useCycle` is a custom React hook that allows you to cycle through a list of values. It's useful for implementing features like theme switching or step-by-step processes.

The `useCycle` hook takes an array of values as an argument and returns an array containing the current value, a function to advance to the next value, and a function to go back to the previous value.

## Usage

```typescript
import React from 'react';
import { useCycle } from '@supunlakmal/hooks'; // Adjust the import path

function ThemeSwitcher() {
  const themes = ['light', 'dark', 'system', 'ocean'];
  const [currentTheme, nextTheme, prevTheme] = useCycle(themes);

  return (
    <div>
      <h1>useCycle Example</h1>
      <p>Current Theme: <strong>{currentTheme}</strong></p>
      <button onClick={nextTheme}>Next Theme</button>
      <button onClick={prevTheme}>Previous Theme</button>
    </div>
  );
}

export default ThemeSwitcher;
```

## API

```typescript
function useCycle<T>(values: T[]): [T, () => void, () => void];
```

### Parameters

- **values**: `T[]`
  - Type: `Array`
  - Description: An array of values to cycle through.

### Returns

- A tuple containing:
    - The current value from the `values` array.
    - A function to move to the next value in the cycle.
    - A function to move to the previous value in the cycle.

## How it Works

The `useCycle` hook maintains the current index of the `values` array using `useState`. The `nextTheme` and `prevTheme` functions update this index, wrapping around to the beginning or end of the array as needed to create the cycling behavior.
