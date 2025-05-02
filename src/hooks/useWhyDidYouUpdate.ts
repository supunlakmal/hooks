import { useEffect, useRef } from "react";

interface Props {
  [key: string]: any;
}

/**
 * Hook for debugging component re-renders in React.
 * Logs the props that changed between renders, helping identify performance bottlenecks.
 *
 * Usage: Call this hook within your component, passing the component name and its props.
 * useWhyDidYouUpdate('MyComponent', props);
 *
 * @param componentName The name of the component being debugged (for logging purposes).
 * @param props The current props object of the component.
 */
export function useWhyDidYouUpdate(componentName: string, props: Props): void {
  // Use a ref to store the previous props
  const previousProps = useRef<Props | undefined>(undefined);

  useEffect(() => {
    if (previousProps.current) {
      // Get keys of all current and previous props
      const allKeys = Object.keys({ ...previousProps.current, ...props });

      // Object to store changes
      const changesObj: { [key: string]: { from: any; to: any } } = {};

      // Iterate through keys
      allKeys.forEach((key) => {
        // Check if prop exists in previous props
        const hasPrevProp = previousProps.current?.hasOwnProperty(key);
        // Check if prop exists in current props
        const hasCurrentProp = props.hasOwnProperty(key);

        // Compare values if the prop exists in both
        if (hasPrevProp && hasCurrentProp) {
          if (
            previousProps.current &&
            previousProps.current[key] !== props[key]
          ) {
            changesObj[key] = {
              from: previousProps.current[key],
              to: props[key],
            };
          }
        } else if (hasPrevProp && !hasCurrentProp) {
          // Prop removed
          changesObj[key] = {
            from: previousProps.current
              ? previousProps.current[key]
              : undefined,
            to: undefined,
          };
        } else if (!hasPrevProp && hasCurrentProp) {
          // Prop added
          changesObj[key] = {
            from: undefined,
            to: props[key],
          };
        }
      });

      // If changes were detected, log them
      if (Object.keys(changesObj).length) {
        console.log(`[why-did-you-update] ${componentName}:`, changesObj);
      }
      // Optional: Log if no props changed but component still re-rendered
      // else {
      //   console.log(`[why-did-you-update] ${componentName}: Re-rendered without prop changes.`);
      // }
    }

    // Update the ref with the current props for the next render
    previousProps.current = props;
  }); // Runs after every render
}


