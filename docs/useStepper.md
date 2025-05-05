# `useStepper` Hook

Manages the state and navigation logic for multi-step processes like wizards, forms, or tutorials.

## Usage

```typescript
import React from "react";
import { useStepper } from "@supunlakmal/hooks"; // Adjust path

// Example Step Components (replace with your actual step content)
const Step1 = () => <div>Content for Step 1</div>;
const Step2 = () => <div>Content for Step 2</div>;
const Step3 = () => <div>Content for Step 3</div>;
const Step4 = () => <div>Content for Step 4: Final Step!</div>;

const steps = [<Step1 />, <Step2 />, <Step3 />, <Step4 />];

function MultiStepWizard() {
  const {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    canGoNextStep,
    canGoPreviousStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    reset,
  } = useStepper({ totalSteps: steps.length, initialStep: 1 });

  const CurrentStepComponent = steps[currentStep - 1]; // 0-indexed access

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", margin: "20px 0" }}
    >
      <h2>
        Multi-Step Wizard ({currentStep}/{totalSteps})
      </h2>

      {/* Render the current step's component */}
      <div
        style={{
          margin: "20px 0",
          padding: "15px",
          border: "1px dashed #eee",
          minHeight: "50px",
        }}
      >
        {CurrentStepComponent}
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <button onClick={goToPreviousStep} disabled={!canGoPreviousStep}>
            Previous
          </button>
          <button
            onClick={goToNextStep}
            disabled={!canGoNextStep}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>

        {/* Optional: Direct step navigation */}
        {/* <div>
             {Array.from({ length: totalSteps }, (_, i) => i + 1).map(stepNum => (
                 <button
                    key={stepNum}
                    onClick={() => goToStep(stepNum)}
                    disabled={currentStep === stepNum}
                    style={{ marginLeft: '5px' }} >
                    {stepNum}
                 </button>
             ))}
        </div> */}

        <button
          onClick={reset}
          disabled={isFirstStep}
          style={{ marginLeft: "auto" }}
        >
          Reset to Start
        </button>
      </div>

      <p style={{ fontSize: "0.9em", marginTop: "15px" }}>
        Status:{" "}
        {isFirstStep
          ? "On First Step"
          : isLastStep
          ? "On Last Step"
          : `On Step ${currentStep}`}
      </p>
    </div>
  );
}

export default MultiStepWizard;
```

## API

### Parameters

The hook takes a single configuration object (`UseStepperProps`) with the following properties:

- `totalSteps`: `number` - The total number of steps in the sequence (must be at least 1).
- `initialStep`: (Optional) `number` - The step number (1-indexed) to start on. Defaults to `1`. Invalid initial steps are clamped to the range [1, `totalSteps`].

### Returns

An object (`UseStepperReturn`) containing:

- `currentStep`: `number` - The current active step number (1-indexed).
- `totalSteps`: `number` - The total number of steps available.
- `isFirstStep`: `boolean` - `true` if the current step is the first step (1).
- `isLastStep`: `boolean` - `true` if the current step is the last step (`totalSteps`).
- `canGoNextStep`: `boolean` - `true` if it's possible to navigate to the next step.
- `canGoPreviousStep`: `boolean` - `true` if it's possible to navigate to the previous step.
- `goToNextStep`: `() => void` - Function to advance to the next step (if not already on the last step).
- `goToPreviousStep`: `() => void` - Function to go back to the previous step (if not already on the first step).
- `goToStep`: `(stepNumber: number) => void` - Function to navigate directly to a specific step number. Invalid step numbers are clamped to the range [1, `totalSteps`].
- `reset`: `() => void` - Function to return to the `initialStep`.

## How it Works

1.  **Input Validation**: Uses `useMemo` to calculate `safeTotalSteps` (ensuring at least 1) and `validatedInitialStep` (clamping the initial step within [1, `safeTotalSteps`]).
2.  **State Management**: Uses `useState` (`currentStep`, `setCurrentStep`) to store the current active step number, initialized with `validatedInitialStep`.
3.  **Step Clamping**: Defines a memoized `clampStep` function using `useCallback` to ensure any target step number stays within the valid range [1, `safeTotalSteps`].
4.  **Navigation Functions**: Provides memoized `goToStep`, `goToNextStep`, `goToPreviousStep`, and `reset` functions using `useCallback`. These functions use `setCurrentStep` (potentially with the previous state) and `clampStep` to manage navigation logic.
5.  **Derived State**: Calculates boolean flags (`isFirstStep`, `isLastStep`, `canGoNextStep`, `canGoPreviousStep`) directly from the current `currentStep` and `safeTotalSteps`.
6.  **Boundary Effect**: Uses `useEffect` to watch for changes in `safeTotalSteps`. If `totalSteps` decreases such that the `currentStep` becomes invalid, this effect calls `setCurrentStep(clampStep(currentStep))` to bring it back into the valid range.
7.  **Return Value**: Returns an object containing the current step, total steps, boolean status flags, and navigation functions.
