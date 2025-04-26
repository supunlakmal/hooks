// examples/app/list/useGeolocationContinuous/page.tsx
'use client';
import { useGeolocationContinuous } from 'src';
import { useCallback } from 'react';

export default function UseGeolocationContinuousExample() {
  const { location, error, loading, stop } = useGeolocationContinuous();

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  return (
    <div>
      <p>Loading: {loading ? 'true' : 'false'}</p>
      {location && (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </>
      )}
      {error && <p>Error: {error}</p>}
      <button onClick={handleStop}>Stop Getting Location</button>
    </div>
  );
}