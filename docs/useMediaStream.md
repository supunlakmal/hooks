# useMediaStream

The `useMediaStream` hook simplifies the process of requesting and managing access to the user's camera and/or microphone using the `navigator.mediaDevices.getUserMedia` API.

## Usage

```jsx
import React, { useRef, useEffect } from 'react';
import { useMediaStream } from '@supunlakmal/hooks'; // Assuming installation

function MediaStreamComponent() {
  const videoRef = useRef(null);
  const {
    stream,
    startStream,
    stopStream,
    isSupported,
    isActive,
    error,
  } = useMediaStream({
    constraints: { video: true, audio: false }, // Request video only
    onStream: (activeStream) => {
      console.log('Stream started:', activeStream);
      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = activeStream;
      }
    },
    onError: (streamError) => {
      console.error('Stream error:', streamError);
    },
    onStop: () => {
        console.log('Stream stopped.');
        // Clear video source
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }
  });

  // Effect to play video when stream is active
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  }, [stream]);

  if (!isSupported) {
    return <div>getUserMedia is not supported in this browser.</div>;
  }

  return (
    <div>
      <h2>useMediaStream Example</h2>
      <video ref={videoRef} muted autoPlay playsInline style={{ width: '300px', border: '1px solid black' }} />
      <div>
        <button onClick={startStream} disabled={isActive || !isSupported}>
          Start Camera
        </button>
        <button onClick={stopStream} disabled={!isActive || !isSupported}>
          Stop Camera
        </button>
      </div>
      {isActive && <p>Status: Stream Active</p>}
      {!isActive && <p>Status: Stream Inactive</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

export default MediaStreamComponent;
```

## API

### Parameters

-   `options?`: `UseMediaStreamOptions`
    -   Optional object to configure the hook:
    -   `constraints?`: `MediaStreamConstraints` - The constraints object passed to `getUserMedia`. Defaults to `{ audio: true, video: true }`.
    -   `onStream?`: `(stream: MediaStream) => void` - Callback function executed when the stream is successfully obtained.
    -   `onError?`: `(error: Error) => void` - Callback function executed when an error occurs (e.g., permission denied, no devices found).
    -   `onStop?`: `() => void` - Callback function executed when the stream is stopped via the `stopStream` method.

### Return Value

The hook returns an object with the following properties:

-   `stream`: `MediaStream | null`
    -   The current active `MediaStream` object, or `null` if no stream is active or supported.
-   `startStream`: `() => Promise<void>`
    -   An asynchronous function to request and start the media stream based on the provided constraints. It handles obtaining the stream and setting the state.
-   `stopStream`: `() => void`
    -   A function to stop all tracks on the current stream and clean up resources.
-   `isSupported`: `boolean`
    -   Indicates whether `navigator.mediaDevices.getUserMedia` is supported by the browser.
-   `isActive`: `boolean`
    -   Indicates whether a media stream is currently active.
-   `error`: `Error | null`
    -   Stores any error encountered during the `getUserMedia` process.

## Behavior

-   The hook checks for `getUserMedia` support on mount.
-   Calling `startStream` initiates the request to access media devices.
-   If successful, the `stream` state is updated, `isActive` becomes `true`, and `onStream` is called.
-   If an error occurs, the `error` state is updated, `isActive` remains `false`, and `onError` is called.
-   Calling `stopStream` stops all tracks of the current `stream`, sets `stream` to `null`, sets `isActive` to `false`, and calls `onStop`.
-   The hook automatically calls `stopStream` on component unmount to ensure cleanup.
