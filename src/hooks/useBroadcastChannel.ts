import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Enables cross-tab/window communication between same-origin contexts using the Broadcast Channel API.
 *
 * @param channelName The name of the broadcast channel.
 * @returns An object containing the received data and a function to post messages.
 */
const useBroadcastChannel = <T = any>(channelName: string) => {
  const [data, setData] = useState<T | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Ensure BroadcastChannel is supported
    if (typeof BroadcastChannel === "undefined") {
      console.warn("BroadcastChannel API is not supported in this browser.");
      return;
    }

    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<T>) => {
      setData(event.data);
    };

    channel.addEventListener("message", handleMessage);

    // Cleanup function
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      channelRef.current = null;
    };
  }, [channelName]);

  const postMessage = useCallback(
    (message: T) => {
      if (channelRef.current) {
        channelRef.current.postMessage(message);
      } else {
        console.warn(
          `Broadcast channel "${channelName}" is not initialized or closed.`
        );
      }
    },
    [channelName]
  );

  return { data, postMessage };
};

export default useBroadcastChannel;