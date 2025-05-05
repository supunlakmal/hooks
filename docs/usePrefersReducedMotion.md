# usePrefersReducedMotion

The `usePrefersReducedMotion` hook detects whether the user has requested the system minimize the amount of non-essential motion it uses, based on the CSS `prefers-reduced-motion` media query.

## Usage

```jsx
import React from 'react';
import { usePrefersReducedMotion } from '@supunlakmal/hooks'; // Assuming installation

function MotionComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div>
      <h2>usePrefersReducedMotion Example</h2>
      <p>
        User prefers reduced motion:{' '}
        <strong>{prefersReducedMotion ? 'Yes' : 'No'}</strong>
      </p>
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'lightblue',
          transition: prefersReducedMotion
            ? 'none'
            : 'transform 0.5s ease-in-out',
          // Apply animation conditionally
          animation: prefersReducedMotion ? 'none' : 'spin 2s linear infinite',
          marginTop: '20px',
        }}
      >
        {prefersReducedMotion ? 'Motion Reduced' : 'Animated Box'}
      </div>

      {/* Add CSS for animation if not reduced */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default MotionComponent;
```

## API

### Parameters

None.

### Return Value

- `prefersReducedMotion`: `boolean`
  - Returns `true` if the user has enabled the 'reduce motion' preference in their system settings, `false` otherwise.
  - The hook attempts to determine the initial value synchronously and then listens for changes.

## Behavior

- The hook uses `window.matchMedia('(prefers-reduced-motion: reduce)')` to detect the user's preference.
- It initializes the state based on the current media query match.
- It adds a listener to the media query list to update the state if the user's preference changes while the component is mounted.
- The listener is automatically removed on component unmount.
- Includes basic SSR/browser environment checks. In non-browser environments, it defaults to `false`.
