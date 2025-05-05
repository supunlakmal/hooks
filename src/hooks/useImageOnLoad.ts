import { useState, useEffect } from 'react';

interface ImageOnLoadResult {
  /** Indicates if the image is currently loading. */
  isLoading: boolean;
  /** Any error that occurred during loading. */
  error: Event | string | null;
  /** The natural width of the image once loaded. */
  naturalWidth: number | null;
  /** The natural height of the image once loaded. */
  naturalHeight: number | null;
}

const initialState: ImageOnLoadResult = {
  isLoading: true,
  error: null,
  naturalWidth: null,
  naturalHeight: null,
};

/**
 * Custom hook to track the loading status and dimensions of an image.
 *
 * @param src The source URL of the image to load.
 * @returns An object containing the loading state, error, and image dimensions.
 */
export function useImageOnLoad(src?: string): Readonly<ImageOnLoadResult> {
  const [state, setState] = useState<ImageOnLoadResult>(initialState);

  useEffect(() => {
    if (!src) {
      setState({ ...initialState, isLoading: false }); // Reset if no src
      return;
    }

    setState(initialState); // Reset state when src changes
    let isMounted = true;
    const img = new Image();

    const handleLoad = () => {
      if (isMounted) {
        setState({
          isLoading: false,
          error: null,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      }
    };

    const handleError = (errorEvent: Event | string) => {
      if (isMounted) {
        setState({
          isLoading: false,
          error: errorEvent,
          naturalWidth: null,
          naturalHeight: null,
        });
      }
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    // Optional: Check if image is already cached by the browser
    if (img.complete && img.naturalWidth) {
        // Needs a slight delay for cached images in some browsers (like Firefox)
        // to correctly report dimensions and trigger load event if needed.
        setTimeout(() => {
             if(isMounted && img.complete && img.naturalWidth) {
                handleLoad();
             }
        }, 0);
    }

    return () => {
      isMounted = false;
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      // Optional: Abort loading if src changes before load finishes
      // img.src = ''; // Setting src to '' might not be standard for aborting
    };
  }, [src]);

  return state;
}
