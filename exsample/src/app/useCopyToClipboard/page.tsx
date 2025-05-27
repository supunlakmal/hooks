"use client";

import { useState } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'; // Will be created

const UseCopyToClipboardPage = () => {
  const [textToCopy, setTextToCopy] = useState('Hello there! Copy this text.');
  const [copyStatus, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    await copy(textToCopy);
    // The hook itself will set the status (null, true, or false)
    // and it resets to null after a delay (default 2s in the hook).
  };

  const getStatusMessage = () => {
    if (copyStatus === null) return 'Status: Idle (or recently reset)';
    if (copyStatus === true) return 'Status: Copied successfully!';
    if (copyStatus === false) return 'Status: Copy failed.';
    return '';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>useCopyToClipboard Hook Example</h1>
      <p>This page demonstrates copying text to the clipboard and displaying feedback based on success/failure.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <textarea 
          value={textToCopy} 
          onChange={(e) => setTextToCopy(e.target.value)} 
          rows={3}
          style={{ marginRight: '10px', padding: '5px', width: '300px', verticalAlign: 'middle' }}
        />
        <button onClick={handleCopy} style={{ verticalAlign: 'middle' }}>
          Copy to Clipboard
        </button>
      </div>

      <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee', minHeight: '30px' }}>
        <p>{getStatusMessage()}</p>
      </div>

      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        The status message will update upon copy attempt and reset after a short delay.
        Clipboard API availability and permissions can affect functionality.
      </p>
    </div>
  );
};

export default UseCopyToClipboardPage;
