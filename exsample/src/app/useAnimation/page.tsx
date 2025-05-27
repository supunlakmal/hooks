"use client";

import { useState, useEffect } from 'react';
import { useAnimation } from '@/hooks/useAnimation';

const UseAnimationPage = () => {
  const [progress, setProgress] = useState(0);
  const animation = useAnimation((value) => {
    // If easing was desired, it would be applied here, e.g.:
    // const easedValue = easeInOutQuad(value);
    // setProgress(easedValue);
    setProgress(value);
  }, { duration: 5000 }); // Animate over 5 seconds

  useEffect(() => {
    animation.start();
    return () => animation.stop(); // Cleanup on unmount
  }, [animation]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>useAnimation Hook Example</h1>
      <p>This page demonstrates the useAnimation hook to animate a progress bar.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => animation.start()} style={{ marginRight: '10px' }}>
          Start Animation
        </button>
        <button onClick={() => animation.stop()} style={{ marginRight: '10px' }}>
          Stop Animation
        </button>
        <button onClick={() => animation.reset()}>
          Reset Animation
        </button>
      </div>
      <div style={{ marginTop: '20px', width: '100%', backgroundColor: '#eee' }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: '30px',
            backgroundColor: 'green',
            textAlign: 'center',
            lineHeight: '30px',
            color: 'white',
          }}
        >
          {(progress * 100).toFixed(0)}%
        </div>
      </div>
      <p style={{ marginTop: '10px' }}>Current Progress: {progress.toFixed(2)}</p>
    </div>
  );
};

export default UseAnimationPage;
