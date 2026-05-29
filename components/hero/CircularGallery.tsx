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
  /** Optional small-caps category shown above the title. */
  category?: string;
};

type CircularGalleryProps = {
  items: GalleryItem[];
  /** Vh of scroll space the pinned section consumes (controls scrub length). */
  scrollDistanceVh?: number;
  /** Accepted for backwards compatibility; no longer used by the coverflow. */
  radius?: number;
  className?: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

// Cover Flow geometry (modeled on obsidian-blade's "Global Portfolio"): a big
// flat center card, side cards translated outward, pushed back, turned toward
// the middle, scaled down, and faded. `off` is the signed (and fractional, so
// the scroll scrub interpolates smoothly) distance from the centered card.
function transformFor(off: number, cardW: number) {
  const a = Math.abs(off);
  const s = Math.sign(off);
  // Wide horizontal spread so cards fan toward the edges like the reference.
  const tx = s * cardW * (a <= 1 ? a * 1.0 : 1.0 + (a - 1) * 0.44);
  const tz = -a * cardW * 0.45;
  // Ramp the turn: ~46° by one step out, steeper beyond that.
  const ry = -s * (Math.min(a, 1) * 46 + Math.max(0, a - 1) * 18);
  const scale = Math.max(0.46, 1 - a * 0.17);
  const opacity = Math.max(0, 1 - a * 0.42);
  const z = 100 - Math.round(a * 10);
  return { tx, tz, ry, scale, opacity, z };
}

/**
 * Pinned, scroll-driven Cover Flow gallery.
 *
 *  - Section is `scrollDistanceVh` tall; an inner panel is `position: sticky`
 *    so it pins to the viewport while the outer section scrolls past.
 *  - Scroll progress (0 → 1) maps to a continuous Cover Flow position
 *    (0 → items.length − 1): progress 0 centers the first card, progress 1
 *    centers the last. Cards interpolate as you scroll, so the scrub feel is
 *    identical to before — only the appearance/spacing/sizing changed to match
 *    the obsidian-blade reference.
 *  - Kept on the site's dark theme.
 */
export function CircularGallery({
  items,
  scrollDistanceVh = 260,
  className,
}: CircularGalleryProps) {
  const reduce = useReducedMotion();
  const { lenisActive, subscribeScroll } = useLenisScroll();
  const n = items.length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [cardW, setCardW] = useState(360);
  const [perSide, setPerSide] = useState(2);
  // Phones (≤767px) get a tap/swipe carousel instead of the scroll-pinned
  // coverflow. Computed after mount so SSR markup is identical for everyone.
  const [isMobile, setIsMobile] = useState(false);

  const cardH = Math.round(cardW * 1.45);
  // Continuous Cover Flow position: 0 → n-1 across the scroll runway.
  const position = progress * (n - 1);
  const currentIndex = Math.min(n - 1, Math.round(position));

  useEffect(() => {
    const compute = () => {
      const vw = Math.max(320, window.innerWidth || 1024);
      // Large flat center card like the reference, capped so the fan fits.
      const w = Math.round(Math.min(460, Math.max(200, vw * 0.28)));
      setCardW(w);
      setPerSide(vw < 680 ? 1 : 2);
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // The scroll-driven coverflow is desktop-only; phones use the arrow/swipe
    // carousel below, so skip attaching scroll listeners there.
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    let mounted = true;
    let rafId = 0;
    let isVisible = true;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const maxTravel = Math.max(1, rect.height - vh);
      setProgress(clamp01(-rect.top / maxTravel));
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
  }, [lenisActive, subscribeScroll, isMobile]);

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
                className="overflow-hidden rounded-[26px] border border-white/15 bg-[color:var(--surface)] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
              >
                <div className="relative aspect-[5/7]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    {item.category && (
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                        {item.category}
                      </p>
                    )}
                    <h3 className="mt-1 font-[var(--font-serif)] text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      <span className="text-[var(--accent)]">•</span> {item.subtitle}
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

  if (isMobile) {
    return <CoverflowMobile items={items} className={className} />;
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
            <p className="text-[10px] font-medium tracking-[0.3em] text-[var(--accent)] sm:text-xs">
              PERFECT FOR EVERY OCCASION
            </p>
            <h2 className="mt-3 font-[var(--font-serif)] text-3xl leading-tight text-white sm:text-5xl">
              A night for every kind of crew
            </h2>
          </Reveal>
        </div>

        {/* Cover Flow stage */}
        <div
          className="relative flex w-full flex-1 items-center justify-center"
          style={{ perspective: "1900px", perspectiveOrigin: "50% 50%" }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
          >
            {items.map((item, i) => {
              const off = i - position;
              const { tx, tz, ry, scale, opacity, z } = transformFor(off, cardW);
              const isFront = Math.abs(off) < 0.5;
              const hidden = Math.abs(off) > perSide + 1;
              return (
                <article
                  key={item.title}
                  className="absolute overflow-hidden rounded-[26px] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                  style={{
                    width: cardW,
                    height: cardH,
                    marginLeft: -cardW / 2,
                    marginTop: -cardH / 2,
                    transform: `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    opacity: hidden ? 0 : opacity,
                    zIndex: z,
                    willChange: "transform, opacity",
                  }}
                  aria-hidden={!isFront}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes={`${cardW}px`}
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
                    {item.category ? (
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)] sm:text-[11px]">
                        {item.category}
                      </p>
                    ) : (
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)] sm:text-[11px]">
                        0{i + 1}
                      </p>
                    )}
                    <h3 className="mt-1 font-[var(--font-serif)] text-xl leading-tight text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/70 sm:text-sm">
                      <span className="text-[var(--accent)]">•</span> {item.subtitle}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Position counter — obsidian-style */}
        <div className="relative z-10 mb-10 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.18em] text-white">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-white/25" />
          <span className="text-white/45">{String(n).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}

/**
 * Phone coverflow: same visual card fan as the desktop version, but driven by
 * an integer active index instead of scroll. Two arrows below the cards step
 * through, and swiping left/right on the cards themselves advances them. No
 * pinned/scroll-jacked section — the gallery sits inline at its natural
 * height, so the page scrolls normally past it.
 */
function CoverflowMobile({
  items,
  className,
}: {
  items: GalleryItem[];
  className?: string;
}) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [cardW, setCardW] = useState(220);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const vw = Math.max(320, window.innerWidth || 360);
      setCardW(Math.round(Math.min(300, Math.max(180, vw * 0.62))));
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  const cardH = Math.round(cardW * 1.45);
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + n) % n);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 36) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const cardTransition =
    "transform 480ms cubic-bezier(0.22,1,0.36,1), opacity 480ms ease";

  return (
    <section
      className={cn("relative overflow-hidden bg-[color:var(--bg)] py-12", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 55%, rgba(255,179,71,0.10), transparent 55%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />

      <div className="relative z-10 px-4 text-center">
        <Reveal preset="fadeUp">
          <p className="text-[10px] font-medium tracking-[0.3em] text-[var(--accent)]">
            PERFECT FOR EVERY OCCASION
          </p>
          <h2 className="mt-3 font-[var(--font-serif)] text-3xl leading-tight text-white">
            A night for every kind of crew
          </h2>
        </Reveal>
      </div>

      {/* Card stage — swipe to advance */}
      <div
        className="relative z-10 mt-8 flex w-full items-center justify-center"
        style={{ perspective: "1600px", height: cardH }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
        >
          {items.map((item, i) => {
            const off = i - index;
            const { tx, tz, ry, scale, opacity, z } = transformFor(off, cardW);
            const hidden = Math.abs(off) > 2;
            const isFront = off === 0;
            return (
              <article
                key={item.title}
                className="absolute overflow-hidden rounded-[24px] border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transform: `translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  opacity: hidden ? 0 : opacity,
                  zIndex: z,
                  transition: cardTransition,
                  willChange: "transform, opacity",
                }}
                aria-hidden={!isFront}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes={`${cardW}px`}
                  draggable={false}
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-5">
                  {item.category ? (
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
                      {item.category}
                    </p>
                  ) : (
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
                      0{i + 1}
                    </p>
                  )}
                  <h3 className="mt-1 font-[var(--font-serif)] text-xl leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/70">
                    <span className="text-[var(--accent)]">•</span>{" "}
                    {item.subtitle}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Arrows below the photos */}
      <div className="relative z-10 mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 text-white transition active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="flex items-center gap-2 text-sm font-medium tracking-[0.18em] text-white">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-white/25" />
          <span className="text-white/45">{String(n).padStart(2, "0")}</span>
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 text-white transition active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
