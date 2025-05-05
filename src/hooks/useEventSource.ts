import { useState, useEffect, useRef } from 'react';

/**
 * Represents the state of the EventSource connection.
 */
export type EventSourceStatus = 'connecting' | 'open' | 'closed' | 'error';

interface UseEventSourceOptions {
  /** Whether to include credentials (cookies, authorization headers) with the request. */
  withCredentials?: boolean;
  /** Optional event listeners to register for specific event types. */
  eventListeners?: Record<string, (event: MessageEvent) => void>;
}

interface UseEventSourceReturn<T = any> {
  /** The current status of the EventSource connection. */
  status: EventSourceStatus;
  /** The last received message data (parsed if possible, otherwise raw). */
  lastMessage: MessageEvent<T> | null;
  /** Any error that occurred with the connection. */
  error: Event | null;
  /** Function to explicitly close the EventSource connection. */
  close: () => void;
}

/**
 * Custom hook to connect to a Server-Sent Events (SSE) endpoint.
 *
 * @param url The URL of the SSE endpoint.
 * @param options Configuration options for the connection.
 * @returns An object with connection status, last message, error, and close function.
 */
export function useEventSource<T = any>(
  url: string | null | undefined,
  options: UseEventSourceOptions = {}
): UseEventSourceReturn<T> {
  const { withCredentials = false, eventListeners = {} } = options;
  const [status, setStatus] = useState<EventSourceStatus>('closed');
  const [lastMessage, setLastMessage] = useState<MessageEvent<T> | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const listenersRef = useRef(eventListeners); // Ref to keep listeners stable

  // Update listeners ref if options.eventListeners changes
  useEffect(() => {
    listenersRef.current = eventListeners;
  }, [eventListeners]);

  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setStatus('closed');
      // console.log('EventSource explicitly closed');
    }
  };

  useEffect(() => {
    if (!url || typeof window === 'undefined') {
      setStatus('closed');
      return;
    }

    setStatus('connecting');
    setError(null);
    setLastMessage(null);

    try {
        const es = new EventSource(url, { withCredentials });
        eventSourceRef.current = es;

        es.onopen = () => {
            setStatus('open');
            // console.log('EventSource connection opened');
        };

        es.onmessage = (event: MessageEvent<T>) => {
            setLastMessage(event);
            // Optionally try to parse data
            // try {
            //     const parsedData = JSON.parse(event.data);
            //     setLastMessage({ ...event, data: parsedData });
            // } catch (e) {
            //     setLastMessage(event); // Store raw data if JSON parsing fails
            // }
        };

        es.onerror = (errEvent) => {
            setError(errEvent);
            setStatus('error');
            // console.error('EventSource error:', errEvent);
            close(); // Close on error
        };

        // Register custom event listeners
        Object.entries(listenersRef.current).forEach(([eventName, handler]) => {
            if (es) {
                es.addEventListener(eventName, handler);
            }
        });

    } catch (err: any) {
        console.error("Failed to create EventSource:", err);
        setError(null); // Set error state to null, type is Event | null
        setStatus('error');
        eventSourceRef.current = null;
    }

    // Cleanup function
    return () => {
        // Remove custom listeners before closing
        if (eventSourceRef.current) {
            const es = eventSourceRef.current;
            Object.entries(listenersRef.current).forEach(([eventName, handler]) => {
                es.removeEventListener(eventName, handler);
            });
        }
        close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, withCredentials]); // Dependencies: url, withCredentials. listenersRef handles listener changes.

  return { status, lastMessage, error, close };
}
