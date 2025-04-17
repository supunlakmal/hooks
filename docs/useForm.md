# `useForm` Hook

A reusable hook for managing form state, handling input changes, and processing form submissions in React applications.

## Usage

```typescript
import React from "react";
import { useForm } from "@supunlakmal/hooks"; // Adjust the import path as needed

interface MyFormData {
  name: string;
  email: string;
  subscribe: boolean;
  color: string;
}

function SignUpForm() {
  const initialValues: MyFormData = {
    name: "",
    email: "",
    subscribe: true,
    color: "red",
  };

  const { values, handleChange, handleSubmit, resetForm } =
    useForm<MyFormData>(initialValues);

  const handleFormSubmit = (formData: MyFormData) => {
    console.log("Form Submitted:", formData);
    // Add your submission logic here (e.g., API call)
    // Optionally reset the form after successful submission
    // resetForm();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name" // 'name' attribute must match the key in initialValues
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="color">Favorite Color:</label>
        <select
          id="color"
          name="color"
          value={values.color}
          onChange={handleChange}
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="subscribe"
            checked={values.subscribe}
            onChange={handleChange}
          />
          Subscribe to newsletter
        </label>
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={resetForm}>
        Reset
      </button>
    </form>
  );
}

export default SignUpForm;
```

## API

### Parameters

- `initialValues`: An object (`T`) representing the initial state of the form fields. The keys should correspond to the `name` attributes of your form inputs.

### Returns

An object (`UseFormReturn<T>`) containing:

- `values`: The current state object (`T`) of the form fields.
- `handleChange`: A memoized callback function (`(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void`) to be passed to the `onChange` prop of form inputs (`input`, `textarea`, `select`). It automatically updates the state based on the input's `name` and `value` (or `checked` for checkboxes).
- `handleSubmit`: A memoized function that takes your submission handler (`(values: T) => void`) as an argument and returns an event handler (`(event: FormEvent<HTMLFormElement>) => void`) suitable for the form's `onSubmit` prop. It prevents the default form submission behavior and calls your provided handler with the current form `values`.
- `resetForm`: A memoized callback function (`() => void`) that resets the form state back to the `initialValues`.
- `setValues`: The state setter function (`React.Dispatch<React.SetStateAction<T>>`) from `useState`. Allows for more direct or complex state manipulations if needed, though `handleChange` covers most standard use cases.

## How it Works

1.  **State Initialization**: Uses `useState` to store the form's field values, initialized with the provided `initialValues`.
2.  **Change Handling**: The `handleChange` function is memoized using `useCallback`. When an input changes, it extracts the `name`, `value`, and `type` from the event target. It updates the state using the setter function, dynamically setting the key corresponding to the input's `name` to the new `value`. It specifically handles checkboxes by using the `checked` property instead of `value`.
3.  **Submission Handling**: The `handleSubmit` function is memoized using `useCallback`. It returns another function that acts as the event listener for the form's `onSubmit` event. This listener first calls `event.preventDefault()` to stop the default browser page reload. Then, it calls the `onSubmit` function (passed as an argument to `handleSubmit`) with the current `values` state.
4.  **Resetting**: The `resetForm` function is memoized using `useCallback`. It simply calls the state setter function (`setValues`) with the original `initialValues`.
5.  **Memoization**: `useCallback` is used for `handleChange`, `handleSubmit`, and `resetForm` to ensure these functions maintain stable references between renders unless their dependencies change. This can be beneficial for performance optimization, especially if these handlers are passed down to memoized child components.
