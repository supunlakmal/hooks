import { useState, useEffect } from "react";
import {useEventListener} from "./useEventListener";

/**
 * Custom hook to track the browser's online status.
 *
 * @returns {boolean} Returns `true` if the browser is online, `false` otherwise.
 */
export function useOnlineStatus(): boolean {
  // Get the initial status from navigator.onLine
  // Ensure navigator is defined (for SSR or specific environments)
  const getInitialStatus = () => {
    return typeof navigator !== "undefined" &&
      typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true; // Default to true if navigator or onLine is not available
  };

  const [isOnline, setIsOnline] = useState<boolean>(getInitialStatus());

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  // Use useEventListener hook to manage listeners
  useEventListener("online", handleOnline, { current: window } as any);
  useEventListener("offline", handleOffline, { current: window } as any);

  // Additionally, check status on mount in case the initial value was wrong
  // or the browser state changed before listeners were attached.
  useEffect(() => {
    setIsOnline(getInitialStatus());
  }, []);

  return isOnline;
}


