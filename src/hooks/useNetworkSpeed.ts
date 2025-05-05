import { useState, useEffect } from 'react';

// Extend the Navigator interface to include the experimental NetworkInformation API
declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

// Define the NetworkInformation interface based on the spec (might vary slightly by browser)
interface NetworkInformation extends EventTarget {
  readonly downlink?: number; // Effective bandwidth estimate in megabits per second
  readonly downlinkMax?: number; // Maximum downlink speed in megabits per second
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'; // Effective connection type
  readonly rtt?: number; // Round-trip time estimate in milliseconds
  readonly saveData?: boolean; // User preference for reduced data usage
  readonly type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';

  // Event handler for connection changes
  onchange?: ((this: NetworkInformation, ev: Event) => any) | null;
}

export interface NetworkSpeedState {
  isSupported: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';
}

const getConnectionState = (
  connection?: NetworkInformation
): Omit<NetworkSpeedState, 'isSupported'> => {
  if (!connection) {
    return {};
  }
  return {
    downlink: connection.downlink,
    downlinkMax: connection.downlinkMax,
    effectiveType: connection.effectiveType,
    rtt: connection.rtt,
    saveData: connection.saveData,
    type: connection.type,
  };
};

/**
 * Custom hook to get information about the user's network connection speed and type.
 * Uses the experimental Network Information API (`navigator.connection`).
 * Note: Browser support is limited (unavailable in Safari, Firefox behind flag).
 * Information should be considered an approximation.
 *
 * @returns {NetworkSpeedState} An object containing network state information.
 */
export const useNetworkSpeed = (): NetworkSpeedState => {
  const isSupported =
    typeof navigator !== 'undefined' && 'connection' in navigator;

  const [state, setState] = useState<NetworkSpeedState>(() => ({
    isSupported,
    ...(isSupported ? getConnectionState(navigator.connection) : {}),
  }));

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const connection = navigator.connection;
    if (!connection) return; // Should not happen if isSupported is true, but check anyway

    const handleChange = () => {
      setState({
        isSupported,
        ...getConnectionState(connection),
      });
    };

    // Add event listener
    connection.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      connection.removeEventListener('change', handleChange);
    };
  }, [isSupported]); // Only re-run effect if support changes (unlikely)

  return state;
};
