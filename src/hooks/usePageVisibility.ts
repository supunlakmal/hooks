import { useState, useEffect } from "react";

// Helper function to get the correct visibility property names
const getVisibilityProperties = (): {
  hidden: string | null;
  visibilityChange: string | null;
} => {
  if (typeof document === "undefined") {
    return { hidden: null, visibilityChange: null };
  }
  if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    return { hidden: "hidden", visibilityChange: "visibilitychange" };
  } else if (typeof (document as any).msHidden !== "undefined") {
    return { hidden: "msHidden", visibilityChange: "msvisibilitychange" };
  } else if (typeof (document as any).webkitHidden !== "undefined") {
    return {
      hidden: "webkitHidden",
      visibilityChange: "webkitvisibilitychange",
    };
  }
  return { hidden: null, visibilityChange: null }; // Not supported
};

/**
 * Custom hook to track the visibility state of the browser page/tab
 * using the Page Visibility API.
 *
 * @returns {boolean} True if the page is currently visible, false otherwise.
 */
export function usePageVisibility(): boolean {
  const visibilityProps = getVisibilityProperties();
  const isSupported = !!visibilityProps.hidden;

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (!isSupported || typeof document === "undefined") {
      return true; // Assume visible if API not supported or SSR
    }
    return !document[visibilityProps.hidden as keyof Document];
  });

  useEffect(() => {
    if (
      !isSupported ||
      !visibilityProps.visibilityChange ||
      typeof document === "undefined"
    ) {
      return;
    }

    const handleVisibilityChange = () => {
      setIsVisible(!document[visibilityProps.hidden as keyof Document]);
    };

    document.addEventListener(
      visibilityProps.visibilityChange,
      handleVisibilityChange
    );

    // Cleanup
    return () => {
      document.removeEventListener(
        visibilityProps.visibilityChange!,
        handleVisibilityChange
      );
    };
  }, [isSupported, visibilityProps.hidden, visibilityProps.visibilityChange]);

  return isVisible;
}


