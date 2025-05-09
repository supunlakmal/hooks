import { useState, useEffect, useCallback, useRef } from 'react';

// Define types based on the Idle Detection API specification
type UserIdleState = 'active' | 'idle';
type ScreenIdleState = 'locked' | 'unlocked';
type IdlePermissionState = 'granted' | 'denied' | 'prompt'; // Assuming 'prompt' might be a state

declare global {
  interface IdleDetector {
    readonly userState: UserIdleState;
    readonly screenState: ScreenIdleState;
    onchange: ((this: IdleDetector, ev: Event) => any) | null;
    start: (options?: {
      threshold?: number;
      signal?: AbortSignal;
    }) => Promise<void>;
  }

  interface IdleDetectorOptions {
    threshold?: number;
    signal?: AbortSignal;
  }

  interface Window {
    IdleDetector: {
      prototype: IdleDetector;
      new (): IdleDetector;
      requestPermission: () => Promise<IdlePermissionState>;
    };
  }
}

interface UseIdleDetectionOptions {
  /** Threshold in milliseconds to consider the user idle. Defaults to 60000 (1 minute). */
  threshold?: number;
  /** Optional: AbortSignal to stop the detector externally. */
  signal?: AbortSignal;
  /** Optional: Callback when idle state changes. */
  onChange?: (states: {
    userState: UserIdleState;
    screenState: ScreenIdleState;
  }) => void;
  /** Optional: Callback on error. */
  onError?: (error: Error) => void;
  /** If true, automatically attempts to start the detector on mount after requesting permission. Defaults to true. */
  autoStart?: boolean;
}

interface UseIdleDetectionReturn {
  /** Current user state ('active' or 'idle'). */
  userState: UserIdleState | null;
  /** Current screen state ('locked' or 'unlocked'). */
  screenState: ScreenIdleState | null;
  /** Current permission status for idle detection. */
  permissionState: IdlePermissionState | null;
  /** Indicates if the detector is currently active and listening for changes. */
  isActive: boolean;
  /** Error object if permission request or detection fails. */
  error: Error | null;
  /** Function to request permission for idle detection. */
  requestPermission: () => Promise<IdlePermissionState>;
  /** Function to start the idle detector. */
  startDetector: () => Promise<void>;
  /** Indicates if the Idle Detection API is supported by the browser. */
  isSupported: boolean;
}

const isBrowser = typeof window !== 'undefined';
const IdleDetector = isBrowser ? window.IdleDetector : undefined;

/**
 * Hook to detect user idle state and screen lock status using the Idle Detection API.
 *
 * @param options Configuration options for the idle detector.
 * @returns State and controls for idle detection.
 */
export function useIdleDetection(
  options: UseIdleDetectionOptions = {}
): UseIdleDetectionReturn {
  const isSupported = !!IdleDetector;

  const [userState, setUserState] = useState<UserIdleState | null>(null);
  const [screenState, setScreenState] = useState<ScreenIdleState | null>(null);
  const [permissionState, setPermissionState] =
    useState<IdlePermissionState | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const detectorRef = useRef<IdleDetector | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const optionsRef = useRef(options);

  // Keep options ref updated
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const requestPermission =
    useCallback(async (): Promise<IdlePermissionState> => {
      if (!isSupported) {
        setError(new Error('Idle Detection API not supported.'));
        setPermissionState('denied');
        return 'denied';
      }
      try {
        const status = await IdleDetector.requestPermission();
        setPermissionState(status);
        setError(null);
        return status;
      } catch (err) {
        console.error('Error requesting idle detection permission:', err);
        const currentError =
          err instanceof Error
            ? err
            : new Error('Failed to request idle permission');
        setError(currentError);
        optionsRef.current.onError?.(currentError);
        setPermissionState('denied');
        return 'denied';
      }
    }, [isSupported]);

  const startDetector = useCallback(async () => {
    if (!isSupported || isActive) return;

    if (permissionState !== 'granted') {
      const status = await requestPermission();
      if (status !== 'granted') {
        setError(new Error('Idle detection permission not granted.'));
        optionsRef.current.onError?.(
          new Error('Idle detection permission not granted.')
        );
        return;
      }
    }

    if (detectorRef.current) return; // Already started or failed previously

    try {
      abortControllerRef.current = new AbortController();
      const detector = new IdleDetector();
      detectorRef.current = detector;

      detector.onchange = () => {
        setUserState(detector.userState);
        setScreenState(detector.screenState);
        setIsActive(true); // Keep active as long as detector exists
        optionsRef.current.onChange?.({
          userState: detector.userState,
          screenState: detector.screenState,
        });
      };

      await detector.start({
        threshold: optionsRef.current.threshold,
        signal: abortControllerRef.current.signal,
      });
      // Initial state check after start
      setUserState(detector.userState);
      setScreenState(detector.screenState);
      setIsActive(true);
      setError(null);
      optionsRef.current.onChange?.({
        userState: detector.userState,
        screenState: detector.screenState,
      });
    } catch (err) {
      console.error('Error starting idle detector:', err);
      const currentError =
        err instanceof Error ? err : new Error('Failed to start idle detector');
      setError(currentError);
      optionsRef.current.onError?.(currentError);
      setIsActive(false);
      detectorRef.current = null;
      abortControllerRef.current?.abort(); // Clean up abort controller
      abortControllerRef.current = null;
    }
  }, [isSupported, isActive, permissionState, requestPermission]);

  // Auto-start logic
  useEffect(() => {
    if (isSupported && optionsRef.current.autoStart) {
      // Check initial permission state without prompting
      (navigator.permissions as any)
        ?.query({ name: 'idle-detection' })
        .then((status: any) => {
          setPermissionState(status.state as IdlePermissionState);
          if (status.state === 'granted') {
            startDetector();
          }
          status.onchange = () => {
            setPermissionState(status.state as IdlePermissionState);
            if (status.state !== 'granted') {
              // Stop detector if permission is revoked
              abortControllerRef.current?.abort();
              detectorRef.current = null;
              setIsActive(false);
            }
          };
        })
        .catch((err: any) => {
          console.warn('Could not query idle-detection permission state:', err);
          // Fallback to trying to start, which will request permission if needed
          startDetector();
        });
    }
  }, [isSupported, startDetector]); // Dependencies: isSupported, startDetector (which depends on permissionState)

  // Cleanup on unmount or when signal is aborted
  useEffect(() => {
    const externalSignal = optionsRef.current.signal;
    const handleAbort = () => {
      abortControllerRef.current?.abort();
      detectorRef.current = null;
      setIsActive(false);
    };

    externalSignal?.addEventListener('abort', handleAbort);

    return () => {
      externalSignal?.removeEventListener('abort', handleAbort);
      abortControllerRef.current?.abort(); // Abort internal controller on unmount
      detectorRef.current = null;
    };
  }, []); // Empty array: run only once on mount/unmount

  return {
    userState,
    screenState,
    permissionState,
    isActive,
    error,
    requestPermission,
    startDetector,
    isSupported,
  };
}
