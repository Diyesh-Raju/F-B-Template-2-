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
        <h1 className="max-w-5xl font-[var(--font-bogue)] text-4xl font-bold leading-[1.08] tracking-tight text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-7xl">
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
          }}
          className="font-[var(--font-bogue)] text-6xl font-bold uppercase tracking-tight text-white [text-shadow:0_10px_50px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Nocturne Logistics
        </motion.h2>
      </div>
    </>
  );
}
