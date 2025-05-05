# usePreferredLanguages

A React hook that returns an array of the user's preferred languages, as configured in their browser, ordered by preference.

## Usage

```tsx
import { usePreferredLanguages } from './hooks/usePreferredLanguages'; // Adjust import path

function LanguagePreferenceInfo() {
  const languages = usePreferredLanguages();

  return (
    <div>
      <h2>Preferred Languages:</h2>
      {languages.length > 0 ? (
        <ol>
          {languages.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ol>
      ) : (
        <p>Could not determine preferred languages.</p>
      )}
      <p style={{ fontStyle: 'italic' }}>
        (Updates if browser preferences change and the 'languagechange' event fires)
      </p>
    </div>
  );
}
```

## API

`usePreferredLanguages(): ReadonlyArray<string>`

### Return Value

-   A `ReadonlyArray<string>` containing language codes (e.g., `['en-US', 'en', 'fr-FR', 'fr']`). The array is ordered from most preferred to least preferred.
-   Returns an empty array if `navigator.languages` is not available (e.g., during server-side rendering or in very old browsers).

### Notes

-   The hook relies on `navigator.languages`.
-   It listens for the `languagechange` event on the `window` object to update the list if the user changes their browser's language settings while the component is mounted. Support for this event varies.
-   The returned array is read-only.
