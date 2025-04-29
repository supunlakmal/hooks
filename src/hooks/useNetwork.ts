import { useState, useEffect } from 'react';

interface NetworkState {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Custom hook to provide information about the user's network connection.
 *
 * @returns {NetworkState} An object containing network connection details.
 */
function useNetwork(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
  });

  useEffect(() => {
    const handleOnline = () => setNetworkState({ ...networkState, isOnline: true });
    const handleOffline = () => setNetworkState({ ...networkState, isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection;
    if (connection) {
      const updateConnectionStatus = () => {
        setNetworkState({
          isOnline: navigator.onLine,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      };

      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();

      return () => {
        connection.removeEventListener('change', updateConnectionStatus);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else{
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }
  }, []);

  return networkState;
}

export default useNetwork;