import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to detect a specific sequence of key presses.
 *
 * @param {string[]} sequence - An array of strings representing the keys in the sequence.
 * @param {() => void} callback - The function to execute when the sequence is detected.
 */
function useKeySequence(sequence: string[], callback: () => void): void {
  const sequenceRef = useRef<string[]>([]);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      sequenceRef.current.push(key);

      if (sequence.length > 0 && sequenceRef.current.length > sequence.length) {
        sequenceRef.current.shift();
      }

      if (sequenceRef.current.join(',') === sequence.join(',')) {
        callbackRef.current();
        sequenceRef.current = [];
      } else {
        const isPartiallyCorrect = sequence.some((_, index) => {
          return sequenceRef.current.slice(0,index + 1).join(',') === sequence.slice(0, index + 1).join(',');
        });

        if(!isPartiallyCorrect){
            sequenceRef.current = [];
        }
      }
    },
    [sequence]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeySequence;