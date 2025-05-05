import { useState, useEffect, useCallback } from 'react';

interface TextSelectionState {
  /** The selected text content. */
  text: string;
  /** The DOMRect object representing the geometry of the selection. */
  rect: DOMRect | null;
  /** The start offset of the selection within its start node. */
  startOffset: number | null;
  /** The end offset of the selection within its end node. */
  endOffset: number | null;
  /** The start node of the selection. */
  startNode: Node | null;
  /** The end node of the selection. */
  endNode: Node | null;
  /** The range object representing the selection. */
  range: Range | null;
}

const isBrowser = typeof window !== 'undefined';

const getInitialState = (): TextSelectionState => ({
  text: '',
  rect: null,
  startOffset: null,
  endOffset: null,
  startNode: null,
  endNode: null,
  range: null,
});

/**
 * Hook to track the user's text selection within the document.
 *
 * @returns {TextSelectionState} An object containing details about the current text selection.
 */
export function useTextSelection(): TextSelectionState {
  const [selectionState, setSelectionState] = useState<TextSelectionState>(getInitialState);

  const handleSelectionChange = useCallback(() => {
    if (!isBrowser) return;

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      // If no selection or selection is collapsed, reset state
      // Check if current state is already reset to avoid unnecessary updates
      if (selectionState.text !== '' || selectionState.range !== null) {
          setSelectionState(getInitialState());
      }
      return;
    }

    const range = selection.getRangeAt(0);
    const text = selection.toString();
    let rect: DOMRect | null = null;
    try {
         rect = range.getBoundingClientRect();
    } catch (e) {
        console.warn('Could not get bounding client rect for selection range:', e);
    }

    // Check if the new state is different from the current one before updating
    if (
        text !== selectionState.text ||
        range.startOffset !== selectionState.startOffset ||
        range.endOffset !== selectionState.endOffset ||
        range.startContainer !== selectionState.startNode ||
        range.endContainer !== selectionState.endNode
       // Note: Comparing DOMRect objects directly might be tricky due to float precision.
       // A shallow comparison or comparing specific properties might be better if needed.
    ) {
         setSelectionState({
            text,
            rect,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
            startNode: range.startContainer,
            endNode: range.endContainer,
            range: range, // Store the range itself if needed
        });
    }

  }, [selectionState]); // Depend on selectionState to compare against new selection

  useEffect(() => {
    if (!isBrowser) return;

    // Listen for selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
    // Initial check in case selection exists on mount
    handleSelectionChange();

    // Also listen for mouse up, as selectionchange might not fire reliably in all cases (e.g., clearing selection)
    // Note: 'mouseup' might fire too often. 'selectionchange' is generally preferred.
    // Consider adding mouseup only if 'selectionchange' proves insufficient for some edge cases.
    // document.addEventListener('mouseup', handleSelectionChange);

    // Cleanup listeners
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      // document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return selectionState;
}
