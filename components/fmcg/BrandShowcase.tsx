"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const BRANDS = [
  { src: "/fmcg/brand-loreal.png", alt: "L'Oréal Paris" },
  { src: "/fmcg/brand-amul.png", alt: "Amul" },
  { src: "/fmcg/brand-unilever.png", alt: "Unilever" },
  { src: "/fmcg/brand-nestle.png", alt: "Nestlé" },
];

const ROTATE_MS = 2800;

export function BrandShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // One-shot trigger: as soon as ~30% of the section is in view, the iPad
  // smoothly tweens open (rotateX 45 → 0, scale 0.86 → 1, opacity 0 → 1).
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <div
      ref={sectionRef}
      className="relative flex h-[46rem] items-center justify-center p-2 md:h-[62rem] md:p-8"
    >
      <div
        className="relative w-full py-4 md:py-10"
        style={{ perspective: "1200px" }}
      >
        <div className="mx-auto max-w-5xl pb-6 text-center">
          <p className="font-[var(--font-sans)] text-xs font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
            Brand Showcasing
          </p>
          <h2 className="mt-3 font-[var(--font-serif)] text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Trusted by the brands you{" "}
            <span className="text-[var(--accent)]">already buy</span>
          </h2>
        </div>

        <motion.div
          initial={{ rotateX: 45, scale: 0.86, opacity: 0 }}
          animate={
            inView
              ? { rotateX: 0, scale: 1, opacity: 1 }
              : { rotateX: 45, scale: 0.86, opacity: 0 }
          }
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transformOrigin: "center bottom",
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="relative mx-auto mt-4 h-[36rem] w-full max-w-[1200px] rounded-[28px] border border-white/15 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-1.5 ring-1 ring-black/40 md:h-[48rem] md:rounded-[36px] md:p-2"
        >
          {/* Glass-rim highlight along the top edge */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white md:rounded-[30px]">
            <BrandSlider />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BrandSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % BRANDS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = BRANDS[i];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={current.src}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[55%] max-w-[55%] object-contain"
           loading="lazy" decoding="async"/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
