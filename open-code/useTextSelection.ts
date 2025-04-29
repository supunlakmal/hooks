import { useState, RefObject } from 'react';
import useEventListener from './useEventListener';

interface TextSelectionState {
  text: string;
  range: Range | null;
  element: Element | null;
}

/**
 * Custom hook to get the currently selected text on the page or within a specific element.
 *
 * @param {RefObject<HTMLElement | null>} ref - A ref to the element to listen to, or null to listen to the whole document.
 * @returns {TextSelectionState} An object containing the selected text, range, and element.
 */
function useTextSelection(ref: RefObject<HTMLElement | null>): TextSelectionState {
  const [selectionState, setSelectionState] = useState<TextSelectionState>({
    text: '',
    range: null,
    element: null,
  });

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      setSelectionState({
        text: selection.toString(),
        range: range,
        element: selection.anchorNode,
      });
    }
  };

  useEventListener('select', handleSelectionChange, ref.current ? ref : document);

  return selectionState;
}

export default useTextSelection;