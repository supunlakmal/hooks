import { useCallback, useMemo, useState } from "react";

// Type Definitions
export type FieldValue = any;
export type FormValues = Record<string, FieldValue>;
export type ValidationError = string | undefined;
export type ValidationErrors<T extends FormValues> = {
  [K in keyof T]?: ValidationError;
};
export type ValidationRule<T extends FormValues> = (
  value: FieldValue,
  fieldName: keyof T,
  allValues: T
) => ValidationError;

export type ValidationSchema<T extends FormValues> = {
  [K in keyof T]?: ValidationRule<T> | Array<ValidationRule<T>>;
};

export interface UseFormValidationOptions<T extends FormValues> {
  initialValues: T;
  validationSchema: ValidationSchema<T>;
  /** Validate on field change (default: true) */
  validateOnChange?: boolean;
  /** Validate on field blur (default: true) */
  validateOnBlur?: boolean;
  /** Validate on form submission (default: true) */
  validateOnSubmit?: boolean;
}

export interface UseFormValidationResult<T extends FormValues> {
  /** Current form values */
  values: T;
  /** Current validation errors */
  errors: ValidationErrors<T>;
  /** Whether the form has any validation errors */
  hasErrors: boolean;
  /** Whether a field has been touched (blurred) */
  touched: Record<keyof T, boolean>;
  /** Whether the form is currently being submitted */
  isSubmitting: boolean;
  /** Function to handle input change events */
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  /** Function to handle input blur events */
  handleBlur: (
    event: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  /** Function to handle form submission */
  handleSubmit: (
    onSubmit: (values: T) => Promise<void> | void
  ) => (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  /** Manually set a field's value */
  setFieldValue: (fieldName: keyof T, value: FieldValue) => void;
  /** Manually set all form values */
  setValues: (values: T) => void;
  /** Manually set a field's touched state */
  setFieldTouched: (fieldName: keyof T, isTouched: boolean) => void;
  /** Manually set touched state for all fields */
  setAllTouched: (isTouched: boolean) => void;
  /** Manually trigger validation for a specific field or the whole form */
  validateField: (fieldName: keyof T) => Promise<ValidationError>;
  validateForm: () => Promise<ValidationErrors<T>>;
  /** Reset the form to its initial state */
  resetForm: () => void;
}

/**
 * Manages form state, validation, and submission logic.
 *
 * @param options Configuration options including initial values and validation schema.
 * @returns Form state and handler functions.
 */
export function useFormValidation<T extends FormValues>(
  options: UseFormValidationOptions<T>
): UseFormValidationResult<T> {
  const {
    initialValues,
    validationSchema,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
  } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() =>
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFieldInternal = useCallback(
    async (fieldName: keyof T, currentValues: T): Promise<ValidationError> => {
      const rules = validationSchema[fieldName];
      if (!rules) return undefined;

      const fieldRules = Array.isArray(rules) ? rules : [rules];
      let error: ValidationError = undefined;

      for (const rule of fieldRules) {
        error = rule(currentValues[fieldName], fieldName, currentValues);
        if (error) break; // Stop at the first error for this field
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error,
      }));
      return error;
    },
    [validationSchema]
  );

  const validateFormInternal = useCallback(
    async (currentValues: T): Promise<ValidationErrors<T>> => {
      const newErrors: ValidationErrors<T> = {};

      for (const fieldName of Object.keys(validationSchema) as Array<keyof T>) {
        const fieldError = await validateFieldInternal(
          fieldName,
          currentValues
        );
        if (fieldError) {
          newErrors[fieldName] = fieldError;
        }
      }
      setErrors(newErrors); // Set all errors at once
      return newErrors;
    },
    [validationSchema, validateFieldInternal]
  );

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = event.target;
      let parsedValue: FieldValue = value;

      // Handle checkboxes
      if (type === "checkbox" && event.target instanceof HTMLInputElement) {
        parsedValue = event.target.checked;
      }
      // Handle multi-select potentially
      if (
        type === "select-multiple" &&
        event.target instanceof HTMLSelectElement
      ) {
        parsedValue = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
      }

      const fieldName = name as keyof T;

      setValuesState((prevValues) => {
        const newValues = { ...prevValues, [fieldName]: parsedValue };
        if (validateOnChange) {
          validateFieldInternal(fieldName, newValues);
        }
        return newValues;
      });
    },
    [validateOnChange, validateFieldInternal]
  );

  const handleBlur = useCallback(
    (
      event: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = event.target;
      const fieldName = name as keyof T;
      setTouched((prevTouched) => ({
        ...prevTouched,
        [fieldName]: true,
      }));
      if (validateOnBlur) {
        setValuesState((currentVals) => {
          // Ensure validation runs with the latest state
          validateFieldInternal(fieldName, currentVals);
          return currentVals; // No state change needed here
        });
      }
    },
    [validateOnBlur, validateFieldInternal]
  );

  const setFieldValue = useCallback(
    (fieldName: keyof T, value: FieldValue) => {
      setValuesState((prevValues) => {
        const newValues = { ...prevValues, [fieldName]: value };
        if (validateOnChange) {
          // Optionally delay validation slightly if needed for rapid programmatic changes
          validateFieldInternal(fieldName, newValues);
        }
        return newValues;
      });
      // Consider if programmatic set should also trigger touched
      // setTouched(prev => ({ ...prev, [fieldName]: true }));
    },
    [validateOnChange, validateFieldInternal]
  );

  const setValues = useCallback((newValues: T) => {
    setValuesState(newValues);
    // Maybe re-validate all or clear errors?
    setErrors({});
    setTouched(
      Object.keys(newValues).reduce((acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      }, {} as Record<keyof T, boolean>)
    );
  }, []);

  const setFieldTouched = useCallback(
    (fieldName: keyof T, isTouched: boolean) => {
      setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: isTouched }));
      if (isTouched && validateOnBlur) {
        setValuesState((currentVals) => {
          // Ensure validation runs with the latest state
          validateFieldInternal(fieldName, currentVals);
          return currentVals; // No state change needed here
        });
      }
    },
    [validateOnBlur, validateFieldInternal]
  );

  const setAllTouched = useCallback(
    (isTouched: boolean) => {
      setTouched((prevTouched) => {
        const newTouched = { ...prevTouched };
        Object.keys(newTouched).forEach((key) => {
          newTouched[key as keyof T] = isTouched;
        });
        return newTouched;
      });
      if (isTouched) {
        // Validate all fields when setting all to touched (e.g., on submit failure)
        validateFormInternal(values);
      }
    },
    [validateFormInternal, values]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) =>
      async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        setIsSubmitting(true);
        setAllTouched(true); // Mark all fields as touched

        let formErrors: ValidationErrors<T> = {};
        if (validateOnSubmit) {
          formErrors = await validateFormInternal(values);
        }

        const hasFormErrors = Object.values(formErrors).some(
          (error) => !!error
        );

        if (!hasFormErrors) {
          try {
            await onSubmit(values);
          } catch (submitError) {
            console.error("Form submission error:", submitError);
            // Optionally set a form-level error
            // setErrors(prev => ({ ...prev, _form: 'Submission failed' }));
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setIsSubmitting(false);
          // Focus the first field with an error (optional, requires element refs)
        }
      },
    [validateOnSubmit, validateFormInternal, values, setAllTouched]
  );

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      }, {} as Record<keyof T, boolean>)
    );
    setIsSubmitting(false);
  }, [initialValues]);

  const hasErrors = useMemo(
    () => Object.values(errors).some((error) => !!error),
    [errors]
  );

  return {
    values,
    errors,
    hasErrors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    setFieldTouched,
    setAllTouched,
    validateField: (fieldName: keyof T) =>
      validateFieldInternal(fieldName, values),
    validateForm: () => validateFormInternal(values),
    resetForm,
  };
}


