"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = {
  /** 0 → 1 scroll progress for the hero, supplied by ScrollScrubVideoHero. */
  progress: MotionValue<number>;
};

/**
 * Two text states that cross-dissolve as the logistics video scrubs.
 *
 *  - Intro (0 → ~0.45): "Seamless delivery, from source to store."
 *      Holds over the outdoor / journey footage, then fades + drifts up
 *      as the camera enters the warehouse.
 *  - Outro (~0.86 → 1):  "Nocturne Logistics"
 *      Rises in with a subtle perspective tilt at the end of the scrub
 *      for a "name plate" reveal that feels like it pops toward the viewer.
 *
 * Both blocks live in the same absolutely-positioned layer so the fades
 * cross-dissolve smoothly without layout shift. A cinematic vignette and a
 * soft bottom gradient sit behind them for legibility.
 */
export function FmcgHeroOverlay({ progress }: Props) {
  // Intro — visible from frame 0; fades out as warehouse interior arrives.
  const introOpacity = useTransform(progress, [0.0, 0.42, 0.55], [1, 1, 0]);
  const introY = useTransform(progress, [0.42, 0.55], ["0%", "-8%"]);
  const introScale = useTransform(progress, [0.42, 0.55], [1, 0.94]);

  // Outro — name plate, rises in at the end with a perspective tilt.
  const outroOpacity = useTransform(progress, [0.82, 0.94, 1.0], [0, 1, 1]);
  const outroY = useTransform(progress, [0.82, 0.94], ["10%", "0%"]);
  const outroScale = useTransform(progress, [0.82, 0.94], [0.94, 1]);
  const outroRotateX = useTransform(progress, [0.82, 0.94], [14, 0]);

  // Phone-only "scroll" prompt. Starts just under the hero text, then glides
  // down to the bottom of the screen as the hero scrubs — staying visible the
  // whole time so it always reads as a scroll cue.
  const scrollHintTop = useTransform(progress, [0, 0.5], ["60%", "88%"]);
  const scrollHintOpacity = useTransform(progress, [0, 0.06], [0, 1]);

  return (
    <>
      {/* Cinematic vignette — depth + focus to the centre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.55) 95%)",
        }}
      />
      {/* Soft bottom scrim so text reads on bright frames. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        }}
      />

      {/* Intro */}
      <motion.div
        style={{ opacity: introOpacity, y: introY, scale: introScale }}
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
      >
        <h1
          className="max-w-5xl text-4xl font-bold leading-[1.08] tracking-tight text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-bogue)" }}
        >
          Seamless delivery,
          <br />
          from source to store.
        </h1>
      </motion.div>

      {/* Outro — perspective container so rotateX reads in 3D. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{ perspective: "1200px" }}
      >
        <motion.h2
          style={{
            opacity: outroOpacity,
            y: outroY,
            scale: outroScale,
            rotateX: outroRotateX,
            transformOrigin: "50% 100%",
            fontFamily: "var(--font-bogue)",
          }}
          className="text-6xl font-bold uppercase tracking-tight text-white [text-shadow:0_10px_50px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Nocturne Logistics
        </motion.h2>
      </div>

      {/* Phone-only scroll cue — under the text, then drops to the bottom. */}
      <motion.div
        style={{ top: scrollHintTop, opacity: scrollHintOpacity }}
        className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-white md:hidden"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.32em] [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
          Scroll
        </span>
        <svg
          className="mt-1 animate-bounce"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </>
  );
}
