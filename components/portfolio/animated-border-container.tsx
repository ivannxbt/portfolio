"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * AnimatedBorderContainer
 *
 * A performant animated border wrapper using pure CSS with dynamic opacity.
 *
 * HOW IT WORKS:
 * - Uses a pseudo-element to create a spinning conic-gradient
 * - The gradient is masked to only show along the border perimeter
 * - Animation speed AND opacity changes based on interaction state
 * - Subtle when idle, pronounced when active/focused
 * - Respects user's motion preferences (prefers-reduced-motion)
 *
 * CUSTOMIZATION:
 * - borderWidth: thickness of the animated border (default: 2px)
 * - borderRadius: corner radius (default: 16px)
 * - gradientColors: array of 2-3 colors for the gradient
 * - animationSpeed: rotation duration in seconds (idle state)
 *
 * PERFORMANCE:
 * - Uses CSS transforms (GPU-accelerated)
 * - Smooth opacity transitions via CSS
 * - No JavaScript animation loops
 * - Will-change hints for optimal rendering
 *
 * ACCESSIBILITY:
 * - Respects prefers-reduced-motion media query
 * - Animation disabled for users who prefer reduced motion
 */

type AnimatedBorderContainerProps = {
  children: React.ReactNode;
  className?: string;
  state?: "idle" | "hover" | "focus" | "loading";
  borderWidth?: number;
  borderRadius?: number;
  gradientColors?: [string, string] | [string, string, string];
  animationSpeed?: number;
  style?: React.CSSProperties;
};

export function AnimatedBorderContainer({
  children,
  className = "",
  state = "idle",
  borderWidth = 2,
  borderRadius = 16,
  gradientColors = ["#e5e7eb", "#3b82f6"],
  animationSpeed = 8,
  style = {},
}: AnimatedBorderContainerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Client-only mounting flag to prevent hydration mismatches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Calculate animation duration and opacity based on state
  // Idle: very slow and subtle, Active: fast and pronounced
  const baseDuration =
    state === "loading"
      ? animationSpeed * 0.4 // Much faster when loading
      : state === "focus"
        ? animationSpeed * 0.5 // Fast when focused
        : state === "hover"
          ? animationSpeed * 0.75 // Moderately faster on hover
          : animationSpeed * 1.8; // Very slow and subtle when idle

  // Opacity changes based on state for subtle idle -> pronounced active
  const opacity =
    state === "loading"
      ? 1.0 // Full brightness when loading
      : state === "focus"
        ? 0.9 // Bright when focused
        : state === "hover"
          ? 0.6 // Medium when hovering
          : 0.35; // Very subtle when idle

  // Disable animation if user prefers reduced motion
  const duration = prefersReducedMotion ? 0 : baseDuration;

  // Build gradient from color array
  const gradient =
    gradientColors.length === 3
      ? `conic-gradient(
          from 0deg,
          ${gradientColors[0]} 0deg,
          ${gradientColors[1]} 120deg,
          ${gradientColors[2]} 240deg,
          ${gradientColors[0]} 360deg
        )`
      : `conic-gradient(
          from 0deg,
          ${gradientColors[0]} 0deg,
          ${gradientColors[1]} 180deg,
          ${gradientColors[0]} 360deg
        )`;

  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: "#ffffff",
        ...style,
      }}
    >
      {/* Animated border layer with dynamic opacity */}
      {isMounted && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: `${borderRadius}px`,
            padding: `${borderWidth}px`,
            background: gradient,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            animation: duration > 0 ? `spin ${duration}s linear infinite` : "none",
            opacity: opacity,
            transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform, opacity",
          }}
        />
      )}

      {/* Content container with white background */}
      <div
        className="relative z-10 w-full h-full"
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: "#ffffff",
        }}
      >
        {children}
      </div>

      {/* CSS keyframes injection */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * Basic:
 * <AnimatedBorderContainer>
 *   <div>Your content</div>
 * </AnimatedBorderContainer>
 * 
 * Custom colors (subtle gray to blue):
 * <AnimatedBorderContainer
 *   gradientColors={["#e5e7eb", "#3b82f6"]}
 * >
 *   <div>Your content</div>
 * </AnimatedBorderContainer>
 * 
 * Three-color gradient (premium look):
 * <AnimatedBorderContainer
 *   gradientColors={["#e5e7eb", "#8b5cf6", "#3b82f6"]}
 * >
 *   <div>Your content</div>
 * </AnimatedBorderContainer>
 * 
 * Dynamic state:
 * const [state, setState] = useState<"idle" | "focus" | "loading">("idle");
 * 
 * <AnimatedBorderContainer
 *   state={state}
 *   gradientColors={["#d1d5db", "#3b82f6", "#8b5cf6"]}
 * >
 *   <input onFocus={() => setState("focus")} />
 * </AnimatedBorderContainer>
 */
