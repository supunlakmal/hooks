import { useState, useEffect, useCallback } from "react";

// Define valid permission names based on the Permissions API spec
// Note: This list might evolve; check MDN for the latest.
// Using PermissionName directly relies on TypeScript's lib.dom.d.ts

type PermissionState = PermissionStatus["state"] | "unsupported" | "querying";

export interface UsePermissionState {
  state: PermissionState;
  isSupported: boolean;
  query: () => Promise<void>; // Function to manually re-query
}

/**
 * Custom hook to query the status of a browser permission using the Permissions API.
 *
 * @param {PermissionDescriptor} permissionDesc - An object describing the permission to query (e.g., { name: 'geolocation' }).
 * @returns {UsePermissionState} An object containing the permission state, support status, and a function to re-query.
 */
function usePermission(
  permissionDesc: PermissionDescriptor
): UsePermissionState {
  const [state, setState] = useState<PermissionState>("querying");
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);

  const queryPermission = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      setIsSupported(false);
      setState("unsupported");
      setPermissionStatus(null);
      return;
    }

    setIsSupported(true);
    setState("querying"); // Set state to querying before async call
    setPermissionStatus(null);

    try {
      const status = await navigator.permissions.query(permissionDesc);
      setPermissionStatus(status);
      setState(status.state);

      // Set up the change listener
      status.onchange = () => {
        setState(status.state);
      };
    } catch (error) {
      console.error(
        `Error querying permission '${permissionDesc.name}':`,
        error
      );
      // If query fails (e.g., unrecognized permission), treat as unsupported or denied?
      // Let's default to 'denied' or maybe a specific 'error' state?
      // For simplicity, sticking to 'denied' if query fails after support check.
      setState("denied");
      setPermissionStatus(null);
    }
  }, [permissionDesc]); // Re-query if permissionDesc changes

  useEffect(() => {
    queryPermission();

    // Cleanup function to remove the listener if the permissionStatus object exists
    // This is important if the component unmounts before the query completes or if permissionDesc changes
    const currentStatus = permissionStatus; // Capture status at the time effect runs
    return () => {
      if (currentStatus) {
        currentStatus.onchange = null;
      }
    };
  }, [queryPermission]); // Run effect when queryPermission function updates

  // Need to add manual cleanup for the listener on the *previous* status object
  // when the permissionDesc changes and a new query is initiated.
  useEffect(() => {
    // Store the previous status object to remove its listener on change
    const previousStatus = permissionStatus;
    return () => {
      if (previousStatus) {
        previousStatus.onchange = null;
      }
    };
  }, [permissionStatus]); // Run cleanup when permissionStatus object itself changes

  return { state, isSupported, query: queryPermission };
}

export default usePermission;
