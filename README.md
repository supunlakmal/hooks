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

### [**`useAnimationFrame`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAnimationFrame.md)

Executes a callback function on each frame of the `requestAnimationFrame` loop.

---

### [**`useBatteryStatus`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBatteryStatus.md)

Provides real-time information about the device's battery status.

---

### [**`useBoolean`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBoolean.md)

Manages a boolean state with convenient toggle, setTrue, and setFalse functions.

---

### [**`useCachedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCachedFetch.md)

A `useFetch` variant with simple in-memory caching and TTL.

---

### [**`useClickOutsideWithEscape`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClickOutsideWithEscape.md)

Triggers a callback when clicking outside an element or pressing the Escape key.

---

### [**`useClipboardWithFeedback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClipboardWithFeedback.md)

Copies text to the clipboard and shows timed feedback on success.

---

### [**`useConst`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConst.md)

Initializes and returns a value that remains constant throughout the component's lifecycle.

---

### [**`useCookie`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCookie.md)

Provides an interface for reading, writing, and deleting cookies.

---

### [**`useCountdown`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCountdown.md)

Manages a countdown timer with start, pause, and reset controls.

---

### [**`useCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCounter.md)

A basic counter hook with increment, decrement, and reset functions.

---

### [**`useConditionalEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConditionalEffect.md)

A `useEffect` variant that allows you to conditionally run the effect based on a boolean flag.

---

### [**`useContextMenu`**](https://github.com/supunlakmal/hooks/blob/main/docs/useContextMenu.md)

Provides state and logic for implementing a custom context menu (right-click menu).

---

### [**`useCopyToClipboard`**](https://github.bal/hooks/blob/main/docs/useCopyToClipboard.md)

Provides a function to copy text to the clipboard and tracks status (uses fallback).

---

### [**`useControlledRerenderState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useControlledRerenderState.md)

A hook to force a component to re-render.

---

### [**`useCycle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCycle.md)

Cycles through a list of values with next/previous controls.

---

### [**`useDarkMode`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDarkMode.md)

Manages application theme preference (dark/light mode) with OS detection and local storage persistence.

---

### [**`useDebouncedCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedCallback.md)

Debounces a callback function, delaying its execution until a certain time has passed without changes.

---

### [**`useDebouncedEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedEffect.md)

A `useEffect` variant that debounces the effect callback.

---

### [**`useDebouncedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedFetch.md)

A `useFetch` variant that debounces the fetch call.

---

### [**`useDebouncedGeolocation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedGeolocation.md)

Tracks the user's geographic location using the Geolocation API, with debouncing.

---

### [**`useDebouncedMediaQuery`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedMediaQuery.md)

Debounces the result of a CSS media query.

---

### [**`useDebouncedWindowSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedWindowSize.md)

Provides window dimensions debounced by a specified delay.

---

### [**`useDefault`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDefault.md)

Provides a default value if the input value is `null` or `undefined`.

---

### [**`useDerivedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDerivedState.md)

Computes derived state based on other values, recomputing only when dependencies change (wraps `useMemo`).

---

### [**`useDeviceMotion`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceMotion.md)

Tracks device motion information (acceleration, rotation rate) via the `devicemotion` event.

---

### [**`useDeviceOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceOrientation.md)

Tracks the physical orientation of the device via the `deviceorientation` event.

---

### [**`useDocumentTitle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDocumentTitle.md)

Sets and manages the document title.

---

### [**`useDraggable`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDraggable.md)

Adds direct element draggability (positioning via transform) using pointer events, with bounds support.

---

### [**`useDrag`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDrag.md)

Provides basic HTML Drag and Drop API event handling (`dragstart`, `drag`, `dragend`) for an element.

---

### [**`useElementSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useElementSize.md)

Efficiently tracks the dimensions (width/height) of a DOM element using `ResizeObserver`.

---

### [**`useEnum`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEnum.md)

A hook to manage a state that cycles through values of an enum. (Description inferred - doc file was blank).

---

### [**`useErrorBoundary`**](https://github.com/supunlakmal/hooks/blob/main/docs/useErrorBoundary.md)

A hook to add error boundary to a component.

---

### [**`useEventCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventCallback.md)

Creates a stable function reference that always calls the latest version of a callback.

---

### [**`useEventListener`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventListener.md)

Robustly attaches event listeners to `window`, `document`, or elements, handling cleanup.

---

### [**`useEventSource`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventSource.md)

Manages a connection to a Server-Sent Events (SSE) endpoint.

---

### [**`useEyeDropper`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEyeDropper.md)

Utilizes the EyeDropper API to select colors from the screen.

---

### [**`useFavicon`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFavicon.md)

Dynamically sets the website's favicon.

---

### [**`useFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFetch.md)

A simple hook for fetching data, managing loading and error states.

---

### [**`useFiniteStateMachine`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFiniteStateMachine.md)

Manages complex component state using an explicit state machine definition.

---

### [**`useFirstMountState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFirstMountState.md)

Returns `true` if the component is rendering for the first time, `false` otherwise.

---

### [**`useFocusTrap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFocusTrap.md)

Traps keyboard focus within a specified container element when active (for modals, dialogs).

---

### [**`useFocusWithinState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFocusWithinState.md)

Determines if a specified element or any of its descendants currently have focus.

---

### [**`useForm`**](https://github.com/supunlakmal/hooks/blob/main/docs/useForm.md)

A basic hook for managing form state, input changes, and submission.

---

### [**`useFormValidation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFormValidation.md)

A comprehensive hook for form state, validation (change/blur/submit), and submission handling.

---

### [**`useForceUpdate`**](https://github.com/supunlakmal/hooks/blob/main/docs/useForceUpdate.md)

A hook to force a component to re-render.

---

### [**`useFullscreen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFullscreen.md)

Enters and exits fullscreen mode for an element, tracking the current state.

---

### [**`useFunctionalState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFunctionalState.md)

Functional state updates for React components. (Description inferred - doc file was blank).

---

### [**`useGeolocation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocation.md)

Tracks the user's geographic location using the Geolocation API.

---

### [**`useGeolocationContinuous`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocationContinuous.md)

Tracks the user's geographic location continuously using the Geolocation API.

---

### [**`useHasBeenVisible`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHasBeenVisible.md)

Determines if an element has ever been visible within the viewport.

---

### [**`useHistoryState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHistoryState.md)

Manages state with undo/redo history tracking.

---

### [**`useHookableRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHookableRef.md)

Create a ref that can be used in a hook. (Description inferred - doc file was blank).

---

### [**`useHover`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHover.md)

Tracks whether the mouse pointer is currently hovering over a specific DOM element.

---

### [**`useHoverDelay`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHoverDelay.md)

Tracks hover state with a minimum duration delay.

---

### [**`useIdleCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleCallback.md)

Schedules a function to be called during browser idle periods using `requestIdleCallback`.

---

### [**`useIdleDetection`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleDetection.md)

Monitors user idle state and screen lock status using the experimental Idle Detection API.

---

### [**`useIdleFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleFetch.md)

Initiates a data fetch after the user becomes active following a period of inactivity.

---

### [**`useIdleTimer`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleTimer.md)

Monitors user activity and triggers callbacks based on idle/active status.

---

### [**`useImageOnLoad`**](https://github.com/supunlakmal/hooks/blob/main/docs/useImageOnLoad.md)

Tracks the loading status and dimensions of an image element.

---

### [**`useInfiniteScroll`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInfiniteScroll.md)

Facilitates infinite scrolling using `IntersectionObserver` to trigger loading more data.

---

### [**`useIntersectionObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIntersectionObserver.md)

Monitors the intersection of a target element with the viewport or an ancestor.

---

### [**`useInterval`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInterval.md)

A declarative hook for setting intervals (`setInterval`) with automatic cleanup.

---

### [**`useIntervalWhen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIntervalWhen.md)

Sets up an interval that only runs when a specific condition is met.

---

### [**`useIsFirstRender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsFirstRender.md)

Returns `true` if the component is rendering for the first time, `false` otherwise.

---

### [**`useIsMobile`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsMobile.md)

Detects if the current viewport is mobile-sized based on a configurable breakpoint.

---

### [**`useIsMounted`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsMounted.md)

A hook that returns true if the component is mounted.

---

### [**`useIsomorphicId`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsomorphicId.md)

Generates unique IDs that are stable across server and client rendering environments.

---

### [**`useIsomorphicLayoutEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsomorphicLayoutEffect.md)

A `useLayoutEffect` variant that works on the server and the client.

---

### [**`useKeyCombo`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyCombo.md)

Detects specific keyboard combinations (shortcuts) being pressed.

---

### [**`useKeyPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyPress.md)

Detects whether a specific key is currently being pressed down.

---

### [**`useLifecycleLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLifecycleLogger.md)

A hook that logs the component's lifecycle events.

---

### [**`useList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useList.md)

A hook that provides functions to manipulate a list.

---

### [**`useListState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useListState.md)

Manages an array state with helper functions for common array operations.

---

### [**`useLocalStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorage.md)

Manages state persisted in `localStorage`, synchronizing across tabs.

---

### [**`useLocalStorageQueue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorageQueue.md)

Manages a queue of items persisted in local storage.

---

### [**`useLocalStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorageValue.md)

Get the value from local storage.

---

### [**`useLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLogger.md)

Development utility to log component lifecycle events and prop changes.

---

### [**`useLongPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLongPress.md)

Detects long press gestures (mouse or touch) on a target element.

---

### [**`useLocationBasedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocationBasedFetch.md)

A fetch variant that uses the user's location for the API endpoint.

---

### [**`useMap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMap.md)

Manages state in the form of a JavaScript `Map`, providing immutable update actions.

---

### [**`useMapState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMapState.md)

Manages an object or a Map-like state with helper functions to set, remove, and reset key-value pairs.

---

### [**`useMeasure`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMeasure.md)

Get the size of an element. (Description inferred - doc file was blank).

---

### [**`useMediaStream`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediaStream.md)

Simplifies requesting and managing access to the user's camera and/or microphone.

---

### [**`useMediatedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediatedState.md)

Manages a mediated state value.

---

### [**`useMediaQuery`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediaQuery.md)

Tracks the state of a CSS media query.

---

### [**`useMergeRefs`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMergeRefs.md)

Merges multiple React refs (callback or object refs) into a single callback ref.

---

### [**`useMount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMount.md)

Executes a callback function exactly once when the component mounts.

---

### [**`useMousePosition`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMousePosition.md)

Tracks the current position of the mouse pointer globally.

---

### [**`useMutation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMutation.md)

Simplifies handling asynchronous data modification operations (POST, PUT, DELETE), managing status.

---

### [**`useNetworkAwareFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkAwareFetch.md)

A `useFetch` variant that automatically refetches when the network status changes from offline to online.

---

### [**`useNetworkAwareWebSocket`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkAwareWebSocket.md)

A `useWebSocket` variant that automatically reconnects when the network status changes from offline to online.

---

### [**`useNetworkSpeed`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkSpeed.md)

Provides information about the user's network connection (speed, type) using the Network Information API.

---

### [**`useNetworkState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkState.md)

Tracks the network state.

---

### [**`useNewFullscreen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNewFullscreen.md)

Enters and exits fullscreen mode for an element, tracking the current state. (Description inferred - doc was same as useFullscreen)

---

### [**`useNotification`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNotification.md)

Utilizes the Notification API to display desktop notifications.

---

### [**`useOnlineStatus`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOnlineStatus.md)

Tracks the browser's online/offline connection status.

---

### [**`useOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOrientation.md)

Tracks the screen orientation (landscape or portrait).

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

### [**`usePermission`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePermission.md)

Queries the status of browser permissions (geolocation, notifications, etc.) using the Permissions API.

---

### [**`usePersistentCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePersistentCounter.md)

Manages a counter state that persists in local storage.

---

### [**`usePersistentToggle`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePersistentToggle.md)

Manages boolean state that persists in local storage.

---

### [**`usePinchZoom`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePinchZoom.md)

Detects and reacts to pinch-to-zoom gestures on a specified element.

---

### [**`usePortal`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePortal.md)

Simplifies the creation and management of React Portals.

---

### [**`usePrefersReducedMotion`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePrefersReducedMotion.md)

Tracks the user's preference for reduced motion using the `prefers-reduced-motion` media query.

---

### [**`usePreferredLanguages`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePreferredLanguages.md)

Returns an array of the user's preferred languages, as configured in their browser.

---

### [**`usePrevious`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePrevious.md)

Tracks the previous value of a state or prop from the last render.

---

### [**`usePreviousDifferent`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePreviousDifferent.md)

Tracks the previous different value of a state or prop from the last render.

---

### [**`usePromise`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePromise.md)

Simplifies handling promises, managing loading, error, and success states.

---

### [**`useQueue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useQueue.md)

Manages a stateful queue (First-In, First-Out).

---

### [**`useRafCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRafCallback.md)

Creates a callback based on requestAnimationFrame.

---

### [**`useRafState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRafState.md)

Manages state updates deferred to the next browser animation frame.

---

### [**`useReducerLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useReducerLogger.md)

Wraps `useReducer` to automatically log actions and state changes in development.

---

### [**`useRenderCount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRenderCount.md)

Tracks the number of times a component has rendered.

---

### [**`useRerender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRerender.md)

Force to re-render the component.

---

### [**`useResetState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useResetState.md)

Provides a state variable and a function to reset it to its initial value.

---

### [**`useResizeObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useResizeObserver.md)

Monitors changes to the dimensions of a target element using the `ResizeObserver` API.

---

### [**`useRouteChange`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRouteChange.md)

Executes a callback whenever the browser's URL path changes (handles `popstate` and `pushState`).

---

### [**`useRovingTabIndex`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRovingTabIndex.md)

Implements the roving tabindex accessibility pattern for keyboard navigation within a group.

---

### [**`useScreenOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScreenOrientation.md)

Tracks the screen orientation (angle, type) using the Screen Orientation API.

---

### [**`useScript`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScript.md)

Dynamically loads an external JavaScript script and tracks its loading status.

---

### [**`useScrollLock`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollLock.md)

Prevents scrolling on the `body` element.

---

### [**`useScrollPosition`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollPosition.md)

Tracks the current X and Y scroll position of the window or a specified element.

---

### [**`useScrollSpy`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollSpy.md)

Monitors scroll position to determine which section element is currently active in the viewport.

---

### [**`useScrollToTop`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollToTop.md)

Provides a function to programmatically scroll the window to the top.

---

### [**`useSessionStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSessionStorage.md)

Manages state persisted in `sessionStorage` for the duration of the session.

---

### [**`useSet`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSet.md)

Manages state in the form of a JavaScript `Set`, providing immutable update actions.

---

### [**`useSetState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSetState.md)

Manages object state allowing partial updates, similar to class component `setState`.

---

### [**`useStepper`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStepper.md)

A hook to use a basic step logic.

---

### [**`useStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStorageValue.md)

A hook to get the value from local or session storage.

---

### [**`useSwipe`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSwipe.md)

Detects swipe gestures (left, right, up, down) on touch-enabled devices for a specified element.

---

### [**`useSyncedLocalStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSyncedLocalStorage.md)

Manages state persisted in `localStorage` and synchronizes across tabs.

---

### [**`useSyncedRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSyncedRef.md)

Create a ref that syncs with another value.

---

### [**`useTextSelection`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTextSelection.md)

Tracks the text currently selected by the user within the document.

---

### [**`useThrottle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottle.md)

Throttles a value, delaying updates until a certain time has passed without changes.

---

### [**`useThrottledCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledCallback.md)

Throttles a callback, ensuring updates do not occur more frequently than a specified limit.

---

### [**`useThrottledEventListener`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledEventListener.md)

Attaches an event listener and throttles the callback execution.

---

### [**`useThrottledScroll`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledScroll.md)

Tracks the window's scroll position with throttled updates.

---

### [**`useThrottledState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledState.md)

Throttles a state, ensuring updates do not occur more frequently than a specified limit.

---

### [**`useTimeout`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTimeout.md)

A declarative hook for setting timeouts (`setTimeout`) with automatic cleanup.

---

### [**`useToggle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useToggle.md)

Manages boolean state with convenient toggle, setOn, and setOff functions.

---

### [**`useTranslation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTranslation.md)

A basic hook for handling internationalization (i18n) with static resources.

---

### [**`useUnmount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmount.md)

Executes a cleanup function exactly once when the component unmounts.

---

### [**`useUnmountEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmountEffect.md)

Executes a cleanup function when the component unmounts.

---

### [**`useUpdateEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUpdateEffect.md)

A `useEffect` variant that skips the effect execution after the initial render (mount).

---

### [**`useVibration`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVibration.md)

Utilizes the Vibration API to trigger device vibrations.

---

### [**`useVirtualList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVirtualList.md)

Performance optimization for rendering long lists by rendering only visible items (fixed height).

---

### [**`useVisibility`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVisibility.md)

Tracks whether a target element is currently visible within the viewport or an ancestor using `IntersectionObserver`.

---

### [**`useWakeLock`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWakeLock.md)

Manages the Screen Wake Lock API to prevent the screen from sleeping.

---

### [**`useWebSocket`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebSocket.md)

Manages WebSocket connections, state, messaging, and automatic reconnection.

---

### [**`useWebWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebWorker.md)

Runs a function in a Web Worker thread to offload heavy computations from the main thread.

---

### [**`useWhyDidYouUpdate`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWhyDidYouUpdate.md)

Development utility to debug component re-renders by logging changed props.

---

### [**`useWindowSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWindowSize.md)

Returns the current dimensions (width and height) of the browser window.

---

### [**`useWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWorker.md)

Offloads expensive computations or functions to a separate Web Worker thread (alternative to useWebWorker).

## Live Demo

A live demo environment showcasing all hooks will be available [**`here`**](https://hooks-showcase-chi.vercel.app/)
