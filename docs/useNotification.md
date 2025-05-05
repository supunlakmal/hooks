# useNotification

The `useNotification` hook provides an interface to interact with the browser's Web Notifications API, allowing you to request permission and display notifications.

## Usage

```jsx
import React from 'react';
import { useNotification } from '@supunlakmal/hooks'; // Assuming installation

function NotificationComponent() {
  const {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    error,
  } = useNotification({
    // Optional default options for all notifications shown via this hook instance
    defaultOptions: {
      lang: 'en',
      // Other NotificationOptions like icon, badge, etc.
    },
    // Optional event handlers for all notifications shown via this hook instance
    onClick: (event) => console.log('Notification clicked:', event),
    onShow: (event) => console.log('Notification shown:', event),
    onClose: (event) => console.log('Notification closed:', event),
    onError: (event) => console.error('Notification error:', event),
  });

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      console.log('Permission request result:', result);
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  const handleShowNotification = () => {
    if (permission === 'granted') {
      showNotification('Hello from Hook!', {
        body: 'This is a notification triggered by useNotification.',
        icon: '/path/to/icon.png', // Optional icon
      });
    } else {
      alert('Notification permission is not granted. Please request permission first.');
    }
  };

  if (!isSupported) {
    return <div>Web Notifications API is not supported in this browser.</div>;
  }

  return (
    <div>
      <h2>useNotification Example</h2>
      <p>Notification Permission: <strong>{permission}</strong></p>
      {permission !== 'granted' && (
        <button onClick={handleRequestPermission}>Request Permission</button>
      )}
      <button onClick={handleShowNotification} disabled={permission !== 'granted'}>
        Show Notification
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

export default NotificationComponent;
```

## API

### Parameters

-   `options?`: `UseNotificationOptions`
    -   Optional object to configure the hook:
    -   `defaultOptions?`: `NotificationOptions` - Default options applied to all notifications shown by this hook instance.
    -   `onClick?`: `(this: Notification, ev: Event) => any` - Default handler for the `click` event.
    -   `onShow?`: `(this: Notification, ev: Event) => any` - Default handler for the `show` event.
    -   `onClose?`: `(this: Notification, ev: Event) => any` - Default handler for the `close` event.
    -   `onError?`: `(this: Notification, ev: Event) => any` - Default handler for the `error` event.

### Return Value

The hook returns an object with the following properties:

-   `isSupported`: `boolean`
    -   Indicates whether the Web Notifications API is supported by the browser.
-   `permission`: `NotificationPermission`
    -   The current permission state (`'default'`, `'granted'`, or `'denied'`).
-   `requestPermission`: `() => Promise<NotificationPermission>`
    -   An asynchronous function to request notification permission from the user. Returns the resulting permission state.
-   `showNotification`: `(title: string, options?: NotificationOptions, events?: NotificationEvents) => Notification | null`
    -   A function to display a notification.
        -   `title`: **Required**. The title of the notification.
        -   `options?`: `NotificationOptions` - Options for this specific notification (e.g., `body`, `icon`, `badge`, `data`, `requireInteraction`). These merge with `defaultOptions`.
        -   `events?`: `NotificationEvents` - Event handlers (`onClick`, `onShow`, `onClose`, `onError`) specific to this notification instance. These override the default handlers provided in `UseNotificationOptions`.
    -   Returns the created `Notification` object or `null` if permission is not granted or the API is not supported.
-   `error`: `Error | null`
    -   Stores any error encountered during permission requests or notification creation.

## Behavior

-   Checks for Notifications API support and initial permission state on mount.
-   `requestPermission` uses `Notification.requestPermission()`.
-   `showNotification` creates a new `Notification` instance if permission is granted.
-   Event listeners specified in `options` or `events` are attached to the `Notification` instance.
-   Handles cleanup of internal state and references on unmount.
