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
      staggerChildren: 0.06, // 60ms between items (reduced from 100ms)
      delayChildren: 0.1,    // Wait 100ms before first item (reduced from 200ms)
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
 * margin: Start animation 50px before element enters viewport (reduced for earlier trigger)
 * amount: Percentage of element that must be visible to trigger (0.3 = 30%)
 */
export const scrollViewport = {
  once: true,
  margin: "-50px",
  amount: 0.3 as const,
};

/**
 * Common animation props for whileHover
 */
export const hoverProps = {
  whileHover: hoverScale,
  whileTap: tapScale,
};

/**
 * Developer-vibe animations
 */

// Terminal typing effect
export const terminalType: Variants = {
  hidden: {
    opacity: 0,
    width: 0,
  },
  visible: {
    opacity: 1,
    width: "auto",
    transition: {
      duration: 1,
      ease: "linear",
    },
  },
};

// Code reveal (slides in from left with slight glow)
export const codeReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      ...ease.out,
      duration: 0.6,
    },
  },
};

// Glitch effect on hover
export const glitchHover = {
  scale: 1.02,
  textShadow: "2px 2px 0px rgba(0, 255, 65, 0.3), -2px -2px 0px rgba(0, 229, 255, 0.3)",
  transition: {
    duration: 0.1,
  },
};

// Smooth elevation (for cards)
export const elevate: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -4,
    boxShadow: "0 10px 30px rgba(0, 229, 255, 0.1), 0 0 20px rgba(0, 255, 65, 0.05)",
    transition: spring.gentle,
  },
};

// Parallax scroll effect
export const parallax = {
  slow: {
    y: [0, -30],
    transition: {
      duration: 1.5,
      ease: "linear",
    },
  },
  fast: {
    y: [0, -60],
    transition: {
      duration: 1,
      ease: "linear",
    },
  },
};

// Stagger with faster timing for snappier feel
export const developerStagger: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Faster stagger (reduced from 0.05)
      delayChildren: 0.05,   // Reduced from 0.1
    },
  },
};

// Stagger item with more pronounced movement
export const developerStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,      // Cards animate FROM below (slide up into view)
    scale: 0.98, // Closer to 1 for subtler effect
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...ease.out,
      duration: 0.35, // Faster duration (reduced from 0.5)
    },
  },
};

// Smooth glow on interaction
export const glowInteraction = {
  rest: {
    filter: "brightness(1) drop-shadow(0 0 0px transparent)",
  },
  hover: {
    filter: "brightness(1.1) drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))",
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    filter: "brightness(0.9) drop-shadow(0 0 4px rgba(0, 229, 255, 0.6))",
    transition: {
      duration: 0.1,
    },
  },
};

// Page transition (smooth fade with slight scale)
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Smooth ease-out
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(10px)",
    transition: {
      duration: 0.4,
    },
  },
};

// Neo-brutalist card elevation with offset shadow
export const brutalElevate: Variants = {
  rest: {
    y: 0,
    x: 0,
    rotate: 0,
    boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -8,
    x: -4,
    rotate: 0.5,
    boxShadow: "8px 8px 0px rgba(0, 229, 255, 0.3), 12px 12px 0px rgba(0, 255, 65, 0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

// Refined minimal card elevation with subtle teal glow
export const refinedElevate: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -4,
    boxShadow: "0 10px 30px rgba(0, 229, 255, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

// Stagger tags entrance
export const tagStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

export const tagItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};
