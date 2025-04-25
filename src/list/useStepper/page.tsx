import React from "react";
import { useStepper } from "../../hooks/useStepper";

function StepperExample() {
    const { step, next, previous, reset, isFirstStep, isLastStep } = useStepper(3);

    return (
        <div>
            <h1>useStepper Example</h1>
            <p>Current Step: {step}</p>
            <button onClick={previous} disabled={isFirstStep}>Previous</button>
            <button onClick={next} disabled={isLastStep}>Next</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

export default StepperExample;