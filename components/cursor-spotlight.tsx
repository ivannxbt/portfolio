'use client';

import { useEffect, useState } from 'react';

interface CursorSpotlightProps {
  color?: string;
  size?: number;
  intensity?: number;
  blur?: number;
}

/**
 * CursorSpotlight - A subtle glowing ambient effect with gentle CSS-based floating animation
 *
 * Optimized version using CSS animations instead of Framer Motion for better performance.
 * Uses prime number durations and custom bezier curves for organic, aurora-like motion.
 */
export function CursorSpotlight({
  color = '#00e5ff',
  size = 420,
  intensity = 0.3,
  blur = 110,
}: CursorSpotlightProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Only hide on small screens (mobile)
    // Note: We no longer check for touch because many desktop monitors support touch
    const isSmallScreen = window.innerWidth < 768;
    setShouldRender(!isSmallScreen);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Don't render on mobile/touch devices or if reduced motion is preferred
  if (!shouldRender || prefersReducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ '--cursor-intensity': intensity } as React.CSSProperties}
    >

      {/* Orb 1 - Top Left */}
      <div
        className="absolute spotlight-orb orb-1"
        style={{
          top: '5%',
          left: '5%',
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur}px)`,
        }}
      />

      {/* Orb 2 - Top Right */}
      <div
        className="absolute spotlight-orb orb-2"
        style={{
          top: '10%',
          right: '10%',
          width: size * 0.85,
          height: size * 0.85,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 0.9}px)`,
        }}
      />

      {/* Orb 3 - Center Left */}
      <div
        className="absolute spotlight-orb orb-3"
        style={{
          top: '15%',
          left: '-5%',
          width: size * 0.7,
          height: size * 0.7,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 0.8}px)`,
        }}
      />

      {/* Orb 4 - Center Right */}
      <div
        className="absolute spotlight-orb orb-4"
        style={{
          top: '25%',
          right: '-5%',
          width: size * 0.75,
          height: size * 0.75,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 0.85}px)`,
        }}
      />

      {/* Orb 5 - Bottom Left */}
      <div
        className="absolute spotlight-orb orb-5"
        style={{
          bottom: '5%',
          left: '5%',
          width: size * 0.8,
          height: size * 0.8,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 0.95}px)`,
        }}
      />

      {/* Orb 6 - Bottom Right */}
      <div
        className="absolute spotlight-orb orb-6"
        style={{
          bottom: '5%',
          right: '5%',
          width: size * 0.6,
          height: size * 0.6,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 0.75}px)`,
        }}
      />

      {/* Orb 7 - Center Deep Pulse */}
      <div
        className="absolute spotlight-orb orb-7"
        style={{
          top: '50%',
          left: '-15%',
          width: size * 1.1,
          height: size * 1.1,
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          filter: `blur(${blur * 1.2}px)`,
        }}
      />

      {/* Orb 8 - Deep Background */}
      <div
        className="absolute spotlight-orb orb-8"
        style={{
          top: '5%',
          left: '80%',
          width: size * 1.5,
          height: size * 1.5,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur * 1.5}px)`,
        }}
      />
    </div>
  );
}
