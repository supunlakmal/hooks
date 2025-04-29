import { useState, useEffect, RefObject, useCallback } from 'react';
import useEventListener from './useEventListener';

interface DropOptions {
  onDrop?: (event: DragEvent, data: any) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
}

/**
 * Custom hook to handle drop events on an element.
 *
 * @param {RefObject<HTMLElement>} ref - The ref attached to the element to listen for drop events.
 * @param {DropOptions} [options] - Configuration options for the drop behavior.
 * @returns {boolean} Returns `true` if a dragged element is currently over the target element, `false` otherwise.
 */
function useDrop<T extends HTMLElement>(
  ref: RefObject<T>,
  options: DropOptions = {}
): boolean {
  const { onDrop, onDragEnter, onDragOver, onDragLeave } = options;
  const [isOver, setIsOver] = useState<boolean>(false);

  const handleDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOver(true);
    onDragEnter?.(event);
  }, [onDragEnter]);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDragOver?.(event);
  }, [onDragOver]);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOver(false);
    onDragLeave?.(event);
  }, [onDragLeave]);

  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOver(false);

    let data;
    try {
      const dataString = event.dataTransfer?.getData('text/plain');
      if (dataString) {
        data = JSON.parse(dataString);
      }
    } catch (e) {
      data = event.dataTransfer?.getData('text/plain');
    }
    onDrop?.(event, data);
  }, [onDrop]);

  useEventListener('dragenter', handleDragEnter, ref);
  useEventListener('dragover', handleDragOver, ref);
  useEventListener('dragleave', handleDragLeave, ref);
  useEventListener('drop', handleDrop, ref);

  return isOver;
}

export default useDrop;