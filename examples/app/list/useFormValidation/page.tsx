"use client"
import React from "react";
import useFormValidation  from "../../../../src/hooks/useFormValidation";


interface FormData {
    name: string;
    email: string;
}
const validationSchema = {
    name: [(value: string) => (!value ? "Name is required" : undefined)],
    email: [
        (value: string) => (!value ? "Email is required" : undefined),
        (value: string) =>
            value && !/^[^@]+@[^@]+\.[^@]+$/.test(value) ? "Invalid email address" : undefined,
    ],
};

function FormValidationExample() {
    const initialValues = { name: "", email: "" };
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    } = useFormValidation<FormData>({ initialValues, validationSchema });

    const onSubmit = (formData: FormData) => {
        console.log("Form submitted:", formData);
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={resetForm}>
                Reset
            </button>
        </form>
    );
}

export default FormValidationExample;