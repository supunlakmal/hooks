import useEventListener from './useEventListener';

/**
 * Custom hook to detect when a user is about to leave the current page.
 *
 * @param {() => void} callback - The function to call when the user is about to leave the page.
 */
function usePageLeave(callback: () => void): void {
  useEventListener('beforeunload', callback, window);
}

export default usePageLeave;