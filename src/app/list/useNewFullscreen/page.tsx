"use client";
import React, { useRef } from 'react';
import useNewFullscreen from '../../../hooks/useNewFullscreen';

function NewFullscreenExample() {
  const ref = useRef<any>(null);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useNewFullscreen(ref);

  const handleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: 'lightblue',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isFullscreen ? "Full Screen" : "Not Full Screen"}
      </div>
      <button onClick={handleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
    </div>
  );
}

export default NewFullscreenExample;