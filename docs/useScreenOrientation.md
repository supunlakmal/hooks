# useScreenOrientation

A React hook to track the screen's orientation type and angle using the Screen Orientation API.

## Usage

```tsx
import { useScreenOrientation } from './hooks/useScreenOrientation'; // Adjust the import path

function OrientationInfo() {
  const { type, angle, isSupported } = useScreenOrientation();

  if (!isSupported) {
    return <p>Screen Orientation API not supported.</p>;
  }

  return (
    <div>
      <p>Orientation Type: {type}</p>
      <p>Orientation Angle: {angle}°</p>
    </div>
  );
}
```

## API

`useScreenOrientation(): ScreenOrientationState`

### Return Value (`ScreenOrientationState`)

- `type: OrientationType | null`: The current orientation type (e.g., `portrait-primary`, `landscape-secondary`). `null` if not supported or initially.
- `angle: number`: The current orientation angle (0, 90, 180, 270). `0` if not supported or initially.
- `isSupported: boolean`: Whether the Screen Orientation API is available in the current browser.
