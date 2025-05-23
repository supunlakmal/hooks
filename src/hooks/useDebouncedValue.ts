import { useState, useEffect } from 'react';

/**
 * @name useDebouncedValue
 * @description Debounces a value. This hook will only update the returned value if the input value has not changed for the specified delay.
 * This is useful when you want to react to a value that changes frequently (e.g., text input)
 * but only want to perform an action (like an API call or heavy computation) after the user has stopped typing for a certain period.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} delay The delay in milliseconds to wait before updating the debounced value.
 * @returns {T} The debounced value.
 *
 * @example
 * const MyComponent = () => {
 *   const [inputValue, setInputValue] = useState('');
 *   const debouncedSearchTerm = useDebouncedValue(inputValue, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Perform search API call or other action with debouncedSearchTerm
 *       console.log(`Searching for: ${debouncedSearchTerm}`);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={inputValue}
 *       onChange={(e) => setInputValue(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes or the component unmounts
    // This is important to prevent updates after the component has unmounted
    // or if the value changes again before the delay has passed.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
};

// Default export for convenience if needed, though named is preferred for tree-shaking
export default useDebouncedValue;
