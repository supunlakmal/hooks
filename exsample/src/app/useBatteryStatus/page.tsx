"use client";

import { useBatteryStatus } from '@/hooks/useBatteryStatus';

const UseBatteryStatusPage = () => {
  const batteryStatus = useBatteryStatus();

  if (!batteryStatus.isSupported) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>useBatteryStatus Hook Example</h1>
        <p>The Battery Status API is not supported by your browser.</p>
      </div>
    );
  }

  if (batteryStatus.loading) { // Changed from !batteryStatus.fetched to batteryStatus.loading
    return (
        <div style={{ padding: '20px' }}>
            <h1>useBatteryStatus Hook Example</h1>
            <p>Fetching battery status...</p>
        </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>useBatteryStatus Hook Example</h1>
      <p>This page displays information about the system&apos;s battery status.</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Battery Information</h2>
        <p><strong>Charging:</strong> {batteryStatus.charging ? 'Yes' : 'No'}</p>
        <p>
          <strong>Level:</strong>{' '}
          {batteryStatus.level !== null ? `${(batteryStatus.level * 100).toFixed(0)}%` : 'N/A'}
        </p>
        {batteryStatus.chargingTime !== null && isFinite(batteryStatus.chargingTime) && batteryStatus.chargingTime > 0 && (
          <p><strong>Time to Full Charge:</strong> {batteryStatus.chargingTime} seconds</p>
        )}
        {batteryStatus.dischargingTime !== null && isFinite(batteryStatus.dischargingTime) && batteryStatus.dischargingTime > 0 && (
          <p><strong>Time to Empty:</strong> {batteryStatus.dischargingTime} seconds</p>
        )}
      </div>
    </div>
  );
};

export default UseBatteryStatusPage;
