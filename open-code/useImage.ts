import { useState, useEffect } from 'react';

interface UseImageReturn {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  image: HTMLImageElement | null;
}

/**
 * Custom hook to preload an image and manage its loading state.
 *
 * @param {string} src - The URL of the image to load.
 * @returns {UseImageReturn} An object containing the loading state and the image element.
 */
function useImage(src: string): UseImageReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setImage(null);

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      setIsLoading(false);
      setIsSuccess(true);
      setImage(img);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsError(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return { isLoading, isError, isSuccess, image };
}

export default useImage;