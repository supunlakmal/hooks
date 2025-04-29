import { useState, useCallback, useRef, useLayoutEffect } from 'react';

interface Size {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const useMeasure = <T extends HTMLElement>(): [
  (node: T | null) => void,
  Size
] => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const handleResize = useCallback(() => {
    if (!ref.current) return;
    const node = ref.current;
    const rect = node.getBoundingClientRect();
    setSize({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    });
  }, []);

  const setRef = useCallback((node: T | null) => {
    if (ref.current) {
      window.removeEventListener('resize', handleResize);
    }
    ref.current = node;
    if (ref.current) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
  }, [handleResize]);

  useLayoutEffect(() => {
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return [setRef, size];
};

export default useMeasure;