"use client";

import { useState } from 'react';
import { useClipboardWithFeedback } from '@/hooks/useClipboardWithFeedback';

const UseClipboardWithFeedbackPage = () => {
  const [textToCopy, setTextToCopy] = useState('Copy me with feedback!');
  // useClipboardWithFeedback returns: [clipboardValue, copyFn, isCopiedRecently]
  // We are primarily interested in copyFn and isCopiedRecently for this example.
  const [, copyWithFeedback, isCopied] = useClipboardWithFeedback(2500); // Feedback duration 2.5s

  const handleCopy = async () => {
    await copyWithFeedback(textToCopy);
    // The hook handles setting isCopied and resetting it.
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>useClipboardWithFeedback Hook Example</h1>
      <p>This page demonstrates copying text to the clipboard with visual feedback.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          value={textToCopy} 
          onChange={(e) => setTextToCopy(e.target.value)} 
          style={{ marginRight: '10px', padding: '5px', minWidth: '200px' }}
        />
        <button onClick={handleCopy} style={{ marginRight: '10px' }}>
          Copy Text
        </button>
        {isCopied && (
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            Copied!
          </span>
        )}
      </div>

      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        The &quot;Copied!&quot; message will appear for 2.5 seconds after a successful copy.
      </p>
    </div>
  );
};

export default UseClipboardWithFeedbackPage;
