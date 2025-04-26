import React from 'react';
import Link from 'next/link';

interface HookLink {
  name: string;
  path: string;
}

const hookLinks: HookLink[] = [
  { name: 'useAnimation', path: '/list/useAnimation' },
  { name: 'useAsync', path: '/list/useAsync' },
  { name: 'usePromise', path: '/list/usePromise' },
  { name: 'useBreakpoint', path: '/list/useBreakpoint' },
  { name: 'useBroadcastChannel', path: '/list/useBroadcastChannel' },
  { name: 'useCachedFetch', path: '/list/useCachedFetch' },
  { name: 'useClickOutside', path: '/list/useClickOutside' },
  { name: 'useClipboard', path: '/list/useClipboard' },
  { name: 'useCopyToClipboard', path: '/list/useCopyToClipboard' },
  { name: 'useContextMenu', path: '/list/useContextMenu' },
  { name: 'useCountdown', path: '/list/useCountdown' },
  { name: 'useDarkMode', path: '/list/useDarkMode' },
  { name: 'useDebounce', path: '/list/useDebounce' },
  { name: 'useDebouncedState', path: '/list/useDebouncedState' },
  { name: 'useDebouncedState', path: '/list/useDebouncedState' },
  { name: 'useThrottledState', path: '/list/useThrottledState' },
  { name: 'useDeepCompareEffect', path: '/list/useDeepCompareEffect' },
  { name: 'useDerivedState', path: '/list/useDerivedState' },
  { name: 'useDeviceMotion', path: '/list/useDeviceMotion' },
  { name: 'useFiniteStateMachine', path: '/list/useFiniteStateMachine' },
  { name: 'useFocusTrap', path: '/list/useFocusTrap' },
  { name: 'useForm', path: '/list/useForm' },
  { name: 'useFormValidation', path: '/list/useFormValidation' },
  { name: 'useFullscreen', path: '/list/useFullscreen' },
  { name: 'useGeolocation', path: '/list/useGeolocation' },
  { name: 'useGeolocationContinuous', path: '/list/useGeolocationContinuous' },
  { name: 'useHover', path: '/list/useHover' },
  { name: 'useIdleTimer', path: '/list/useIdleTimer' },
  { name: 'useInfiniteScroll', path: '/list/useInfiniteScroll' },
  { name: 'useIntersectionObserver', path: '/list/useIntersectionObserver' },
  { name: 'useInterval', path: '/list/useInterval' },
  { name: 'useIsFirstRender', path: '/list/useIsFirstRender' },
  { name: 'useIsMobile', path: '/list/useIsMobile' },
  { name: 'useKeyCombo', path: '/list/useKeyCombo' },
  { name: 'useKeyPress', path: '/list/useKeyPress' },
  { name: 'useLocalStorage', path: '/list/useLocalStorage' },
  { name: 'useLogger', path: '/list/useLogger' },
  { name: 'useLongPress', path: '/list/useLongPress' },
  { name: 'useMap', path: '/list/useMap' },
  { name: 'useMediaQuery', path: '/list/useMediaQuery' },
  { name: 'useMergeRefs', path: '/list/useMergeRefs' },
  { name: 'useMount', path: '/list/useMount' },
  { name: 'useMutation', path: '/list/useMutation' },
  { name: 'useNetworkSpeed', path: '/list/useNetworkSpeed' },
  { name: 'useOnlineStatus', path: '/list/useOnlineStatus' },
  { name: 'usePageVisibility', path: '/list/usePageVisibility' },
  { name: 'usePagination', path: '/list/usePagination' },
  { name: 'usePermission', path: '/list/usePermission' },
  { name: 'usePortal', path: '/list/usePortal' },
  { name: 'usePrevious', path: '/list/usePrevious' },
  { name: 'usePreviousDifferent', path: '/list/usePreviousDifferent' },
  { name: 'useQueryParam', path: '/list/useQueryParam' },
  { name: 'useReducerLogger', path: '/list/useReducerLogger' },
  { name: 'useRenderCount', path: '/list/useRenderCount' },
  { name: 'useResizeObserver', path: '/list/useResizeObserver' },
  { name: 'useRouteChange', path: '/list/useRouteChange' },
  { name: 'useRovingTabIndex', path: '/list/useRovingTabIndex' },
  { name: 'useScrollPosition', path: '/list/useScrollPosition' },
  { name: 'useScrollSpy', path: '/list/useScrollSpy' },
  { name: 'useScrollToTop', path: '/list/useScrollToTop' },
  { name: 'useSessionStorage', path: '/list/useSessionStorage' },
  { name: 'useSet', path: '/list/useSet' },
  { name: 'useStateWithHistory', path: '/list/useStateWithHistory' },
  { name: 'useStepper', path: '/list/useStepper' },
  { name: 'useSwipe', path: '/list/useSwipe' },
  { name: 'useSwipeable', path: '/list/useSwipeable' },
  { name: 'useThrottle', path: '/list/useThrottle' },
  { name: 'useTimeout', path: '/list/useTimeout' },
  { name: 'useToggle', path: '/list/useToggle' },
  { name: 'useTranslation', path: '/list/useTranslation' },
  { name: 'useUnmount', path: '/list/useUnmount' },
  { name: 'useUpdateEffect', path: '/list/useUpdateEffect' },
  { name: 'useVirtualList', path: '/list/useVirtualList' },
  { name: 'useVisibility', path: '/list/useVisibility' },
  { name: 'useWebSocket', path: '/list/useWebSocket' },
  { name: 'useWhyDidYouUpdate', path: '/list/useWhyDidYouUpdate' },
  { name: 'useWindowSize', path: '/list/useWindowSize' },
];

const HookListPage: React.FC = () => {
  return (
    <div>
      <h1>React Hook Demos</h1>
      <ul>
        {hookLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.path}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HookListPage;