"use client";

import * as React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/** Input state variants for animations */
const inputVariants: Variants = {
  default: {
    scale: 1,
    x: 0,
  },
  focus: {
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  error: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
  success: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.3,
    },
  },
};

export interface InputProps
  extends Omit<
    React.ComponentProps<"input">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  /** Show error state with red border and shake animation */
  error?: boolean;
  /** Show success state with green border and pulse animation */
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, success = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const [isFocused, setIsFocused] = React.useState(false);

    // Determine current variant
    const currentVariant = error ? "error" : success ? "success" : isFocused ? "focus" : "default";

    // Determine border color class based on state
    const borderColorClass = error
      ? "border-red-500 focus-visible:ring-red-400 dark:border-red-600 dark:focus-visible:ring-red-500"
      : success
      ? "border-green-500 focus-visible:ring-green-400 dark:border-green-600 dark:focus-visible:ring-green-500"
      : "border-zinc-200 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:focus-visible:ring-zinc-500";

    // If reduced motion is preferred, use regular input
    if (prefersReducedMotion) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-zinc-50 dark:placeholder:text-zinc-400",
            borderColorClass,
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <motion.input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-zinc-50 dark:placeholder:text-zinc-400",
          borderColorClass,
          className
        )}
        ref={ref}
        variants={inputVariants}
        animate={currentVariant}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
