import { useState, useEffect, useCallback, RefObject } from "react";

// Simpler type checks, relying on standard properties first
interface FullscreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
  mozRequestFullScreen?: (options?: FullscreenOptions) => Promise<void>;
  msRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
}

interface UseFullscreenResult {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  isSupported: boolean;
}

/**
 * Custom hook to manage fullscreen state for a specific element.
 *
 * @param {RefObject<HTMLElement>} ref - Ref attached to the target element.
 * @returns {UseFullscreenResult} An object with fullscreen status and control functions.
 */
export const useFullscreen = (ref: RefObject<HTMLElement>): UseFullscreenResult => {
  // Get the initial state based on the standard API if possible
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () =>
      !!(
        typeof document !== "undefined" &&
        document.fullscreenElement &&
        document.fullscreenElement === ref.current
      )
  );

  // Check for API support using the standard property
  const isSupported = !!(
    typeof document !== "undefined" && document.fullscreenEnabled
  );

  const getFullscreenElement = (): Element | null => {
    if (typeof document === "undefined") return null;
    const doc = document as FullscreenDocument;
    // Prioritize standard, then fall back to prefixed versions
    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      null
    );
  };

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(
      !!getFullscreenElement() && getFullscreenElement() === ref.current
    );
  }, [ref]);

  useEffect(() => {
    if (!isSupported || typeof document === "undefined") return;

    // Still need prefixed event names for listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    // Update state on mount
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [isSupported, handleFullscreenChange]);

  const enterFullscreen = useCallback(async (): Promise<void> => {
    if (!isSupported || !ref.current) return;
    const element = ref.current as FullscreenElement;

    try {
      // Attempt standard first, then fallbacks
      if (element.requestFullscreen) await element.requestFullscreen();
      else if (element.webkitRequestFullscreen)
        await element.webkitRequestFullscreen();
      else if (element.mozRequestFullScreen)
        await element.mozRequestFullScreen();
      else if (element.msRequestFullscreen) await element.msRequestFullscreen();
      else console.warn("Fullscreen API not fully supported on this element.");
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      setIsFullscreen(false); // Reset state on failure
    }
  }, [isSupported, ref]);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    if (!isSupported || !getFullscreenElement()) return;
    const doc = document as FullscreenDocument;

    try {
      // Attempt standard first, then fallbacks
      if (doc.exitFullscreen) await doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
      else if (doc.msExitFullscreen) await doc.msExitFullscreen();
      else
        console.warn(
          "Exit Fullscreen API not fully supported on this document."
        );
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, [isSupported]);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    const currentFullscreenElement = getFullscreenElement();
    if (currentFullscreenElement && currentFullscreenElement === ref.current) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen, ref]); // Use getFullscreenElement within toggle

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSupported,
  };
}


