import type { Transition, Variants } from "framer-motion";

export type MotionPresetName =
  | "fadeIn"
  | "fadeUp"
  | "scaleIn"
  | "slideInLeft"
  | "slideInRight"
  | "staggerChildren";

export const easeOutSoft: Transition["ease"] = [0.16, 1, 0.3, 1];

export function baseTransition(duration = 0.6): Transition {
  return { duration, ease: easeOutSoft };
}

export function getPresetVariants(
  preset: MotionPresetName,
  opts?: { distance?: number }
): Variants {
  const d = opts?.distance ?? 18;

  switch (preset) {
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      };
    case "fadeUp":
      return {
        hidden: { opacity: 0, y: d, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "scaleIn":
      return {
        hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
        show: { opacity: 1, scale: 1, filter: "blur(0px)" },
      };
    case "slideInLeft":
      return {
        hidden: { opacity: 0, x: -d, filter: "blur(6px)" },
        show: { opacity: 1, x: 0, filter: "blur(0px)" },
      };
    case "slideInRight":
      return {
        hidden: { opacity: 0, x: d, filter: "blur(6px)" },
        show: { opacity: 1, x: 0, filter: "blur(0px)" },
      };
    case "staggerChildren":
      return {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08, delayChildren: 0.04 },
        },
      };
    default: {
      const _exhaustive: never = preset;
      return _exhaustive;
    }
  }
}

