import { useState, useCallback, useMemo, useEffect } from "react";

interface UseStepperProps {
  initialStep?: number;
  totalSteps: number;
}

interface UseStepperReturn {
  currentStep: number; // 1-indexed
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNextStep: boolean;
  canGoPreviousStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (stepNumber: number) => void;
  reset: () => void; // Added reset function
}

/**
 * Custom hook for managing state in multi-step forms or wizards.
 *
 * @param {UseStepperProps} props - Configuration options.
 * @param {number} [props.initialStep=1] - The initial step number (1-indexed).
 * @param {number} props.totalSteps - The total number of steps in the process.
 * @returns {UseStepperReturn} An object containing stepper state and control functions.
 */
export function useStepper({
  initialStep = 1,
  totalSteps,
}: UseStepperProps): UseStepperReturn {
  // Ensure totalSteps is at least 1
  const safeTotalSteps = useMemo(() => Math.max(1, totalSteps), [totalSteps]);

  // Clamp initialStep within valid bounds
  const validatedInitialStep = useMemo(
    () => Math.max(1, Math.min(initialStep, safeTotalSteps)),
    [initialStep, safeTotalSteps]
  );

  const [currentStep, setCurrentStep] = useState<number>(validatedInitialStep);

  // Clamp step number within valid bounds [1, totalSteps]
  const clampStep = useCallback(
    (step: number): number => {
      return Math.max(1, Math.min(step, safeTotalSteps));
    },
    [safeTotalSteps]
  );

  // Go to a specific step
  const goToStep = useCallback(
    (stepNumber: number) => {
      setCurrentStep(clampStep(stepNumber));
    },
    [clampStep]
  );

  // Go to the next step
  const goToNextStep = useCallback(() => {
    setCurrentStep((prevStep) => clampStep(prevStep + 1));
  }, [clampStep]);

  // Go to the previous step
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prevStep) => clampStep(prevStep - 1));
  }, [clampStep]);

  // Reset to the initial step
  const reset = useCallback(() => {
    setCurrentStep(validatedInitialStep);
  }, [validatedInitialStep]);

  // Derived boolean states
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === safeTotalSteps;
  const canGoNextStep = !isLastStep;
  const canGoPreviousStep = !isFirstStep;

  // Ensure currentStep is updated if totalSteps changes and makes currentStep invalid
  useEffect(() => {
    setCurrentStep(clampStep(currentStep));
  }, [safeTotalSteps, clampStep, currentStep]);

  return {
    currentStep,
    totalSteps: safeTotalSteps,
    isFirstStep,
    isLastStep,
    canGoNextStep,
    canGoPreviousStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    reset,
  };
}


