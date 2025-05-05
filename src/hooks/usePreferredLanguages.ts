import { useState, useEffect } from 'react';

/**
 * Retrieves the user's preferred languages from the browser.
 *
 * @returns A readonly array of language codes (e.g., ['en-US', 'en', 'fr']).
 */
export function usePreferredLanguages(): ReadonlyArray<string> {
  const [languages, setLanguages] = useState<ReadonlyArray<string>>([]);

  const getLanguages = () => {
    if (typeof navigator !== 'undefined' && navigator.languages) {
      // navigator.languages returns languages in preference order
      return navigator.languages;
    } else if (typeof navigator !== 'undefined' && (navigator as any).language) {
      // Fallback for older browsers
      return [(navigator as any).language];
    }
    return []; // Return empty array if navigator is not available (SSR)
  };

  useEffect(() => {
    // Set initial languages
    setLanguages(getLanguages());

    // Browsers might fire 'languagechange' event when preferences change
    const handleLanguageChange = () => {
      setLanguages(getLanguages());
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  return languages;
}
