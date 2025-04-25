"use client";
import React from 'react';
import useDeviceOrientation from '../../../hooks/useDeviceOrientation';

function DeviceOrientationExample() {
  const { alpha, beta, gamma } = useDeviceOrientation();

  return (
    <div>
      <h2>Device Orientation</h2>
      <p>Alpha: {alpha !== null ? alpha.toFixed(2) : 'Not available'}</p>
      <p>Beta: {beta !== null ? beta.toFixed(2) : 'Not available'}</p>
      <p>Gamma: {gamma !== null ? gamma.toFixed(2) : 'Not available'}</p>
    </div>
  );
}

export default DeviceOrientationExample;