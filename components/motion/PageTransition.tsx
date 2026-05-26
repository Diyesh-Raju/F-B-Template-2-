"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Page transition wrapper.
 *
 * Animates ONLY opacity — NEVER a transform. The wrapper contains every
 * page, and many pages mount `position: sticky` children (the scroll-scrub
 * video heroes, the boat banner, the iPad menu showcase, the sticky scroll
 * cards). Any non-`none` transform on an ancestor creates a containing
 * block, which makes `sticky` resolve against the transformed ancestor
 * instead of the viewport — silently breaking every pinned hero and parallax
 * section. Keeping this opacity-only avoids that footgun.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 1 } : { opacity: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
        }
        style={{ willChange: "opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

