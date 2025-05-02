import { useState, useEffect, useCallback } from 'react';

interface WakeLockState {
  isSupported: boolean;
  isActive: boolean;
}

type WakeLockAcquire = () => Promise<void>;
type WakeLockRelease = () => Promise<void>;

export const useWakeLock = (): [WakeLockAcquire, WakeLockRelease, WakeLockState] => {
  const [wakeLockState, setWakeLockState] = useState<WakeLockState>({
    isSupported: 'wakeLock' in navigator,
    isActive: false,
  });
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const acquire: WakeLockAcquire = useCallback(async () => {
    if (!wakeLockState.isSupported) {
      console.warn('Wake Lock API not supported');
      return;
    }

    try {
      const newWakeLock = await navigator.wakeLock.request('screen');
      setWakeLock(newWakeLock);
      setWakeLockState((prevState) => ({ ...prevState, isActive: true }));
      newWakeLock.onrelease = () => {
        setWakeLockState((prevState) => ({ ...prevState, isActive: false }));
      };
    } catch (err) {
      console.error('Could not acquire wake lock:', err);
    }
  }, [wakeLockState.isSupported]);

  const release: WakeLockRelease = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
      } catch (err) {
        console.error('Could not release wake lock:', err);
      }
    }
  }, [wakeLock]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLockState.isActive && document.visibilityState === 'visible') {
        await acquire();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockState.isActive) {
        release();
      }
    };
  }, [wakeLockState.isActive, acquire, release]);

  return [acquire, release, wakeLockState];
};

