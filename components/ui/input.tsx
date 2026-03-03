"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends Omit<
  React.ComponentPropsWithRef<"input">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  /** Visual state of the input */
  state?: "default" | "error" | "success";
  /** @deprecated Use `state="error"` instead */
  /** Show error state with red border and shake animation */
  error?: boolean;
  /** @deprecated Use `state="success"` instead */
  /** Show success state with green border and pulse animation */
  success?: boolean;
}

function Input({
  className,
  type,
  state,
  error = false,
  success = false,
  ref,
  ...props
}: InputProps) {
  const resolvedState =
    state ?? (error ? "error" : success ? "success" : "default");

  // Determine border color class based on state
  const borderColorClass =
    resolvedState === "error"
      ? "border-red-500 focus-visible:ring-red-400 dark:border-red-600 dark:focus-visible:ring-red-500"
      : resolvedState === "success"
        ? "border-green-500 focus-visible:ring-green-400 dark:border-green-600 dark:focus-visible:ring-green-500"
        : "border-slate-200 focus-visible:ring-slate-400 dark:border-slate-700/30 dark:focus-visible:ring-slate-600/40";

  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400",
        borderColorClass,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { Input };
