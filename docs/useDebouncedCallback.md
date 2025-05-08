# `useDebouncedCallback` Hook

## Description

`useDebouncedCallback` is a custom React hook that creates a debounced version of a callback function. When the debounced function is called, it waits for a specified delay before executing the original callback. If the debounced function is called again within that delay period, the timer is reset. This is useful for limiting the rate at which a function is called, especially for events like typing, scrolling, or resizing, where you only want to react after the user has finished performing the action for a short period.

## Usage

```typescript
import React, { useState, useCallback } from 'react';
import { useDebouncedCallback } from '@supunlakmal/hooks'; // Adjust the import path

function SearchInput() {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  // Create a debounced version of a function that updates the display value
  const updateDisplayValue = useDebouncedCallback(
    (value: string) => {
      console.log('Debounced function executed with:', value);
      setDisplayValue(value);
    },
    500 // 500 milliseconds delay
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // Call the debounced function. It will only execute 500ms after the last call.
    updateDisplayValue(newValue);
  };

  return (
    <div>
      <h1>useDebouncedCallback Example</h1>
      <p>Type into the input field. The "Debounced Value" updates after you stop typing for 500ms.</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Start typing..."
        style={{ width: '300px', padding: '8px' }}
      />
      <p>Current Input Value: <strong>{inputValue}</strong></p>
      <p>Debounced Value: <strong>{displayValue}</strong></p>
      <p>Check the console to see when the debounced function runs.</p>
    </div>
  );
}

export default SearchInput;
```

## API

```typescript
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: { maxWait?: number }
): (...args: Parameters<T>) => void;
```

## Parameters

- **`callback`**: `(...args: any[]) => any`
  - Type: `function`
  - Description: The function to debounce. It will receive the arguments passed to the debounced function.
- **`delay`**: `number`
  - Type: `number`
  - Description: The number of milliseconds to delay the execution of the callback.
- **`options`**: `{ maxWait?: number }` (optional)
  - Type: `object`
  - Description: An optional options object.
    - `maxWait` (number, optional): The maximum time the debounced function is allowed to be delayed before it's invoked. If the debounced function is called repeatedly, the callback will be executed at least once every `maxWait` milliseconds.

## Returns

- **`debouncedCallback`**: `(...args: Parameters<T>) => void`
  - Type: `function`
  - Description: A new function that, when called, will debounce the execution of the original `callback`. This function accepts the same arguments as the original `callback`.

## How it Works

The `useDebouncedCallback` hook manages a timer internally using `setTimeout`. When the returned debounced function is called, it clears any existing timer and sets a new one. The original `callback` is only executed when the timer completes without being reset by another call to the debounced function. The `maxWait` option, if provided, adds an additional layer to ensure the callback is invoked periodically even if calls are continuous. It typically uses `useRef` to store the timer ID and potentially the last arguments, and `useCallback` to ensure the debounced function itself has a stable identity across renders.
