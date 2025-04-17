# `useOnlineStatus` Hook

Tracks the browser's online/offline connection status.

**Dependency:** This hook relies on `useEventListener`.

## Usage

```typescript
import React from "react";
import { useOnlineStatus } from "@supunlakmal/hooks"; // Adjust path

function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus();

  const indicatorStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    backgroundColor: isOnline ? "green" : "red",
    display: "inline-block",
    margin: "20px 0",
  };

  return (
    <div>
      <h1>Network Status</h1>
      <div style={indicatorStyle}>
        Status: {isOnline ? "Online" : "Offline"}
      </div>
      <p>
        Try toggling your network connection (e.g., using browser developer
        tools) to see the status change.
      </p>
    </div>
  );
}

export default OnlineStatusIndicator;
```

## API

### Parameters

None.

### Returns

- `isOnline`: `boolean` - Returns `true` if the browser reports being online, `false` otherwise.

## How it Works

1.  **Initial State**: Uses `useState` to store the online status (`isOnline`). It initializes the state by checking `navigator.onLine`. It includes a check for the existence of `navigator` and `navigator.onLine` for compatibility with server-side rendering or older environments, defaulting to `true` if unavailable.
2.  **Event Handlers**: Defines simple `handleOnline` and `handleOffline` functions that update the `isOnline` state to `true` or `false` respectively.
3.  **Event Listeners**: Uses the `useEventListener` hook to attach listeners to the `window` object for the standard `online` and `offline` events. These listeners call `handleOnline` and `handleOffline`.
4.  **Mount Check**: Includes a `useEffect` with an empty dependency array (`[]`) that runs once on mount to re-check `navigator.onLine` and update the state. This ensures the status is correct even if it changed between the initial state setup and the listeners being attached.
