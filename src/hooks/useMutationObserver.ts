import { useEffect, useRef, RefObject, useState, useCallback } from 'react';

type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void;

function useMutationObserver(
  ref: RefObject<Element | null>,
  callback: MutationCallback,
  options: MutationObserverInit
): [MutationRecord[], (element: Element) => void] {
  const observerRef = useRef<MutationObserver | null>(null);
  const callbackRef = useRef<MutationCallback>(callback);
  const [mutations, setMutations] = useState<MutationRecord[]>([]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const observe = useCallback((element: Element) => {
      if (observerRef.current) {
          observerRef.current.disconnect();
      }

    observerRef.current = new MutationObserver((mutations, observer) => {
        callbackRef.current(mutations, observer);
        setMutations(mutations)
      });

      observerRef.current.observe(element, options);

  }, [options]);


  useEffect(() => {
    const element = ref.current;

    if (element) {
        observe(element);
    }
    return () => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
    };
  }, [ref, observe]);

  return [mutations, observe];
}

export default useMutationObserver;