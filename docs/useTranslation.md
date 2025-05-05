# `useTranslation` Hook

A basic hook for handling internationalization (i18n). It manages the current language state, loads translation resources (using a simple static object in this example), and provides a function `t` to retrieve translated strings.

**Note:** This is a simplified implementation. Real-world i18n often requires more features like dynamic loading of translations, interpolation (inserting values into strings), pluralization rules, context, and integration with established libraries (e.g., `i18next`, `react-intl`).

## Usage

Call the hook (optionally providing initial language and static resources) to get the current language, a function to change it, and the translation function `t`.

```typescript
import React from "react";
import { useTranslation } from "@supunlakmal/hooks"; // Adjust path

// Example: Define resources outside the component or pass them to the hook
const resources = {
  en: {
    pageTitle: "Translation Example",
    welcome: "Welcome!",
    actions: {
      changeLang: "Change Language",
      greet: "Say Hello",
    },
    farewell: "Goodbye, see you later!",
  },
  fr: {
    pageTitle: "Exemple de Traduction",
    welcome: "Bienvenue !",
    actions: {
      changeLang: "Changer de Langue",
      greet: "Dire Bonjour",
    },
    // Missing 'farewell' - will fallback
  },
};

function TranslationExample() {
  const {
    language,
    setLanguage,
    t, // The translation function
    isLoaded,
  } = useTranslation(resources, "en"); // Start with English

  const handleGreet = () => {
    alert(t("welcome")); // Example: Get translation for 'welcome'
  };

  if (!isLoaded) {
    return <div>Loading translations...</div>;
  }

  return (
    <div>
      <h1>{t("pageTitle")}</h1>
      <p>Current Language: {language}</p>

      <div>
        <button onClick={handleGreet}>
          {t("actions.greet")} {/* Nested key */}
        </button>
        <button
          onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          style={{ marginLeft: "10px" }}
        >
          {t("actions.changeLang")} {/* Nested key */}
        </button>
        <button
          onClick={() => setLanguage("de")}
          style={{ marginLeft: "10px" }}
        >
          {t("actions.changeLang", "Change Language")} (Switch to German - Not
          defined)
        </button>
      </div>

      <p>
        {t("farewell", "Default Farewell")} {/* Example with fallback */}
      </p>
      <p>
        {t("nonExistentKey", "Fallback for missing key")}{" "}
        {/* Key missing entirely */}
      </p>
    </div>
  );
}

export default TranslationExample;
```

## API

```typescript
type Translations = Record<string, string | { [key: string]: string }>;

interface UseTranslationResult {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translations: Translations;
  isLoaded: boolean;
}

function useTranslation(
  staticResources?: Record<string, Translations>, // Optional: Static resources object
  initialLanguage?: string // Optional: Default language code
): UseTranslationResult;
```

### Parameters

- `staticResources`: (Optional) `Record<string, Translations>` - An object where keys are language codes (e.g., `'en'`, `'es'`) and values are the translation objects for that language. Translation objects can contain key-string pairs or nested objects.
  - If not provided, it uses a default internal object with basic English and Spanish examples.
- `initialLanguage`: (Optional) `string` - The language code to use initially. Defaults to `'en'` or the first key in `staticResources` if `'en'` isn't present.

### Returns

- `UseTranslationResult`: An object containing:
  - `language`: `string` - The currently active language code.
  - `setLanguage`: `(lang: string) => void` - A function to change the active language. This will trigger a re-load (in this case, selection) of the corresponding translations.
  - `t`: `(key: string, fallback?: string) => string` - The translation function.
    - Takes a `key` (string, can use dot notation for nested values, e.g., `'button.submit'`) as the first argument.
    - Optionally takes a `fallback` string as the second argument.
    - Returns the translated string found at the `key` in the current language's `translations`.
    - If the key is not found, it returns the `fallback` string if provided.
    - If the key is not found and no `fallback` is provided, it returns the `key` itself.
    - If translations are not yet loaded (`isLoaded` is false), it returns the `fallback` or the `key`.
  - `translations`: `Translations` - The currently loaded translation object for the active `language`.
  - `isLoaded`: `boolean` - A flag indicating whether the translations for the current language have been loaded (or selected, in this static example).

## How it Works

1.  **State**: Uses `useState` to manage the current `language`, the loaded `translations` object, and an `isLoaded` flag.
2.  **Resource Handling**: Accepts `staticResources` or uses internal defaults. Stores these in the component scope.
3.  **Loading Effect**: An `useEffect` hook runs whenever the `language` (or the `staticResources` reference) changes.
    - It sets `isLoaded` to `false`.
    - It simulates loading by looking up the translations for the current `language` in the `staticResources` object.
    - If found, it updates the `translations` state with the corresponding object.
    - If not found, it logs a warning and potentially falls back to the first available language or an empty object.
    - It sets `isLoaded` back to `true`.
4.  **Nested Value Helper**: A helper function `getNestedValue` is used by `t` to retrieve values from the potentially nested `translations` object using dot notation keys.
5.  **Translation Function `t`**: A memoized `useCallback` function.
    - It checks the `isLoaded` flag.
    - It uses `getNestedValue` to find the translation for the given `key`.
    - It implements the fallback logic: return translation if found, otherwise return `fallback` if provided, otherwise return the `key` itself.

</rewritten_file>
