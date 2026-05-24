"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * 21st.dev ContainerScroll template, adapted for this site:
 *  - Card box is sized to the menu image's natural aspect (736×1041, ~5:7
 *    portrait), so the entire image fits inside without any cropping.
 *  - Outer container height adjusts to give the user enough scroll room for
 *    the rotateX / scale parallax to play through.
 */
export function MenuShowcase() {
  return (
    <ContainerScroll
      titleComponent={
        <>
          <p className="text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
            CAFE MENU
          </p>
          <h2 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Today&apos;s pour list. <br />
            <span className="italic text-white/70">Espresso to nightcap.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            A short, deliberate list — pulled, steamed, and poured to order.
            Prices and seasonal pours rotate weekly.
          </p>
        </>
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cafe/menu-board-wide.png"
        alt="Cafe menu board with espresso, cappuccino, latte and other coffee drinks"
        className="block h-full w-full object-contain"
      />
    </ContainerScroll>
  );
}

function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
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
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    // Tall container so the user has room to scroll the rotate/scale parallax
    // through. Bumped up to accommodate the portrait card.
    <div
      ref={containerRef}
      className="relative flex h-[44rem] items-center justify-center p-2 md:h-[60rem] md:p-10"
    >
      <div className="relative w-full py-6 md:py-12" style={{ perspective: "1000px" }}>
        <Header translate={translate}>{titleComponent}</Header>
        <CardFrame rotate={rotate} scale={scale}>
          {children}
        </CardFrame>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-3xl px-4 text-center"
    >
      {children}
    </motion.div>
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
      className="-mt-8 mx-auto w-[min(80rem,96vw)] rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:-mt-12 md:p-6"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-2">
        {children}
      </div>
    </motion.div>
  );
}
