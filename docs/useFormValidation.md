# `useFormValidation`

A comprehensive hook for managing form state, validation (on change, blur, submit), and submission handling in React.

## Usage

Define initial values and a validation schema, then use the returned state and handlers to build your form.

```tsx
import React from "react";
import {
  useFormValidation,
  ValidationSchema,
  ValidationRule,
  FormValues,
} from "your-hooks-library"; // Adjust import path

// --- Validation Rules ---
const required: ValidationRule<any> = (value) =>
  value === "" || value === null || value === undefined
    ? "This field is required"
    : undefined;

const isEmail: ValidationRule<any> = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;

const minLength =
  (min: number): ValidationRule<any> =>
  (value) =>
    value && value.length < min
      ? `Must be at least ${min} characters`
      : undefined;

// --- Form Component ---
interface MyFormValues extends FormValues {
  name: string;
  email: string;
  subscribe: boolean;
  feedback: string;
  role: string;
}

const initialFormData: MyFormValues = {
  name: "",
  email: "",
  subscribe: false,
  feedback: "",
  role: "developer",
};

const formSchema: ValidationSchema<MyFormValues> = {
  name: [required, minLength(3)],
  email: [required, isEmail],
  feedback: (value, fieldName, values) => {
    // Conditional validation: feedback required only if subscribed
    if (values.subscribe && !value) {
      return "Feedback is required when subscribed";
    }
    return undefined;
  },
  // No validation needed for 'subscribe' or 'role' in this example
};

const RegistrationForm: React.FC = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormValidation<MyFormValues>({
    initialValues: initialFormData,
    validationSchema: formSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleFormSubmit = async (formValues: MyFormValues) => {
    console.log("Form Submitted:", formValues);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submission successful!");
    // Optionally reset form after successful submission
    // resetForm();
    alert("Form submitted successfully! (Check console)");
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <h2>Registration Form</h2>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.name && touched.name}
          aria-describedby={
            errors.name && touched.name ? "name-error" : undefined
          }
        />
        {errors.name && touched.name && (
          <p id="name-error" style={{ color: "red" }}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email && touched.email}
          aria-describedby={
            errors.email && touched.email ? "email-error" : undefined
          }
        />
        {errors.email && touched.email && (
          <p id="email-error" style={{ color: "red" }}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur} // Optional: track touched for select
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
        {/* No validation error shown for role */}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="subscribe"
            checked={values.subscribe}
            onChange={handleChange}
            onBlur={handleBlur} // Optional: track touched for checkbox
          />
          Subscribe to newsletter
        </label>
        {/* No validation error shown for subscribe checkbox itself */}
      </div>

      <div>
        <label htmlFor="feedback">Feedback:</label>
        <textarea
          id="feedback"
          name="feedback"
          value={values.feedback}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.feedback && touched.feedback}
          aria-describedby={
            errors.feedback && touched.feedback ? "feedback-error" : undefined
          }
        />
        {errors.feedback && touched.feedback && (
          <p id="feedback-error" style={{ color: "red" }}>
            {errors.feedback}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Register"}
      </button>
      <button type="button" onClick={resetForm} disabled={isSubmitting}>
        Reset
      </button>

      {/* Optional: Display overall form error status */}
      {hasErrors &&
        isSubmitting === false &&
        Object.keys(touched).some((k) => touched[k]) && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Please fix the errors above.
          </p>
        )}
    </form>
  );
};

export default RegistrationForm;
```

## API

### `useFormValidation<T extends FormValues>(options: UseFormValidationOptions<T>): UseFormValidationResult<T>`

#### Generics

- `T` (extends `FormValues`, required): An interface or type representing the shape of the form's values (e.g., `{ name: string; email: string; }`). `FormValues` is `Record<string, any>`.

#### Parameters (`options` object)

- `initialValues` (`T`, required): An object containing the initial values for all form fields.
- `validationSchema` (`ValidationSchema<T>`, required): An object where keys match field names in `T`. Each value is a validation rule function or an array of validation rule functions for that field.
  - A `ValidationRule<T>` is a function `(value: FieldValue, fieldName: keyof T, allValues: T) => ValidationError`. It returns an error message string if validation fails, or `undefined` if it passes.
- `validateOnChange` (boolean, optional): If `true`, validation runs for a field whenever its value changes via the `handleChange` handler. Defaults to `true`.
- `validateOnBlur` (boolean, optional): If `true`, validation runs for a field whenever it loses focus (via the `handleBlur` handler). Defaults to `true`.
- `validateOnSubmit` (boolean, optional): If `true`, the entire form is validated when `handleSubmit` is called. Defaults to `true`.

#### Returns (`UseFormValidationResult<T>` object)

- `values` (`T`): The current state of the form values.
- `errors` (`ValidationErrors<T>`): An object containing current validation errors. Keys are field names, values are error message strings or `undefined`.
- `hasErrors` (boolean): A memoized boolean indicating if there are any errors in the `errors` object.
- `touched` (`Record<keyof T, boolean>`): An object tracking which fields have been touched (blurred). Keys are field names, values are booleans.
- `isSubmitting` (boolean): A boolean indicating if the form is currently in the process of submitting (after `handleSubmit` is called and before the provided `onSubmit` function resolves or rejects).
- `handleChange` (`(event: React.ChangeEvent<...>) => void`): A handler function to be passed to the `onChange` prop of standard HTML input, textarea, and select elements. Automatically updates the corresponding field in `values` and triggers validation if `validateOnChange` is true.
- `handleBlur` (`(event: React.FocusEvent<...>) => void`): A handler function to be passed to the `onBlur` prop. Updates the field's `touched` state and triggers validation if `validateOnBlur` is true.
- `handleSubmit` (`(onSubmit: (values: T) => Promise<void> | void) => (event?: React.FormEvent<HTMLFormElement>) => Promise<void>`): A function that takes _your_ async or sync submission handler (`onSubmit`) as an argument and returns an event handler suitable for a `<form>` element's `onSubmit` prop. It prevents default form submission, triggers validation if `validateOnSubmit` is true, sets `isSubmitting` state, calls your `onSubmit` function with the current `values` if there are no errors, and manages the `isSubmitting` state.
- `setFieldValue` (`(fieldName: keyof T, value: FieldValue) => void`): Manually sets the value of a specific field and optionally triggers validation.
- `setValues` (`(values: T) => void`): Manually replaces the entire form values object. Resets errors and touched state.
- `setFieldTouched` (`(fieldName: keyof T, isTouched: boolean) => void`): Manually sets the touched state of a specific field and optionally triggers validation if `validateOnBlur` is true.
- `setAllTouched` (`(isTouched: boolean) => void`): Sets the touched state for all fields. If set to `true`, also triggers validation for the entire form.
- `validateField` (`(fieldName: keyof T) => Promise<ValidationError>`): Manually triggers validation for a single field based on the current `values`. Returns the validation error, if any.
- `validateForm` (`() => Promise<ValidationErrors<T>>`): Manually triggers validation for the entire form based on the current `values`. Returns the complete errors object.
- `resetForm` (`() => void`): Resets the form state (`values`, `errors`, `touched`, `isSubmitting`) back to its initial state based on `initialValues`.

## Notes

- This hook provides a structured way to handle common form logic but doesn't render any UI itself.
- Validation rules receive the field's value, the field's name, and all current form values, allowing for complex and cross-field validation.
- The `handleSubmit` function ensures your submission logic only runs if the form passes validation (if `validateOnSubmit` is enabled).
- Handles standard HTML inputs, textareas, selects, and checkboxes. Multi-selects are parsed into an array of values.
- Consider using accessibility attributes like `aria-invalid` and `aria-describedby` based on the `errors` and `touched` state.
