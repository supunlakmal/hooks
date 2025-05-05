# useEventSource

A React hook to establish and manage a connection to a Server-Sent Events (SSE) endpoint using the `EventSource` API.

## Usage

```tsx
import React, { useState, useEffect } from 'react';
import { useEventSource, EventSourceStatus } from './hooks/useEventSource'; // Adjust import path

// Example SSE endpoint (replace with your actual endpoint)
const SSE_ENDPOINT = '/api/sse-stream'; // Needs a backend serving SSE

function EventSourceComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<string[]>([]);

  // Define custom event handlers (optional)
  const eventListeners = {
    'custom-event': (event: MessageEvent) => {
      console.log('Received custom-event:', event.data);
      setCustomEvents((prev) => [...prev, `Custom: ${event.data}`]);
    },
    'another-event': (event: MessageEvent) => {
      console.log('Received another-event:', event.data);
      // Handle another specific event type
    },
  };

  const { status, lastMessage, error, close } = useEventSource(
    SSE_ENDPOINT,
    { eventListeners } // Pass custom listeners here
  );

  useEffect(() => {
    if (lastMessage) {
      // Handle generic 'message' events
      console.log('Received message:', lastMessage.data);
      setMessages((prev) => [...prev, `Generic: ${lastMessage.data}`]);
    }
  }, [lastMessage]);

  return (
    <div>
      <h2>Server-Sent Events (SSE)</h2>
      <p>
        Connection Status: <strong>{status}</strong>
      </p>

      {status === 'connecting' && <p>Connecting...</p>}
      {status === 'open' && (
        <p style={{ color: 'green' }}>Connection established.</p>
      )}
      {status === 'closed' && <p>Connection closed.</p>}
      {error && (
        <p style={{ color: 'red' }}>Error: {error.type || 'Unknown Error'}</p>
      )}

      <button
        onClick={close}
        disabled={status !== 'open' && status !== 'connecting'}
      >
        Close Connection
      </button>

      <h3>Received Messages (Generic):</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <h3>Received Messages (Custom Events):</h3>
      <ul>
        {customEvents.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default EventSourceComponent;
```

## API

`useEventSource<T = any>(url: string | null | undefined, options?: UseEventSourceOptions): UseEventSourceReturn<T>`

### Parameters

- `url`: The URL of the Server-Sent Events endpoint. If `null` or `undefined`, the connection is not attempted or closed.
- `options` (optional): An object with configuration settings:
  - `withCredentials?: boolean`: (default `false`) Whether to send cookies or authentication headers with the request.
  - `eventListeners?: Record<string, (event: MessageEvent) => void>`: An object where keys are event names (e.g., `'message'`, `'custom-event'`) and values are handler functions for those specific event types.

### Return Value (`UseEventSourceReturn<T>`)

- `status: EventSourceStatus`: The current state of the connection (`'connecting'`, `'open'`, `'closed'`, `'error'`).
- `lastMessage: MessageEvent<T> | null`: The most recent generic `message` event received from the server. The `data` property holds the message content.
- `error: Event | null`: The error object if the connection failed or encountered an error.
- `close(): void`: A function to manually close the EventSource connection.

### Notes

- Requires a backend endpoint that correctly implements the SSE protocol.
- The hook handles opening, closing, generic message handling, and error handling.
- Custom event types sent by the server can be handled by providing `eventListeners` in the options.
- The connection automatically closes on component unmount or if the `url` changes to `null`/`undefined`.
- The connection is automatically closed if an `error` event occurs.
- The type parameter `T` allows specifying the expected type of `lastMessage.data` (though the hook itself doesn't perform parsing by default).
