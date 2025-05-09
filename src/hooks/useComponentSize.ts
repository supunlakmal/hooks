import { useState, useCallback, useLayoutEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

function getSize(el?: HTMLElement | null): Size {
  if (!el) {
    return {
      width: 0,
      height: 0
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  };
}

function useComponentSize(ref: RefObject<HTMLElement>): Size {
  const [componentSize, setComponentSize] = useState<Size>(getSize(ref ? ref.current : null));

  const handleResize = useCallback(
    () => {
      if (ref.current) {
        setComponentSize(getSize(ref.current));
      }
    },
    [ref]
  );

  useLayoutEffect(
    () => {
      if (!ref.current) {
        return;
      }

      handleResize();

      if (typeof ResizeObserver === 'function') {
        const resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(ref.current);

        return () => {
          resizeObserver.disconnect(ref.current as Element);
          // resizeObserver = null; // This line is not necessary in modern JS/TS
        };
      } else {
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    },
    [ref.current]
  );

  return componentSize;
}

export default useComponentSize;