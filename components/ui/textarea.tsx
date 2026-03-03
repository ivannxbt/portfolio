"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends Omit<
  React.ComponentPropsWithRef<"textarea">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  /** Visual state of the textarea */
  state?: "default" | "error" | "success";
  /** @deprecated Use `state="error"` instead */
  /** Show error state with red border and shake animation */
  error?: boolean;
  /** @deprecated Use `state="success"` instead */
  /** Show success state with green border and pulse animation */
  success?: boolean;
}

function Textarea({
  className,
  state,
  error = false,
  success = false,
  ref,
  ...props
}: TextareaProps) {
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
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-slate-500 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:placeholder:text-slate-400",
        borderColorClass,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { Textarea };
