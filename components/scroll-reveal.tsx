'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * ScrollReveal - Lightweight Intersection Observer wrapper for CSS animations
 *
 * Replaces Framer Motion's whileInView for better performance.
 * Uses native Intersection Observer API + CSS animations.
 */

interface ScrollRevealProps {
  children: ReactNode;
  /** CSS animation class to apply when in view (e.g., "animate-fade-in-up") */
  animation?: string;
  /** Root margin for intersection observer (default: "0px 0px -100px 0px") */
  rootMargin?: string;
  /** Threshold for triggering (default: 0.1) */
  threshold?: number;
  /** Optional delay in milliseconds */
  delay?: number;
  /** Custom className to merge */
  className?: string;
}

export function ScrollReveal({
  children,
  animation = 'animate-fade-in-up',
  rootMargin = '0px 0px -100px 0px',
  threshold = 0.1,
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state
    element.style.opacity = '0';
    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element enters viewport
            entry.target.classList.add(animation);
            // Disconnect after animating once (for performance)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animation, rootMargin, threshold, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Hook version for more flexibility
 */
export function useScrollReveal(options: {
  animation?: string;
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const {
    animation = 'animate-fade-in-up',
    rootMargin = '0px 0px -100px 0px',
    threshold = 0.1,
  } = options;

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.opacity = '0';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animation);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animation, rootMargin, threshold]);

  return ref;
}
