import { useState, useEffect, useRef, useCallback } from "react";

interface ScrollSpyOptions {
  /** The container element whose scroll position is monitored. Defaults to window. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Pixel offset from the top of the container to trigger activation. Can be negative. Defaults to 0. */
  offset?: number;
  /** Throttle delay in milliseconds for scroll event handling. Defaults to 100. */
  throttleMs?: number;
}

/**
 * Monitors scroll position to determine which element/section is currently active in the viewport.
 *
 * @param sectionRefs An array of React refs attached to the section elements to be monitored.
 * @param options Configuration options for offset and container.
 * @returns The id of the currently active section element, or null if none are active.
 */
export const useScrollSpy = (
  sectionRefs: React.RefObject<HTMLElement | null>[],
  options: ScrollSpyOptions = {}
): string | null => {
  const { containerRef, offset = 0, throttleMs = 100 } = options;
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getScrollContainer = useCallback(() => {
    return containerRef?.current || window;
  }, [containerRef]);

  const getContainerScrollTop = useCallback(() => {
    const container = getScrollContainer();
    if (container instanceof Window) {
      return container.scrollY;
    } else {
      return container.scrollTop;
    }
  }, [getScrollContainer]);

  const handleScroll = useCallback(() => {
    const scrollTop = getContainerScrollTop() + offset;
    let currentActiveId: string | null = null;

    for (let i = sectionRefs.length - 1; i >= 0; i--) {
      const section = sectionRefs[i]?.current;
      if (section) {
        // Calculate section top relative to the scroll container
        let sectionTop = section.offsetTop;
        if (
          !(getScrollContainer() instanceof Window) &&
          containerRef?.current
        ) {
          // Adjust if container is not window, offsetTop is relative to offsetParent
          // This simple calculation might need refinement depending on complex layouts
          sectionTop =
            section.getBoundingClientRect().top -
            containerRef.current.getBoundingClientRect().top +
            containerRef.current.scrollTop;
        }

        if (scrollTop >= sectionTop) {
          currentActiveId = section.id;
          break; // Found the topmost active section
        }
      }
    }

    setActiveSectionId(currentActiveId);
  }, [
    sectionRefs,
    offset,
    getContainerScrollTop,
    containerRef,
    getScrollContainer,
  ]);

  // Throttled scroll handler
  const throttledHandleScroll = useCallback(() => {
    if (!throttleTimeoutRef.current) {
      handleScroll(); // Run immediately the first time
      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null;
        // Optional: Could re-run handleScroll here if needed after timeout,
        // but usually running on leading edge is sufficient.
        // handleScroll();
      }, throttleMs);
    }
  }, [handleScroll, throttleMs]);

  useEffect(() => {
    const container = getScrollContainer();

    // Initial check
    handleScroll();

    container.addEventListener("scroll", throttledHandleScroll);
    window.addEventListener("resize", throttledHandleScroll); // Also check on resize

    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [getScrollContainer, throttledHandleScroll, handleScroll]); // Rerun if container or handler changes

  return activeSectionId;
};


