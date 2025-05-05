import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

/**
 * Interface for the return value of useForm.
 *
 * @template T The shape of the form values.
 */
interface UseFormReturn<T> {
  values: T;
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (
    onSubmit: (values: T) => void
  ) => (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * Custom hook for managing form state and handling submissions.
 *
 * @template T An object type representing the form fields.
 * @param {T} initialValues The initial values for the form fields.
 * @returns {UseFormReturn<T>} An object containing form values, handlers, and reset function.
 */
export const useForm = <T extends object>(
  initialValues: T
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);

  /**
   * Handles changes in form inputs (input, textarea, select).
   * Updates the corresponding field in the state.
   */
  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = event.target;
      const target = event.target;

      // Handle checkbox input type
      if (type === 'checkbox' && target instanceof HTMLInputElement) {
        setValues((prevValues) => ({
          ...prevValues,
          [name]: target.checked,
        }));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      }
    },
    []
  );

  /**
   * Creates a submit handler function.
   * Prevents the default form submission and calls the provided onSubmit callback.
   *
   * @param {(values: T) => void} onSubmit The callback function to execute with form values upon submission.
   * @returns {(event: FormEvent<HTMLFormElement>) => void} The event handler for the form's onSubmit event.
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(values);
    },
    [values]
  );

  /**
   * Resets the form fields back to their initial values.
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    setValues, // Expose setValues for more complex state updates if needed
  };
};
