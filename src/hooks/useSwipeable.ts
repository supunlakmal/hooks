import { useSwipe } from './useSwipe';
import { useRef, useEffect } from 'react';

interface SwipeableOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export default function useSwipeable({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: SwipeableOptions) {
  const ref = useRef<HTMLElement>(null);
  const { swipe } = useSwipe(ref);

  useEffect(() => {
    if (!swipe) return;
    if (swipe.direction === 'left' && swipe.distance > threshold) {
      onSwipeLeft?.();
    } else if (swipe.direction === 'right' && swipe.distance > threshold) {
      onSwipeRight?.();
    } else if (swipe.direction === 'up' && swipe.distance > threshold) {
      onSwipeUp?.();
    } else if (swipe.direction === 'down' && swipe.distance > threshold) {
      onSwipeDown?.();
    }
  }, [swipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return ref;
}