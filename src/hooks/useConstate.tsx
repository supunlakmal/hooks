import React, { createContext, useContext, FC, PropsWithChildren, Context, ReactElement } from "react";

// constate(useCounter, value => value.count)
//                      ^^^^^^^^^^^^^^^^^^^^\
type Selector<Value> = (value: Value) => any;

// const [Provider, useCount, useIncrement] = constate(...)\
//                  ^^^^^^^^^^^^^^^^^^^^^^\
type SelectorHooks<Selectors extends Selector<any>[]> = {
  [K in keyof Selectors]: () => Selectors[K] extends (...args: any) => infer R
    ? R
    : never;
};

// const [Provider, useCounterContext] = constate(...)\
// or               ^^^^^^^^^^^^^^^^^\
// const [Provider, useCount, useIncrement] = constate(...)\
//                  ^^^^^^^^^^^^^^^^^^^^^^\
type Hooks<
  Value,
  Selectors extends Selector<Value>[]
> = Selectors["length"] extends 0 ? [() => Value] : SelectorHooks<Selectors>;

// const [Provider, useContextValue] = constate(useValue)\
//       ^^^^^^^^^^^^^^^^^^^^^^^^^^^\
type ConstateTuple<Props, Value, Selectors extends Selector<Value>[]> = [
  FC<PropsWithChildren<Props>>,
  ...Hooks<Value, Selectors>
];

const isDev = process.env.NODE_ENV !== "production";

const NO_PROVIDER = {};

function createUseContextHook<T>(context: Context<T>): () => T {
  return () => {
    const value = useContext(context);
    if (isDev && value === NO_PROVIDER) {
      const warnMessage = context.displayName
        ? `The context consumer of ${context.displayName} must be wrapped with its corresponding Provider`
        : "Component must be wrapped with Provider.";
      // eslint-disable-next-line no-console
      console.warn(warnMessage);
    }
    return value;
  };
}

function constate<Props, Value, Selectors extends Selector<Value>[]>(
  useValue: (props: Props) => Value,
  ...selectors: Selectors
): ConstateTuple<Props, Value, Selectors> {
  const contexts: Context<any>[] = [];
  const hooks = ([] as unknown) as Hooks<Value, Selectors>;

  const createContextForSelector = (selector?: Selector<Value>) => {
    const context = createContext<any>(NO_PROVIDER);
    if (isDev && selector?.name) {
      context.displayName = selector.name;
    }
    contexts.push(context);
    hooks.push(createUseContextHook(context) as any); // Type assertion needed here due to complex conditional type
  };

  if (selectors.length > 0) {
    selectors.forEach((selector) => createContextForSelector(selector));
  } else {
    createContextForSelector(); // Create a context for the main value if no selectors are provided
  }

  const Provider: FC<PropsWithChildren<Props>> = ({
    children,
    ...props
  }) => {
    const value = useValue(props as Props);
    let element: ReactElement | string | number | React.Fragment = children as any;

    for (let i = 0; i < contexts.length; i += 1) {
      const context = contexts[i];
      const selector = selectors[i] || ((v: Value) => v);
      element = (
        <context.Provider value={selector(value)}>{element}</context.Provider>
      );
    }
    return element as ReactElement;
  };

  if (isDev && useValue.name) {
    Provider.displayName = "ConstateProvider";
  }

  return [Provider, ...hooks];
}

export default constate;