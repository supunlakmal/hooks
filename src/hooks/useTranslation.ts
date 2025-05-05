import { useState, useEffect, useCallback } from 'react';

// Define a basic type for translation resources (can be more complex)
type Translations = Record<string, string | { [key: string]: string }>;

// Define the structure returned by the hook
interface UseTranslationResult {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translations: Translations;
  isLoaded: boolean;
}

// Helper function to get nested values from the translation object
const getNestedValue = (obj: Translations, key: string): string | undefined => {
  const keys = key.split('.');
  let current: any = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined; // Key path not found
    }
  }
  return typeof current === 'string' ? current : undefined;
};

/**
 * Custom hook for basic internationalization (i18n).
 * Manages language state, loads translations (statically defined here), and provides a translation function.
 *
 * @param {Record<string, () => Promise<{ default: Translations }>>} resources - An object where keys are language codes (e.g., 'en')
 *   and values are functions that return a Promise resolving to the translation module (e.g., `() => import('./locales/en.json')`).
 *   **Note**: For this basic example, we'll simulate static loading directly in the hook.
 * @param {string} initialLanguage - The default language code to use.
 * @returns {UseTranslationResult} An object with language state, setter, translation function, loaded translations, and loading status.
 */
export const useTranslation = (
  // In a real app, resources would likely be passed in or configured globally.
  // For simplicity, we'll define some static resources here.
  staticResources: Record<string, Translations> = {
    en: {
      greeting: 'Hello',
      farewell: 'Goodbye',
      button: {
        submit: 'Submit',
        cancel: 'Cancel',
      },
      message: 'This is a sample message.',
    },
    es: {
      greeting: 'Hola',
      farewell: 'Adiós',
      button: {
        submit: 'Enviar',
        cancel: 'Cancelar',
      },
      message: 'Este es un mensaje de ejemplo.',
    },
  },
  initialLanguage: string = 'en' // Default to English
): UseTranslationResult => {
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Effect to "load" translations when the language changes
  useEffect(() => {
    setIsLoaded(false);
    const loadTranslations = async () => {
      // Simulate loading based on the static resources provided
      if (staticResources[language]) {
        setTranslations(staticResources[language]);
      } else {
        console.warn(
          `Translations for language "${language}" not found. Falling back to initial language or empty.`
        );
        // Optionally fall back to the initial language or default
        const fallbackLang = Object.keys(staticResources)[0] || '';
        setTranslations(staticResources[fallbackLang] || {});
        // Optionally set language back to fallback if desired
        // setLanguage(fallbackLang);
      }
      setIsLoaded(true);
    };

    loadTranslations();
  }, [language, staticResources, initialLanguage]);

  // The translation function `t`
  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (!isLoaded) {
        return fallback ?? key; // Return fallback or key if not loaded yet
      }
      const translatedValue = getNestedValue(translations, key);
      return translatedValue ?? fallback ?? key; // Return translation, fallback, or the key itself
    },
    [translations, isLoaded]
  );

  return {
    language,
    setLanguage,
    t,
    translations,
    isLoaded,
  };
};
