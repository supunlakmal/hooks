import {
  useState,
  useRef,
  useEffect,
  useMemo,
  createElement,
  ReactNode,
} from 'react';

type Slot = {
  [key: string]: ReactNode;
};

type SlotDefinition = {
  name: string;
  fallback?: ReactNode;
};

type SlotConfig = {
  [key: string]: SlotDefinition;
};

type SlotProps<T extends SlotConfig> = {
  [K in keyof T]?: ReactNode;
};

type LayoutProps<T extends SlotConfig> = {
  slots: T;
  children: ReactNode;
};

function defineSlots<T extends SlotConfig>(config: T): T {
  return config;
}

function argsAsNames<T extends string[]>(...args: T): { [K in T[number]]: { name: K } } {
    const result: any = {};
    for (const arg of args) {
      result[arg] = { name: arg };
    }
    return result;
  }

const EMPTY_SLOTS = {};

function useLayout<T extends SlotConfig>(
  config: T,
  children: ReactNode
): [
  <K extends keyof T>(props: { name: K; fallback?: ReactNode }) => ReactNode,
  SlotProps<T>
] {
  const slotRefs = useRef<{ [key: string]: ReactNode }>({});
  const slotConfig = useMemo(() => config, []);
  const [slots, setSlots] = useState<SlotProps<T>>({} as SlotProps<T>);

  useEffect(() => {
    const nextSlots: SlotProps<T> = {} as SlotProps<T>;
    for (const key in slotConfig) {
      if (slotRefs.current[key]) {
        nextSlots[key] = slotRefs.current[key];
      }
    }
    setSlots(nextSlots);
  }, [slotConfig]);

  const SlotComponent = useMemo(
    () =>
      ({ name, fallback }: { name: keyof T; fallback?: ReactNode }) => {
        const slot = slotConfig[name];
          if (!slot) {
              return null
          }
          
          return (
            createElement('div', {
              style: { display: 'contents' },
              ref: (el) => {
                if(el) {
                    slotRefs.current[name as string] = el
                }
              }
            },slots[name as keyof typeof slots] || fallback || slot.fallback )
          );
      },
    [slotConfig, slots]
  );

  useEffect(() => {
    if (children) {
      const childSlots = {} as SlotProps<T>;
      
      if (Array.isArray(children)){
          for(const child of children) {
            if (child && typeof child === 'object' && 'type' in child && typeof child.type === 'object' && 'name' in child.type) {
              childSlots[child.type.name as keyof T] = child;
            }
          }
      } else {
        if (children && typeof children === 'object' && 'type' in children && typeof children.type === 'object' && 'name' in children.type) {
            childSlots[children.type.name as keyof T] = children;
          }
      }

      for (const key in childSlots) {
        slotRefs.current[key] = childSlots[key];
      }
    }
  }, [children]);

  return [SlotComponent, slots];
}

export { useLayout, defineSlots, argsAsNames };