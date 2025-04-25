import React from "react";
import useStepper  from "../../hooks/useStepper";

function StepperExample() {    
    const { currentStep, goToNextStep, goToPreviousStep, reset, isFirstStep, isLastStep } = useStepper({totalSteps:3});

    return (
        <div>
            <h1>useStepper Example</h1>
            <p>Current Step: {currentStep}</p>
            <button onClick={goToPreviousStep} disabled={isFirstStep}>Previous</button>
            <button onClick={goToNextStep} disabled={isLastStep}>Next</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

export default StepperExample;