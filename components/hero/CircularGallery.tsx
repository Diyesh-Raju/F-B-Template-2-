"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { useLenisScroll } from "@/components/providers/lenis-scroll-context";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  title: string;
  subtitle: string;
  image: string;
};

type CircularGalleryProps = {
  items: GalleryItem[];
  /** Vh of scroll space the pinned section consumes (controls scrub length). */
  scrollDistanceVh?: number;
  /** Distance from the rotation axis to each card. */
  radius?: number;
  className?: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Pinned, scroll-driven circular 3D gallery.
 *
 *  - Section is `scrollDistanceVh` tall; an inner panel is `position: sticky`
 *    so it pins to the viewport while the outer section scrolls past.
 *  - Scroll progress (0 → 1) maps to a rotation of (items.length − 1) ×
 *    anglePerItem, so progress 0 puts item 0 at the front and progress 1
 *    lands the LAST item at the front. After that, the section ends and the
 *    page resumes its normal vertical scroll.
 *  - Rotation is driven by Lenis ticks for smoothness; no CSS transition on
 *    the rotating element so it tracks the scroll exactly.
 */
export function CircularGallery({
  items,
  scrollDistanceVh = 260,
  radius,
  className,
}: CircularGalleryProps) {
  const reduce = useReducedMotion();
  const { lenisActive, subscribeScroll } = useLenisScroll();

  const sectionRef = useRef<HTMLElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [computedRadius, setComputedRadius] = useState(radius ?? 460);
  const [cardSize, setCardSize] = useState({ w: 280, h: 380 });

  /** Total rotation from progress 0 → 1 (degrees). */
  const totalRotationDeg = (items.length - 1) * (360 / items.length);
  const anglePerItem = 360 / items.length;

  useEffect(() => {
    const compute = () => {
      const vw = Math.max(320, window.innerWidth || 1024);
      const vh = Math.max(480, window.innerHeight || 800);

      // Card size scales with viewport so the ring always fits.
      const w = Math.round(Math.min(320, Math.max(180, vw * 0.22)));
      const h = Math.round(w * 1.32);
      setCardSize({ w, h });

      // Radius keeps the ring inside the viewport even at progress=0.
      // We pick a radius such that the front card is fully visible.
      const idealRadius = radius ?? Math.round(Math.min(vw * 0.32, vh * 0.42));
      setComputedRadius(idealRadius);
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, [radius]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mounted = true;
    let rafId = 0;
    let isVisible = true;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const maxTravel = Math.max(1, rect.height - vh);
      const traveled = clamp01(-rect.top / maxTravel);
      setProgress(traveled);
      setRotation(traveled * totalRotationDeg);
    };

    const flush = () => {
      if (!mounted || !isVisible) return;
      rafId = 0;
      updateProgress();
    };

    const schedule = () => {
      if (!isVisible || rafId) return;
      rafId = window.requestAnimationFrame(flush);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updateProgress();
          schedule();
        } else if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(section);

    const unsubs: Array<() => void> = [];
    if (lenisActive) {
      unsubs.push(subscribeScroll(schedule));
    } else {
      const onScroll = () => schedule();
      window.addEventListener("scroll", onScroll, { passive: true });
      unsubs.push(() => window.removeEventListener("scroll", onScroll));
    }

    const onResize = () => schedule();
    window.addEventListener("resize", onResize, { passive: true });
    unsubs.push(() => window.removeEventListener("resize", onResize));

    updateProgress();

    return () => {
      mounted = false;
      io.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      for (const u of unsubs) u();
    };
  }, [lenisActive, subscribeScroll, totalRotationDeg]);

  if (reduce) {
    return (
      <section className={cn("relative bg-[color:var(--bg)] py-16", className)}>
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal preset="fadeUp" className="text-center">
            <p className="text-xs font-medium tracking-[0.22em] text-white/55">
              PERFECT FOR EVERY OCCASION
            </p>
            <h2 className="mt-3 font-[var(--font-serif)] text-3xl text-white sm:text-4xl">
              A night for every kind of crew
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-white/80 bg-[color:var(--surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/70"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover brightness-[1.14] contrast-[1.06]"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/18 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="font-[var(--font-serif)] text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--accent-2)]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cn("relative bg-[color:var(--bg)]", className)}
      style={{ height: `${scrollDistanceVh}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 60%, rgba(255,179,71,0.10), transparent 55%), radial-gradient(circle at 30% 30%, rgba(197,255,211,0.08), transparent 55%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.6), transparent 60%)",
          }}
        />

        <div className="relative z-10 mt-10 px-4 text-center sm:mt-14">
          <Reveal preset="fadeUp">
            <p className="text-[10px] font-medium tracking-[0.28em] text-[var(--accent)] sm:text-xs">
              PERFECT FOR EVERY OCCASION
            </p>
            <h2 className="mt-3 font-[var(--font-serif)] text-3xl leading-tight text-white sm:text-5xl">
              A night for every kind of crew
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
              Scroll to spin the room—six rooms, six moods, one address.
            </p>
          </Reveal>
        </div>

        <div
          className="relative flex flex-1 w-full items-center justify-center"
          style={{ perspective: "2200px", perspectiveOrigin: "50% 55%" }}
        >
          <div
            className="relative"
            style={{
              width: cardSize.w,
              height: cardSize.h,
              transformStyle: "preserve-3d",
              transform: `rotateY(${-rotation}deg)`,
              willChange: "transform",
            }}
          >
            {items.map((item, i) => {
              const itemAngle = i * anglePerItem;
              const visible = ((itemAngle - rotation) % 360 + 360) % 360;
              const dist = visible > 180 ? 360 - visible : visible;
              const opacity = Math.max(0.3, 1 - dist / 150);
              const isFront = dist < anglePerItem * 0.6;
              return (
                <article
                  key={item.title}
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-2xl border border-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_28px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/70"
                  )}
                  style={{
                    transform: `rotateY(${itemAngle}deg) translateZ(${computedRadius}px)`,
                    opacity,
                    transition: "opacity 240ms linear",
                    backfaceVisibility: "hidden",
                  }}
                  aria-hidden={!isFront}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover brightness-[1.14] contrast-[1.06]"
                    sizes={`${cardSize.w}px`}
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/22 to-transparent" />
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      isFront ? "opacity-0" : "opacity-40"
                    )}
                    style={{ background: "rgba(0,0,0,0.28)" }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <p className="text-[10px] font-medium tracking-[0.22em] text-[var(--accent-2)]">
                      0{i + 1}
                    </p>
                    <h3 className="mt-1 font-[var(--font-serif)] text-xl leading-tight text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/70">
                      {item.subtitle}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <Reveal
          preset="fadeUp"
          className="pointer-events-none relative z-10 mb-10 w-[min(420px,80%)]"
        >
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.18em] text-white/55">
            <span>SCROLL TO REVOLVE</span>
            <span>
              {Math.min(items.length, Math.round(progress * (items.length - 1)) + 1)}
              {" / "}
              {items.length}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
