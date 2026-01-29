'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Props for the CursorSpotlight component
 */
interface CursorSpotlightProps {
  /** Color of the spotlight glow (CSS color value) */
  color?: string;
  /** Diameter of the spotlight effect in pixels */
  size?: number;
  /** Opacity of the glow effect (0-1, where 1 is fully opaque) */
  intensity?: number;
  /** Blur radius applied to the spotlight in pixels */
  blur?: number;
}

/**
 * CursorSpotlight - A subtle glowing ambient effect with gentle floating animation
 *
 * What it does:
 * - Creates a radial gradient "glow" that floats gently across the screen
 * - Uses slow, organic motion pattern (like aurora borealis drift)
 * - Respects accessibility preferences (disabled if user prefers reduced motion)
 * - Only works on desktop devices (not on mobile/touch screens)
 *
 * Technical details:
 * - Uses Framer Motion for smooth floating animation (25s cycle)
 * - GPU-accelerated transforms for 60fps performance
 * - Non-interactive (pointer-events: none) so it doesn't block clicks
 * - Positioned absolutely behind content (z-index handled by parent)
 * - Subtle scale and opacity variations add depth
 *
 * @example
 * ```tsx
 * <CursorSpotlight
 *   color="#00e5ff"   // Cyan glow
 *   size={420}        // 420px diameter
 *   intensity={0.3}   // 30% base opacity
 *   blur={110}        // 110px blur for soft edges
 * />
 * ```
 */
export function CursorSpotlight({
  color = '#00e5ff',
  size = 420,
  intensity = 0.3,
  blur = 110,
}: CursorSpotlightProps) {
  // Check if user prefers reduced motion (accessibility)
  const shouldReduceMotion = useReducedMotion();

  // Detect if we're on a touch device (mobile/tablet)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch support on mount
    // If the device supports touch OR has a small screen, don't show the spotlight
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    setIsTouchDevice(hasTouch || isSmallScreen);
  }, []);

  // Don't render on mobile/touch devices
  if (isTouchDevice) return null;

  // Don't render if user prefers reduced motion
  if (shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 1. Top Left - Fast */}
      <motion.div
        className="absolute"
        style={{ top: '5%', left: '5%' }}
        animate={{
          x: [0, 100, 40, 140, 20, 0],
          y: [0, 80, 150, 40, 100, 0],
        }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 0.9, 1.15, 1], opacity: [intensity, intensity * 1.3, intensity * 0.7, intensity * 1.2, intensity] }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size, height: size, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur}px)` }}
        />
      </motion.div>

      {/* 2. Top Right - Medium */}
      <motion.div
        className="absolute"
        style={{ top: '10%', right: '10%' }}
        animate={{
          x: [0, -120, -40, -150, -60, 0],
          y: [0, 90, 160, 50, 120, 0],
        }}
        transition={{ duration: 15, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 0.85, 1.15, 0.9, 1], opacity: [intensity * 0.8, intensity * 1.2, intensity * 0.5, intensity, intensity * 0.8] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.85, height: size * 0.85, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.9}px)` }}
        />
      </motion.div>

      {/* 3. Center Left - Slow */}
      <motion.div
        className="absolute"
        style={{ top: '15%', left: '-5%' }}
        animate={{
          x: [0, 80, 150, 50, 120, 0],
          y: [0, -50, 80, -70, 40, 0],
        }}
        transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [0.9, 1.25, 0.95, 1.2, 0.9], opacity: [intensity * 0.7, intensity, intensity * 0.6, intensity * 0.9, intensity * 0.7] }}
          transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.7, height: size * 0.7, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.8}px)` }}
        />
      </motion.div>

      {/* 4. Center Right - Fast */}
      <motion.div
        className="absolute"
        style={{ top: '25%', right: '-5%' }}
        animate={{
          x: [0, -80, -140, -50, -110, 0],
          y: [0, 60, -50, 90, 20, 0],
        }}
        transition={{ duration: 13, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.2, 0.95, 1.1], opacity: [intensity * 0.6, intensity * 0.9, intensity * 0.4, intensity * 0.8, intensity * 0.6] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.75, height: size * 0.75, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.85}px)` }}
        />
      </motion.div>

      {/* 5. Bottom Left - Medium */}
      <motion.div
        className="absolute"
        style={{ bottom: '5%', left: '5%' }}
        animate={{
          x: [0, 110, -30, 160, 60, 0],
          y: [0, -80, 50, -110, 80, 0],
        }}
        transition={{ duration: 16, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.9, 1.1, 0.85], opacity: [intensity * 0.5, intensity * 0.9, intensity * 0.4, intensity * 0.8, intensity * 0.5] }}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.8, height: size * 0.8, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.95}px)` }}
        />
      </motion.div>

      {/* 6. Bottom Right - Fast */}
      <motion.div
        className="absolute"
        style={{ bottom: '5%', right: '5%' }}
        animate={{
          x: [0, -90, 50, -110, 40, 0],
          y: [0, 50, -70, 90, -40, 0],
        }}
        transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 0.8, 1.2, 0.9, 1], opacity: [intensity * 0.7, intensity, intensity * 0.5, intensity * 0.9, intensity * 0.7] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.6, height: size * 0.6, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.75}px)` }}
        />
      </motion.div>

      {/* 7. Mid Top - Wandering */}
      <motion.div
        className="absolute"
        style={{ top: '-10%', left: '20%' }}
        animate={{
          x: [0, -50, 50, -30, 30, 0],
          y: [0, 100, 20, 120, 40, 0],
        }}
        transition={{ duration: 17, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [0.95, 1.1, 0.9, 1.05, 0.95], opacity: [intensity * 0.6, intensity * 0.8, intensity * 0.5, intensity * 0.7, intensity * 0.6] }}
          transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.9, height: size * 0.9, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur}px)` }}
        />
      </motion.div>

      {/* 8. Mid Bottom - Wandering */}
      <motion.div
        className="absolute"
        style={{ bottom: '-10%', right: '20%' }}
        animate={{
          x: [0, 60, -60, 40, -40, 0],
          y: [0, -90, 30, -110, 50, 0],
        }}
        transition={{ duration: 19, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1.05, 0.9, 1.15, 0.95, 1.05], opacity: [intensity * 0.7, intensity * 0.9, intensity * 0.6, intensity * 0.8, intensity * 0.7] }}
          transition={{ duration: 13, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.85, height: size * 0.85, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.9}px)` }}
        />
      </motion.div>

      {/* 9. Center - Pulse */}
      <motion.div
        className="absolute"
        style={{ top: '50%', left: '-15%' }}
        animate={{
          x: [0, 40, -40, 30, -30, 0],
          y: [0, 30, -30, 40, -40, 0],
        }}
        transition={{ duration: 25, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [0.8, 1.4, 0.9, 1.3, 0.8], opacity: [intensity * 0.4, intensity, intensity * 0.5, intensity * 0.9, intensity * 0.4] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 1.1, height: size * 1.1, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 1.2}px)` }}
        />
      </motion.div>

      {/* 10. Deep Background - Very Slow */}
      <motion.div
        className="absolute"
        style={{ top: '5%', left: '80%' }}
        animate={{
          x: [0, -30, 30, -20, 20, 0],
          y: [0, 40, 10, 50, 20, 0],
        }}
        transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 0.9, 1.05, 1], opacity: [intensity * 0.3, intensity * 0.5, intensity * 0.2, intensity * 0.4, intensity * 0.3] }}
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 1.5, height: size * 1.5, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: `blur(${blur * 1.5}px)` }}
        />
      </motion.div>

      {/* 11. Edge Floater - Left */}
      <motion.div
        className="absolute"
        style={{ top: '80%', left: '-5%' }}
        animate={{
          x: [0, 80, 20, 100, 40, 0],
          y: [0, -40, 40, -30, 30, 0],
        }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.95, 1.05, 0.9], opacity: [intensity * 0.5, intensity * 0.7, intensity * 0.4, intensity * 0.6, intensity * 0.5] }}
          transition={{ duration: 15, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.6, height: size * 0.6, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.8}px)` }}
        />
      </motion.div>

      {/* 12. Edge Floater - Right */}
      <motion.div
        className="absolute"
        style={{ bottom: '70%', right: '-5%' }}
        animate={{
          x: [0, -60, -20, -80, -30, 0],
          y: [0, 50, -30, 70, -20, 0],
        }}
        transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.15, 0.95, 1.1], opacity: [intensity * 0.6, intensity * 0.8, intensity * 0.5, intensity * 0.7, intensity * 0.6] }}
          transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
          style={{ width: size * 0.65, height: size * 0.65, background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, filter: `blur(${blur * 0.8}px)` }}
        />
      </motion.div>
    </div>
  );
}
