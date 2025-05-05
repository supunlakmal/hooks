import { useState, useEffect } from 'react';

interface MousePosition {
  /** The X coordinate of the mouse pointer relative to the viewport. */
  x: number | null;
  /** The Y coordinate of the mouse pointer relative to the viewport. */
  y: number | null;
  /** The X coordinate of the mouse pointer relative to the screen. */
  screenX: number | null;
  /** The Y coordinate of the mouse pointer relative to the screen. */
  screenY: number | null;
  /** The X coordinate of the mouse pointer relative to the whole document. */
  pageX: number | null;
  /** The Y coordinate of the mouse pointer relative to the whole document. */
  pageY: number | null;
}

const initialState: MousePosition = {
  x: null,
  y: null,
  screenX: null,
  screenY: null,
  pageX: null,
  pageY: null,
};

/**
 * Custom hook to track the current position of the mouse pointer.
 *
 * @returns An object containing the mouse coordinates (relative to viewport, screen, and page).
 */
export function useMousePosition(): Readonly<MousePosition> {
  const [mousePosition, setMousePosition] =
    useState<MousePosition>(initialState);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Don't run on server
    }

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        pageX: event.pageX,
        pageY: event.pageY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial state check (in case mouse is already over the window before mount)
    // Note: This won't capture position if the mouse isn't moved after mount.
    // Consider alternative strategies if initial position without movement is critical.

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
}
