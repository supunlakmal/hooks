# `useNetworkSpeed` Hook

Provides information about the user's current network connection, such as effective speed and type, using the experimental [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) (`navigator.connection`).

**⚠️ Important Caveats:**

- **Experimental:** This API is not on a standards track and its specification may change.
- **Browser Support:** Support is **limited**. As of late 2023, it's generally available in Chrome, Edge, and Android browsers, but **not available in Safari** (desktop/iOS) and **disabled by default in Firefox**.
- **Approximation:** The values provided (like `downlink` and `effectiveType`) are estimates based on recent network performance and may not reflect the instantaneous connection speed accurately.
- **Privacy:** Exposing network information can have privacy implications, which is one reason for its limited adoption.

Use this hook primarily for **progressive enhancement** (e.g., adapting content quality based on `effectiveType` or `saveData`) rather than critical application logic.

## Usage

Call the hook to get the current network state. The hook will update the state if the connection changes (where supported).

```typescript
import React from "react";
import { useNetworkSpeed } from "@supunlakmal/hooks"; // Adjust path

function NetworkInfoDisplay() {
  const networkState = useNetworkSpeed();

  return (
    <div>
      <h1>Network Connection Info</h1>
      {!networkState.isSupported ? (
        <p>Network Information API not supported in this browser.</p>
      ) : (
        <ul>
          <li>
            Effective Type:{" "}
            <strong>{networkState.effectiveType ?? "N/A"}</strong>
          </li>
          <li>
            Downlink Speed (Mbps):{" "}
            <strong>{networkState.downlink ?? "N/A"}</strong>
          </li>
          <li>
            Max Downlink Speed (Mbps):{" "}
            <strong>{networkState.downlinkMax ?? "N/A"}</strong>
          </li>
          <li>
            Round Trip Time (ms): <strong>{networkState.rtt ?? "N/A"}</strong>
          </li>
          <li>
            Connection Type: <strong>{networkState.type ?? "N/A"}</strong>
          </li>
          <li>
            Save Data Mode:{" "}
            <strong>{networkState.saveData ? "On" : "Off"}</strong>
          </li>
        </ul>
      )}
      <p>
        <em>(Note: Values are estimates and API support varies by browser)</em>
      </p>
    </div>
  );
}

export default NetworkInfoDisplay;
```

## API

```typescript
interface NetworkSpeedState {
  isSupported: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';
}

function useNetworkSpeed(): NetworkSpeedState;
```

### Parameters

- None.

### Returns

- `NetworkSpeedState`: An object containing the following properties:
  - `isSupported`: `boolean` - True if the `navigator.connection` API is detected in the browser.
  - `downlink`: (Optional) `number` - Estimated effective bandwidth in megabits per second (Mbps).
  - `downlinkMax`: (Optional) `number` - Estimated maximum downlink speed in Mbps for the underlying connection technology.
  - `effectiveType`: (Optional) `'slow-2g' | '2g' | '3g' | '4g'` - Estimated effective connection type based on latency and bandwidth.
  - `rtt`: (Optional) `number` - Estimated effective round-trip time in milliseconds, rounded to the nearest 25ms.
  - `saveData`: (Optional) `boolean` - True if the user has enabled a data saving preference in their browser.
  - `type`: (Optional) `'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'` - The general type of the current connection.

## How it Works

1.  **Support Check**: It determines if `navigator.connection` exists when the hook first runs.
2.  **Initial State**: It initializes the state using `useState`, immediately setting the `isSupported` flag and populating the initial network properties by calling `navigator.connection` if available.
3.  **Event Listener**: An `useEffect` hook runs once on mount (if the API is supported).
    - It gets a reference to `navigator.connection`.
    - It defines a `handleChange` function that reads the current properties from `navigator.connection` and updates the component's state.
    - It adds an event listener for the `'change'` event on the `connection` object, calling `handleChange` whenever the network information potentially changes.
    - It returns a cleanup function that removes the event listener when the component unmounts.
4.  **Global Augmentation**: Uses `declare global` to augment the standard `Navigator` interface definition, making TypeScript aware of the `connection` property.
