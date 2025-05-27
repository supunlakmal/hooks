"use client";

import { useCountdown } from '@/hooks/useCountdown'; 
import { useState } from 'react';

const UseCountdownPage = () => {
  const [initialSeconds, setInitialSeconds] = useState(60);
  // Removed countdownKey state

  // The useCountdown hook
  const { remainingSeconds, isRunning, start, pause, reset } = useCountdown({
    // Removed key: countdownKey
    seconds: initialSeconds,
    autoStart: false, // Don't start immediately
    onComplete: () => {
      alert('Countdown complete!');
    },
  });

  const handleSetNewTime = () => {
    const newTime = parseInt(prompt('Enter new countdown seconds:', String(initialSeconds)) || String(initialSeconds), 10);
    if (!isNaN(newTime) && newTime > 0) {
      setInitialSeconds(newTime); 
      // The hook will now re-initialize internally due to the `seconds` prop changing
    } else {
      alert('Invalid number of seconds.');
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>useCountdown Hook Example</h1>
      <p>This page demonstrates a countdown timer with start, pause, and reset controls.</p>

      <div style={{ marginTop: '20px', fontSize: '2em', fontWeight: 'bold' }}>
        Time Remaining: {remainingSeconds}s
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={start} disabled={isRunning || remainingSeconds === 0} style={{ marginRight: '10px' }}>
          Start
        </button>
        <button onClick={pause} disabled={!isRunning} style={{ marginRight: '10px' }}>
          Pause
        </button>
        <button onClick={reset} style={{ marginRight: '10px' }}>
          Reset (to {initialSeconds}s)
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
         <button onClick={handleSetNewTime} style={{ marginRight: '10px' }}>
          Set New Countdown Time
        </button>
      </div>

      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        Current Status: {isRunning ? 'Running' : (remainingSeconds === 0 && initialSeconds > 0 && !isRunning) ? 'Completed' : 'Paused/Idle'}
      </p>
      <p style={{ marginTop: '5px', fontSize: '0.9em', color: 'gray' }}>
        If you set a new time, the timer will reset with that new duration.
        An alert will show when the countdown completes.
      </p>
    </div>
  );
};

export default UseCountdownPage;
