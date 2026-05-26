"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = {
  /** 0 → 1 scroll progress for the hero section, provided by
   *  ScrollScrubVideoHero's render-prop child. */
  progress: MotionValue<number>;
};

/**
 * Two text states that fade in/out as the brewery hero video scrubs.
 *
 *  - Intro (0 → ~0.35): "Soluna Brewhouse" + "Curated to Perfection"
 *  - Outro (~0.78 → 1):  "Good friends, good beer, good times!"
 *
 * Both blocks live in the same absolutely-positioned layer so the fades
 * cross-dissolve smoothly without layout shift.
 */
export function BreweryHeroOverlay({ progress }: Props) {
  // Intro card: fully visible from the very first frame, holds through the
  // entire walk-through, then fades out at the very end just before the bar
  // shot lands.
  const introOpacity = useTransform(
    progress,
    [0.0, 0.78, 0.88],
    [1, 1, 0]
  );
  // Subtle parallax lift on the intro — drifts up as it fades.
  const introY = useTransform(progress, [0.78, 0.88], ["0%", "-8%"]);

  // Outro card: takes over immediately after the intro clears, sitting on
  // the final bar-counter beat through the end of the scroll.
  const outroOpacity = useTransform(
    progress,
    [0.85, 0.94, 1.0],
    [0, 1, 1]
  );
  // Slight rise-in from below for the outro.
  const outroY = useTransform(progress, [0.85, 0.94], ["6%", "0%"]);

  return (
    <>
      <motion.div
        style={{ opacity: introOpacity, y: introY }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-[var(--font-display)] text-5xl font-black leading-[0.95] tracking-tight text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.75)] sm:text-6xl md:text-7xl lg:text-8xl">
          Soluna Brewhouse
        </h1>
        <p className="mt-6 font-[var(--font-serif)] text-xl italic tracking-wide text-white/90 [text-shadow:0_3px_18px_rgba(0,0,0,0.75)] sm:text-2xl md:mt-8 md:text-3xl lg:text-4xl">
          Curated to Perfection
        </p>
      </motion.div>

      <motion.div
        style={{ opacity: outroOpacity, y: outroY }}
        className="absolute inset-0 flex items-center justify-start px-6 text-left sm:px-12 md:px-16 lg:px-24"
      >
        <p
          className="max-w-lg text-4xl leading-[1.15] tracking-tight text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-rampart-one)" }}
        >
          Good friends,
          <br />
          Good beer,
          <br />
          Great times!
        </p>
      </motion.div>
    </>
  );
}
