"use client"
import React from "react";
import useNetworkSpeed from "../../hooks/useNetworkSpeed";

function NetworkSpeedExample() {
  const { isSupported, downlink, downlinkMax, effectiveType, rtt, saveData, type } = useNetworkSpeed();

  return (
    <div>
      <h1>useNetworkSpeed Example</h1>
      <p>Is Supported: {isSupported ? "Yes" : "No"}</p>
      {isSupported && (
        <>
          <p>Downlink: {downlink} Mbps</p>
          <p>Downlink Max: {downlinkMax} Mbps</p>
          <p>Effective Type: {effectiveType}</p>
          <p>RTT: {rtt} ms</p>
          <p>Save Data: {saveData ? "Yes" : "No"}</p>
          <p>Type: {type}</p>
        </>
      )}
    </div>
  );
}

export default NetworkSpeedExample;