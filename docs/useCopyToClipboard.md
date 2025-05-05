# `useCopyToClipboard` Hook

Provides a function to copy text to the user's clipboard and tracks the success or failure status of the operation.
It uses the modern asynchronous Clipboard API (`navigator.clipboard.writeText`) when available, falling back to the older `document.execCommand('copy')` method for broader compatibility.

## Usage

```typescript
import React, { useState } from "react";
import { useCopyToClipboard } from "@supunlakmal/hooks"; // Adjust the import path as needed

function ClipboardExample() {
  const [textToCopy, setTextToCopy] = useState("Hello from the hook!");
  const [copyStatus, copy] = useCopyToClipboard();

  const handleCopyClick = () => {
    copy(textToCopy);
  };

  return (
    <div>
      <h1>Copy to Clipboard</h1>
      <textarea
        value={textToCopy}
        onChange={(e) => setTextToCopy(e.target.value)}
        rows={3}
        cols={40}
      />
      <br />
      <button onClick={handleCopyClick}>Copy Text</button>

      {copyStatus === true && (
        <p style={{ color: "green" }}>Successfully copied!</p>
      )}
      {copyStatus === false && (
        <p style={{ color: "red" }}>Failed to copy. See console for details.</p>
      )}
      {copyStatus === null && <p>Click the button to copy the text above.</p>}
    </div>
  );
}

export default ClipboardExample;
```

## API

### Parameters

None.

### Returns

A tuple (`UseCopyToClipboardReturn`) containing:

1.  `status`: The current status of the last copy attempt (`CopyStatus`).
    - `null`: Initial state, no copy operation has been attempted yet or the status timeout has reset it.
    - `true`: The last copy operation was successful.
    - `false`: The last copy operation failed.
2.  `copy`: An asynchronous function (`(text: string) => Promise<void>`) that you call to initiate the copy process.
    - Takes one argument: `text` (the string to be copied).
    - Returns a `Promise` that resolves when the copy attempt is complete (though the success/failure is primarily tracked via the `status` state).

## How it Works

1.  **State Initialization**: Uses `useState` to store the `status` of the copy operation, initialized to `null`.
2.  **Copy Function**: Defines an `async` function `copy` using `useCallback` (with an empty dependency array as it doesn't depend on props or other state).
3.  **Clipboard API Check**: Inside `copy`, it checks if the modern `navigator.clipboard.writeText` API is available.
4.  **Modern API Attempt**: If available, it calls `navigator.clipboard.writeText(text)` inside a `try...catch` block.
    - On success, it updates the `status` state to `true`.
    - On failure, it logs the error and updates the `status` to `false`.
5.  **Fallback Method**: If the modern API is not available, it attempts the fallback method:
    - Creates a temporary `textarea` element off-screen.
    - Sets its value to the `text` to be copied.
    - Appends it to the `document.body`.
    - Focuses and selects the text within the `textarea`.
    - Executes `document.execCommand('copy')` within a `try...catch` block.
    - Removes the temporary `textarea`.
    - If `execCommand` returns `true`, it updates the `status` to `true`.
    - If `execCommand` returns `false` or an error occurs, it throws/catches the error, logs it, and updates the `status` to `false`.
6.  **Status Reset**: After either the modern API or fallback attempt completes (success or failure), a `setTimeout` is scheduled to reset the `status` back to `null` after 2 seconds. This provides brief feedback to the user.
7.  **Return Value**: The hook returns an array containing the current `status` and the memoized `copy` function.
