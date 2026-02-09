/**
 * Skeleton Loading Components
 *
 * Lightweight skeleton loaders for better perceived performance.
 * Prevents Cumulative Layout Shift (CLS) by maintaining layout during loading.
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800",
        className
      )}
    />
  );
}

/**
 * GitHub contributions heatmap skeleton
 */
export function GithubContributionsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 84 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3" />
        ))}
      </div>
    </div>
  );
}

/**
 * Blog post row skeleton
 */
export function BlogRowSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-20 w-20 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * Project card skeleton
 */
export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-900 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Experience card skeleton
 */
export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-900 p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-12 rounded-full" />
        ))}
      </div>
    </div>
  );
}
