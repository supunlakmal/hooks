import { useEffect, useRef } from 'react';

type KeyPredicate = (event: KeyboardEvent) => boolean;

type Handler = (event: KeyboardEvent) => void;

interface UseKeyboardEventOptions {
  event?: 'keydown' | 'keyup';
  target?: EventTarget;
}

function isTarget(target: any): target is EventTarget {
    return target instanceof EventTarget;
}
function useKeyboardEvent(key: string | KeyPredicate, handler: Handler, options: UseKeyboardEventOptions = {}) {
  const { event = 'keydown', target = window } = options;
  const savedHandler = useRef<Handler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
        const predicate = typeof key === 'string' ? (e: KeyboardEvent) => e.key === key : key;
        if (predicate(event)) {
          savedHandler.current?.(event);
        }
      };
    
    if (isTarget(target)){
        target.addEventListener(event, listener);
        return () => {
          target.removeEventListener(event, listener);
        };
    }
    return undefined;

  }, [key, event, target]);
}

export default useKeyboardEvent;