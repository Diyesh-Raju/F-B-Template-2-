"use client";

import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  baseTransition,
  getPresetVariants,
  presetDuration,
  type MotionPresetName,
} from "@/lib/motion/presets";
import { forwardRef, useEffect, useMemo, useRef } from "react";

type RevealProps = HTMLMotionProps<"div"> & {
  preset?: MotionPresetName;
  /** Only animate the first time we enter view; never re-trigger. Default true. */
  once?: boolean;
  /** Fraction of the element that must be in view for a trigger (0–1). */
  amount?: number;
  /** Override the per-preset translate distance (px). */
  distance?: number;
};

/**
 * Reveal mounts in `hidden` state and only animates to `show` once the element
 * actually intersects the viewport. With `once=false` it goes back to `hidden`
 * when scrolled away and re-animates on re-entry.
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  {
    preset = "fadeUp",
    once = true,
    amount = 0.15,
    distance,
    transition,
    variants,
    ...props
  },
  forwardedRef
) {
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRef = useMemo(() => {
    return (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
  }, [forwardedRef]);

  // useInView returns true while the element intersects (subject to `amount`).
  // With `once: true` it latches the first time it becomes true and never goes
  // back to false — which is exactly the "appear once on scroll" behavior the
  // user wants.
  const inView = useInView(localRef, { once, amount });

  const computedVariants = variants ?? getPresetVariants(preset, { distance });

  // Reduced motion: skip everything, render at the rest state with no animation.
  useEffect(() => {
    if (!reduce) return;
    const el = localRef.current;
    if (!el) return;
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.filter = "none";
  }, [reduce]);

  return (
    <motion.div
      ref={setRef}
      initial={reduce ? false : "hidden"}
      animate={reduce ? "show" : inView ? "show" : "hidden"}
      variants={computedVariants}
      transition={
        reduce
          ? { duration: 0 }
          : { ...baseTransition(presetDuration(preset)), ...transition }
      }
      {...props}
    />
  );
});
