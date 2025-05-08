# `useResetState` Hook

## Description

`useResetState` is a custom React hook that provides a state variable and a function to reset it to its initial value. This is useful for managing form states, temporary component states, or any state that needs to be easily reset without having to manually set each value back to its default.

## Usage

```typescript
import React, { useState } from 'react';
import { useResetState } from '@supunlakmal/hooks'; // Adjust the import path

interface FormData {
  name: string;
  email: string;
}

function MyForm() {
  const initialFormState: FormData = { name: '', email: '' };
  const [formData, setFormData, resetFormData] = useResetState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Simulate sending data to server
    // After successful submission, reset the form
    resetFormData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>useResetState Example (Form)</h1>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={resetFormData} style={{ marginLeft: '10px' }}>
        Reset Form
      </button>
      <p style={{ marginTop: '15px', fontSize: '0.9em', color: 'gray' }}>
        Fill out the form and click Reset or Submit to see the state revert to initial values.
      </p>
    </form>
  );
}

export default MyForm;
```

## API

```typescript
import { Dispatch, SetStateAction } from 'react';

function useResetState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>, () => void];
```

## Parameters

- **`initialState`**: `S | (() => S)` (Required)
  - Type: `any` or `function that returns any`
  - Description: The initial state value. Can be a value or a function that returns the initial value (similar to `useState`). This value will be used when the `reset` function is called.

## Returns

The hook returns a tuple containing:

1.  **`state`**: `S`
    - The current state value.
2.  **`setState`**: `Dispatch<SetStateAction<S>>`
    - The standard React state setter function to update the state.
3.  **`reset`**: `() => void`
    - A function that, when called, resets the state back to the `initialState`.

## How it Works

The `useResetState` hook uses `useState` internally to manage the state. It stores the `initialState` in a `useRef` so that the reset function always has access to the original initial value, even if the component re-renders with different props or the state is updated. The `reset` function simply calls the `useState` setter with the value stored in the ref.
