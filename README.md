# @supunlakmal/hooks

[![NPM Version](https://img.shields.io/npm/v/@supunlakmal/hooks.svg)](https://www.npmjs.com/package/@supunlakmal/hooks)
[![License: ISC](https://img.shields.io/npm/l/@supunlakmal/hooks.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
![npm](https://img.shields.io/npm/dt/@supunlakmal/hooks?label=Total%20Downloads&color=brightgreen)
[![GitHub last commit](https://img.shields.io/github/last-commit/supunlakmal/hooks)](https://github.com/supunlakmal/hooks/commits/main)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@supunlakmal/hooks)](https://bundlephobia.com/package/@supunlakmal/hooks)
[![Install Size](https://packagephobia.com/badge?p=@supunlakmal/hooks)](https://packagephobia.com/result?p=@supunlakmal/hooks)

<!-- Add other badges as applicable: Downloads, Build Status, Coverage -->

**A comprehensive collection of production-ready, reusable React hooks written in TypeScript to simplify common UI patterns and browser API interactions.**

Stop reinventing the wheel! `@supunlakmal/hooks` provides a wide arrays, easy-to-use hooks covering everything from state management enhancements and side effects to browser APIs and performance optimizations.

**Why choose `@supunlakmal/hooks`?**

- **🚀 Extensive Collection:** Over 60+ hooks covering a vast range of common React development needs.
- **🛡️ Type-Safe:** Written entirely in TypeScript for robust development.
- **✨ Simple API:** Designed for ease of use and minimal boilerplate.
- **🌍 SSR Compatible:** Hooks are designed to work safely in server-side rendering environments.
- **🧹 Automatic Cleanup:** Handles listeners, timers, and observers correctly.
- **⚡ Performance Focused:** Includes hooks like `useDebounce`, `useThrottle`, and `useVirtualList` for optimization.
- **🧩 Minimal Dependencies:** Core hooks have zero runtime dependencies (unless specified in individual hook docs).

## Installation

```bash
npm install @supunlakmal/hooks
# or
yarn add @supunlakmal/hooks
```

## Quick Start Example

```jsx
import React, { useState } from 'react';
import { useToggle, useDebounce, useWindowSize } from '@supunlakmal/hooks';

function ExampleComponent() {
  // Effortlessly manage boolean state
  const [isOpen, toggle] = useToggle(false);

  // Debounce rapid input changes
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  // Get window dimensions easily
  const { width, height } = useWindowSize();

  // Use debounced value for API calls, etc.
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(`Searching for: ${debouncedSearchTerm}`);
      // Fetch API call here...
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      {/* useToggle Example */}
      <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <p>Content is visible!</p>}

      <hr />

      {/* useDebounce Example */}
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <p>Typing: {inputValue}</p>
      <p>Debounced: {debouncedSearchTerm}</p>

      <hr />

      {/* useWindowSize Example */}
      <p>
        Window Size: {width}px x {height}px
      </p>
    </div>
  );
}
```

## Available Hooks

Okay, here is a list of all the hooks found in the provided documentation, formatted as requested:

---

---

### [**`useVisibility`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVisibility.md)

Tracks whether a target element is currently visible within the browser viewport or a specified scrollable ancestor element.

---

### [**`useWebSocket`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebSocket.md)

React hook for managing WebSocket connections.

---

### [**`useWakeLock`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWakeLock.md)

Provides a simple way to utilize the Screen Wake Lock API within your React application.

---

### [**`useWhyDidYouUpdate`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWhyDidYouUpdate.md)

A simple hook that helps debug component re-renders by logging the props that changed since the last render.

---

### [**`useWebWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebWorker.md)

Simplifies running functions in a separate Web Worker thread.

---

### [**`useWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWorker.md)

Allows you to offload expensive computations or functions to a separate Web Worker thread.

---

### [**`useWindowSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWindowSize.md)

Returns the current dimensions (width and height) of the browser window.

---

### [**`useResizeObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useResizeObserver.md)

Monitors changes to the dimensions (content rect and border box) of a target DOM element using the `ResizeObserver` API.

---

### [**`useRovingTabIndex`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRovingTabIndex.md)

Implements the roving tabindex accessibility pattern, enabling keyboard navigation within a group of focusable elements contained within a specified element.

---

### [**`useResetState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useResetState.md)

Provides a state variable and a function to reset it to its initial value.

---

### [**`useScript`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScript.md)

Dynamically loads an external JavaScript script and tracks its loading status.

---

### [**`useScreenOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScreenOrientation.md)

Tracks the screen's orientation type and angle using the Screen Orientation API.

---

### [**`useScrollLock`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollLock.md)

Provides functions to prevent and allow scrolling on the `<body>` element of the page.

---

### [**`useScrollPosition`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollPosition.md)

Tracks the current X and Y scroll position of the browser window or a specified scrollable element.

---

### [**`useScrollSpy`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollSpy.md)

Monitors the scroll position of a container (or the window) and determines which target section element is currently considered "active".

---

### [**`useSessionStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSessionStorage.md)

Behaves like `useState` but persists the state in the browser's `sessionStorage`.

---

### [**`useRouteChange`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRouteChange.md)

Executes a callback function whenever the browser's URL path changes.

---

### [**`useSet`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSet.md)

Manages state in the form of a JavaScript `Set` object, providing utility functions for common set operations.

---

### [**`useSetState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSetState.md)

Provides a way to manage state in a component using an object, similar to the `setState` method in class components.

---

### [**`useSpeechSynthesis`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSpeechSynthesis.md)

Leverages the browser's Speech Synthesis API (Text-to-Speech).

---

### [**`useStateWithHistory`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStateWithHistory.md)

Manages state similarly to `useState`, but additionally keeps track of the state's history.

---

### [**`useStepper`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStepper.md)

Manages the state and navigation logic for multi-step processes.

---

### [**`useStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStorageValue.md)

Provides a convenient way to manage state that is persisted in either `localStorage` or `sessionStorage`.

---

### [**`useSwipe`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSwipe.md)

Detects swipe gestures (left, right, up, down) on touch-enabled devices for a specified element.

---

### [**`useSyncedLocalStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSyncedLocalStorage.md)

Provides a state management mechanism similar to `useState`, but with persistence in `localStorage` and synchronization across tabs.

---

### [**`useSyncedRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSyncedRef.md)

Provides a way to create a ref that automatically stays in sync with a given value.

---

### [**`useTextSelection`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTextSelection.md)

Tracks the text currently selected by the user within the document and provides details about the selection.

---

### [**`useThrottle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottle.md)

Throttles a value, ensuring that updates to the value do not occur more frequently than a specified time limit.

---

### [**`useThrottledEventListener`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledEventListener.md)

Allows you to attach an event listener to an element and throttle the execution of the event handler.

---

### [**`useThrottledCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledCallback.md)

Creates a debounced version of a callback function, limiting the rate at which it can be executed.

---

### [**`useThrottledScroll`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledScroll.md)

Tracks the window's horizontal (`scrollX`) and vertical (`scrollY`) scroll position, but throttles the state updates.

---

### [**`useThrottledState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledState.md)

Provides a way to throttle state updates, limiting the rate at which the state is updated based on input.

---

### [**`useTimeout`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTimeout.md)

A declarative hook for setting timeouts (`setTimeout`) in React components.

---

### [**`useScrollToTop`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollToTop.md)

Returns a function to programmatically scroll the window to the top of the page.

---

### [**`useToggle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useToggle.md)

Provides a simple way to manage boolean state with toggle functionality.

---

### [**`useNetworkSpeed`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkSpeed.md)

Provides information about the user's current network connection, such as effective speed and type.

---

### [**`useNetworkState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkState.md)

Provides information about the user's network connectivity status.

---

### [**`useNotification`****](https://github.com/supunlakmal/hooks/blob/main/docs/useNotification.md)

Provides an interface to interact with the browser's Web Notifications API.

---

### [**`useOnlineStatus`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOnlineStatus.md)

Tracks the browser's online/offline connection status.

---

### [**`useOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOrientation.md)

Tracks the device's screen orientation using the Screen Orientation API.

---

### [**`usePageLeave`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePageLeave.md)

Triggers a callback function when the user's mouse cursor leaves the main browser window or document area.

---

### [**`usePageVisibility`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePageVisibility.md)

Tracks the visibility state of the current browser tab/page using the Page Visibility API.

---

### [**`usePagination`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePagination.md)

Manages pagination logic for client-side data sets.

---

### [**`usePatch`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePatch.md)

A specialized version of `useFetch` for making PATCH requests.

---

### [**`usePersistentCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePersistentCounter.md)

Provides a counter state which automatically persists its value in the browser's local storage.

---

### [**`usePersistentToggle`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePersistentToggle.md)

Manages a boolean state that automatically persists its value in the browser's local storage.

---

### [**`usePermission`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePermission.md)

Queries the status of browser permissions using the Permissions API.

---

### [**`usePinchZoom`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePinchZoom.md)

Allows you to detect and react to pinch-to-zoom gestures on a specified HTML element.

---

### [**`usePortal`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePortal.md)

Simplifies the creation and management of React Portals.

---

### [**`usePost`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePost.md)

A specialized version of `useFetch` for making POST requests.

---

### [**`usePrefersReducedMotion`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePrefersReducedMotion.md)

Detects whether the user has requested the system minimize the amount of non-essential motion it uses.

---

### [**`usePreferredLanguages`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePreferredLanguages.md)

Returns an array of the user's preferred languages, as configured in their browser.

---

### [**`usePreviousDifferent`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePreviousDifferent.md)

Tracks the previous _different_ value of a state variable.

---

### [**`usePromise`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePromise.md)

Provides a way to manage the state of a Promise, making it easier to handle asynchronous operations.

---

### [**`usePut`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePut.md)

A specialized version of `useFetch` for making PUT requests.

---

### [**`useQueue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useQueue.md)

Manages a stateful queue (First-In, First-Out).

---

### [**`useQueryParam`**](https://github.com/supunlakmal/hooks/blob/main/docs/useQueryParam.md)

Synchronizes a React state variable with a URL query parameter.

---

### [**`useRafCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRafCallback.md)

Provides a way to schedule a callback function to be executed on the next animation frame using `requestAnimationFrame`.

---

### [**`usePrevious`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePrevious.md)

Tracks the previous value of a given state or prop from the last render.

---

### [**`useRafState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRafState.md)

A React hook behaving like `useState`, but deferring state updates to the next browser animation frame using `requestAnimationFrame`.

---

### [**`useReducerLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useReducerLogger.md)

A development utility hook that wraps React's built-in `useReducer` hook and adds automatic console logging for every action dispatched.

---

### [**`useIsFirstRender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsFirstRender.md)

Returns `true` if the component is rendering for the first time, and `false` for all subsequent renders.

---

### [**`useRenderCount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRenderCount.md)

Tracks the number of times a component has rendered.

---

### [**`useIsMobile`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsMobile.md)

A React hook that detects whether the current viewport is mobile-sized based on a configurable breakpoint.

---

### [**`useRerender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRerender.md)

Provides a function to force a component to re-render.

---

### [**`useIsMounted`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsMounted.md)

Provides a way to check if a component is currently mounted.

---

### [**`useIsomorphicId`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsomorphicId.md)

Generates unique IDs that are stable and consistent across server and client rendering environments.

---

### [**`useIsomorphicLayoutEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsomorphicLayoutEffect.md)

Uses `useLayoutEffect` on the client side and `useEffect` on the server side.

---

### [**`useKeyCombo`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyCombo.md)

Detects specific keyboard combinations (shortcuts) being pressed.

---

### [**`useLifecycleLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLifecycleLogger.md)

Logs the component's lifecycle events to the console, such as mount, update, and unmount.

---

### [**`useList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useList.md)

Provides a convenient way to manage a list of items with common operations like adding, removing, updating, and clearing.

---

### [**`useKeyPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyPress.md)

Detects whether a specific key on the keyboard is currently being pressed down.

---

### [**`useListState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useListState.md)

Provides a way to manage an array state with helper functions for common array operations.

---

### [**`useLocalStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorage.md)

Provides an easy way to use `localStorage` for state persistence across page refreshes and browser sessions.

---

### [**`useLocalStorageQueue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorageQueue.md)

Manages a stateful queue (First-In, First-Out) that is persisted in the browser's Local Storage.

---

### [**`useLocalStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorageValue.md)

Provides a convenient way to manage a value stored in the browser's local storage.

---

### [**`useLocationBasedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocationBasedFetch.md)

Provides a way to fetch data from an API endpoint based on the user's geographical location.

---

### [**`useLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLogger.md)

A development utility hook that logs component lifecycle events and optionally prop changes to the browser console.

---

### [**`useLongPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLongPress.md)

Detects long press gestures (holding down the mouse button or touch) on a target element.

---

### [**`useMap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMap.md)

Manages state in the form of a JavaScript `Map` object, providing utility functions for common map operations.

---

### [**`useMapState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMapState.md)

Provides a convenient way to manage an object or a Map-like state in React functional components.

---

### [**`useMeasure`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMeasure.md)

A brief paragraph explaining the purpose and functionality of the hook.

---

### [**`useMediaQuery`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediaQuery.md)

Tracks the state of a CSS media query, returning `true` if the query currently matches and `false` otherwise.

---

### [**`useMediaStream`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediaStream.md)

Simplifies the process of requesting and managing access to the user's camera and/or microphone using the `navigator.mediaDevices.getUserMedia` API.

---

### [**`useMediatedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediatedState.md)

Allows you to manage state that can be updated both internally and externally through a mediator function.

---

### [**`useMergeRefs`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMergeRefs.md)

Merges multiple React refs (either callback refs or object refs) into a single callback ref.

---

### [**`useMousePosition`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMousePosition.md)

Tracks the current position of the mouse pointer globally within the window.

---

### [**`useNetworkAwareFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkAwareFetch.md)

Intelligently performs data fetching using `useFetch` only when the user's browser is detected as being online.

---

### [**`useNetworkAwareWebSocket`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkAwareWebSocket.md)

Manages a WebSocket connection, ensuring it is active only when the user's browser is online and a valid URL is provided.

---

### [**`useMount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMount.md)

Executes a callback function exactly once when the component mounts.

---

### [**`useFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFetch.md)

A custom React hook for fetching data from an API endpoint.

---

### [**`useFiniteStateMachine`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFiniteStateMachine.md)

Manages complex component state using an explicit state machine definition.

---

### [**`useFirstMountState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFirstMountState.md)

Provides a boolean value indicating whether the component is being mounted for the first time.

---

### [**`useMutation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMutation.md)

Simplifies handling asynchronous operations that modify data (like API POST, PUT, DELETE requests).

---

### [**`useFocusWithinState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFocusWithinState.md)

Determines if a specified DOM element or any of its descendant elements currently have focus.

---

### [**`useFocusTrap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFocusTrap.md)

Manages keyboard focus, trapping it within a specified container element when active.

---

### [**`useForceUpdate`**](https://github.com/supunlakmal/hooks/blob/main/docs/useForceUpdate.md)

Provides a function to force a component to re-render.

---

### [**`useFormValidation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFormValidation.md)

A comprehensive hook for managing form state, validation (on change, blur, submit), and submission handling in React.

---

### [**`useFullscreen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFullscreen.md)

Provides functionality to enter and exit fullscreen mode for a specific HTML element.

---

### [**`useFunctionalState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFunctionalState.md)

A brief paragraph explaining the purpose and functionality of the hook.

---

### [**`useGeolocation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocation.md)

Tracks the user's current geographic location using the browser's Geolocation API.

---

### [**`useGeolocationContinuous`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocationContinuous.md)

Provides continuous geolocation updates, allowing you to track the user's location in real-time.

---

### [**`useGet`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGet.md)

A specialized version of `useFetch` for making GET requests.

---

### [**`useForm`**](https://github.com/supunlakmal/hooks/blob/main/docs/useForm.md)

A reusable hook for managing form state, handling input changes, and processing form submissions.

---

### [**`useHistoryState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHistoryState.md)

Provides a way to manage state with built-in undo/redo capabilities.

---

### [**`useHover`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHover.md)

Tracks whether the mouse pointer is currently hovering over a specific DOM element.

---

### [**`useHookableRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHookableRef.md)

A brief paragraph explaining the purpose and functionality of the hook.

---

### [**`useIdleCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleCallback.md)

Provides a convenient way to schedule a function to be called during a browser's idle periods.

---

### [**`useHoverDelay`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHoverDelay.md)

Tracks whether a user has hovered over a specific element for a minimum duration.

---

### [**`useIdleDetection`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleDetection.md)

Interacts with the experimental Idle Detection API to monitor the user's idle state and screen lock status.

---

### [**`useIdleFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleFetch.md)

Initiates a data fetch request using `useFetch` only _after_ the user becomes active following a specified period of inactivity.

---

### [**`useIdleTimer`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleTimer.md)

Monitors user activity within the browser window and triggers callbacks when the user becomes idle or active again.

---

### [**`useHasBeenVisible`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHasBeenVisible.md)

Determines if a referenced DOM element has ever been visible within the viewport at least once.

---

### [**`useImageOnLoad`**](https://github.com/supunlakmal/hooks/blob/main/docs/useImageOnLoad.md)

Tracks the loading status, potential errors, and natural dimensions of an image element.

---

### [**`useInfiniteScroll`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInfiniteScroll.md)

Facilitates the implementation of infinite scrolling by using the `IntersectionObserver` API.

---

### [**`useIntersectionObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIntersectionObserver.md)

Monitors the intersection of a target DOM element with an ancestor element or with the device's viewport.

---

### [**`useInterval`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInterval.md)

A declarative hook for setting intervals (`setInterval`) in React components.

---

### [**`useIntervalWhen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIntervalWhen.md)

Sets up an interval (`setInterval`) which only runs when a specific condition is met.

---

### [**`useDebounce`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebounce.md)

Debounces a value. This hook is useful when you want to delay the execution of a function or the update of a value.

---

### [**`useDebouncedEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedEffect.md)

Similar to `useEffect`, but delays the execution of the effect callback until dependencies have stopped changing for a specified time.

---

### [**`useDebouncedCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedCallback.md)

Creates a debounced version of a callback function, limiting the rate at which it can be executed.

---

### [**`useDebouncedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedFetch.md)

Wraps the Fetch API and debounces the requests.

---

### [**`useDebouncedGeolocation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedGeolocation.md)

Provides access to the device's geolocation information, but debounces the state updates.

---

### [**`useDarkMode`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDarkMode.md)

Manages application theme preference (dark/light mode).

---

### [**`useDebouncedMediaQuery`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedMediaQuery.md)

Determines if a CSS media query matches the current environment, but with a debounced result.

---

### [**`useDebouncedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedState.md)

Provides a way to debounce state updates, delaying the update until the user has stopped typing for a short period.

---

### [**`useDebouncedWindowSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedWindowSize.md)

Provides the current window dimensions, but updates the returned values only after a specified debounce delay.

---

### [**`useDeepCompareEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeepCompareEffect.md)

A drop-in replacement for `React.useEffect` that performs a **deep comparison** of its dependencies.

---

### [**`useDefault`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDefault.md)

Returns a default value if the provided value is `null` or `undefined`.

---

### [**`useDelete`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDelete.md)

A specialized version of `useFetch` for making DELETE requests.

---

### [**`useDerivedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDerivedState.md)

Computes derived state based on other values (like props or other state variables).

---

### [**`useDeviceMotion`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceMotion.md)

Provides access to the device's motion sensor data, allowing you to track acceleration and rotation rates.

---

### [**`useDeviceOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceOrientation.md)

Tracks the physical orientation of the hosting device relative to the Earth's coordinate frame.

---

### [**`useDocumentTitle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDocumentTitle.md)

Sets the document's title (`document.title`).

---

### [**`useDrag`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDrag.md)

Provides basic drag event handling for an element.

---

### [**`useDraggable`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDraggable.md)

Adds draggability to an HTML element using pointer events.

---

### [**`useElementSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useElementSize.md)

Efficiently tracks the dimensions (content width and height) of a specified DOM element using the `ResizeObserver` API.

---

### [**`useEnum`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEnum.md)

A brief paragraph explaining the purpose and functionality of the hook.

---

### [**`useErrorBoundary`**](https://github.com/supunlakmal/hooks/blob/main/docs/useErrorBoundary.md)

Provides state management and control functions for handling JavaScript errors within a component tree.

---

### [**`useEventCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventCallback.md)

Creates a stable function reference (memoized callback) that always delegates to the _latest_ version of the provided callback function.

---

### [**`useEventListener`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventListener.md)

A robust hook for declaratively adding event listeners to the `window`, `document`, a DOM element, or a React ref.

---

### [**`useEventSource`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventSource.md)

Establishes and manages a connection to a Server-Sent Events (SSE) endpoint using the `EventSource` API.

---

### [**`useEyeDropper`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEyeDropper.md)

Provides an interface to the experimental EyeDropper API, allowing users to sample colors from anywhere on their screen.

---

### [**`useFavicon`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFavicon.md)

Dynamically sets the website's favicon.

---

### [**`useAnimation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAnimation.md)

Manages a simple time-based animation loop using `requestAnimationFrame`.

---

### [**`useAnimationFrame`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAnimationFrame.md)

Takes a callback function as an argument, which will be executed on each frame of the `requestAnimationFrame` loop.

---

### [**`useAsync`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAsync.md)

Simplifies handling asynchronous operations (like API calls) in React components.

---

### [**`useAsyncAbortable`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAsyncAbortable.md)

Manages asynchronous operations, providing a way to execute an async function and abort it if needed.

---

### [**`useBatteryStatus`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBatteryStatus.md)

Provides real-time information about the device's battery status.

---

### [**`useBoolean`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBoolean.md)

Provides a convenient way to manage a boolean state with helper functions to toggle, set to true, and set to false.

---

### [**`useBreakpoint`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBreakpoint.md)

Determines the currently active responsive breakpoint based on window width.

---

### [**`useBroadcastChannel`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBroadcastChannel.md)

Enables cross-tab/window communication between same-origin contexts using the Broadcast Channel API.

---

### [**`useCachedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCachedFetch.md)

Similar to `useFetch` but with an added layer of simple in-memory caching.

---

### [**`useClickOutside`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClickOutside.md)

Executes a callback function when a click (or touch) event occurs outside of a specified DOM element.

---

### [**`useClickOutsideWithEscape`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClickOutsideWithEscape.md)

Triggers a callback function when the user either clicks outside of a specified DOM element or presses the 'Escape' key.

---

### [**`useClipboard`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClipboard.md)

Provides functionality to interact with the system clipboard using the modern asynchronous Clipboard API.

---

### [**`useClipboardWithFeedback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClipboardWithFeedback.md)

Wraps the `useClipboard` hook to provide visual feedback when text has been successfully copied to the clipboard.

---

### [**`useConditionalEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConditionalEffect.md)

Runs a side effect only when a specific condition is met.

---

### [**`useConst`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConst.md)

Initializes and returns a value that remains constant throughout the component's lifecycle.

---

### [**`useContextMenu`**](https://github.com/supunlakmal/hooks/blob/main/docs/useContextMenu.md)

Provides state and logic for implementing a custom context menu (right-click menu).

---

### [**`useControlledRerenderState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useControlledRerenderState.md)

Provides a mechanism to manually trigger re-renders of a component based on an external condition or state change.

---

### [**`useCookie`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCookie.md)

Provides a convenient interface for reading, writing, and deleting cookies.

---

### [**`useCopyToClipboard`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCopyToClipboard.md)

Provides a function to copy text to the user's clipboard and tracks the success or failure status.

---

### [**`useCountdown`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCountdown.md)

Manages a countdown timer with start, pause, and reset controls.

---

### [**`useCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCounter.md)

Manages a numerical counter, allowing for incrementing, decrementing, and resetting.

---

### [**`useCustomCompareEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCustomCompareEffect.md)

A drop-in replacement for `React.useEffect` that uses a custom comparison function for its dependencies.

---

### [**`useCustomCompareMemo`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCustomCompareMemo.md)

Works like `useMemo` but allows you to define a custom comparison function for its dependencies.

---

### [**`useCycle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCycle.md)

Allows you to cycle through a list of values.

---

### [**`use-mobile`**](https://github.com/supunlakmal/hooks/blob/main/docs/use-mobile.md)

Determines whether the current device is a mobile device based on screen width.

---

### [**`useTranslation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTranslation.md)

A basic hook for handling internationalization (i18n).

---

### [**`useUnmountEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmountEffect.md)

Runs its effect function only once, specifically when the component unmounts.

---

### [**`useUnmount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmount.md)

Executes a cleanup function when the component unmounts.

---

### [**`useUpdateEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUpdateEffect.md)

Functions similarly to `useEffect`, but skips running the effect callback after the initial render.

---

### [**`useVibration`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVibration.md)

Interacts with the browser's Vibration API.

---

### [**`useVirtualList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVirtualList.md)

A performance optimization hook for rendering long lists by only rendering visible items.

## Live Demo

A live demo environment showcasing all hooks will be available [**`here`**](https://hooks-showcase-chi.vercel.app/)
