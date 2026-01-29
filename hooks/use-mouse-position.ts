import { useState, useEffect } from 'react';

/**
 * Mouse position coordinates
 */
interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook that tracks the mouse cursor position across the entire viewport.
 *
 * How it works:
 * - Listens to mousemove events on the window
 * - Updates position smoothly using requestAnimationFrame for performance
 * - Only activates on desktop devices (screen width >= 768px)
 * - Cleans up listeners when component unmounts
 *
 * @returns {MousePosition} Current mouse coordinates { x, y }
 *
 * Example usage:
 * ```tsx
 * const { x, y } = useMousePosition();
 * // x and y are the cursor coordinates in pixels from the viewport origin
 * ```
 */
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Only track mouse on desktop (not on mobile/tablet devices)
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    let animationFrameId: number | null = null;
    let currentX = 0;
    let currentY = 0;

    /**
     * Updates the mouse position state using requestAnimationFrame
     * This ensures smooth updates synced with browser repaints (~60fps)
     */
    const updateMousePosition = () => {
      setMousePosition({ x: currentX, y: currentY });
      animationFrameId = null;
    };

    /**
     * Mouse move event handler
     * Captures cursor coordinates and schedules an update via RAF
     */
    const handleMouseMove = (event: MouseEvent) => {
      currentX = event.clientX;
      currentY = event.clientY;

      // Only schedule one update per frame for optimal performance
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateMousePosition);
      }
    };

    // Attach the listener to track cursor movement
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function: remove listener and cancel any pending RAF
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return mousePosition;
}
