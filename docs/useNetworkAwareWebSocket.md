# useNetworkAwareWebSocket

A custom React hook designed to manage a WebSocket connection, ensuring it is active only when the user's browser is online (`useNetworkState`) and a valid URL is provided. It handles automatic connection, disconnection based on network status or URL changes, message sending/receiving, and optional automatic reconnection attempts on errors or unclean closures.

## Usage

```jsx
import { useState, useCallback } from 'react';
import { useNetworkAwareWebSocket } from '@supunlakmal/hooks'; // Adjust import path
import { useNetworkState } from './useNetworkState'; // For displaying status

interface ServerMessage {
  type: string;
  payload: any;
}

function ChatComponent() {
  const wsUrl = 'wss://echo.websocket.org'; // Example echo server
  const { online } = useNetworkState();
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('Message received:', event.data);
    setReceivedMessages((prev) => [...prev, `Received: ${event.data}`]);
  }, []);

  const handleError = useCallback((event: Event) => {
    console.error('WebSocket Error:', event);
    setReceivedMessages((prev) => [...prev, 'Error connecting or during connection.']);
  }, []);

   const handleOpen = useCallback(() => {
    console.log('WebSocket Connected!');
    setReceivedMessages((prev) => [...prev, '--- Connected ---']);
   }, []);

   const handleClose = useCallback((event: CloseEvent) => {
    console.log('WebSocket Closed:', event.reason);
    setReceivedMessages((prev) => [...prev, `--- Disconnected (${event.code}) ---`]);
   }, []);


  // Initialize the hook
  const {
    lastMessage, // Not directly used here, using onMessage callback instead
    isConnected,
    error,
    sendMessage,
    websocket, // Raw WebSocket instance (optional use)
  } = useNetworkAwareWebSocket<string>(wsUrl, {
    onMessage: handleMessage,
    onError: handleError,
    onOpen: handleOpen,
    onClose: handleClose,
    retryOnError: true, // Attempt to reconnect on error/unclean close
    retryDelay: 3000,   // Wait 3 seconds before retry
  });

  const handleSendClick = () => {
    if (messageToSend.trim() && isConnected) {
      sendMessage(messageToSend);
      setReceivedMessages((prev) => [...prev, `Sent: ${messageToSend}`]);
      setMessageToSend('');
    } else if (!isConnected) {
        alert("Cannot send message, WebSocket is not connected.");
    }
  };

  return (
    <div>
      <h1>Network Aware WebSocket Chat</h1>
      <p>Network Status: {online ? 'Online' : 'Offline'}</p>
      <p>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {error && <p style={{ color: 'red' }}>WebSocket Error Occurred!</p>}

      <div>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="Type message..."
          disabled={!isConnected}
        />
        <button onClick={handleSendClick} disabled={!isConnected}>
          Send
        </button>
      </div>

      <div style={{ marginTop: '15px', height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '5px' }}>
        <strong>Messages:</strong>
        {receivedMessages.map((msg, index) => (
          <p key={index} style={{ margin: '2px 0' }}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;
```

## Parameters

-   **`url`**: `string | null | undefined` (Required)
    -   The URL of the WebSocket server to connect to.
    -   If `null` or `undefined` is passed, the hook will attempt to close any existing connection and prevent new ones from opening.
-   **`options`**: `UseNetworkAwareWebSocketOptions` (Optional)
    -   An object containing configuration callbacks and settings:
        -   `onOpen`: `(event: Event) => void` - Callback fired when the connection is successfully opened.
        -   `onClose`: `(event: CloseEvent) => void` - Callback fired when the connection closes.
        -   `onError`: `(event: Event) => void` - Callback fired when a WebSocket error occurs.
        -   `onMessage`: `(event: MessageEvent) => void` - Callback fired when a message is received from the server.
        -   `retryOnError`: `boolean` (Default: `false`) - If `true`, the hook will automatically attempt to reconnect after the specified `retryDelay` if an error occurs or the connection closes uncleanly, but only if the browser is online.
        -   `retryDelay`: `number` (Default: `2000`) - The delay in milliseconds before attempting a reconnect if `retryOnError` is `true`.

## Return Value

-   **`UseNetworkAwareWebSocketReturn<T>`**: An object containing the state and controls for the WebSocket connection:
    -   `lastMessage`: `MessageEvent<T> | null` - The most recent message event received from the server. `T` is the expected type of `message.data`.
    -   `isConnected`: `boolean` - `true` if the WebSocket is currently connected (readyState is OPEN), `false` otherwise.
    -   `error`: `Event | null` - The last error event encountered, or `null` if no error has occurred since the last successful connection or attempt.
    -   `sendMessage`: `(data: string | ArrayBufferLike | Blob | ArrayBufferView) => void` - A memoized function to send data over the WebSocket connection. It checks if the connection is open before sending.
    -   `websocket`: `WebSocket | null` - A direct reference to the underlying `WebSocket` instance, or `null` if not connected. Useful for accessing properties or methods not exposed directly by the hook.

## Notes

-   The connection is only established or maintained when `navigator.onLine` is `true` AND a valid `url` is provided.
-   If the network status changes to offline, or the `url` becomes `null`/`undefined`, the hook automatically initiates a clean disconnection.
-   If the network status changes back to online and a valid `url` is present, the hook automatically attempts to reconnect.
-   The `retryOnError` option provides basic resilience against temporary network issues or server-side restarts causing unclean closures.
-   Event handlers (`onOpen`, `onClose`, etc.) are passed via the `options` object.
-   The hook handles cleanup (closing the connection, clearing timeouts) automatically on component unmount or when dependencies change.
