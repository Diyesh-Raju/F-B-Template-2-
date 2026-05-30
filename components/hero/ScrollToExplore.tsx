"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Shared "Scroll to explore" cue for the scroll-scrub heroes (FMCG, Cafe,
 * Brewery — never the home page). Pinned to the bottom-center of the hero on
 * every viewport (desktop + mobile), it fades in the moment the hero settles
 * and fades back out as soon as the user starts scrubbing, so it never
 * collides with an outro name plate.
 *
 * Animation budget: opacity + transform only (no layout properties), with a
 * `will-change: transform` hint and a smooth-deceleration feel. The bouncing
 * chevron is gated behind `motion-safe:` so reduced-motion users get a static
 * cue.
 */
export function ScrollToExplore({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  // Fade in quickly once the hero is at rest, hold, then fade out as the
  // scrub begins. Driven entirely by the hero's own scroll progress so it
  // stays in lockstep with the video + overlay text.
  const opacity = useTransform(progress, [0, 0.04, 0.16, 0.26], [0, 1, 1, 0]);
  // Gentle upward drift as it leaves — transform only, no layout thrash.
  const y = useTransform(progress, [0.16, 0.26], [0, -16]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, y, willChange: "transform" }}
      className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center text-white sm:bottom-9"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.34em] [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] sm:text-sm">
        Scroll to explore
      </span>
      <svg
        className="mt-1.5 motion-safe:animate-bounce"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </motion.div>
  );
}
