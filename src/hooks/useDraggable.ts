import { useRef, useState, useEffect, useCallback } from "react";

interface DraggableOptions {
  /** Initial position of the element. */
  initialPosition?: { x: number; y: number };
  /** Reference to a bounding container element. Dragging will be constrained within this container. */
  boundsRef?: React.RefObject<HTMLElement>;
  /** Specific bounding box coordinates (overrides boundsRef if provided). */
  bounds?: { top: number; left: number; right: number; bottom: number };
  /** Callback fired when dragging starts. */
  onDragStart?: (
    position: { x: number; y: number },
    event: PointerEvent
  ) => void;
  /** Callback fired continuously during dragging. */
  onDrag?: (position: { x: number; y: number }, event: PointerEvent) => void;
  /** Callback fired when dragging stops. */
  onDragEnd?: (position: { x: number; y: number }, event: PointerEvent) => void;
  /** Control the position externally. If provided, the hook operates in controlled mode. */
  position?: { x: number; y: number };
  /** Callback to update the position in controlled mode. */
  onPositionChange?: (position: { x: number; y: number }) => void;
}

interface DraggableState {
  /** Current position (x, y) of the element. */
  position: { x: number; y: number };
  /** Whether the element is currently being dragged. */
  isDragging: boolean;
}

/**
 * Makes a DOM element draggable using pointer events, supporting constraints and callbacks.
 *
 * @param ref React ref object attached to the draggable element.
 * @param options Configuration options for draggable behavior.
 * @returns State including the element's position and dragging status.
 */
const useDraggable = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  options: DraggableOptions = {}
): DraggableState => {
  const {
    initialPosition = { x: 0, y: 0 },
    boundsRef,
    bounds: explicitBounds,
    onDragStart,
    onDrag,
    onDragEnd,
    position: controlledPosition,
    onPositionChange,
  } = options;

  const isControlled =
    controlledPosition !== undefined && onPositionChange !== undefined;

  const [internalPosition, setInternalPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const elementStartOffsetRef = useRef<{ x: number; y: number } | null>(null);

  const position = isControlled ? controlledPosition : internalPosition;

  const getConstrainedPosition = useCallback(
    (newX: number, newY: number): { x: number; y: number } => {
      const element = ref.current;
      if (!element) return { x: newX, y: newY };

      let currentBounds = explicitBounds;
      if (!currentBounds && boundsRef?.current) {
        const parentRect = boundsRef.current.getBoundingClientRect();
        const elemRect = element.getBoundingClientRect(); // Need current element size
        // Calculate bounds relative to the parent origin
        currentBounds = {
          top: 0,
          left: 0,
          right: parentRect.width - elemRect.width,
          bottom: parentRect.height - elemRect.height,
        };
      }

      if (currentBounds) {
        const constrainedX = Math.max(
          currentBounds.left,
          Math.min(newX, currentBounds.right)
        );
        const constrainedY = Math.max(
          currentBounds.top,
          Math.min(newY, currentBounds.bottom)
        );
        return { x: constrainedX, y: constrainedY };
      }

      return { x: newX, y: newY };
    },
    [ref, boundsRef, explicitBounds]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!ref.current || event.button !== 0) return; // Only handle left click

      // Prevent default only if the target is the draggable element itself (or allow specific handles)
      if (event.target === ref.current) {
        // Prevent text selection during drag
        event.preventDefault();
        // Capture pointer events to ensure we get pointerup even if cursor leaves the element
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
      }

      setIsDragging(true);
      dragStartRef.current = { x: event.clientX, y: event.clientY };
      elementStartOffsetRef.current = { ...position }; // Store position at drag start

      onDragStart?.(position, event);
    },
    [ref, position, onDragStart]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (
        !isDragging ||
        !dragStartRef.current ||
        !elementStartOffsetRef.current ||
        !ref.current
      )
        return;

      const dx = event.clientX - dragStartRef.current.x;
      const dy = event.clientY - dragStartRef.current.y;

      const newX = elementStartOffsetRef.current.x + dx;
      const newY = elementStartOffsetRef.current.y + dy;

      const constrainedPos = getConstrainedPosition(newX, newY);

      if (isControlled) {
        // If controlled, check if position actually changed before calling callback
        if (
          constrainedPos.x !== position.x ||
          constrainedPos.y !== position.y
        ) {
          onPositionChange(constrainedPos);
          onDrag?.(constrainedPos, event);
        }
      } else {
        setInternalPosition(constrainedPos);
        onDrag?.(constrainedPos, event);
      }
    },
    [
      isDragging,
      position,
      isControlled,
      onPositionChange,
      getConstrainedPosition,
      onDrag,
      ref,
    ]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !ref.current) return;

      if ((event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
      }

      setIsDragging(false);
      onDragEnd?.(position, event);

      dragStartRef.current = null;
      elementStartOffsetRef.current = null;
    },
    [isDragging, position, onDragEnd, ref]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use pointer events for better compatibility across devices
    element.addEventListener("pointerdown", handlePointerDown as EventListener);
    // Attach move and up listeners to the window to handle dragging outside the element
    window.addEventListener("pointermove", handlePointerMove as EventListener);
    window.addEventListener("pointerup", handlePointerUp as EventListener);
    window.addEventListener("pointercancel", handlePointerUp as EventListener); // Handle cancellations

    // Apply initial/current position using transform for performance
    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
    // Ensure position: relative or absolute is set on the element by the user for transform to work as expected
    // element.style.position = 'relative'; // Or 'absolute' - uncomment if needed, but better set via CSS
    element.style.cursor = isDragging ? "grabbing" : "grab";
    element.style.userSelect = isDragging ? "none" : "auto"; // Prevent text selection while dragging

    return () => {
      element.removeEventListener(
        "pointerdown",
        handlePointerDown as EventListener
      );
      window.removeEventListener(
        "pointermove",
        handlePointerMove as EventListener
      );
      window.removeEventListener("pointerup", handlePointerUp as EventListener);
      window.removeEventListener(
        "pointercancel",
        handlePointerUp as EventListener
      );
      // Cleanup inline styles potentially?
      // element.style.cursor = 'auto';
      // element.style.userSelect = 'auto';
    };
    // Rerun effect if position changes externally (controlled) or if handlers change
  }, [
    ref,
    position,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  ]);

  return {
    position,
    isDragging,
  };
};

export default useDraggable;
