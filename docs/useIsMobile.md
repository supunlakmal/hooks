# useIsMobile

A React hook that detects whether the current viewport is mobile-sized based on a configurable breakpoint.

## Installation

This hook is included in the `@supunlakmal/hooks` package:

```bash
npm install @supunlakmal/hooks
# or
yarn add @supunlakmal/hooks
```

## Usage

```jsx
import { useIsMobile } from '@supunlakmal/hooks';

function MyComponent() {
  // Using the default breakpoint (768px)
  const isMobile = useIsMobile();

  // Or with a custom breakpoint
  // const isMobile = useIsMobile(480);

  return <div>{isMobile ? 'Mobile View' : 'Desktop View'}</div>;
}
```

## API

### `useIsMobile(breakpoint?: number): boolean`

Returns a boolean indicating whether the current viewport width is less than the specified breakpoint.

#### Parameters

| Name         | Type     | Default | Description                                       |
| ------------ | -------- | ------- | ------------------------------------------------- |
| `breakpoint` | `number` | `768`   | The breakpoint in pixels to determine mobile view |

#### Return Value

| Type      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `boolean` | `true` if viewport width is less than the breakpoint, otherwise `false` |

## Implementation Details

- Uses `window.matchMedia` to detect viewport size
- Sets up event listeners to respond to viewport changes in real-time
- Properly cleans up event listeners when the component unmounts
- Works in all modern browsers

## Example: Responsive Layout

```jsx
import React from 'react';
import { useIsMobile } from '@supunlakmal/hooks';

function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return (
    <div className={`layout ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}

      <main style={{ padding: isMobile ? '10px' : '20px' }}>
        {/* Content here */}
      </main>
    </div>
  );
}
```

## Example: Custom Breakpoints

```jsx
import React from 'react';
import { useIsMobile } from '@supunlakmal/hooks';

function ComplexResponsiveUI() {
  const isSmallMobile = useIsMobile(480);
  const isTablet = useIsMobile(1024);

  let deviceType = 'desktop';
  if (isSmallMobile) {
    deviceType = 'small-mobile';
  } else if (isTablet) {
    deviceType = 'tablet';
  }

  return (
    <div className={`ui ${deviceType}`}>Device detected: {deviceType}</div>
  );
}
```
