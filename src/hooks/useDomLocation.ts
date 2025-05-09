import { useState, useEffect, RefObject } from 'react';

interface ElementLocation {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function getlocation(element: HTMLElement): ElementLocation {
  const rect = element.getBoundingClientRect();
  const top = document.documentElement.clientTop;
  const left = document.documentElement.clientLeft;
  return {
    top: rect.top - top,
    bottom: rect.bottom - top,
    left: rect.left - left,
    right: rect.right - left,
  };
}

const useDomLocation = (element: HTMLElement | null): ElementLocation | undefined => {
  const [elementLocation, setElementLocation] = useState<ElementLocation | undefined>(
    element ? getlocation(element) : undefined
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    const handleResize = () => {
      setElementLocation(getlocation(element));
    };

    // Using ResizeObserver is more efficient than window resize for a specific element
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(element);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize);
    }


    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [element]); // Re-run effect if the element changes

  return elementLocation;
};

export default useDomLocation;