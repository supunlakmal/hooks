import * as React from 'react';

let serverId = 0;

// Use React.useId() if available (React 18+), otherwise fallback to a simple counter for SSR
// and rely on the client-side React.useId() after hydration.
const useReactId = (React as any)['useId'.toString()]; // Use string access to avoid React version check errors

/**
 * Generates unique IDs that are stable and consistent across server and client rendering.
 *
 * Wraps `React.useId` (available in React 18+) for optimal performance and safety.
 * Provides a basic fallback for older React versions or environments where `useId` might not be present,
 * although using React 18+ is highly recommended for proper SSR hydration compatibility.
 *
 * @returns {string} A unique and stable ID string.
 */
export function useIsomorphicId(): string {
    if (useReactId) {
        // Use the built-in hook if available (React 18+)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useReactId();
    }

    // Fallback for environments without React.useId (e.g., React < 18 or testing environments)
    // Important: This fallback might not be perfectly safe for SSR hydration in React < 18.
    // Consider upgrading React or using a dedicated SSR-safe ID generation library if needed.
    const [id, setId] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Generate a simple incrementing ID on the server or during initial client render if no ID exists
        if (id === null) {
            // Increment serverId for uniqueness during SSR or initial render
            serverId++;
            setId(`fallback-id-${serverId}`);
        }
    }, [id]); // Run effect only if id is null

    // Prefer the client-generated ID once it's available
    return id ?? ''; // Return the generated ID or an empty string if still null
}
