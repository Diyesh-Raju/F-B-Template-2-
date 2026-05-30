"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  baseTransition,
  getPresetVariants,
  presetDuration,
  type MotionPresetName,
} from "@/lib/motion/presets";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

// Mirrors framer-motion's internal (non-exported) `MarginType` so the `margin`
// prop is type-checked against the same shape `useInView` accepts.
type MarginValue = `${number}${"px" | "%"}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

type RevealProps = HTMLMotionProps<"div"> & {
  preset?: MotionPresetName;
  /** Only animate the first time we enter view; never re-trigger. Default true. */
  once?: boolean;
  /**
   * IntersectionObserver root margin. Default trips the reveal ~80px before
   * the element fully enters the viewport so the page feels responsive.
   */
  margin?: MarginType;
  /** Override the per-preset translate distance (px). */
  distance?: number;
};

// Trigger the reveal just before the element fully enters the viewport. Using
// a root *margin* (not an area threshold) is what makes this reliable across
// devices: an `amount`-based trigger requires a fraction of the element to be
// on screen, which tall sections on short laptops/phones can never satisfy —
// they'd stay stuck at opacity:0. A negative bottom margin fires as soon as
// the element's leading edge crosses 80px above the viewport bottom.
const DEFAULT_MARGIN: MarginType = "0px 0px -80px 0px";

/**
 * Reveal mounts in `hidden` state and only animates to `show` once the element
 * crosses the IntersectionObserver margin. With `once=false` it goes back to
 * `hidden` when scrolled away and re-animates on re-entry.
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(function Reveal(
  {
    preset = "fadeUp",
    once = true,
    margin = DEFAULT_MARGIN,
    distance,
    transition,
    variants,
    style,
    ...props
  },
  forwardedRef
) {
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement | null>(null);
  // Latches true once the show animation finishes so we can drop the
  // `will-change` layer hint and stop paying for a promoted compositor layer.
  const [settled, setSettled] = useState(false);
  // Safety net for flaky deployments/browsers where the initial
  // IntersectionObserver callback never lands: if the element is actually
  // within the viewport but still hidden, reveal it so content is never
  // stranded invisible.
  const [forced, setForced] = useState(false);

  const setRef = useMemo(() => {
    return (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
  }, [forwardedRef]);

  // useInView returns true while the element intersects the margin-adjusted
  // viewport. With `once: true` it latches the first time it becomes true.
  const inView = useInView(localRef, { once, margin });

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

  // Safety net: a little after mount, if the observer hasn't reported us in
  // view yet but we're genuinely on screen, force the reveal. Scoped to the
  // viewport check so below-the-fold elements keep their normal scroll reveal.
  useEffect(() => {
    if (reduce) return;
    const el = localRef.current;
    if (!el) return;
    const check = () => {
      if (!el.isConnected) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (rect.top < vh && rect.bottom > 0) setForced(true);
    };
    const t = window.setTimeout(check, 1200);
    // Late layout shifts (image/font loads) can move us into view after the
    // first paint — re-check once everything settles.
    window.addEventListener("load", check, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", check);
    };
  }, [reduce]);

  const show = inView || forced;

  return (
    <motion.div
      ref={setRef}
      initial={reduce ? false : "hidden"}
      animate={reduce ? "show" : show ? "show" : "hidden"}
      variants={computedVariants}
      transition={
        reduce
          ? { duration: 0 }
          : { ...baseTransition(presetDuration(preset)), ...transition }
      }
      onAnimationComplete={() => {
        if (show) setSettled(true);
      }}
      {...props}
      style={{
        // Promote to its own layer only while it still has an animation to
        // play; drop the hint once settled to avoid permanent layer bloat.
        willChange: reduce || settled ? undefined : "transform, opacity",
        ...style,
      }}
    />
  );
});
