"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * 21st.dev ContainerScroll template, adapted for this site:
 *  - Card box is sized to the menu image's natural aspect (736×1041, ~5:7
 *    portrait), so the entire image fits inside without any cropping.
 *  - The heading sits in normal document flow ABOVE the scroll-locked
 *    container, so it always appears below the previous section without
 *    overlapping into it — and the rotateX / scale parallax on the card
 *    is untouched.
 */
export function MenuShowcase() {
  return (
    <section className="pt-16 sm:pt-20 md:pt-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
          OUR MENU
        </p>
        <h2 className="mt-4 font-[var(--font-serif)] text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl md:text-5xl">
          Seasonally Inspired
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
          A short, deliberate list — pulled, steamed, and poured to order.
          Prices and seasonal pours rotate weekly.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-4 text-center sm:mt-14">
        <h3 className="font-[var(--font-serif)] text-3xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl md:text-5xl">
          Our menu
        </h3>
      </div>

      <ContainerScroll>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cafe/menu-board-wide.png"
          alt="Cafe menu board with espresso, cappuccino, latte and other coffee drinks"
          className="block h-full w-full object-contain"
         loading="lazy" decoding="async"/>
      </ContainerScroll>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-4 text-center sm:pb-28 md:pb-32">
        <h3
          className="text-3xl font-normal leading-[1.15] tracking-tight text-[var(--fg)] sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-fascinate)" }}
        >
          From Our Kitchen to Your Table
        </h3>
      </div>
    </section>
  );
}

function ContainerScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = (): [number, number] => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());

  return (
    // Tall container so the user has room to scroll the rotate/scale parallax
    // through. Bumped up to accommodate the portrait card.
    <div
      ref={containerRef}
      className="relative flex h-[36rem] items-center justify-center p-2 md:h-[52rem] md:p-10"
    >
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <CardFrame rotate={rotate} scale={scale}>
          {children}
        </CardFrame>
      </div>
    </div>
  );
}

function CardFrame({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        // Card matches the menu image's natural aspect so the entire image
        // fits inside without cropping, regardless of viewport width.
        aspectRatio: "1408 / 704",
      }}
      className="mx-auto w-[min(80rem,96vw)] rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:p-6"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-2">
        {children}
      </div>
    </motion.div>
  );
}
