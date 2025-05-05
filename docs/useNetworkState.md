# `useNetworkState` Hook

## Description

The `useNetworkState` hook provides information about the user's network connectivity status. It allows you to track whether the user is online or offline, as well as changes in network conditions.

## Usage

Here's how you can use the `useNetworkState` hook in your React component:

```
typescript
import { useNetworkState } from '@supunlakmal/hooks';

function NetworkStatusComponent() {
  const { online, since, offlineAt, connection } = useNetworkState();

  return (
    <div>
      <p>Is Online: {online ? 'Yes' : 'No'}</p>
      {since && <p>Online Since: {since.toLocaleString()}</p>}
       {offlineAt && <p>Offline At: {offlineAt.toLocaleString()}</p>}
      {connection && (
        <>
          <p>Connection Type: {connection.type}</p>
          <p>Effective Type: {connection.effectiveType}</p>
          <p>Downlink: {connection.downlink} Mbps</p>
          <p>RTT: {connection.rtt} ms</p>
          <p>Save Data: {connection.saveData ? 'Yes' : 'No'}</p>
        </>
      )}
    </div>
  );
}
```

## API

```
typescript
interface NetworkState {
  online: boolean | null;
  since: Date | null;
  offlineAt:Date | null;
  connection: NetworkInformation | null;
}

interface NetworkInformation {
  downlink: number;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | undefined;
  rtt: number;
  saveData: boolean;
  type: 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax' | undefined;
}
```

## Parameters

This hook does not accept any parameters.

## Returns

The `useNetworkState` hook returns an object with the following properties:

- **`online`**: `boolean | null` - Indicates whether the user is currently online (true) or offline (false). It can be `null` initially before the state is determined.
- **`since`**: `Date | null` - A `Date` object representing when the user went online. It's `null` if the user is offline or if the online state hasn't been determined.
- **`offlineAt`** : `Date | null` - A `Date` object representing when the user went offline. It's `null` if the user is online or if the offline state hasn't been determined.
- **`connection`**: `NetworkInformation | null` - An object containing information about the user's network connection. It includes properties like `downlink`, `effectiveType`, `rtt`, `saveData`, and `type`. This is `null` if the browser doesn't support the Network Information API.

## How it Works

The `useNetworkState` hook utilizes the `navigator.onLine` property and the `online` and `offline` events to track the user's network status. It also uses the `navigator.connection` API (if available) to get detailed network information.

- **Event Listeners:** The hook adds event listeners for the `online` and `offline` events on the window object. These listeners update the internal state when the network status changes.
- **Initial State:** The initial `online` state is determined using `navigator.onLine`.
- **offlineAt state** : keep last offline data.
- **Network Information API:** If the `navigator.connection` API is available, the hook retrieves the connection details and updates the `connection` state.
- **Cleanup:** The hook cleans up the event listeners when the component unmounts to prevent memory leaks.
- **Reasoning:** Use network state to build network state-dependent features.
