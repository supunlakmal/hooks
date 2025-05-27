"use client";

import { useState, useEffect } from 'react'; // Removed useCallback, added useEffect
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';

const CHANNEL_NAME = 'my-example-channel';

const UseBroadcastChannelPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  // useBroadcastChannel now only takes channelName.
  // It returns `data` which is the last message received, and `postMessage`.
  const { data: lastReceivedData, postMessage } = useBroadcastChannel<string>(CHANNEL_NAME);

  // Effect to handle new messages received via the hook's `data` state
  useEffect(() => {
    if (lastReceivedData !== null && lastReceivedData !== undefined) {
      // Check if the message is already the last one in the array to avoid duplicates if data object identity changes
      setReceivedMessages(prevMessages => {
        if (prevMessages.length === 0 || prevMessages[prevMessages.length -1] !== lastReceivedData) {
          return [...prevMessages, lastReceivedData];
        }
        return prevMessages;
      });
    }
  }, [lastReceivedData]);


  const handleSendMessage = () => {
    if (inputValue.trim() && postMessage) {
      postMessage(inputValue.trim());
      setInputValue(''); // Clear input after sending
    }
  };

  // The hook itself doesn't explicitly expose isSupported, error, or isClosed.
  // isSupported is handled by a console.warn within the hook.
  // For this example, we'll assume it's supported if window.BroadcastChannel exists.
  const isSupported = typeof BroadcastChannel !== 'undefined';

  if (!isSupported) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>useBroadcastChannel Hook Example</h1>
        <p>The Broadcast Channel API is not supported by your browser (window.BroadcastChannel is undefined).</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>useBroadcastChannel Hook Example</h1>
      <p>This page demonstrates the useBroadcastChannel hook for cross-tab communication.</p>
      <p>Open this page in multiple tabs/windows of the same browser to see messages broadcasted between them.</p>

      {/* Error and isClosed states are not directly available from this hook version */}
      {/* {error && <p style={{ color: 'red' }}>Error: {error.message}</p>} */}
      {/* {isClosed && <p style={{ color: 'orange' }}>Channel is closed.</p>} */}

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Send Message</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          style={{ marginRight: '10px', padding: '5px', border: '1px solid #ddd' }}
          // disabled={isClosed || !!error} - These states are not available
        />
        <button onClick={handleSendMessage} disabled={!inputValue.trim()} /* disabled logic simplified */>
          Broadcast Message
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Received Messages</h2>
        {receivedMessages.length === 0 && <p>No messages received yet.</p>}
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {receivedMessages.map((msg, index) => (
            <li key={index} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UseBroadcastChannelPage;
