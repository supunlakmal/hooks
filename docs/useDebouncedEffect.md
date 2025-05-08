# `useDebouncedEffect` Hook

## Description

`useDebouncedEffect` is a custom React hook that is similar to `useEffect`, but it delays the execution of the effect callback until a specified time has elapsed after the dependencies have stopped changing. This is particularly useful for scenarios where you want to perform an action based on changing values (like user input or window resizing) but only after a period of inactivity, preventing the effect from running too frequently.

## Usage

```typescript
import React, { useState } from 'react';
import { useDebouncedEffect } from '@supunlakmal/hooks'; // Adjust the import path

function DebouncedEffectComponent() {
  const [inputValue, setInputValue] = useState('');
  const [processedValue, setProcessedValue] = useState('');

  console.log('Rendered with inputValue:', inputValue);

  // This effect will only run 500ms after inputValue stops changing
  useDebouncedEffect(
    () => {
      console.log('Debounced effect triggered with:', inputValue);
      // Simulate an expensive operation or API call
      setProcessedValue(inputValue);
    },
    [inputValue], // Dependencies array
    500 // Debounce delay in milliseconds
  );

  return (
    <div>
      <h1>useDebouncedEffect Example</h1>
      <p>Type into the input field. The "Processed Value" updates after you stop typing for 500ms.</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Start typing..."
        style={{ width: '300px', padding: '8px' }}
      />
      <p>Current Input Value: <strong>{inputValue}</strong></p>
      <p>Processed Value (Debounced): <strong>{processedValue}</strong></p>
      <p>Check the console to see when the debounced effect runs.</p>
    </div>
  );
}

export default DebouncedEffectComponent;
```

## API

```typescript
import { DependencyList, EffectCallback } from 'react';

function useDebouncedEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  delay?: number
): void;
```

## Parameters

- **`effect`**: `React.EffectCallback`
  - Type: `function`
  - Description: The function containing the side effect logic. This is the same type of function you would pass to `useEffect`. It can optionally return a cleanup function.
- **`deps`**: `React.DependencyList` (optional)
  - Type: `array`
  - Description: An array of dependencies. The effect will be scheduled to run when any of these dependencies change. The debounce delay is applied after a change occurs.
- **`delay`**: `number` (optional)
  - Type: `number`
  - Description: The time in milliseconds to wait after the last dependency change before executing the effect. Defaults to `500`.

## Returns

- `void`: This hook does not return any value.

## How it Works

`useDebouncedEffect` uses a combination of `useEffect` and `setTimeout`. When the dependencies change, a timer is set. If the dependencies change again before the timer expires, the previous timer is cleared and a new one is set. The effect callback is only executed when the timer finally completes without being cleared. The cleanup function returned by the effect callback is run if the dependencies change again before the debounced effect runs, or when the component unmounts, similar to `useEffect`.
