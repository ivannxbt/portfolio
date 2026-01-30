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

  // Use intensity directly - the parent already provides a subtle value
  const baseIntensity = intensity;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: ${baseIntensity};
          }
          25% {
            transform: translate(80px, 60px) rotate(5deg) scale(1.08);
            opacity: ${baseIntensity * 1.15};
          }
          50% {
            transform: translate(120px, 120px) rotate(-3deg) scale(1.02);
            opacity: ${baseIntensity * 0.9};
          }
          75% {
            transform: translate(40px, 80px) rotate(2deg) scale(1.06);
            opacity: ${baseIntensity * 1.1};
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: ${baseIntensity * 0.9};
          }
          25% {
            transform: translate(-90px, 70px) rotate(-4deg) scale(0.95);
            opacity: ${baseIntensity * 1.1};
          }
          50% {
            transform: translate(-60px, 130px) rotate(2deg) scale(1.05);
            opacity: ${baseIntensity * 0.85};
          }
          75% {
            transform: translate(-100px, 50px) rotate(-2deg) scale(0.98);
            opacity: ${baseIntensity};
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(0.95);
            opacity: ${baseIntensity * 0.8};
          }
          25% {
            transform: translate(100px, -30px) rotate(3deg) scale(1.05);
            opacity: ${baseIntensity * 0.95};
          }
          50% {
            transform: translate(70px, 60px) rotate(-2deg) scale(0.98);
            opacity: ${baseIntensity * 0.75};
          }
          75% {
            transform: translate(120px, 20px) rotate(1deg) scale(1.02);
            opacity: ${baseIntensity * 0.9};
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1.02);
            opacity: ${baseIntensity * 0.75};
          }
          25% {
            transform: translate(-70px, 50px) rotate(-3deg) scale(0.96);
            opacity: ${baseIntensity * 0.9};
          }
          50% {
            transform: translate(-110px, -20px) rotate(4deg) scale(1.04);
            opacity: ${baseIntensity * 0.7};
          }
          75% {
            transform: translate(-40px, 70px) rotate(-1deg) scale(0.99);
            opacity: ${baseIntensity * 0.85};
          }
        }

        @keyframes float-5 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(0.98);
            opacity: ${baseIntensity * 0.7};
          }
          25% {
            transform: translate(90px, -60px) rotate(2deg) scale(1.04);
            opacity: ${baseIntensity * 0.85};
          }
          50% {
            transform: translate(60px, 30px) rotate(-3deg) scale(0.96);
            opacity: ${baseIntensity * 0.65};
          }
          75% {
            transform: translate(110px, -40px) rotate(1deg) scale(1.02);
            opacity: ${baseIntensity * 0.8};
          }
        }

        @keyframes float-6 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: ${baseIntensity * 0.8};
          }
          25% {
            transform: translate(-70px, 40px) rotate(-2deg) scale(0.94);
            opacity: ${baseIntensity * 0.95};
          }
          50% {
            transform: translate(30px, -50px) rotate(3deg) scale(1.06);
            opacity: ${baseIntensity * 0.75};
          }
          75% {
            transform: translate(-50px, 60px) rotate(-1deg) scale(0.98);
            opacity: ${baseIntensity * 0.9};
          }
        }

        @keyframes float-7 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(0.92);
            opacity: ${baseIntensity * 0.6};
          }
          25% {
            transform: translate(30px, 20px) rotate(2deg) scale(1.08);
            opacity: ${baseIntensity * 0.8};
          }
          50% {
            transform: translate(-20px, -20px) rotate(-1deg) scale(0.95);
            opacity: ${baseIntensity * 0.55};
          }
          75% {
            transform: translate(40px, -30px) rotate(1deg) scale(1.04);
            opacity: ${baseIntensity * 0.75};
          }
        }

        @keyframes float-8 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: ${baseIntensity * 0.5};
          }
          25% {
            transform: translate(-25px, 35px) rotate(1deg) scale(1.04);
            opacity: ${baseIntensity * 0.65};
          }
          50% {
            transform: translate(20px, 15px) rotate(-1deg) scale(0.96);
            opacity: ${baseIntensity * 0.45};
          }
          75% {
            transform: translate(-15px, 40px) rotate(0.5deg) scale(1.02);
            opacity: ${baseIntensity * 0.6};
          }
        }

        .spotlight-orb {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .orb-1 { animation: float-1 23s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        .orb-2 { animation: float-2 29s cubic-bezier(0.33, 0.1, 0.67, 1) infinite; }
        .orb-3 { animation: float-3 41s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        .orb-4 { animation: float-4 37s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .orb-5 { animation: float-5 43s cubic-bezier(0.33, 0.1, 0.67, 1) infinite; }
        .orb-6 { animation: float-6 31s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        .orb-7 { animation: float-7 59s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .orb-8 { animation: float-8 67s cubic-bezier(0.33, 0.1, 0.67, 1) infinite; }
      `}</style>

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
