import { useRef, useCallback } from 'react';

const SWIPE_THRESHOLD = 50; // px

export function useSwipe({ onSwipeLeft, onSwipeRight, onTap }) {
  const touchStart = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 10 && absDy < 10) {
      onTap?.();
    } else if (absDx > SWIPE_THRESHOLD && absDx > absDy) {
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    }
    touchStart.current = null;
  }, [onSwipeLeft, onSwipeRight, onTap]);

  return { onTouchStart, onTouchEnd };
}
