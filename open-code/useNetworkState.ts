import { useState, useEffect } from 'react';

interface NetworkState {
  online: boolean | null;
  since: Date | null;
  rtt?: number;
  type?: string;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  saveData?: boolean;
}

const useNetworkState = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    online: navigator.onLine,
    since: new Date(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkState((prevState) => ({
        ...prevState,
        online: true,
        since: new Date(),
      }));
    };

    const handleOffline = () => {
      setNetworkState((prevState) => ({
        ...prevState,
        online: false,
        since: new Date(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection;

    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkState((prevState) => ({
          ...prevState,
          rtt: connection.rtt,
          type: connection.type,
          downlink: connection.downlink,
          downlinkMax: connection.downlinkMax,
          effectiveType: connection.effectiveType,
          saveData: connection.saveData,
        }));
      };
      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      connection.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return networkState;
};

export default useNetworkState;