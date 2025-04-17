# `useCountdown`

Manages a countdown timer with start, pause, and reset controls.

## Usage

```tsx
import React, { useCallback } from \'react\';
import { useCountdown } from \'your-hooks-library\'; // Adjust the import path

const CountdownComponent: React.FC = () => {
  const handleComplete = useCallback(() => {
    alert(\'Countdown finished!\');
  }, []);

  const { remainingSeconds, isRunning, start, pause, reset } = useCountdown({
    seconds: 60, // Initial countdown time in seconds
    interval: 500, // Update interval in milliseconds (e.g., every half second)
    autoStart: false, // Don\'t start immediately
    onComplete: handleComplete, // Callback when timer reaches 0
  });

  return (
    <div>
      <h2>Countdown Timer</h2>
      <p>Time Remaining: {remainingSeconds.toFixed(1)} seconds</p>
      <p>Status: {isRunning ? \'Running\' : \'Paused/Stopped\'}</p>
      <div>
        {!isRunning ? (
          <button onClick={start} disabled={remainingSeconds <= 0}>
            Start / Resume
          </button>
        ) : (
          <button onClick={pause}>Pause</button>
        )}
        <button onClick={reset}>Reset (to 60s)</button>
      </div>
    </div>
  );
};

export default CountdownComponent;
```

## API

### `useCountdown(options: CountdownOptions): CountdownControls`

#### Parameters (`options` object)

- `seconds` (number, required): The initial number of seconds for the countdown.
- `interval` (number, optional): The interval in milliseconds at which the countdown updates. Defaults to `1000` (1 second).
- `onComplete` (() => void, optional): A callback function that is executed when the countdown reaches zero.
- `autoStart` (boolean, optional): If `true`, the countdown starts automatically when the component mounts. Defaults to `true`.

#### Returns (`CountdownControls` object)

- `remainingSeconds` (number): The current remaining seconds in the countdown. This value may have decimals if the interval is less than 1000ms.
- `isRunning` (boolean): A boolean indicating whether the countdown is currently active (`true`) or paused/stopped (`false`).
- `start` (() => void): A function to start the countdown if stopped, or resume it if paused.
- `pause` (() => void): A function to pause the currently running countdown.
- `reset` (() => void): A function to stop the countdown and reset the `remainingSeconds` back to the initial `seconds` value provided in the options. It also resets the `isRunning` state based on the initial `autoStart` option.

## Notes

- The hook uses `setInterval` internally.
- The interval is cleared automatically on component unmount or when the timer completes.
- If the `seconds` prop passed to the hook changes after the initial mount, the `remainingSeconds` state will update to the new value. The running state is not automatically reset or restarted in this case.
