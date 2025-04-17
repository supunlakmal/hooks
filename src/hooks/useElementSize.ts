import { useState, useCallback, useEffect, useRef, RefObject } from "react";
import useResizeObserver from "./useResizeObserver";

interface Size {
  width: number;
  height: number;
}

const initialSize: Size = { width: 0, height: 0 };

/**
 * Custom hook that returns the dimensions (width and height) of a target element.
 * It uses ResizeObserver for efficient tracking.
 *
 * @template T The type of the element being measured.
 * @returns {[React.RefCallback<T>, Size]} A tuple containing:
 *           - A callback ref to attach to the target element.
 *           - An object with the latest width and height of the element.
 */
function useElementSize<T extends Element>(): [React.RefCallback<T>, Size] {
  // Keep track of the element node using useState managed by the callback ref
  const [element, setElement] = useState<T | null>(null);

  // We need a stable ref object to pass to useResizeObserver
  const elementRef = useRef<T | null>(null);

  // State to store the size
  const [size, setSize] = useState<Size>(initialSize);

  // The callback ref that updates the state
  const refCallback = useCallback((node: T | null) => {
    elementRef.current = node;
    setElement(node);
  }, []);

  // Get the ResizeObserver entry for the element ref
  const entry = useResizeObserver(elementRef as RefObject<T>);

  // Update size state when ResizeObserver entry changes or the element appears
  useEffect(() => {
    const newWidth = entry?.contentRect?.width ?? element?.clientWidth ?? 0;
    const newHeight = entry?.contentRect?.height ?? element?.clientHeight ?? 0;

    // Check if size actually changed to prevent unnecessary re-renders
    if (newWidth !== size.width || newHeight !== size.height) {
      setSize({ width: newWidth, height: newHeight });
    }
    // Add element to dependencies to recalculate initial size when element appears
    // Add entry width/height to dependencies to react to resize observer changes
  }, [
    element,
    entry?.contentRect?.width,
    entry?.contentRect?.height,
    size.width,
    size.height,
  ]);

  return [refCallback, size];
}

export default useElementSize;
