/**
 * Framer Motion Animation Configuration System
 *
 * Centralized animation variants, transitions, and timing standards.
 * All animations respect user's reduced motion preferences.
 */

import { Transition, Variants } from "framer-motion";

/**
 * Timing standards for consistent animation durations across the app
 */
export const timing = {
  fast: 0.15,    // 150ms - micro-interactions (hover states)
  normal: 0.3,   // 300ms - most UI transitions
  slow: 0.5,     // 500ms - complex content animations
  entrance: 0.4, // 400ms - content appearing on screen
  exit: 0.2,     // 200ms - faster out than in
} as const;

/**
 * Spring transition presets for natural, physics-based animations
 */
export const spring = {
  // Gentle spring for subtle interactions
  gentle: {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  },
  // Responsive spring for immediate feedback
  responsive: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
  // Bouncy spring for playful interactions
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 15,
  },
} as const;

/**
 * Easing transition presets for smooth, non-physics animations
 */
export const ease = {
  inOut: {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1], // Material Design standard easing
    duration: timing.normal,
  },
  out: {
    type: "tween" as const,
    ease: [0, 0, 0.2, 1],
    duration: timing.normal,
  },
  in: {
    type: "tween" as const,
    ease: [0.4, 0, 1, 1],
    duration: timing.normal,
  },
} as const;

/**
 * Common animation variants
 */

// Fade in from below (common for content entrance)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...ease.out,
      duration: timing.entrance,
    },
  },
};

// Fade in from above
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...ease.out,
      duration: timing.entrance,
    },
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...ease.out,
      duration: timing.entrance,
    },
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...ease.out,
      duration: timing.entrance,
    },
  },
};

// Simple fade (no movement)
export const fade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ...ease.inOut,
      duration: timing.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...ease.inOut,
      duration: timing.exit,
    },
  },
};

// Scale animation (for modals, popovers)
export const scale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ...ease.inOut,
      duration: timing.exit,
    },
  },
};

// Scale from origin (for dropdowns)
export const scaleFromOrigin: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transformOrigin: "top left",
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.responsive,
  },
};

// Hover scale (for interactive elements)
export const hoverScale = {
  scale: 1.02,
  transition: spring.responsive,
};

// Tap scale (for buttons, clickable items)
export const tapScale = {
  scale: 0.98,
};

// Stagger container (parent element)
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms between items
      delayChildren: 0.2,   // Wait 200ms before first item
    },
  },
};

// Stagger item (child element)
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...ease.out,
      duration: timing.entrance,
    },
  },
};

// Shake animation (for validation errors)
export const shake: Variants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Pulse animation (for success states)
export const pulse: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.3,
    },
  },
};

// Rotate animation (for loading spinners)
export const rotate: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Helper function to create custom stagger configuration
 *
 * @param staggerDelay - Delay between each child animation (in seconds)
 * @param delayChildren - Initial delay before first child animates (in seconds)
 */
export function createStagger(
  staggerDelay: number = 0.1,
  delayChildren: number = 0
): Transition {
  return {
    staggerChildren: staggerDelay,
    delayChildren,
  };
}

/**
 * Helper function to get transition based on reduced motion preference
 *
 * @param transition - The desired transition
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Transition with near-instant duration if reduced motion is enabled
 */
export function getTransition(
  transition: Transition,
  prefersReducedMotion: boolean
): Transition {
  if (prefersReducedMotion) {
    return {
      duration: 0.01, // Near-instant
    };
  }
  return transition;
}

/**
 * Viewport configuration for scroll-triggered animations
 *
 * once: Animation only triggers once (doesn't re-trigger on scroll up)
 * margin: Start animation 100px before element enters viewport
 * amount: Percentage of element that must be visible to trigger (0.2 = 20%)
 */
export const scrollViewport = {
  once: true,
  margin: "-100px",
  amount: 0.2 as const,
};

/**
 * Common animation props for whileHover
 */
export const hoverProps = {
  whileHover: hoverScale,
  whileTap: tapScale,
};
