"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { baseTransition, getPresetVariants, type MotionPresetName } from "@/lib/motion/presets";

type RevealProps = HTMLMotionProps<"div"> & {
  preset?: MotionPresetName;
  once?: boolean;
  amount?: number;
  distance?: number;
};

export function Reveal({
  preset = "fadeUp",
  once = true,
  amount = 0.25,
  distance,
  transition,
  viewport,
  variants,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  const computedVariants = variants ?? getPresetVariants(preset, { distance });

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{
        once,
        amount,
        ...viewport,
      }}
      variants={computedVariants}
      transition={
        reduce
          ? { duration: 0 }
          : (transition ?? baseTransition(preset === "fadeIn" ? 0.45 : 0.65))
      }
      {...props}
    />
  );
}

