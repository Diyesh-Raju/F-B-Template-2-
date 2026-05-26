"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Wide parallax banner — modeled on the Old Mill brewing "Crafted with Care"
 * strip. The image layer is rendered at its natural aspect ratio (so nothing
 * gets cropped) and translates from "bottom of image visible" to "top of
 * image visible" as the section traverses the viewport, so the user sees the
 * entire illustration top-to-bottom over the course of the scroll.
 */
export function CoffeeBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Translate range is the difference between image-layer height and section
  // height — measured at runtime so it stays correct across viewport sizes.
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;

    const measure = () => {
      setTravel(Math.max(0, layer.offsetHeight - section.offsetHeight));
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(layer);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 0 = section's start (top edge) at viewport's end (bottom) — just entering
    // 1 = section's end (bottom edge) at viewport's start (top) — just leaving
    offset: ["start end", "end start"],
  });

  // progress 0  →  translateY = -travel  (image shifted up, BOTTOM of image
  //                                        sits at top of the bar window)
  // progress 1  →  translateY = 0        (image at neutral, TOP of image
  //                                        sits at top of the bar window)
  // The two endpoints together expose every pixel of the image during the
  // scroll-through.
  const y = useTransform(scrollYProgress, [0, 1], [-travel, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden"
      style={{ height: "clamp(360px, 60vh, 560px)" }}
      aria-label="Crafted with care — view the cafe menu"
    >
      {/* Parallax image layer — sized to its natural aspect ratio at the bar's
          full width, so the image is never cropped. Anchored at top-0 and
          translates upward as the section moves up the viewport. */}
      <motion.div
        ref={layerRef}
        aria-hidden="true"
        style={{
          y,
          backgroundImage: "url('/cafe/coffee-illustration.png')",
          aspectRatio: "1200 / 675",
        }}
        className="absolute inset-x-0 top-0 w-full bg-cover bg-center bg-no-repeat"
      />

      {/* Soft dark wash so the white type reads cleanly over the illustration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/55"
      />

      {/* Foreground content — three columns on desktop, stacked on small screens. */}
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
        <div className="grid w-full items-center gap-6 sm:gap-8 md:grid-cols-[auto_1fr_auto] md:gap-12">
          {/* Left: chunky stacked headline */}
          <div className="font-[var(--font-cherry-bomb)] text-4xl leading-[1.15] tracking-tight text-[#ffffff] [text-shadow:0_4px_20px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
            Fuel your day,
            <br />
            Nourish your Soul
          </div>

          {/* Center: italic tagline stack */}
          <div className="space-y-3 text-center md:space-y-4 md:text-left lg:text-center">
            <p className="font-[var(--font-serif)] text-2xl italic tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-4xl">
              Sourced with Care.
            </p>
            <p className="font-[var(--font-serif)] text-2xl italic tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-4xl">
              Roasted by Hand.
            </p>
            <p className="font-[var(--font-serif)] text-2xl italic tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-4xl">
              Poured Fresh.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex justify-center md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(255,179,71,0.35)] transition hover:brightness-110 focus-visible:outline-offset-4"
            >
              Explore the Cafe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

