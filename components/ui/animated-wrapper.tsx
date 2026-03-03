"use client";

/**
 * AnimatedWrapper Component
 *
 * Reusable wrapper for applying Framer Motion animations to any content.
 * Handles viewport detection for scroll animations and respects reduced motion preferences.
 */

import { motion, useReducedMotion, Variants } from "motion/react";
import { ReactNode } from "react";
import {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fade,
  scale,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from "@/lib/animations";

/**
 * Available animation variants
 */
type AnimationVariant =
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "fade"
  | "scale"
  | "staggerContainer"
  | "staggerItem"
  | "none";

/**
 * Props for AnimatedWrapper component
 */
interface AnimatedWrapperProps {
  children: ReactNode;
  /** Animation variant to apply */
  variant?: AnimationVariant;
  /** Custom Framer Motion variants (overrides preset variant) */
  customVariants?: Variants;
  /** Animation trigger mode */
  trigger?: "mount" | "inView";
  /** @deprecated Use `trigger="inView"` instead */
  /** Enable scroll-triggered animation (uses whileInView) */
  scrollTrigger?: boolean;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Map of preset animation variants
 */
const variantMap: Record<Exclude<AnimationVariant, "none">, Variants> = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fade,
  scale,
  staggerContainer,
  staggerItem,
};

/**
 * AnimatedWrapper - Generic wrapper component for animations
 *
 * Usage examples:
 *
 * // Basic fade in from bottom
 * <AnimatedWrapper variant="fadeInUp">
 *   <div>Content</div>
 * </AnimatedWrapper>
 *
 * // Scroll-triggered animation
 * <AnimatedWrapper variant="fadeInUp" scrollTrigger>
 *   <div>Appears when scrolled into view</div>
 * </AnimatedWrapper>
 *
 * // Custom variants
 * <AnimatedWrapper customVariants={myVariants}>
 *   <div>Custom animation</div>
 * </AnimatedWrapper>
 *
 * // Stagger container with children
 * <AnimatedWrapper variant="staggerContainer">
 *   <AnimatedWrapper variant="staggerItem">Item 1</AnimatedWrapper>
 *   <AnimatedWrapper variant="staggerItem">Item 2</AnimatedWrapper>
 *   <AnimatedWrapper variant="staggerItem">Item 3</AnimatedWrapper>
 * </AnimatedWrapper>
 */
export function AnimatedWrapper({
  children,
  variant = "fadeInUp",
  customVariants,
  trigger,
  scrollTrigger = false,
  delay = 0,
  className,
}: AnimatedWrapperProps) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Get the variants to use (custom or preset)
  const variants =
    customVariants || (variant !== "none" ? variantMap[variant] : undefined);
  const resolvedTrigger = trigger ?? (scrollTrigger ? "inView" : "mount");

  // If no animation or reduced motion, render children directly
  if (!variants || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Apply delay if specified
  const modifiedVariants: Variants =
    delay > 0
      ? {
          ...variants,
          visible: {
            ...(typeof variants.visible === "object" ? variants.visible : {}),
            transition: {
              ...((typeof variants.visible === "object" &&
              variants.visible &&
              "transition" in variants.visible
                ? variants.visible.transition
                : {}) as object),
              delay,
            },
          },
        }
      : variants;

  // Common props for all animations
  const commonProps = {
    initial: "hidden",
    variants: modifiedVariants,
    className,
  };

  // Scroll-triggered animation
  if (resolvedTrigger === "inView") {
    return (
      <motion.div
        {...commonProps}
        whileInView="visible"
        viewport={scrollViewport}
      >
        {children}
      </motion.div>
    );
  }

  // Immediate animation (on mount)
  return (
    <motion.div {...commonProps} animate="visible">
      {children}
    </motion.div>
  );
}

/**
 * Convenience components for common patterns
 */

// Scroll-triggered fade in from bottom
export function ScrollFadeIn({
  children,
  className,
  delay,
}: Pick<AnimatedWrapperProps, "children" | "className" | "delay">) {
  return (
    <AnimatedWrapper
      variant="fadeInUp"
      trigger="inView"
      className={className}
      delay={delay}
    >
      {children}
    </AnimatedWrapper>
  );
}

// Stagger container wrapper
export function StaggerContainer({
  children,
  className,
}: Pick<AnimatedWrapperProps, "children" | "className">) {
  return (
    <AnimatedWrapper variant="staggerContainer" className={className}>
      {children}
    </AnimatedWrapper>
  );
}

// Stagger item wrapper (use inside StaggerContainer)
export function StaggerItem({
  children,
  className,
}: Pick<AnimatedWrapperProps, "children" | "className">) {
  return (
    <AnimatedWrapper variant="staggerItem" className={className}>
      {children}
    </AnimatedWrapper>
  );
}
