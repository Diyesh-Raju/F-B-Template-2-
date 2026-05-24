"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

// Each card uses the natural aspect ratio of its image so nothing gets cropped.
// Width is fixed per breakpoint; height is derived from the aspect ratio.
const projects: Array<{
  title: string;
  src: string;
  aspect: string;
  caption: string;
}> = [
  {
    title: "Almond croissants",
    src: "/cafe/cards/almond-croissants.png",
    aspect: "583 / 826",
    caption: "Delicious baked goods!",
  },
  {
    title: "Coffee is our love language",
    src: "/cafe/cards/coffee-shirt.png",
    aspect: "736 / 981",
    caption: "Friendly staff",
  },
  {
    title: "Lit cake",
    src: "/cafe/cards/lit-cake.png",
    aspect: "736 / 1313",
    caption: "Artistic perfection in every angle",
  },
  {
    title: "Pastry tray",
    src: "/cafe/cards/pastry-tray.png",
    aspect: "736 / 1104",
    caption: "Baked Fresh Every Morning.",
  },
];

const ScrollCaption = ({
  text,
  progress,
  index,
  total,
}: {
  text: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) => {
  // Each caption owns the slot [index*slice, (index+1)*slice]. Fade-in and
  // fade-out happen ENTIRELY within the slot, so caption N is fully gone by
  // the time caption N+1 starts appearing — no two captions are ever both
  // partially visible at the same progress value.
  const opacity = useTransform(progress, (p) => {
    const slice = 1 / total;
    const slotStart = index * slice;
    const slotEnd = slotStart + slice;
    const fade = slice * 0.15;

    const isFirst = index === 0;
    const isLast = index === total - 1;

    if (!isFirst && p <= slotStart) return 0;
    if (!isLast && p >= slotEnd) return 0;

    if (!isFirst && p < slotStart + fade) {
      return (p - slotStart) / fade;
    }
    if (!isLast && p > slotEnd - fade) {
      return Math.max(0, (slotEnd - p) / fade);
    }
    return 1;
  });

  return (
    <motion.p
      style={{ opacity, gridArea: "1 / 1" }}
      className="font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-amber-50 [text-shadow:0_2px_18px_rgba(0,0,0,0.75)] md:text-4xl lg:text-5xl"
    >
      {text}
    </motion.p>
  );
};

const StickyCard_001 = ({
  i,
  title,
  src,
  aspect,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  src: string;
  aspect: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 15 + 200}px)`,
          aspectRatio: aspect,
        }}
        className="rounded-2xl sm:rounded-3xl lg:rounded-4xl relative -top-1/4 flex origin-top flex-col overflow-hidden
                   w-[240px]
                   sm:w-[280px]
                   md:w-[320px]
                   lg:w-[360px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const ImagesScrollingAnimation = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main
      ref={container}
      className="relative isolate flex w-full flex-col items-center justify-center
                 pb-[50vh] pt-[5vh]
                 sm:pb-[60vh] sm:pt-[8vh]
                 lg:pb-[70vh] lg:pt-[10vh]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="sticky top-0 h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/cafe/cafe-interior-bg.jpg')" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        <div className="sticky top-0 mx-auto flex h-screen w-full max-w-7xl items-center justify-end px-8 lg:px-16">
          <div className="grid max-w-xs text-right lg:max-w-sm">
            {projects.map((project, i) => (
              <ScrollCaption
                key={`c_${i}`}
                text={project.caption}
                progress={scrollYProgress}
                index={i}
                total={projects.length}
              />
            ))}
          </div>
        </div>
      </div>
      {projects.map((project, i) => {
        const targetScale = Math.max(0.6, 1 - (projects.length - i - 1) * 0.08);
        return (
          <StickyCard_001
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </main>
  );
};

export { ImagesScrollingAnimation, StickyCard_001 };
