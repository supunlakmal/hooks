# useWebSocket

React hook for managing WebSocket connections.

## Features

- Manages WebSocket connection state (`Connecting`, `Open`, `Closing`, `Closed`).
- Provides functions to `sendMessage`, `connect`, and `disconnect`.
- Stores the latest received `message` and any connection `error`.
- Supports automatic reconnection with configurable attempts and interval.
- Handles WebSocket event listeners (`onopen`, `onmessage`, `onerror`, `onclose`).

## Installation

```bash
npm install your-hooks-library
# or
yarn add your-hooks-library
```

## Usage

```tsx
import React, { useState, useCallback } from "react";
import { useWebSocket, ReadyState } from "your-hooks-library"; // Adjust the import path

function WebSocketComponent() {
  const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);

  const { sendMessage, lastMessage, readyState, connect, disconnect, error } =
    useWebSocket(socketUrl, {
      onOpen: () => console.log("WebSocket opened"),
      onClose: () => console.log("WebSocket closed"),
      shouldReconnect: (closeEvent) => true, // Auto reconnect
      reconnectIntervalMs: 3000,
      reconnectAttempts: 5,
      onMessage: (event) => {
        console.log("Received message:", event.data);
        // Optionally handle message here directly or use lastMessage
      },
      onError: (event) => console.error("WebSocket error:", event),
    });

  // Update message history when lastMessage changes
  React.useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(() => {
    sendMessage("Hello from React hook!");
  }, [sendMessage]);

  const connectionStatus = {
    [ReadyState.Connecting]: "Connecting",
    [ReadyState.Open]: "Open",
    [ReadyState.Closing]: "Closing",
    [ReadyState.Closed]: "Closed",
    [ReadyState.Uninstantiated]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <h1>WebSocket Hook Demo</h1>
      <div>
        <button
          onClick={connect}
          disabled={
            readyState === ReadyState.Open ||
            readyState === ReadyState.Connecting
          }
        >
          Connect
        </button>
        <button onClick={disconnect} disabled={readyState !== ReadyState.Open}>
          Disconnect
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.Open}
        >
          Send Message
        </button>
      </div>
      <p>
        Connection Status: <span>{connectionStatus}</span>
      </p>
      {error && <p style={{ color: "red" }}>Error: WebSocket error occurred</p>}
      <h2>Message History</h2>
      <ul>
        {messageHistory.map((message, idx) => (
          <li key={idx}>{message ? message.data : null}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketComponent;
```

## API

### `useWebSocket(url, options?)`

#### Parameters

- `url` (string | (() => string | Promise<string>) | null): The URL to connect to. Can be a string, a function returning a string, or a function returning a Promise resolving to a string. If `null`, the connection will not be attempted automatically.
- `options` (UseWebSocketOptions, optional): Configuration options for the WebSocket connection.
  - `onOpen?`: (event: Event) => void - Callback invoked when the connection is opened.
  - `onClose?`: (event: CloseEvent) => void - Callback invoked when the connection is closed.
  - `onMessage?`: (event: MessageEvent) => void - Callback invoked when a message is received.
  - `onError?`: (event: Event) => void - Callback invoked when an error occurs.
  - `shouldReconnect?`: (event: CloseEvent) => boolean - Function to determine if reconnection should be attempted after a close event. Defaults to `false`.
  - `reconnectIntervalMs?`: number - The base interval (in ms) for reconnection attempts. Defaults to `5000`.
  - `reconnectAttempts?`: number - The maximum number of reconnection attempts. Defaults to `10`.
  - `protocols?`: string | string[] - WebSocket sub-protocols.
  - `share?`: boolean - If `true`, multiple components using the same URL will share a single WebSocket connection. Defaults to `false`.
  - `filter?`: (message: MessageEvent) => boolean - Function to filter incoming messages. Only messages for which this function returns `true` will update `lastMessage`. Defaults to `() => true`.
  - `retryOnError?`: boolean - Whether to attempt reconnection after an `onerror` event. Defaults to `false`.
  - `eventSourceOptions?`: Record<string, unknown> - Additional options passed directly to the WebSocket constructor (Note: This is generally not needed as standard options cover most use cases).
  - `queryParams?`: Record<string, string> - Query parameters to append to the URL.

#### Returns (`UseWebSocketReturn`)

- `sendMessage`: (data: string | ArrayBuffer | Blob | ArrayBufferView) => void - Function to send data through the WebSocket.
- `lastMessage`: MessageEvent | null - The last message received from the server.
- `readyState`: ReadyState - The current connection state (`Connecting`, `Open`, `Closing`, `Closed`, `Uninstantiated`).
- `error`: Event | null - The last error event encountered.
- `connect`: () => Promise<WebSocket | null> - Manually initiates the WebSocket connection.
- `disconnect`: (code?: number, reason?: string) => void - Manually closes the WebSocket connection.
- `getWebSocket`: () => WebSocket | null - Returns the underlying WebSocket instance.

### `ReadyState` Enum

An enum representing the WebSocket connection states:

- `Connecting = 0`
- `Open = 1`
- `Closing = 2`
- `Closed = 3`
- `Uninstantiated = 4` (Initial state before connection attempt)

```

```
