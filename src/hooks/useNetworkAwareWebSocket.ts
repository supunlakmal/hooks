import { useState, useEffect, useRef, useCallback } from 'react';
import { useNetworkState } from './useNetworkState'; // Assuming signature: () => { online: boolean }

export interface UseNetworkAwareWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  retryOnError?: boolean; // Simple retry logic (could be expanded)
  retryDelay?: number; // Delay in ms before retrying
}

export interface UseNetworkAwareWebSocketReturn<T = any> {
  lastMessage: MessageEvent<T> | null;
  isConnected: boolean;
  error: Event | null;
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  websocket: WebSocket | null; // Expose the instance directly if needed
}

const isBrowser = typeof window !== 'undefined';

/**
 * Manages a WebSocket connection that is only active when the user is online.
 *
 * @param url The WebSocket server URL. Pass null or undefined to disconnect.
 * @param options Optional configuration for event handlers and retry logic.
 * @returns An object with connection status, last message, error, send function, and the WebSocket instance.
 */
export function useNetworkAwareWebSocket<T = any>(
  url: string | null | undefined,
  options: UseNetworkAwareWebSocketOptions = {}
): UseNetworkAwareWebSocketReturn<T> {
  const {
    onOpen,
    onClose,
    onError,
    onMessage,
    retryOnError = false,
    retryDelay = 2000, // Default 2 seconds retry delay
  } = options;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<MessageEvent<T> | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const explicitCloseRef = useRef<boolean>(false); // Track if closed manually or due to error/offline

  const { online } = useNetworkState();

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const connectWebSocket = useCallback(() => {
    if (!url || !isBrowser || wsRef.current) {
      return; // Don't connect if no URL, not in browser, or already connected
    }
    console.log('Attempting WebSocket connection to:', url);
    explicitCloseRef.current = false;
    clearRetryTimeout(); // Clear any pending retries

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = (event) => {
      console.log('WebSocket opened:', url);
      setIsConnected(true);
      setError(null);
      onOpen?.(event);
    };

    ws.onmessage = (event) => {
      setLastMessage(event);
      onMessage?.(event);
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(event);
      wsRef.current = null; // Ensure ref is cleared on error
      setIsConnected(false); // Explicitly set disconnected on error
      onError?.(event);

      // Retry logic
      if (!explicitCloseRef.current && retryOnError && online) {
        console.log(`WebSocket attempting retry in ${retryDelay}ms...`);
        clearRetryTimeout(); // Ensure no double timeouts
        retryTimeoutRef.current = setTimeout(connectWebSocket, retryDelay);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', url, 'Clean close:', event.wasClean);
      // Only update state if it wasn't an explicit close initiated by the hook logic
      if (wsRef.current === ws) { // Ensure this close event belongs to the current ref instance
          wsRef.current = null;
          setIsConnected(false);
          if (!explicitCloseRef.current) {
              setError(null); // Clear error only if not an explicit close/error handled by onError
          }
          onClose?.(event);

          // Retry logic (also on unclean close if retrying enabled)
          if (!event.wasClean && !explicitCloseRef.current && retryOnError && online) {
              console.log(`WebSocket attempting retry (unclean close) in ${retryDelay}ms...`);
              clearRetryTimeout();
              retryTimeoutRef.current = setTimeout(connectWebSocket, retryDelay);
          }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, retryOnError, retryDelay, onOpen, onClose, onError, onMessage, online]); // Reconnect if URL/options/network change

  const disconnectWebSocket = useCallback(() => {
    clearRetryTimeout();
    explicitCloseRef.current = true; // Mark as intentional close
    if (wsRef.current) {
        console.log('Disconnecting WebSocket explicitly:', url);
        wsRef.current.close(1000, 'Hook cleanup or explicit disconnect'); // 1000: Normal Closure
        // wsRef.current will be set to null in the onclose handler
    }
  }, [url]);

  // Effect to manage connection based on network state and URL
  useEffect(() => {
    if (online && url) {
      // If online and URL is set, try connecting (connectWebSocket handles existing connections)
      connectWebSocket();
    } else {
      // If offline or no URL, disconnect
      disconnectWebSocket();
    }

    // Cleanup function on unmount or if dependencies change
    return () => {
        disconnectWebSocket();
    };
  }, [online, url, connectWebSocket, disconnectWebSocket]);

  const sendMessage = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
      } else {
        console.warn('WebSocket not connected. Cannot send message.');
      }
    },
    [] // Depends only on the ref, which is stable
  );

  return {
    lastMessage,
    isConnected,
    error,
    sendMessage,
    websocket: wsRef.current,
  };
}
