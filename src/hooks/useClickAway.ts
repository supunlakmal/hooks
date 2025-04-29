import { useEffect, useRef } from 'react';

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

type Target = HTMLElement | null | HTMLElement[] | null;

function useClickOutside<T extends Event = Event>(
  callback: (event: T) => void,
  target: Target,
  eventName: keyof DocumentEventMap = 'click'
) {
  const callbackRef = useLatest(callback);

  const targets = Array.isArray(target) ? target : target ? [target]:[];

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
        const clickedOutside = targets.every((targetElement) => {
            return !targetElement?.contains(event.target as Node);
          });
        if(clickedOutside) callbackRef.current(event as T)
    };

    if(targets.length === 0) return;

    document.addEventListener(eventName, handleClickOutside);
    return () => {
      document.removeEventListener(eventName, handleClickOutside);
    };
  }, [eventName, ...targets]);
}

export default useClickOutside;