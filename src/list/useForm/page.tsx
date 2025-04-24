import React from "react";
import { useForm } from "@supunlakmal/hooks";

function FormExample() {
    const initialValues = { name: "", email: "" };
    const { values, handleChange, handleSubmit, resetForm } = useForm(initialValues);

    const onSubmit = (formData: typeof initialValues) => {
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
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={resetForm}>
                Reset
            </button>
        </form>
    );
}

export default FormExample;