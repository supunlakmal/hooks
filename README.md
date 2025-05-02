# @supunlakmal/hooks

[![NPM Version](https://img.shields.io/npm/v/@supunlakmal/hooks.svg)](https://www.npmjs.com/package/@supunlakmal/hooks)
[![License: ISC](https://img.shields.io/npm/l/@supunlakmal/hooks.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

<!-- Add other badges as applicable: Downloads, Build Status, Coverage -->

**A comprehensive collection of production-ready, reusable React hooks written in TypeScript to simplify common UI patterns and browser API interactions.**

Stop reinventing the wheel! `@supunlakmal/hooks` provides a wide array of well-tested, easy-to-use hooks covering everything from state management enhancements and side effects to browser APIs and performance optimizations.

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
import React, { useState } from "react";
import { useToggle, useDebounce, useWindowSize } from "@supunlakmal/hooks";

function ExampleComponent() {
  // Effortlessly manage boolean state
  const [isOpen, toggle] = useToggle(false);

  // Debounce rapid input changes
  const [inputValue, setInputValue] = useState("");
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
      <button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>
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

Explore the documentation for each hook to see detailed API information and usage examples:

| Hook                                                                                                       | Description                                                                                                           |
| :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| [**`useAnimation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAnimation.md)                       | Manages a simple time-based animation loop using `requestAnimationFrame`.                                             |
| [**`useAsync`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAsync.md)                               | Simplifies handling asynchronous operations (like API calls), managing loading, error, and success states.            |
| [**`useAsyncAbortable`**](https://github.com/supunlakmal/hooks/blob/main/docs/useAsyncAbortable.md)             | Simplifies handling asynchronous operations that can be aborted.            |
| [**`useBreakpoint`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBreakpoint.md)                     | Determines the currently active responsive breakpoint based on window width.                                          |
| [**`useBroadcastChannel`**](https://github.com/supunlakmal/hooks/blob/main/docs/useBroadcastChannel.md)         | Enables cross-tab/window communication using the Broadcast Channel API.                                               |
| [**`useCachedFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCachedFetch.md)                   | A `useFetch` variant with simple in-memory caching and TTL.                                                           |
| [**`useClickOutside`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClickOutside.md)                 | Executes a callback when a click/touch event occurs outside of a specified DOM element.                               |
| [**`useClipboard`**](https://github.com/supunlakmal/hooks/blob/main/docs/useClipboard.md)                       | Provides functionality to interact with the system clipboard (copy/paste).                                            |
| [**`useContextMenu`**](https://github.com/supunlakmal/hooks/blob/main/docs/useContextMenu.md)                   | Provides state and logic for implementing a custom context menu (right-click menu).                                   |
| [**`useCopyToClipboard`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCopyToClipboard.md)           | Provides a function to copy text to the clipboard and tracks status (uses fallback).                                  |
| [**`useControlledRerenderState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useControlledRerenderState.md)    | A hook to force a component to re-render                                             |
| [**`useCountdown`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCountdown.md)                       | Manages a countdown timer with start, pause, and reset controls.                                                      |
| [**`useCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCounter.md)                           | A basic counter hook                                           |
| [**`useConditionalEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConditionalEffect.md)    | A `useEffect` variant that allows you to conditionally run the effect.                                             |
| [**`useDarkMode`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDarkMode.md)                         | Manages application theme preference (dark/light mode) with OS detection and local storage persistence.               |
| [**`useDebouncedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedState.md)             | Debounces a state, delaying updates until a certain time has passed without changes.                                  |
| [**`useDebounce`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebounce.md)                         | Debounces a value, delaying updates until a certain time has passed without changes.                                  |
| [**`useDeepCompareEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeepCompareEffect.md)       | A `useEffect` variant that performs a deep comparison of dependencies.                                                |
| [**`useDebouncedCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedCallback.md) | Debounces a callback function, delaying its execution until a certain time has passed without changes.                                                |
| [**`useDebouncedEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDebouncedEffect.md)       |  A `useEffect` variant that debounces the effect callback.                                             |
| [**`useDerivedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDerivedState.md)                 | Computes derived state based on other values, recomputing only when dependencies change (wraps `useMemo`).            |
| [**`useDeviceMotion`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceMotion.md)                 | Tracks device motion information (acceleration, rotation rate) via the `devicemotion` event.                          |
| [**`useDeviceOrientation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDeviceOrientation.md)       | Tracks the physical orientation of the device via the `deviceorientation` event.                                      |
| [**`useDrag`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDrag.md)                                 | Provides basic HTML Drag and Drop API event handling (`dragstart`, `drag`, `dragend`) for an element.                 |
| [**`useConditionalEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useConditionalEffect.md)    | A `useEffect` variant that allows you to conditionally run the effect.                                             |
| [**`useCounter`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCounter.md)                           | A basic counter hook                                           |
| [**`useGeolocationContinuous`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocationContinuous.md) | Tracks the user's geographic location continuously using the Geolocation API.                                                      |
| [**`useErrorBoundary`**](https://github.com/supunlakmal/hooks/blob/main/docs/useErrorBoundary.md)    | A hook to add error boundary to a component                                            |
| [**`useMobile`**](https://github.com/supunlakmal/hooks/blob/main/docs/use-mobile.md)    | Detects if the current viewport is mobile-sized based on a configurable breakpoint                                             |
| [**`useNewFullscreen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNewFullscreen.md)    | Enters and exits fullscreen mode for an element, tracking the current state.                                            |
| [**`useDraggable`**](https://github.com/supunlakmal/hooks/blob/main/docs/useDraggable.md)                       | Adds direct element draggability (positioning via transform) using pointer events, with bounds support.               |
| [**`useElementSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useElementSize.md)                   | Efficiently tracks the dimensions (width/height) of a DOM element using `ResizeObserver`.                             |
| [**`useFirstMountState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFirstMountState.md)               | Returns `true` if the component is rendering for the first time, `false` otherwise.                                   |
| [**`useEventListener`**](https://github.com/supunlakmal/hooks/blob/main/docs/useEventListener.md)               | Robustly attaches event listeners to `window`, `document`, or elements, handling cleanup.                             |
| [**`useFetch`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFetch.md)                               | A simple hook for fetching data, managing loading and error states.                                                   |
| [**`useFiniteStateMachine`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFiniteStateMachine.md)     | Manages complex component state using an explicit state machine definition.                                           |
| [**`useFocusTrap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFocusTrap.md)                       | Traps keyboard focus within a specified container element when active (for modals, dialogs).                          |
| [**`useForm`**](https://github.com/supunlakmal/hooks/blob/main/docs/useForm.md)                                 | A basic hook for managing form state, input changes, and submission.                                                  |
| [**`useFormValidation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFormValidation.md)             | A comprehensive hook for form state, validation (change/blur/submit), and submission handling.                        |
| [**`useFullscreen`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFullscreen.md)                     | Enters and exits fullscreen mode for an element, tracking the current state.                                          |
| [**`useGeolocation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useGeolocation.md)                   | Tracks the user's geographic location using the Geolocation API.                                                      |
| [**`useHover`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHover.md)                               | Tracks whether the mouse pointer is currently hovering over a specific DOM element.                                   |
| [**`useFunctionalState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useFunctionalState.md) | Functional state updates for React components.                                                    |
| [**`useHookableRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useHookableRef.md)  | Create a ref that can be used in a hook.                                                   |
| [**`useIsMounted`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsMounted.md)  | A hook that returns true if the component is mounted.                                                  |
| [**`useIsomorphicLayoutEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsomorphicLayoutEffect.md)|  A `useLayoutEffect` variant that works on the server and the client.                                               |
| [**`useLifecycleLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLifecycleLogger.md)  | A hook that logs the component's lifecycle events.                                             |
| [**`useList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useList.md)                                 |  A hook that provides functions to manipulate a list.                                                 |
| [**`useLocalStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorageValue.md)      |  Get the value from local storage.                                                |
| [**`useMeasure`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMeasure.md) | Get the size of an element                                                    |
| [**`useMediatedState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediatedState.md)     | Manages a mediated state value.                                                    |
| [**`useCustomCompareEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCustomCompareEffect.md)    | A `useEffect` variant that allow to provide custom compore logic                                             |
| [**`useCustomCompareMemo`**](https://github.com/supunlakmal/hooks/blob/main/docs/useCustomCompareMemo.md)    | A `useMemo` variant that allow to provide custom compore logic                                            |
| [**`usePreviousDifferent`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePreviousDifferent.md)         | Tracks the previous different value of a state or prop from the last render.                                                    |
| [**`useInfiniteScroll`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInfiniteScroll.md)             | Facilitates infinite scrolling using `IntersectionObserver` to trigger loading more data.                             |
| [**`useIntersectionObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIntersectionObserver.md) | Monitors the intersection of a target element with the viewport or an ancestor.                                       |
| [**`useInterval`**](https://github.com/supunlakmal/hooks/blob/main/docs/useInterval.md)                         | A declarative hook for setting intervals (`setInterval`) with automatic cleanup.                                      |
| [**`useIsFirstRender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIsFirstRender.md)               | Returns `true` if the component is rendering for the first time, `false` otherwise.                                   |
| [**`useKeyCombo`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyCombo.md)                         | Detects specific keyboard combinations (shortcuts) being pressed.                                                    |
| [**`useKeyPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useKeyPress.md)                         | Detects whether a specific key is currently being pressed down.                                                       |
| [**`useLocalStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLocalStorage.md)                 | Manages state persisted in `localStorage`, synchronizing across tabs.                                                 |
| [**`useLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLogger.md)                             | Development utility to log component lifecycle events and prop changes.                                               |
| [**`useLongPress`**](https://github.com/supunlakmal/hooks/blob/main/docs/useLongPress.md)                       | Detects long press gestures (mouse or touch) on a target element.                                                     |
| [**`useMap`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMap.md)                                   | Manages state in the form of a JavaScript `Map`, providing immutable update actions.                                  |
| [**`useMediaQuery`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMediaQuery.md)                     | Tracks the state of a CSS media query (e.g., viewport size, orientation, color scheme).                               |
| [**`useNetworkState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkState.md) | Tracks the network state.                                                    |
| [**`useMergeRefs`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMergeRefs.md)                       | Merges multiple React refs (callback or object refs) into a single callback ref.                                      |
| [**`useMount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMount.md)                               | Executes a callback function exactly once when the component mounts.                                                  |
| [**`useMutation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useMutation.md)                         | Simplifies handling asynchronous data modification operations (POST, PUT, DELETE), managing status.                   |
| [**`useNetworkSpeed`**](https://github.com/supunlakmal/hooks/blob/main/docs/useNetworkSpeed.md)                 | Provides information about the user's network connection (speed, type) using the Network Information API.             |
| [**`usePromise`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePromise.md)                             | Simplifies handling promises, managing loading, error, and success states.            |
| [**`useOnlineStatus`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOnlineStatus.md)                 | Tracks the browser's online/offline connection status.                                                                |
| [**`usePageVisibility`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePageVisibility.md)             | Tracks the visibility state of the current browser tab/page using the Page Visibility API.                            |
| [**`useOldUpdateEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useOldUpdateEffect.md)                 | A `useEffect` variant that skips the effect execution after the initial render (mount).                               |
| [**`usePagination`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePagination.md)                     | Manages pagination logic for client-side data sets.                                                                   |
| [**`usePermission`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePermission.md)                     | Queries the status of browser permissions (geolocation, notifications, etc.) using the Permissions API.               |
| [**`usePortal`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePortal.md)                             | Simplifies the creation and management of React Portals.                                                              |
| [**`usePrevious`**](https://github.com/supunlakmal/hooks/blob/main/docs/usePrevious.md)                         | Tracks the previous value of a state or prop from the last render.                                                    |
| [**`useQueryParam`**](https://github.com/supunlakmal/hooks/blob/main/docs/useQueryParam.md)                     | Synchronizes a React state variable with a URL query parameter.                                                       |
| [**`useReducerLogger`**](https://github.com/supunlakmal/hooks/blob/main/docs/useReducerLogger.md)               | Wraps `useReducer` to automatically log actions and state changes in development.                                     |
| [**`useRenderCount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRenderCount.md)                   | Tracks the number of times a component has rendered.                                                                  |
| [**`useRafCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRafCallback.md)                   |  Creates a callback based on requestAnimationFrame.                                                  |
| [**`useResizeObserver`**](https://github.com/supunlakmal/hooks/blob/main/docs/useResizeObserver.md)             | Monitors changes to the dimensions of a target element using the `ResizeObserver` API.                                |
| [**`useRouteChange`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRouteChange.md)                   | Executes a callback whenever the browser's URL path changes (handles `popstate` and `pushState`).                     |
| [**`useRovingTabIndex`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRovingTabIndex.md)             | Implements the roving tabindex accessibility pattern for keyboard navigation within a group.                          |
| [**`useScrollPosition`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollPosition.md)             | Tracks the current X and Y scroll position of the window or a specified element.                                      |
| [**`useScrollSpy`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollSpy.md)                       | Monitors scroll position to determine which section element is currently active in the viewport.                      |
| [**`useScrollToTop`**](https://github.com/supunlakmal/hooks/blob/main/docs/useScrollToTop.md)                   | Provides a function to programmatically scroll the window to the top.                                                 |
| [**`useSessionStorage`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSessionStorage.md)             | Manages state persisted in `sessionStorage` for the duration of the session.                                          |
| [**`useSet`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSet.md)                                   | Manages state in the form of a JavaScript `Set`, providing immutable update actions.                                  |
| [**`useStateWithHistory`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStateWithHistory.md)         | Manages state with undo/redo history tracking.                                                                        |
| [**`useRerender`**](https://github.com/supunlakmal/hooks/blob/main/docs/useRerender.md)      |  Force to re-render the component.                                                   |
| [**`useSwipe`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSwipe.md)                               | Detects swipe gestures (left, right, up, down) on touch-enabled devices for a specified element.                      |
| [**`useThrottle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottle.md)                         | Throttles a value, ensuring updates do not occur more frequently than a specified limit.                              |
| [**`useStepper`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStepper.md)    | A hook to use a basic step logic.                                          |
| [**`useStorageValue`**](https://github.com/supunlakmal/hooks/blob/main/docs/useStorageValue.md)    | A hook to get the value from local or session storage.                                           |
| [**`useThrottledState`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledState.md)             | Throttles a state, ensuring updates do not occur more frequently than a specified limit.                              |
| [**`useThrottledCallback`**](https://github.com/supunlakmal/hooks/blob/main/docs/useThrottledCallback.md)             | Throttles a callback, ensuring updates do not occur more frequently than a specified limit.                              |
| [**`useTimeout`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTimeout.md)                           | A declarative hook for setting timeouts (`setTimeout`) with automatic cleanup.                                        |
| [**`useToggle`**](https://github.com/supunlakmal/hooks/blob/main/docs/useToggle.md)                             | Manages boolean state with convenient toggle, setOn, and setOff functions.                                            |
| [**`useTranslation`**](https://github.com/supunlakmal/hooks/blob/main/docs/useTranslation.md)                   | A basic hook for handling internationalization (i18n) with static resources.                                          |
| [**`useUnmount`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmount.md)                           | Executes a cleanup function exactly once when the component unmounts.                                                 |
| [**`useUpdateEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUpdateEffect.md)                 | A `useEffect` variant that skips the effect execution after the initial render (mount).                               |
| [**`useVirtualList`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVirtualList.md)                   | Performance optimization for rendering long lists by rendering only visible items (fixed height).                     |
| [**`useSyncedRef`**](https://github.com/supunlakmal/hooks/blob/main/docs/useSyncedRef.md) | Create a ref that syncs with another value                                                    |
| [**`useUnmountEffect`**](https://github.com/supunlakmal/hooks/blob/main/docs/useUnmountEffect.md)                           | Executes a cleanup function when the component unmounts.                                                 |
| [**`useVisibility`**](https://github.com/supunlakmal/hooks/blob/main/docs/useVisibility.md)                     | Tracks whether a target element is currently visible within the viewport or an ancestor using `IntersectionObserver`. |
| [**`useWebSocket`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebSocket.md)                       | Manages WebSocket connections, state, messaging, and automatic reconnection.                                          |
| [**`useWindowSize`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWindowSize.md)                     | Returns the current dimensions (width and height) of the browser window.                                              |
| [**`useWhyDidYouUpdate`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWhyDidYouUpdate.md)           | Development utility to debug component re-renders by logging changed props.

| [**`useIdleTimer`**](https://github.com/supunlakmal/hooks/blob/main/docs/useIdleTimer.md)               | Monitors user activity and triggers callbacks based on idle/active status.                                            |
| [**`useWakeLock`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWakeLock.md)                 | Manages the Screen Wake Lock API to prevent the screen from sleeping.                                                |
| [**`useWebWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWebWorker.md)               | Runs a function in a Web Worker thread to offload heavy computations from the main thread.                          |
| [**`useWorker`**](https://github.com/supunlakmal/hooks/blob/main/docs/useWorker.md)                     | Offloads expensive computations or functions to a separate Web Worker thread (alternative to useWebWorker).        |                                           |

## Live Demo

**(Coming Soon!)** A live demo environment showcasing all hooks will be available [**`here`**](https://hooks-showcase-chi.vercel.app/) 
