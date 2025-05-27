"use client";

import { useState } from 'react';
import { useClipboard } from '@/hooks/useClipboard';

const UseClipboardPage = () => {
  const { value: clipboardValue, error: clipboardError, copy, paste } = useClipboard();
  const [textToCopy, setTextToCopy] = useState('Hello, Clipboard!');
  const [pastedText, setPastedText] = useState('');

  const handleCopy = async () => {
    await copy(textToCopy);
  };

  const handlePaste = async () => {
    try {
      const text = await paste();
      setPastedText(text);
    } catch { // Removed _err as it's not used
      // Error is already handled by the hook and exposed in clipboardError
      setPastedText(''); // Clear pasted text on error
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>useClipboard Hook Example</h1>
      <p>This page demonstrates copying text to and pasting from the clipboard.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={textToCopy} 
          onChange={(e) => setTextToCopy(e.target.value)} 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleCopy} style={{ marginRight: '10px' }}>
          Copy Text
        </button>
        <button onClick={handlePaste}>
          Paste Text
        </button>
      </div>

      {clipboardError && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Clipboard Error: {clipboardError.message}
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Clipboard State:</h3>
        <p>Current Hook Value (after successful paste): {clipboardValue ?? 'null'}</p>
        <p>Text Pasted via Button: {pastedText || 'No text pasted yet or paste failed.'}</p>
      </div>

      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        Note: Clipboard API availability and permissions can affect functionality.
        Pasting might require user interaction or specific browser permissions.
      </p>
    </div>
  );
};

export default UseClipboardPage;
