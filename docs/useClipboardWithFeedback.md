# useClipboardWithFeedback

A custom React hook that wraps the `useClipboard` hook to provide visual feedback when text has been successfully copied to the clipboard.

## Usage

```jsx
import { useClipboardWithFeedback } from '@supunlakmal/hooks'; // Adjust import path

function ClipboardComponent() {
  const textToCopy = 'Hello, Clipboard!';
  const [clipboardValue, copy, isCopied] = useClipboardWithFeedback(1500); // Feedback for 1.5 seconds

  const handleCopyClick = () => {
    copy(textToCopy);
    // 'isCopied' will become true for 1.5 seconds if copy succeeds
  };

  return (
    <div>
      <h1>Clipboard with Feedback</h1>
      <p>Text to copy: {textToCopy}</p>
      <button onClick={handleCopyClick} disabled={isCopied}>
        {isCopied ? 'Copied!' : 'Copy Text'}
      </button>
      {/* Optionally display the current clipboard value (might require permissions) */}
      {/* <p>Current clipboard (may not update immediately): {clipboardValue ?? 'N/A'}</p> */}
    </div>
  );
}

export default ClipboardComponent;
```

## Parameters

-   **`feedbackDuration`**: `number` (Optional, defaults to `2000`)
    -   The duration in milliseconds for which the `isCopied` feedback state remains `true` after a successful copy operation.

## Return Value

The hook returns a tuple `[value, copyFn, isCopied]`:

-   **`value`**: `string | null`
    -   The current text content read from the clipboard. Note: Reading from the clipboard might require user permissions and may not always be available or immediate. This value comes directly from the underlying `useClipboard` hook.
-   **`copyFn`**: `(text: string) => Promise<boolean>`
    -   An asynchronous function to copy the provided `text` to the clipboard.
    -   It returns a `Promise` that resolves to `true` if the copy operation was likely successful, and `false` if an error occurred.
    -   On success, it sets the `isCopied` state to `true`.
-   **`isCopied`**: `boolean`
    -   A boolean state indicating whether text was recently copied successfully. It is `true` for the duration specified by `feedbackDuration` after a successful call to `copyFn`, and `false` otherwise.

## Notes

-   This hook enhances the base `useClipboard` hook by adding a timed feedback state.
-   The underlying clipboard operations depend on the browser's Clipboard API (`navigator.clipboard`). Permissions might be required.
-   Errors during the copy process are caught and logged to the console, and the function will return `false`.
