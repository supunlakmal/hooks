# `usePermission` Hook

Queries the status of browser permissions using the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) (`navigator.permissions`).

This allows you to check if your application has been granted permission for features like geolocation, notifications, camera, microphone, etc., without needing to actually request the permission (which might trigger a user prompt).

**Note:** Browser support for specific permissions within the Permissions API varies. Always check compatibility tables (like on MDN) for the permissions you intend to query.

## Usage

Provide a `PermissionDescriptor` object (usually just `{ name: 'permission-name' }`) to the hook. It returns an object containing the current permission `state` (`granted`, `denied`, `prompt`, `querying`, or `unsupported`), a flag indicating API `isSupported`, and a function to manually `query` again.

```typescript
import React from "react";
import { usePermission } from "@supunlakmal/hooks"; // Adjust path

function PermissionStatus({
  permissionName,
}: {
  permissionName: PermissionName;
}) {
  const { state, isSupported, query } = usePermission({ name: permissionName });

  let statusMessage = "Querying...";
  if (!isSupported) {
    statusMessage = "Permissions API not supported.";
  } else {
    switch (state) {
      case "granted":
        statusMessage = "Permission Granted ✅";
        break;
      case "prompt":
        statusMessage = "Permission Not Requested (Prompt) 🤔";
        break;
      case "denied":
        statusMessage = "Permission Denied 🚫";
        break;
      case "querying":
        statusMessage = "Querying permission status...";
        break;
      case "unsupported":
        statusMessage = "Permission or API not supported.";
        break;
    }
  }

  return (
    <li style={{ marginBottom: "10px" }}>
      <strong>{permissionName}:</strong> {statusMessage}
      {isSupported && state !== "querying" && (
        <button onClick={query} style={{ marginLeft: "10px" }}>
          Re-Query
        </button>
      )}
    </li>
  );
}

function PermissionsExample() {
  return (
    <div>
      <h1>usePermission Example</h1>
      <p>Checking status for various permissions:</p>
      <ul>
        {/* Standard permissions */}
        <PermissionStatus permissionName="geolocation" />
        <PermissionStatus permissionName="notifications" />
        <PermissionStatus permissionName="camera" />
        <PermissionStatus permissionName="microphone" />
        {/* Example of a potentially unsupported/non-standard permission */}
        <PermissionStatus permissionName="accelerometer" />
        <PermissionStatus permissionName="clipboard-read" />
        <PermissionStatus permissionName="clipboard-write" />
        {/* Example that might fail the query */}
        {/* <PermissionStatus permissionName="invalid-permission-name" /> */}
      </ul>
      <p>
        <em>
          (Note: Actual status depends on your browser and previous
          interactions.)
        </em>
      </p>
    </div>
  );
}

export default PermissionsExample;
```

## API

```typescript
type PermissionState = PermissionStatus['state'] | 'unsupported' | 'querying';

interface UsePermissionState {
  state: PermissionState;
  isSupported: boolean;
  query: () => Promise<void>;
}

function usePermission(
  permissionDesc: PermissionDescriptor
): UsePermissionState;
```

### Parameters

- `permissionDesc`: `PermissionDescriptor` - An object describing the permission you want to query. Typically, this will be `{ name: 'permission-name' }`, where `permission-name` is one of the standard `PermissionName` types (e.g., `'geolocation'`, `'notifications'`, `'camera'`, `'microphone'`, etc.). Refer to MDN for the list of valid permission names.

### Returns

- `UsePermissionState`: An object containing:
  - `state`: `PermissionState` - The current status of the permission. Possible values are:
    - `'granted'`: The user has explicitly granted permission.
    - `'prompt'`: The user has not yet been asked for permission, or has dismissed previous requests.
    - `'denied'`: The user has explicitly denied permission.
    - `'querying'`: The hook is currently querying the permission status (initial state).
    - `'unsupported'`: The Permissions API itself is not supported by the browser.
    - _(Could also implicitly be `'denied'` if the specific permission query fails after API support check)_.
  - `isSupported`: `boolean` - True if the `navigator.permissions` API is available in the browser, false otherwise.
  - `query`: `() => Promise<void>` - An asynchronous function that can be called to manually re-trigger the permission query.

## How it Works

1.  **State Initialization**: Uses `useState` to manage the permission `state` (initially `'querying'`), API support status (`isSupported`), and the underlying `PermissionStatus` object (`permissionStatus`).
2.  **`queryPermission` Function**: A `useCallback` function handles the permission query logic.
    - It first checks if `navigator.permissions` exists. If not, it sets `isSupported` to false and `state` to `'unsupported'`.
    - If supported, it sets `isSupported` to true and `state` to `'querying'`.
    - It calls `navigator.permissions.query(permissionDesc)` asynchronously.
    - **On Success**: Stores the returned `PermissionStatus` object, sets the `state` based on `status.state`, and attaches an `onchange` event listener to the `status` object to update the state automatically if the permission changes later (e.g., user changes settings).
    - **On Error**: Logs an error and sets the `state` to `'denied'` (as a fallback indicating the permission isn't usable).
3.  **Effect Hooks**: Two `useEffect` hooks are used:
    - The first runs `queryPermission` when the hook mounts or when `permissionDesc` changes (via the `queryPermission` dependency).
    - The second `useEffect` specifically manages the cleanup of the `onchange` listener. It ensures that when the `permissionStatus` object _changes_ (meaning a new query was successful for potentially a _different_ permission descriptor), the `onchange` listener attached to the _previous_ `permissionStatus` object is removed.
4.  **Cleanup**: Both effects include cleanup logic to remove the `onchange` listener from the respective `PermissionStatus` object when the component unmounts or before the effect re-runs, preventing memory leaks.
