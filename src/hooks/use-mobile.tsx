import * as React from "react";

/**
 * Default mobile breakpoint in pixels
 */
const DEFAULT_MOBILE_BREAKPOINT = 768;

/**
 * Hook that returns whether the current viewport is mobile-sized
 * @param breakpoint - Optional custom breakpoint in pixels (defaults to 768px)
 * @returns boolean indicating if viewport is mobile-sized
 */
export function useMobile(
  breakpoint: number = DEFAULT_MOBILE_BREAKPOINT
): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);

    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMobile;
}
