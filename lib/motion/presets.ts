import type { Transition, Variants } from "framer-motion";

export type MotionPresetName =
  | "fadeIn"
  | "fadeUp"
  | "fadeUpLg"
  | "scaleIn"
  | "slideInLeft"
  | "slideInRight"
  | "blurIn"
  | "staggerChildren";

// Out-quint: very soft tail — buttery, slow finish that lets the eye track
// the motion through the last few percent.
export const easeOutSoft: Transition["ease"] = [0.16, 1, 0.3, 1];

export function baseTransition(duration = 1.0): Transition {
  return { duration, ease: easeOutSoft };
}

export function getPresetVariants(
  preset: MotionPresetName,
  opts?: { distance?: number }
): Variants {
  const d = opts?.distance ?? 36;

  switch (preset) {
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      };
    case "fadeUp":
      return {
        hidden: { opacity: 0, y: d },
        show: { opacity: 1, y: 0 },
      };
    case "fadeUpLg":
      // Bigger displacement for hero/feature sections — more cinematic.
      return {
        hidden: { opacity: 0, y: d * 1.6 },
        show: { opacity: 1, y: 0 },
      };
    case "scaleIn":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        show: { opacity: 1, scale: 1 },
      };
    case "slideInLeft":
      return {
        hidden: { opacity: 0, x: -d * 1.4 },
        show: { opacity: 1, x: 0 },
      };
    case "slideInRight":
      return {
        hidden: { opacity: 0, x: d * 1.4 },
        show: { opacity: 1, x: 0 },
      };
    case "blurIn":
      return {
        hidden: { opacity: 0, y: d * 0.6, filter: "blur(14px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "staggerChildren":
      return {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.12, delayChildren: 0.06 },
        },
      };
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

/** Default per-preset duration tuning — slower for richer reveals. */
export function presetDuration(preset: MotionPresetName): number {
  switch (preset) {
    case "fadeIn":
      return 0.9;
    case "fadeUp":
      return 1.05;
    case "fadeUpLg":
      return 1.25;
    case "scaleIn":
      return 1.1;
    case "slideInLeft":
    case "slideInRight":
      return 1.15;
    case "blurIn":
      return 1.2;
    case "staggerChildren":
      return 1.0;
  }
}
