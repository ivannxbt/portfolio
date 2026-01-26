"use client";

/**
 * useAnimationControls Hook
 *
 * Custom hook for programmatic animation control in complex sequences.
 * Useful for form submissions, multi-step flows, and coordinated animations.
 */

import { useAnimationControls as useFramerControls, useReducedMotion } from "framer-motion";
import { useCallback } from "react";

/**
 * Animation sequence step
 */
interface AnimationStep {
  /** Variant name to animate to */
  variant: string;
  /** Delay before this step (in seconds) */
  delay?: number;
  /** Duration override for this step (in seconds) */
  duration?: number;
}

/**
 * Hook return type
 */
interface AnimationControlsReturn {
  /** Framer Motion animation controls */
  controls: ReturnType<typeof useFramerControls>;
  /** Start animation to a specific variant */
  animateTo: (variant: string, duration?: number) => Promise<void>;
  /** Run a sequence of animations */
  runSequence: (steps: AnimationStep[]) => Promise<void>;
  /** Reset to initial state */
  reset: () => Promise<void>;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

/**
 * useAnimationControls Hook
 *
 * Provides programmatic control over Framer Motion animations.
 *
 * Usage example:
 *
 * ```tsx
 * function FormComponent() {
 *   const { controls, runSequence, animateTo } = useAnimationControls();
 *
 *   const handleSubmit = async () => {
 *     // Shake on error
 *     await animateTo("shake");
 *
 *     // Or run a sequence
 *     await runSequence([
 *       { variant: "loading", duration: 0.3 },
 *       { variant: "success", delay: 2 },
 *       { variant: "fadeOut", delay: 1 },
 *     ]);
 *   };
 *
 *   return (
 *     <motion.form animate={controls}>
 *       ...
 *     </motion.form>
 *   );
 * }
 * ```
 */
export function useAnimationControls(): AnimationControlsReturn {
  const controls = useFramerControls();
  const prefersReducedMotion = useReducedMotion() ?? false;

  /**
   * Animate to a specific variant
   */
  const animateTo = useCallback(
    async (variant: string, duration?: number) => {
      if (prefersReducedMotion) {
        // Skip animation, just set final state
        await controls.set(variant);
        return;
      }

      await controls.start(variant, {
        duration: duration ?? undefined,
      });
    },
    [controls, prefersReducedMotion]
  );

  /**
   * Run a sequence of animations
   */
  const runSequence = useCallback(
    async (steps: AnimationStep[]) => {
      if (prefersReducedMotion) {
        // Just set final state
        const finalStep = steps[steps.length - 1];
        if (finalStep) {
          await controls.set(finalStep.variant);
        }
        return;
      }

      for (const step of steps) {
        // Wait for delay if specified
        if (step.delay) {
          await new Promise((resolve) => setTimeout(resolve, step.delay! * 1000));
        }

        // Animate to variant
        await controls.start(step.variant, {
          duration: step.duration ?? undefined,
        });
      }
    },
    [controls, prefersReducedMotion]
  );

  /**
   * Reset animation to initial state
   */
  const reset = useCallback(async () => {
    await controls.start("hidden");
  }, [controls]);

  return {
    controls,
    animateTo,
    runSequence,
    reset,
    prefersReducedMotion,
  };
}

/**
 * Helper hook for common form animation patterns
 */
interface FormAnimationReturn {
  controls: ReturnType<typeof useFramerControls>;
  showError: () => Promise<void>;
  showSuccess: () => Promise<void>;
  showLoading: () => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * useFormAnimation Hook
 *
 * Provides pre-configured animations for form interactions.
 *
 * Usage example:
 *
 * ```tsx
 * function ContactForm() {
 *   const { controls, showError, showSuccess, showLoading } = useFormAnimation();
 *
 *   const handleSubmit = async () => {
 *     await showLoading();
 *
 *     try {
 *       await submitForm();
 *       await showSuccess();
 *     } catch {
 *       await showError();
 *     }
 *   };
 *
 *   return (
 *     <motion.form animate={controls}>
 *       ...
 *     </motion.form>
 *   );
 * }
 * ```
 */
export function useFormAnimation(): FormAnimationReturn {
  const { controls, animateTo, reset } = useAnimationControls();

  const showError = useCallback(async () => {
    await animateTo("shake", 0.5);
  }, [animateTo]);

  const showSuccess = useCallback(async () => {
    await animateTo("pulse", 0.3);
  }, [animateTo]);

  const showLoading = useCallback(async () => {
    await animateTo("loading", 0.3);
  }, [animateTo]);

  return {
    controls,
    showError,
    showSuccess,
    showLoading,
    reset,
  };
}
