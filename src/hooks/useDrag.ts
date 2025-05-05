import { useRef, useEffect, useState, useCallback } from 'react';

interface DragOptions {
  /** Data to be transferred during the drag operation. Can be any serializable data. */
  transferData?: any;
  /** The format/type string for the dataTransfer item (e.g., 'text/plain', 'application/json'). Defaults to 'text/plain'. */
  dataFormat?: string;
  /** Effect allowed for the drag operation (e.g., 'copy', 'move', 'link', 'none'). Defaults to 'move'. */
  dragEffect?:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
    | 'uninitialized';
  /** Element to use as the drag ghost image. If null, browser default is used. */
  dragImage?: HTMLElement | null;
  /** Offset for the drag ghost image relative to the cursor. */
  dragImageOffset?: { x: number; y: number };
  /** Callback when dragging starts. */
  onDragStart?: (event: DragEvent) => void;
  /** Callback while dragging. */
  onDrag?: (event: DragEvent) => void;
  /** Callback when dragging ends (successfully or cancelled). */
  onDragEnd?: (event: DragEvent) => void;
  /** Set the element itself as draggable (adds `draggable="true"`). Defaults to true. */
  setDraggableAttribute?: boolean;
}

interface DragState {
  /** Whether the element is currently being dragged. */
  isDragging: boolean;
}

/**
 * Provides basic drag-and-drop event handling for an element.
 * Attaches necessary listeners and manages drag state.
 *
 * @param ref React ref object attached to the draggable element.
 * @param options Configuration options for the drag behavior.
 * @returns State indicating if the element is currently being dragged.
 */
export const useDrag = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  options: DragOptions = {}
): DragState => {
  const { setDraggableAttribute = true } = options;

  const [isDragging, setIsDragging] = useState(false);

  // Store options in refs to avoid re-running effects when they change
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleDragStart = useCallback((event: DragEvent) => {
    const currentOptions = optionsRef.current;
    setIsDragging(true);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = currentOptions.dragEffect || 'move';

      if (currentOptions.transferData !== undefined) {
        let dataString: string | null = null;
        try {
          if (typeof currentOptions.transferData === 'string') {
            dataString = currentOptions.transferData;
          } else {
            dataString = JSON.stringify(currentOptions.transferData);
          }
          event.dataTransfer.setData(
            currentOptions.dataFormat || 'text/plain',
            dataString
          );
        } catch (e) {
          console.error(
            "useDrag: Failed to stringify transferData. Ensure it's serializable.",
            e
          );
          event.dataTransfer.setData(
            currentOptions.dataFormat || 'text/plain',
            '[Serialization Error]'
          );
        }
      }

      if (currentOptions.dragImage && event.dataTransfer.setDragImage) {
        event.dataTransfer.setDragImage(
          currentOptions.dragImage,
          currentOptions.dragImageOffset?.x || 0,
          currentOptions.dragImageOffset?.y || 0
        );
      } else if (currentOptions.dragImage === null) {
        // If explicitly null, try to use a minimal transparent image (browser support varies)
        const emptyImage = new Image();
        emptyImage.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        event.dataTransfer.setDragImage(emptyImage, 0, 0);
      }
      // Otherwise, use browser default drag image
    }

    currentOptions.onDragStart?.(event);
  }, []); // No dependencies, relies on optionsRef

  const handleDrag = useCallback((event: DragEvent) => {
    optionsRef.current.onDrag?.(event);
    // isDragging state is managed by dragstart/dragend
  }, []); // No dependencies, relies on optionsRef

  const handleDragEnd = useCallback((event: DragEvent) => {
    setIsDragging(false);
    optionsRef.current.onDragEnd?.(event);
  }, []); // No dependencies, relies on optionsRef

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (setDraggableAttribute) {
      element.setAttribute('draggable', 'true');
    }

    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('drag', handleDrag);
    element.addEventListener('dragend', handleDragEnd);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('drag', handleDrag);
      element.removeEventListener('dragend', handleDragEnd);
      if (setDraggableAttribute) {
        // Reset draggable attribute on cleanup if we set it
        element.removeAttribute('draggable');
      }
    };
  }, [ref, setDraggableAttribute, handleDragStart, handleDrag, handleDragEnd]);

  return { isDragging };
};
