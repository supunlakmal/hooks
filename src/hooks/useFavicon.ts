import { useEffect } from 'react';

/**
 * Custom hook to dynamically change the favicon of the page.
 *
 * @param {string} url - The URL of the new favicon image.
 */
function useFavicon(url: string): void {
  useEffect(() => {
    // Ensure the code runs in a browser environment
    if (typeof window !== 'undefined') {
      // Find existing link element with rel="icon" or create one if it doesn't exist
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }

      // Set the href to the new favicon URL
      link.href = url;
    }
  }, [url]);
}

export default useFavicon;