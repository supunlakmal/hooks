# `useClipboard` Hook

Provides functionality to interact with the system clipboard using the modern asynchronous Clipboard API (`navigator.clipboard`). It allows copying text to the clipboard and reading text from it.

**Note:** The Clipboard API generally requires user permission (especially for pasting) and often needs the document to be focused or triggered by a direct user interaction (like a button click).

## Usage

```typescript
import React, { useState } from "react";
import { useClipboard } from "@supunlakmal/hooks"; // Adjust path

function ClipboardManager() {
  const { value, error, copy, paste } = useClipboard();
  const [textToCopy, setTextToCopy] = useState("Copy this text!");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);

  const handleCopy = async () => {
    setCopyStatus("Copying...");
    try {
      await copy(textToCopy);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(null), 2000); // Reset status
    } catch (err) {
      setCopyStatus(`Copy failed: ${(err as Error).message}`);
      console.error("Copy error:", err);
    }
  };

  const handlePaste = async () => {
    setPasteStatus("Pasting...");
    try {
      const pastedText = await paste(); // Reads from clipboard, updates hook's internal 'value'
      setPasteStatus(`Pasted: "${pastedText}"`);
      setTimeout(() => setPasteStatus(null), 3000); // Reset status
    } catch (err) {
      setPasteStatus(`Paste failed: ${(err as Error).message}`);
      console.error("Paste error:", err);
      // Error might be due to permissions or lack of text data
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "15px", margin: "20px 0" }}
    >
      <h2>Clipboard Interaction</h2>
      <p>Note: Browser permissions may be required for paste.</p>

      {/* Copy Section */}
      <div>
        <h3>Copy to Clipboard</h3>
        <textarea
          value={textToCopy}
          onChange={(e) => setTextToCopy(e.target.value)}
          rows={3}
          cols={40}
        />
        <br />
        <button onClick={handleCopy} disabled={copyStatus === "Copying..."}>
          {copyStatus === "Copying..." ? "Copying..." : "Copy"}
        </button>
        {copyStatus && (
          <span
            style={{
              marginLeft: "10px",
              color: copyStatus.startsWith("Copy failed") ? "red" : "green",
            }}
          >
            {copyStatus}
          </span>
        )}
      </div>

      {/* Paste Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Paste from Clipboard</h3>
        <button onClick={handlePaste} disabled={pasteStatus === "Pasting..."}>
          {pasteStatus === "Pasting..." ? "Pasting..." : "Paste"}
        </button>
        {pasteStatus && (
          <span
            style={{
              marginLeft: "10px",
              color: pasteStatus.startsWith("Paste failed") ? "red" : "red",
            }}
          >
            {pasteStatus}
          </span>
        )}
        <p style={{ marginTop: "10px" }}>
          Last value read from clipboard by hook:
          <strong
            style={{
              display: "block",
              background: "#eee",
              padding: "5px",
              minHeight: "1.2em",
            }}
          >
            {value ?? "[Nothing read yet or error occurred]"}
          </strong>
        </p>
      </div>

      {/* Hook Error State */}
      {error && (
        <p style={{ marginTop: "15px", color: "red", fontWeight: "bold" }}>
          Clipboard Hook Error: {error.message}
        </p>
      )}
    </div>
  );
}

export default ClipboardManager;
```

## API

### Parameters

- `options`: (Optional) `UseClipboardOptions` - An object for future configuration (currently empty).

### Returns

An object (`UseClipboardReturn`) containing:

- `value`: `string | null` - The last text value successfully read from the clipboard using the `paste` function. Initially `null`.
- `error`: `Error | DOMException | null` - Any error encountered during the last `copy` or `paste` operation, or if the Clipboard API is unavailable. Initially `null`.
- `copy`: `(text: string) => Promise<void>` - An asynchronous function to write the provided `text` string to the clipboard. Returns a Promise that resolves on success or rejects on failure.
- `paste`: `() => Promise<string>` - An asynchronous function to read text from the clipboard. Returns a Promise that resolves with the clipboard text on success or rejects on failure. On success, it also updates the hook's internal `value` state.

## How it Works

1.  **State Management**: Uses `useState` to manage the last read clipboard `value` and any `error` that occurred during clipboard operations.
2.  **API Availability Check**: Checks if `navigator.clipboard` is available upon hook initialization.
3.  **`copy` Function**:
    - Defined using `useCallback`.
    - Checks for API availability; rejects and sets error if unavailable.
    - Calls `navigator.clipboard.writeText(text)` within a `try...catch` block.
    - On success, resolves the Promise and clears the error state.
    - On failure, catches the error (`DOMException` or other), sets the error state, clears the value state, and rejects the Promise.
4.  **`paste` Function**:
    - Defined using `useCallback`.
    - Checks for API availability; rejects and sets error if unavailable.
    - Calls `navigator.clipboard.readText()` within a `try...catch` block.
    - On success, updates the internal `value` state with the retrieved text, clears the error state, and resolves the Promise with the text.
    - On failure, catches the error, sets the error state, clears the value state, and rejects the Promise.
5.  **Return Value**: Returns an object containing the current `value`, `error`, and the memoized `copy` and `paste` functions.
