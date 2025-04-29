import { useState, useEffect, useCallback, RefObject } from "react";

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

interface UseNewFullscreenResult {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  isSupported: boolean;
}

function useNewFullscreen(
  ref: RefObject<HTMLElement | null>
): UseNewFullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isSupported = !!(
    typeof document !== "undefined" && document.fullscreenEnabled
  );

  const getFullscreenElement = (): Element | null => {
    if (typeof document === "undefined") return null;
    const doc = document as FullscreenDocument;
    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      null
    );
  };

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!getFullscreenElement());
  }, []);

  useEffect(() => {
    if (!isSupported || typeof document === "undefined") return;

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

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
      if (element.requestFullscreen) await element.requestFullscreen();
      else if (element.webkitRequestFullscreen)
        await element.webkitRequestFullscreen();
      else if (element.mozRequestFullScreen)
        await element.mozRequestFullScreen();
      else if (element.msRequestFullscreen) await element.msRequestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      setIsFullscreen(false);
    }
  }, [isSupported, ref]);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    if (!isSupported) return;
    const doc = document as FullscreenDocument;

    try {
      if (doc.exitFullscreen) await doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
      else if (doc.msExitFullscreen) await doc.msExitFullscreen();
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, [isSupported]);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (getFullscreenElement()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSupported,
  };
}

export default useNewFullscreen;