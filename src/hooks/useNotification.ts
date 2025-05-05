import { useState, useEffect, useCallback, useRef } from 'react';

interface UseNotificationOptions extends NotificationOptions {
  /** Title for the notification. */
  title: string;
  /** Optional: Function to call when the notification is clicked. */
  onClick?: (event: Event) => void;
  /** Optional: Function to call when the notification is closed. */
  onClose?: (event: Event) => void;
  /** Optional: Function to call when an error occurs showing the notification. */
  onError?: (event: Event) => void;
  /** Optional: Function to call when the notification is shown. */
  onShow?: (event: Event) => void;
}

interface UseNotificationReturn {
  /** The current permission status ('granted', 'denied', 'default'). */
  permission: NotificationPermission;
  /** Function to request notification permission from the user. */
  requestPermission: () => Promise<NotificationPermission>;
  /** Function to display the notification with the configured options. */
  showNotification: (
    overrideOptions?: Partial<UseNotificationOptions>
  ) => Notification | null;
  /** Error object if permission request or notification fails, null otherwise. */
  error: Error | null;
  /** Indicates if the Notification API is supported by the browser. */
  isSupported: boolean;
}

const isBrowser = typeof window !== 'undefined';
const notificationApi = isBrowser ? window.Notification : undefined;

/**
 * Hook to manage web notifications.
 *
 * @param defaultOptions Default options for the notification (title is required).
 * @returns State and functions to request permission and show notifications.
 */
export function useNotification(
  defaultOptions: UseNotificationOptions
): UseNotificationReturn {
  const isSupported = !!notificationApi;
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? notificationApi.permission : 'default'
  );
  const [error, setError] = useState<Error | null>(null);
  const optionsRef = useRef(defaultOptions);

  // Keep optionsRef updated
  useEffect(() => {
    optionsRef.current = defaultOptions;
  }, [defaultOptions]);

  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!isSupported) {
        setError(new Error('Notifications not supported by this browser.'));
        return 'denied';
      }

      try {
        const status = await notificationApi.requestPermission();
        setPermission(status);
        setError(null);
        return status;
      } catch (err) {
        console.error('Error requesting notification permission:', err);
        const currentError =
          err instanceof Error
            ? err
            : new Error('Failed to request permission');
        setError(currentError);
        setPermission('denied'); // Assume denied on error
        return 'denied';
      }
    }, [isSupported]);

  const showNotification = useCallback(
    (
      overrideOptions?: Partial<UseNotificationOptions>
    ): Notification | null => {
      if (!isSupported) {
        console.warn('Notifications not supported.');
        setError(new Error('Notifications not supported by this browser.'));
        return null;
      }

      if (permission !== 'granted') {
        console.warn('Notification permission not granted.');
        // Optionally, you could trigger requestPermission here, or just log
        // setError(new Error('Permission not granted')); // Maybe too noisy
        return null;
      }

      const finalOptions = { ...optionsRef.current, ...overrideOptions };
      const {
        title,
        onClick,
        onClose,
        onError: optionsOnError,
        onShow,
        ...restOptions
      } = finalOptions;

      if (!title) {
        console.error('Notification title is required.');
        setError(new Error('Notification title is required.'));
        return null;
      }

      try {
        const notification = new Notification(title, restOptions);

        notification.onclick = onClick || null;
        notification.onclose = onClose || null;
        notification.onerror = optionsOnError || null;
        notification.onshow = onShow || null;

        setError(null);
        return notification;
      } catch (err) {
        console.error('Error creating notification:', err);
        const currentError =
          err instanceof Error ? err : new Error('Failed to show notification');
        setError(currentError);
        return null;
      }
    },
    [isSupported, permission]
  );

  // Optional: Listen for permission changes from browser settings (might not work everywhere)
  // useEffect(() => {
  //   if (!isSupported) return;
  //   const handler = () => setPermission(notificationApi.permission);
  //   // navigator.permissions?.query({ name: 'notifications' }).then(permissionStatus => {
  //   //   permissionStatus.onchange = handler;
  //   // });
  //   // return () => { /* remove listener */ };
  // }, [isSupported]);

  return {
    permission,
    requestPermission,
    showNotification,
    error,
    isSupported,
  };
}
