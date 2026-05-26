"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = {
  /** 0 → 1 scroll progress for the hero, supplied by ScrollScrubVideoHero. */
  progress: MotionValue<number>;
};

/**
 * Two text states for the cafe hero scrub:
 *
 *  - Intro (starts at 0, hidden — fades in once the user begins scrolling):
 *      "Your Daily Escape Starts Here"
 *      So the hero still looks like a clean video at rest, then the line
 *      appears the moment scroll engages.
 *  - Outro (~0.86 → 1):
 *      "Nocturne Cafe / Where Every Cup Tells a Story"
 *      Rises in with a gentle perspective tilt for the closing reveal.
 */
export function CafeHeroOverlay({ progress }: Props) {
  // Intro — invisible at progress 0 so the very-start frame stays clean,
  // fades in quickly as the user starts scrolling, then fades out before
  // the outro reveal.
  const introOpacity = useTransform(
    progress,
    [0.0, 0.04, 0.5, 0.62],
    [0, 1, 1, 0]
  );
  const introY = useTransform(progress, [0.5, 0.62], ["0%", "-8%"]);
  const introScale = useTransform(progress, [0.5, 0.62], [1, 0.94]);

  // Outro — name plate, rises in at the end with a perspective tilt.
  const outroOpacity = useTransform(progress, [0.82, 0.94, 1.0], [0, 1, 1]);
  const outroY = useTransform(progress, [0.82, 0.94], ["10%", "0%"]);
  const outroScale = useTransform(progress, [0.82, 0.94], [0.94, 1]);
  const outroRotateX = useTransform(progress, [0.82, 0.94], [14, 0]);

  return (
    <>
      {/* Cinematic vignette + bottom scrim for legibility over bright frames. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.55) 95%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        }}
      />

      {/* Intro line */}
      <motion.div
        style={{ opacity: introOpacity, y: introY, scale: introScale }}
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
      >
        <h1
          className="max-w-5xl font-[var(--font-bogue)] text-4xl font-bold leading-[1.08] tracking-tight text-[#ffffff] [text-shadow:0_6px_30px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your Daily Escape Starts Here
        </h1>
      </motion.div>

      {/* Outro — perspective container so rotateX reads in 3D. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          style={{
            opacity: outroOpacity,
            y: outroY,
            scale: outroScale,
            rotateX: outroRotateX,
            transformOrigin: "50% 100%",
          }}
        >
          <h2 className="font-[var(--font-bogue)] text-5xl font-bold leading-[1.05] tracking-tight text-[#ffffff] [text-shadow:0_10px_50px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl lg:text-8xl">
            Nocturne Cafe
          </h2>
          <p className="mt-4 font-[var(--font-bogue)] text-2xl italic leading-snug tracking-tight text-[#ffffff]/90 [text-shadow:0_6px_30px_rgba(0,0,0,0.85)] sm:text-3xl md:text-4xl lg:text-5xl">
            Where Every Cup Tells a Story
          </p>
        </motion.div>
      </div>
    </>
  );
}
