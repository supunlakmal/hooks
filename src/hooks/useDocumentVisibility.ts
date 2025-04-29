import { useState, useRef, useEffect } from 'react';

type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined;

const isBrowser = typeof window !== 'undefined';

type Target =
  | (() => HTMLElement | Document | Window | null)
  | HTMLElement
  | Document
  | Window
  | null;

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: {
    target?: Target;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
  },
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: {
    target?: Target;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
  },
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: {
    target?: Target;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
  },
): void;
function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  options: {
    target?: Target;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
  } = {},
) {
  const { target, capture, once, passive } = options;

  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement =
      typeof target === 'function' ? target() : target ?? window;

    if (!targetElement) return;

    const eventListener = (event: Event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, {
      capture,
      once,
      passive,
    });

    return () => {
      targetElement.removeEventListener(eventName, eventListener, {
        capture,
      });
    };
  }, [eventName, target, capture, once, passive]);
}

const getVisibility = () => {
  if (!isBrowser) {
    return 'visible';
  }
  return document.visibilityState;
};

function useDocumentVisibility(): VisibilityState {
  const [documentVisibility, setDocumentVisibility] = useState(getVisibility);

  useEventListener(
    'visibilitychange',
    () => {
      setDocumentVisibility(getVisibility());
    },
    {
      target: () => document,
    },
  );

  return documentVisibility;
}

export default useDocumentVisibility;
