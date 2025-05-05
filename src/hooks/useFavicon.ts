import { useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

/**
 * Dynamically sets the website's favicon.
 *
 * @param url The URL of the new favicon image (e.g., '/favicon.ico', '/logo.png').
 *            Pass null or an empty string to potentially revert or do nothing (behavior might depend on browser).
 * @param rel The relationship attribute, usually 'icon' or 'shortcut icon'. Defaults to 'icon'.
 */
export function useFavicon(url: string | null | undefined, rel: string = 'icon'): void {
  useEffect(() => {
    if (!isBrowser || !url) {
      return; // Exit if not in browser environment or URL is invalid/null
    }

    // Try to find an existing link element with the specified rel attribute
    let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;

    if (!link) {
        // If no link element exists for the specified rel, try 'shortcut icon' as a common alternative
        if (rel === 'icon') {
             link = document.querySelector(`link[rel='shortcut icon']`) as HTMLLinkElement | null;
        }
        // If still not found, create a new one
        if (!link) {
             link = document.createElement('link');
             link.rel = rel; // Use the specified or default 'icon'
             // Ensure link is added to the head
             const head = document.querySelector('head');
             if (head) {
                head.appendChild(link);
             } else {
                 console.warn('useFavicon: Could not find <head> element to append favicon link.');
                 return; // Cannot proceed without head
             }
        }
    }

    // Ensure the type attribute is set based on the file extension (basic inference)
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'ico') {
        link.type = 'image/x-icon';
    } else if (extension === 'png') {
        link.type = 'image/png';
    } else if (extension === 'gif') {
        link.type = 'image/gif';
    } else if (extension === 'svg') {
        link.type = 'image/svg+xml';
    } else {
         // Clear type if extension is unknown or URL doesn't have one
         link.removeAttribute('type');
    }

    // Update the href attribute with the new URL
    link.href = url;

    // No cleanup needed unless we want to revert on unmount, which is less common for favicons.
  }, [url, rel]); // Re-run the effect if the URL or rel changes
}
