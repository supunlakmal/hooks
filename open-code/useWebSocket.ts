import { useState, useEffect, useRef, useCallback } from "react";

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface UseWebSocketOptions {
  onOpen?: (event: WebSocketEventMap["open"]) => void;
  onClose?: (event: WebSocketEventMap["close"]) => void;
  onMessage?: (event: WebSocketEventMap["message"]) => void;
  onError?: (event: WebSocketEventMap["error"]) => void;
  reconnectLimit?: number;
  reconnectIntervalMs?: number;
  // Add more options as needed, e.g., protocols
}

export interface UseWebSocketReturn {
  sendMessage: (data: string | ArrayBuffer | Blob | ArrayBufferView) => void;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  error: Event | null;
  connect: () => void;
  disconnect: () => void;
  getWebSocket: () => WebSocket | null;
}

const DEFAULT_RECONNECT_LIMIT = 3;
const DEFAULT_RECONNECT_INTERVAL_MS = 5000;

/**
 * Custom hook for managing WebSocket connections.
 *
 * @param {string | URL | null} url The URL to connect to. If null, the connection is not initiated automatically.
 * @param {UseWebSocketOptions} [options={}] Hook options.
 * @returns {UseWebSocketReturn} Object containing the WebSocket state and control functions.
 */
function useWebSocket(
  url: string | URL | null,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    onOpen,
    onClose,
    onMessage,
    onError,
    reconnectLimit = DEFAULT_RECONNECT_LIMIT,
    reconnectIntervalMs = DEFAULT_RECONNECT_INTERVAL_MS,
  } = options;

  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Closed);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [error, setError] = useState<Event | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const explicitDisconnectRef = useRef<boolean>(false);
  const savedOnOpen = useRef(onOpen);
  const savedOnClose = useRef(onClose);
  const savedOnMessage = useRef(onMessage);
  const savedOnError = useRef(onError);

  // Update saved callbacks when options change
  useEffect(() => {
    savedOnOpen.current = onOpen;
    savedOnClose.current = onClose;
    savedOnMessage.current = onMessage;
    savedOnError.current = onError;
  }, [onOpen, onClose, onMessage, onError]);

  const connectWebSocket = useCallback(() => {
    if (!url) return; // Do nothing if URL is null
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current && readyState !== ReadyState.Closed) {
      console.warn("WebSocket already connected or connecting.");
      return;
    }

    explicitDisconnectRef.current = false;
    setReadyState(ReadyState.Connecting);
    setError(null); // Reset error on new connection attempt

    try {
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = (event) => {
        console.log("WebSocket opened");
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful open
        setReadyState(ReadyState.Open);
        savedOnOpen.current?.(event);
      };

      socket.onmessage = (event) => {
        setLastMessage(event);
        savedOnMessage.current?.(event);
      };

      socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError(event);
        setReadyState(ReadyState.Closed); // Often errors lead to closure
        savedOnError.current?.(event);
        // Attempt reconnect on error
        handleClose(false);
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        // Only set Closed state here if not already handled by error
        // and not explicitly disconnected
        if (readyState !== ReadyState.Closed) {
          setReadyState(ReadyState.Closed);
        }
        savedOnClose.current?.(event);
        wsRef.current = null;
        // Handle reconnect logic
        handleClose(explicitDisconnectRef.current);
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      // Ensure we pass an Event or null to setError
      const errorEvent =
        err instanceof Event
          ? err
          : new Event("error", {
              // Create a generic event if err is not an Event
              // You might want to add more details to this synthetic event if possible
            });
      setError(errorEvent);
      setReadyState(ReadyState.Closed);
      wsRef.current = null;
      // Consider if reconnect should happen on constructor error
      handleClose(true); // Treat constructor error as non-retryable for now
    }
  }, [url, readyState, reconnectLimit, reconnectIntervalMs]);

  const handleClose = useCallback(
    (wasExplicit: boolean) => {
      if (wsRef.current && readyState !== ReadyState.Closed) {
        setReadyState(ReadyState.Closed);
      }
      wsRef.current = null;

      if (!wasExplicit && reconnectAttemptsRef.current < reconnectLimit) {
        reconnectAttemptsRef.current++;
        console.log(
          `WebSocket closed unexpectedly. Attempting reconnect ${reconnectAttemptsRef.current}/${reconnectLimit}...`
        );
        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket();
        }, reconnectIntervalMs * Math.pow(2, reconnectAttemptsRef.current - 1)); // Exponential backoff
      } else if (!wasExplicit) {
        console.log("WebSocket reconnect limit reached.");
      }
    },
    [reconnectLimit, reconnectIntervalMs, connectWebSocket, readyState]
  );

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      console.log("Disconnecting WebSocket explicitly.");
      explicitDisconnectRef.current = true;
      setReadyState(ReadyState.Closing);
      wsRef.current.close();
      // onclose handler will set state to Closed and nullify wsRef
    }
  }, []);

  // Initial connection effect
  useEffect(() => {
    if (url) {
      connectWebSocket();
    }
    // Cleanup on unmount
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      explicitDisconnectRef.current = true; // Ensure no reconnect on unmount
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Rerun only if URL changes

  const sendMessage = useCallback(
    (data: string | ArrayBuffer | Blob | ArrayBufferView) => {
      if (wsRef.current && wsRef.current.readyState === ReadyState.Open) {
        wsRef.current.send(data);
      } else {
        console.warn("WebSocket not open. Cannot send message.");
      }
    },
    []
  );

  const getWebSocket = useCallback(() => wsRef.current, []);

  return {
    sendMessage,
    lastMessage,
    readyState,
    error,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    getWebSocket,
  };
}

export default useWebSocket;
