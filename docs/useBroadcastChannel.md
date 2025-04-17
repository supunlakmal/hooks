# `useBroadcastChannel`

Enables cross-tab/window communication between same-origin contexts using the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API).

## Usage

```tsx
import React, { useState } from \'react\';
import { useBroadcastChannel } from \'your-hooks-library\'; // Adjust the import path

interface MyData {
  message: string;
  timestamp: number;
}

const BroadcastComponent: React.FC = () => {
  const { data, postMessage } = useBroadcastChannel<MyData>(\'my-channel\');
  const [messageToSend, setMessageToSend] = useState(\'\');

  const sendMessage = () => {
    const newMessage: MyData = {
      message: messageToSend,
      timestamp: Date.now(),
    };
    postMessage(newMessage);
    setMessageToSend(\'\'); // Clear input after sending
  };

  return (
    <div>
      <h2>Broadcast Channel Example</h2>
      <input
        type="text"
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send Message to Other Tabs</button>

      <h3>Received Message:</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No message received yet.</p>
      )}
    </div>
  );
};

export default BroadcastComponent;
```

## API

### `useBroadcastChannel<T = any>(channelName: string)`

#### Parameters

- `channelName` (string, required): The name of the broadcast channel. All contexts using the same channel name can communicate.

#### Returns

An object containing:

- `data` (T | null): The most recent data received through the channel. Initialized to `null`. `T` is the type of the data being broadcasted (defaults to `any`).
- `postMessage` ((message: T) => void): A function to send a message to all other contexts connected to the same channel.

## Notes

- The Broadcast Channel API is not supported in all browsers (e.g., older versions of IE). The hook includes a warning if the API is unavailable.
- Messages are structured clones, meaning complex objects (like `Date`, `RegExp`, `Blob`, `File`, `FileList`, `ArrayBuffer`) can be sent.
- Communication is limited to contexts with the same origin (protocol, domain, and port).
