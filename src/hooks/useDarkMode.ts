import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage'; // Use our existing hook
import { useMediaQuery } from './useMediaQuery'; // Use our existing hook

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const LOCAL_STORAGE_KEY = 'usehooks-ts-dark-mode';

interface UseDarkModeOutput {
  isDarkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (value: boolean) => void;
}

/**
 * Custom hook to manage dark mode state.
 * It synchronizes with the user's OS preference and persists the choice in local storage.
 *
 * @param {boolean} [defaultValue] - Optional initial value (overrides OS preference and local storage).
 * @returns {UseDarkModeOutput} An object containing the dark mode state and control functions.
 */
export const useDarkMode = (defaultValue?: boolean): UseDarkModeOutput => {
  // Get system preference
  const isSystemDark = useMediaQuery(COLOR_SCHEME_QUERY);

  // Use local storage to override system preference
  const [isDarkModeStored, setDarkModeStored] = useLocalStorage<boolean>(
    LOCAL_STORAGE_KEY,
    defaultValue ?? isSystemDark // Default to defaultValue, then system, then false implicitly by useLocalStorage
  );

  // Determine the current state (respecting storage override)
  const isDarkMode = isDarkModeStored ?? isSystemDark;

  // Apply the theme class to the body or html element
  useEffect(() => {
    const element = window.document.documentElement; // Use <html> element
    if (isDarkMode) {
      element.classList.add('dark');
      element.classList.remove('light');
    } else {
      element.classList.add('light');
      element.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Control functions
  const toggle = () => setDarkModeStored((prev) => !prev);
  const enable = () => setDarkModeStored(true);
  const disable = () => setDarkModeStored(false);
  const set = (value: boolean) => setDarkModeStored(value);

  return {
    isDarkMode,
    toggle,
    enable,
    disable,
    set,
  };
};
