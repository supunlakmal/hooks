import { useRef } from 'react';
import { useMount } from './useMount'; // For mount log
import { useUnmount } from './useUnmount'; // For unmount log
import { useUpdateEffect } from './useUpdateEffect'; // For update log

// Helper to compare props (simple shallow comparison)
const propsChanged = (prevProps: any, nextProps: any): boolean => {
  if (!prevProps || !nextProps) return true; // If either is null/undefined
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  if (prevKeys.length !== nextKeys.length) return true;
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return true;
    }
  }
  return false;
};

/**
 * Custom hook for logging component lifecycle events (mount, update, unmount)
 * and prop changes during development.
 * Logs are only output when `process.env.NODE_ENV` is 'development'.
 *
 * @param componentName - The name of the component to include in the logs.
 * @param props - The current props of the component (optional, for logging changes).
 */
export const useLogger = (componentName: string, props?: any): void => {
  const prevPropsRef = useRef(props);

  // Check if in development environment
  // Note: This relies on the build process setting NODE_ENV correctly.
  // In some environments (like pure client-side setups without a build step),
  // this check might not work as expected.
  const isDevelopment = process.env.NODE_ENV === 'development';

  useMount(() => {
    if (isDevelopment) {
      console.log(
        `%c[Mount] ${componentName}`,
        'color: green; font-weight: bold;',
        props ? { props } : ''
      );
    }
  });

  useUpdateEffect(() => {
    if (isDevelopment) {
      const changed = propsChanged(prevPropsRef.current, props);
      console.log(
        `%c[Update] ${componentName}`,
        changed ? 'color: orange; font-weight: bold;' : 'color: blue;',
        props
          ? { props, prevProps: prevPropsRef.current, changed }
          : { changed: 'No props provided' }
      );
      prevPropsRef.current = props; // Update previous props for next comparison
    }
  }, [componentName, props, isDevelopment]); // Re-run if componentName or props change

  useUnmount(() => {
    if (isDevelopment) {
      console.log(
        `%c[Unmount] ${componentName}`,
        'color: red; font-weight: bold;'
      );
    }
  });

  // No need to return anything, the hook just performs side effects (logging)
};
