"use client";
import React, { useState, useEffect } from 'react';
import useDeviceOrientation from '../../../hooks/useDeviceOrientation';

function DeviceOrientationExample() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
        setIsSupported("DeviceOrientationEvent" in window)
    }
  },[isMounted])

  return (
    <div>
      <h2>Device Orientation</h2>
      {!isSupported && (
        <p style={{ color: 'red' }}>
          Device Orientation API not supported or not available.
        </p>
      )}
      {isMounted && isSupported && (
        (() => {
          const { alpha, beta, gamma } = useDeviceOrientation();
          return (
            <>
              <p>Alpha: {alpha !== null ? alpha.toFixed(2) : 'Not available'}</p>
              <p>Beta: {beta !== null ? beta.toFixed(2) : 'Not available'}</p>
              <p>Gamma: {gamma !== null ? gamma.toFixed(2) : 'Not available'}</p>
            </>
          );
        })()
      )}
    </div>
  );
}

export default DeviceOrientationExample;