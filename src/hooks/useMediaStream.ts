import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMediaStreamOptions {
  /** Media constraints to pass to getUserMedia (e.g., { video: true, audio: true }) */
  constraints: MediaStreamConstraints;
  /** Optional callback when the stream is successfully obtained */
  onStream?: (stream: MediaStream) => void;
  /** Optional callback when there's an error accessing the media devices */
  onError?: (error: Error) => void;
  /** If true, automatically stops the stream tracks when the component unmounts. Defaults to true. */
  autoStop?: boolean;
}

interface UseMediaStreamReturn {
  /** The active MediaStream object, or null if not yet obtained or error occurred. */
  stream: MediaStream | null;
  /** Indicates if the stream is currently active/being requested. */
  isActive: boolean;
  /** Function to explicitly start requesting the media stream. */
  startStream: () => Promise<void>;
  /** Function to explicitly stop the media stream tracks. */
  stopStream: () => void;
  /** Error object if getUserMedia failed, null otherwise. */
  error: Error | null;
  /** Indicates if the getUserMedia API is supported by the browser. */
  isSupported: boolean;
}

const isBrowser = typeof window !== 'undefined';
const mediaDevices = isBrowser ? navigator.mediaDevices : undefined;

/**
 * Hook to manage access to user's media devices (camera, microphone) using getUserMedia.
 *
 * @param options Configuration options including media constraints.
 * @returns State and controls for the media stream.
 */
export function useMediaStream(options: UseMediaStreamOptions): UseMediaStreamReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Ref to hold the stream for cleanup
  const optionsRef = useRef(options); // Ref to hold options

  const isSupported = !!mediaDevices?.getUserMedia;

  // Update optionsRef if options object changes identity
  useEffect(() => {
      optionsRef.current = options;
  }, [options]);

  const stopStreamTracks = useCallback((currentStream: MediaStream | null) => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }, []);

  const stopStream = useCallback(() => {
    stopStreamTracks(streamRef.current);
    setStream(null);
    streamRef.current = null;
    setIsActive(false);
    // Do not clear error, it might be relevant
  }, [stopStreamTracks]);

  const startStream = useCallback(async () => {
    if (!isSupported || isActive) {
      return;
    }

    // Stop any previous stream first
    stopStream();
    setError(null);
    setIsActive(true);

    try {
      const streamInstance = await mediaDevices.getUserMedia(optionsRef.current.constraints);
      setStream(streamInstance);
      streamRef.current = streamInstance;
      optionsRef.current.onStream?.(streamInstance);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      const currentError = err instanceof Error ? err : new Error('Failed to access media devices');
      setError(currentError);
      optionsRef.current.onError?.(currentError);
      setStream(null); // Ensure stream is null on error
      streamRef.current = null;
      setIsActive(false); // No longer active if failed
    }
  }, [isSupported, isActive, stopStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (optionsRef.current.autoStop) {
          stopStream();
      }
    };
  }, [stopStream]); // Use stopStream which includes the autoStop check logic via optionsRef

  return { stream, isActive, startStream, stopStream, error, isSupported };
}
