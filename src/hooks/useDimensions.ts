// This hook is a refactored version of the react-cool-dimensions library.
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
} from 'react';

interface Dimensions {
  width: number | null;
  height: number | null;
  currentBreakpoint: string;
  entry: ResizeObserverEntry | null;
}

interface Breakpoints {
  [key: string]: number;
}

interface ShouldUpdateParams {
  width: number | null;
  height: number | null;
  currentBreakpoint: string;
  entry: ResizeObserverEntry | null;
}

interface Options {
  breakpoints?: Breakpoints;
  updateOnBreakpointChange?: boolean;
  useBorderBoxSize?: boolean;
  shouldUpdate?: (params: ShouldUpdateParams) => boolean;
  onResize?: (dimensions: Dimensions & {
    observe: (element?: Element | null) => void;
    unobserve: () => void;
  }) => void;
  polyfill?: any;
}

type UseDimensionsHook = <T extends Element = HTMLDivElement>(
  options?: Options
) => {
  observe: (element?: T | null) => void;
  unobserve: () => void;
  width: number | null;
  height: number | null;
  currentBreakpoint: string;
  entry: ResizeObserverEntry | null;
};

const useDimensions: UseDimensionsHook = <T extends Element = HTMLDivElement>(
  options: Options = {}
) => {
  const {
    breakpoints,
    updateOnBreakpointChange = false,
    useBorderBoxSize = false,
    shouldUpdate,
    onResize,
    polyfill,
  } = options;

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: null,
    height: null,
    currentBreakpoint: '',
    entry: null,
  });

  const targetRef = useRef<T | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const setRef = useCallback((element: T | null) => {
    targetRef.current = element;
  }, []);

  const unobserve = useCallback(() => {
    if (observerRef.current && targetRef.current) {
      observerRef.current.unobserve(targetRef.current);
    }
  }, []);

  const observe = useCallback((element?: T | null) => {
    if (element) {
      targetRef.current = element;
    }
    if (observerRef.current && targetRef.current) {
        unobserve();
      observerRef.current.observe(targetRef.current);
    }
  },[unobserve]);

  useEffect(() => {
    const RO = (window as any).ResizeObserver || polyfill;

    if (!RO) return;

    observerRef.current = new RO((entries: ResizeObserverEntry[]) => {
      if (!entries.length) return;

      const entry = entries[0];
      let width, height;

      if (useBorderBoxSize && entry.borderBoxSize) {
        width = entry.borderBoxSize[0].inlineSize;
        height = entry.borderBoxSize[0].blockSize;
      } else {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      let currentBreakpoint = '';
      if (breakpoints) {
        const sortedBreakpoints = Object.entries(breakpoints).sort(
          ([, a], [, b]) => a - b
        );
        for (const [key, value] of sortedBreakpoints) {
          if (width >= value) {
            currentBreakpoint = key;
          } else {
            break;
          }
        }
      }

      const shouldUpdateState = shouldUpdate
        ? shouldUpdate({
            width,
            height,
            currentBreakpoint,
            entry,
          })
        : true;
      
        if (
          shouldUpdateState &&
          (updateOnBreakpointChange
            ? dimensions.currentBreakpoint !== currentBreakpoint
            : true)
        ) {
          setDimensions({ width, height, currentBreakpoint, entry });
        }
      if(onResize) {
          onResize({width, height, currentBreakpoint, entry, observe, unobserve})
      }
    });

    if (targetRef.current) {
        observe();
    }

    return () => {
      unobserve();
      observerRef.current = null;
    };
  }, [
    breakpoints,
    updateOnBreakpointChange,
    useBorderBoxSize,
    shouldUpdate,
    onResize,
    polyfill,
    observe,
    unobserve
  ]);

  return { observe:setRef, unobserve, ...dimensions };
};

export default useDimensions;