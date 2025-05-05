import { useState, useCallback, useMemo } from 'react';

// Generic type for the state machine configuration
export interface StateMachineConfig<
  TState extends string,
  TEvent extends string,
  TContext = any,
> {
  initial: TState;
  context?: TContext;
  states: {
    [State in TState]: {
      on?: {
        [Event in TEvent]?:
          | {
              target: TState;
              actions?: Array<
                (
                  context: TContext,
                  eventPayload?: any
                ) => Partial<TContext> | void
              >;
              cond?: (context: TContext, eventPayload?: any) => boolean;
            }
          | TState; // Allow shorthand transition just specifying the target state
      };
      // Optional entry/exit actions for states
      entry?: Array<(context: TContext) => Partial<TContext> | void>;
      exit?: Array<(context: TContext) => Partial<TContext> | void>;
    };
  };
}

// Type for the returned state and controls
export interface StateMachineInstance<
  TState extends string,
  TEvent extends string,
  TContext = any,
> {
  /** The current state value (e.g., 'idle', 'loading', 'success'). */
  currentState: TState;
  /** The current context data associated with the state machine. */
  context: TContext;
  /** Function to send an event to the state machine to trigger transitions. */
  send: (event: TEvent | { type: TEvent; payload?: any }) => void;
  /** Function to check if the current state matches a given state value. */
  matches: (state: TState) => boolean;
}

/**
 * Manages complex state using an explicit finite state machine definition.
 * Inspired by libraries like XState.
 *
 * @param config The state machine configuration object.
 * @returns An object containing the current state, context, and a send function.
 */
export const useFiniteStateMachine = <
  TState extends string,
  TEvent extends string,
  TContext = any,
>(
  config: StateMachineConfig<TState, TEvent, TContext>
): StateMachineInstance<TState, TEvent, TContext> => {
  const [currentState, setCurrentState] = useState<TState>(config.initial);
  const [context, setContext] = useState<TContext>(
    config.context ?? ({} as TContext)
  );

  const send = useCallback(
    (eventInput: TEvent | { type: TEvent; payload?: any }) => {
      const eventType =
        typeof eventInput === 'string' ? eventInput : eventInput.type;
      const eventPayload =
        typeof eventInput === 'object' ? eventInput.payload : undefined;

      const currentStateConfig = config.states[currentState];
      if (!currentStateConfig?.on || !currentStateConfig.on[eventType]) {
        console.warn(
          `No transition defined for event '${eventType}' in state '${currentState}'`
        );
        return; // No transition defined for this event in the current state
      }

      const transitionConfig = currentStateConfig.on[eventType];

      let targetState: TState;
      let actions:
        | Array<
            (context: TContext, eventPayload?: any) => Partial<TContext> | void
          >
        | undefined;
      let condition:
        | ((context: TContext, eventPayload?: any) => boolean)
        | undefined;

      if (typeof transitionConfig === 'string') {
        // Shorthand transition
        targetState = transitionConfig as TState;
      } else {
        // Full transition object
        targetState = transitionConfig.target;
        actions = transitionConfig.actions;
        condition = transitionConfig.cond;
      }

      // Check condition if it exists
      if (condition && !condition(context, eventPayload)) {
        // console.log(`Condition not met for event '${eventType}' in state '${currentState}'`);
        return; // Condition not met, do not transition
      }

      // Execute actions and update context
      let nextContext = { ...context };
      if (actions) {
        actions.forEach((action) => {
          const contextUpdate = action(nextContext, eventPayload);
          if (contextUpdate) {
            nextContext = { ...nextContext, ...contextUpdate };
          }
        });
      }

      // Execute exit actions for the current state
      const currentExitActions = config.states[currentState]?.exit;
      if (currentExitActions) {
        currentExitActions.forEach((action) => {
          const contextUpdate = action(nextContext);
          if (contextUpdate) {
            nextContext = { ...nextContext, ...contextUpdate };
          }
        });
      }

      // Execute entry actions for the target state
      const targetEntryActions = config.states[targetState]?.entry;
      if (targetEntryActions) {
        targetEntryActions.forEach((action) => {
          const contextUpdate = action(nextContext);
          if (contextUpdate) {
            nextContext = { ...nextContext, ...contextUpdate };
          }
        });
      }

      // Update context state
      setContext(nextContext);
      // Update current state
      setCurrentState(targetState);
    },
    [currentState, context, config]
  );

  const matches = useCallback(
    (state: TState): boolean => {
      return currentState === state;
    },
    [currentState]
  );

  // Use useMemo to ensure the returned object reference is stable if state/context hasn't changed
  // This is a minor optimization for consumers memoizing based on the hook's return value
  const machineInstance = useMemo(
    () => ({
      currentState,
      context,
      send,
      matches,
    }),
    [currentState, context, send, matches]
  );

  return machineInstance;
};
