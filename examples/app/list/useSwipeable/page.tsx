'use client';
import { useSwipeable } from 'src';
import React from 'react';

export default function UseSwipeableExample() {
  const { ref } = useSwipeable({
    onSwipeLeft: () => alert('Swiped Left!'),
    onSwipeRight: () => alert('Swiped Right!'),
    onSwipeUp: () => alert('Swiped Up!'),
    onSwipeDown: () => alert('Swiped Down!'),
    threshold: 50,
  });

  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'red',
        touchAction: 'none',
      }}
    >
      Swipe me!
    </div>
  );
}