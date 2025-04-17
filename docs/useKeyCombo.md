# `useKeyCombo`

Detects specific keyboard combinations (shortcuts) being pressed.

## Usage

```tsx
import React, { useState, useCallback } from \'react\';
import { useKeyCombo } from \'your-hooks-library\'; // Adjust the import path

const KeyComboComponent: React.FC = () => {
  const [status, setStatus] = useState(\'Waiting for combo...\');

  const handleSave = useCallback((event: KeyboardEvent) => {
    console.log(\'Save combo detected!\', event);
    setStatus(\'Ctrl+S detected! Action prevented.\');
    // Optionally perform a save action here
  }, []);

  const handleHelp = useCallback(() => {
    setStatus(\'Alt+Shift+H detected!\');
    alert(\'Showing help dialog!\');
  }, []);

  // Detect Ctrl+S and prevent default browser save action
  useKeyCombo(\'ctrl+s\', handleSave, { preventDefault: true });

  // Detect Alt+Shift+H
  useKeyCombo(\'alt+shift+h\', handleHelp);

  return (
    <div>
      <h2>Key Combo Detection</h2>
      <p>Try pressing \'Ctrl + S\' or \'Alt + Shift + H\'.</p>
      <p>Status: {status}</p>
      <p>(Focus this window or document for detection)</p>
    </div>
  );
};

export default KeyComboComponent;
```

## API

### `useKeyCombo(combo: string, callback: (event: KeyboardEvent) => void, options?: KeyComboOptions)`

#### Parameters

- `combo` (string, required): The key combination string. Keys should be joined by `+`. Case-insensitive. Examples: `\'ctrl+s\'`, `\'alt+shift+k\'`, `\'meta+c\'` (for Cmd+C on Mac).
  - Supported modifier keys: `ctrl`, `alt`, `shift`, `meta` (Cmd on Mac, Windows key on Windows).
  - Regular keys like `a`, `b`, `1`, `enter`, `escape`, etc., should be used by their `event.key` value in lowercase.
- `callback` ((event: KeyboardEvent) => void, required): The function to execute when the specified key combination is detected. It receives the keyboard event as an argument.
- `options` (object, optional): Configuration options for the listener.
  - `target` (EventTarget | null | (() => EventTarget | null), optional): The DOM element to attach the listener to. Defaults to `window.document`. Can be a direct element, `null`, or a function returning an element or `null`.
  - `preventDefault` (boolean, optional): If `true`, calls `event.preventDefault()` when the combo is matched. Defaults to `false`.
  - `stopPropagation` (boolean, optional): If `true`, calls `event.stopPropagation()` when the combo is matched. Defaults to `false`.
  - `event` (\'keydown\' | \'keyup\', optional): The type of keyboard event to listen for. Defaults to `\'keydown\'`.

## Notes

- The hook listens for keydown events by default.
- It requires _all_ specified keys in the combo to be pressed simultaneously, and _only_ those keys.
- Modifier keys (`ctrl`, `alt`, `shift`, `meta`) are automatically detected alongside regular keys.
- Key names should match the `event.key` property, converted to lowercase.
- Ensure the target element (or document) has focus for the key events to be captured.
