# `useThrottledEventListener` Hook

## Description

`useThrottledEventListener` is a custom React hook that allows you to attach an event listener to an element and throttle the execution of the event handler. This is useful for performance optimization in situations where events fire rapidly, such as scrolling or resizing.

## Description

The `useThrottledEventListener` hook takes the event type, the event handler function, and an optional options object as arguments. The options object can include a `throttleTimeout` property to specify the minimum time interval between consecutive executions of the event handler. The hook automatically adds and removes the event listener when the component mounts and unmounts.