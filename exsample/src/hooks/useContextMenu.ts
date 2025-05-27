import { RefObject, useCallback, useState } from 'react';
import { useEventListener } from '@/hooks/useEventListener'; // Updated path

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
}

interface UseContextMenuResult extends ContextMenuState {
  open: (event: MouseEvent) => void; // Function to manually open at event coords
  close: () => void;
}

/**
 * Custom hook to manage the state for a custom context menu.
 * Listens for contextmenu events on the target element and provides menu state (position, visibility).
 *
 * @param {RefObject<HTMLElement | null>} targetRef - Ref attached to the element that triggers the context menu.
 * @returns {UseContextMenuResult} An object containing menu state and control functions.
 */
export const useContextMenu = (
  targetRef: RefObject<HTMLElement | null>
): UseContextMenuResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Handler for the contextmenu event
  const handleContextMenu = useCallback(
    (event: Event) => { // Changed MouseEvent to Event
      // Prevent default for any contextmenu event passed through useEventListener
      event.preventDefault(); 
      if (targetRef.current && targetRef.current.contains(event.target as Node)) {
        if (event instanceof MouseEvent) { // Type guard for MouseEvent specific properties
          setPosition({ x: event.clientX, y: event.clientY });
          setIsOpen(true);
        } else {
          // Fallback for non-MouseEvent contextmenu triggers (e.g. Keyboard)
          // Sets a default position or doesn't open. For this example, let's not open.
          setIsOpen(false); 
        }
      } else {
        // If the event didn't originate from within the target, close any open menu
        setIsOpen(false);
      }
    },
    [targetRef]
  );

  // Handler for clicks outside the menu area (or anywhere)
  const handleClickOutside = useCallback(() => {
    // We simply close the menu on any click outside the context menu itself.
    // More sophisticated logic might involve checking if the click was inside
    // the custom menu component, but this hook doesn't know about that component.
    if (isOpen) {
      // Let potential menu item clicks be handled before closing
      setTimeout(() => setIsOpen(false), 0);
    }
  }, [isOpen]);

  // Handler for scroll events - close menu on scroll
  const handleScroll = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  // Add listeners using useEventListener for conciseness
  useEventListener(
    'contextmenu',
    handleContextMenu,
    typeof document !== 'undefined' ? document : undefined
  );
  useEventListener(
    'click',
    handleClickOutside,
    typeof document !== 'undefined' ? document : undefined
  );
  useEventListener(
    'scroll',
    handleScroll,
    typeof document !== 'undefined' ? document : undefined,
    { capture: true }
  ); // Use capture for scroll

  // Manual control functions
  const open = useCallback((event: MouseEvent) => {
    setIsOpen(true);
    setPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    position,
    open,
    close,
  };
};
