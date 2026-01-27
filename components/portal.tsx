"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  /**
   * Optional container selector. Defaults to document.body.
   */
  containerId?: string;
};

/**
 * Portal component that renders children into document.body (or a custom container).
 * Ensures client-only rendering to prevent hydration mismatches.
 * Safe for React Strict Mode - mounts and unmounts cleanly.
 */
export function Portal({ children, containerId }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const isMountingRef = useRef(false);

  useEffect(() => {
    if (!isMountingRef.current) {
      isMountingRef.current = true;
      // Schedule state update to avoid synchronous setState in effect
      queueMicrotask(() => setMounted(true));
    }
    return () => {
      setMounted(false);
      isMountingRef.current = false;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const container = containerId
    ? document.getElementById(containerId)
    : document.body;

  if (!container) {
    console.warn(`Portal: Container "${containerId}" not found, falling back to body`);
    return createPortal(children, document.body);
  }

  return createPortal(children, container);
}
