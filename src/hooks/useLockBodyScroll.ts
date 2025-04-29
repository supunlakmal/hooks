import { useEffect } from 'react';

/**
 * Custom hook to lock or unlock scrolling on the body element.
 *
 * @param {boolean} lock - When true, scrolling is locked; when false, scrolling is unlocked.
 */
function useLockBodyScroll(lock: boolean): void {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

    if (lock) {
      const bodyWidth = document.body.clientWidth;
      document.body.style.overflow = 'hidden';
      const bodyWidthAfterHidden = document.body.clientWidth;

      if (bodyWidthAfterHidden < bodyWidth) {
        const scrollbarWidth = bodyWidth - bodyWidthAfterHidden;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [lock]);
}

export default useLockBodyScroll;