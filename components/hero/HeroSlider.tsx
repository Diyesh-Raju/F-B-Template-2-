"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import brewery from "@/public/hero/brewery.png";
import cafe from "@/public/hero/cafe.png";
import fmcg from "@/public/hero/fmcg.png";

/**
 * A single slide of the homepage hero.
 *
 * @property image     - Imported static image rendered full-bleed (object-cover).
 * @property alt        - Alt text for the background image.
 * @property heading    - The big centered word (e.g. "BREWERY"). Elms Sans, bold.
 * @property caption    - Optional bottom-left caption lines. Elms Sans, normal.
 *                        Each array entry renders on its own line.
 */
interface HeroSlide {
  image: typeof brewery;
  alt: string;
  heading: string;
  caption?: string[];
}

const slides: HeroSlide[] = [
  {
    image: brewery,
    alt: "Grand courtyard brewery with olive trees and a crystal chandelier",
    heading: "BREWERY",
    caption: ["Brewing The Impossible,", "One Pint at a Time"],
  },
  {
    image: cafe,
    alt: "Marble café counter lined with pastries under glass domes",
    heading: "Café",
    caption: ["The Daily Ritual,", "Starts Here"],
  },
  {
    image: fmcg,
    alt: "Vine Glow grape drink can on a torn-paper background",
    heading: "FMCG",
    caption: ["Where Quality", "Never Compromises"],
  },
];

// How long each slide rests before sliding to the next, and how long the
// slide-left motion itself takes.
const HOLD_MS = 2000;
const SLIDE_MS = 900;

// Run a callback after two animation frames — long enough for the browser to
// have committed a no-transition style change before we re-enable the
// transition, so the reset never animates.
function afterTwoFrames(cb: () => void) {
  let inner = 0;
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(cb);
  });
  return () => {
    cancelAnimationFrame(outer);
    cancelAnimationFrame(inner);
  };
}

/**
 * Auto-advancing homepage hero.
 *
 * Reliability note: the track only ever sits at translateX(0) or
 * translateX(-100%) — both always show a real slide — and the deck is rotated
 * (first slide moved to the end) once the slide-left motion completes. Because
 * the transform never points past the rendered slides, the hero can never land
 * on an empty/black region, no matter how timers are throttled while the tab
 * is backgrounded. On returning to the tab (visibilitychange / bfcache
 * `pageshow`) we also snap back to a known-good state, so it never needs a
 * manual refresh.
 */
export function HeroSlider({ className }: { className?: string }) {
  // The live arrangement of slide indices. order[0] is the slide currently in
  // view. Advancing rotates the first entry to the end; going back rotates the
  // last entry to the front.
  const [order, setOrder] = useState<number[]>(() => slides.map((_, i) => i));
  const [x, setX] = useState(0); // track offset in %: 0 or -100
  const [animate, setAnimate] = useState(true);
  // True while a slide transition is in flight — blocks overlapping advances
  // from the autoplay timer and the arrow buttons.
  const busy = useRef(false);

  // Advance one slide to the left.
  const next = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setAnimate(true);
    setX(-100);
    window.setTimeout(() => {
      // Snap: drop the transition, rotate the leaving slide to the end, reset
      // the offset to 0 (same slide stays in view → seamless), then re-enable
      // the transition on the next frames.
      setAnimate(false);
      setOrder((o) => [...o.slice(1), o[0]]);
      setX(0);
      afterTwoFrames(() => {
        setAnimate(true);
        busy.current = false;
      });
    }, SLIDE_MS);
  }, []);

  // Go back one slide (slides to the right).
  const prev = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    // Park the previous slide just off-screen to the left, with no animation…
    setAnimate(false);
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
    setX(-100);
    // …then animate the track back to 0 so it reveals that previous slide.
    afterTwoFrames(() => {
      setAnimate(true);
      setX(0);
    });
    window.setTimeout(() => {
      busy.current = false;
    }, SLIDE_MS + 60);
  }, []);

  // Autoplay. The timer only advances when the tab is visible and no
  // transition is mid-flight, so backgrounding the tab can never queue up a
  // burst of advances that overshoot the deck.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      if (busy.current) return;
      next();
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [next]);

  // Whenever the tab becomes visible again or the page is restored from the
  // back/forward cache, force the track back to a clean, painted state. This
  // is what guarantees the hero is never stuck black after switching apps,
  // tabs, or returning to a previously-opened link.
  useEffect(() => {
    const resync = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      busy.current = false;
      setAnimate(false);
      setX(0);
      afterTwoFrames(() => setAnimate(true));
    };
    document.addEventListener("visibilitychange", resync);
    window.addEventListener("pageshow", resync);
    window.addEventListener("focus", resync);
    return () => {
      document.removeEventListener("visibilitychange", resync);
      window.removeEventListener("pageshow", resync);
      window.removeEventListener("focus", resync);
    };
  }, []);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        "h-[58vh] sm:h-[68vh] lg:h-[82vh]",
        className
      )}
      aria-label="Featured brands"
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(${x}%)`,
          transition: animate
            ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
            : "none",
        }}
      >
        {order.map((slideIndex) => {
          const slide = slides[slideIndex];
          return (
            <div
              key={slideIndex}
              className="relative h-full w-full shrink-0 grow-0 basis-full"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              {/* Legibility scrim — keeps white text readable over both the
                  dark courtyard and the pale café / FMCG backdrops. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/30" />

              {/* Centered heading — Elms Sans, bold. */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <h2
                  className="font-[family-name:var(--font-elms-sans)] font-bold leading-none tracking-tight text-white text-center drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]"
                  style={{ fontSize: "clamp(2.75rem, 9vw, 6.5rem)" }}
                >
                  {slide.heading}
                </h2>
              </div>

              {/* Bottom-left caption — Elms Sans, normal weight. */}
              {slide.caption && (
                <p
                  className="absolute bottom-6 left-6 sm:bottom-9 sm:left-10 font-[family-name:var(--font-elms-sans)] font-normal leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
                  style={{ fontSize: "clamp(1.05rem, 2.6vw, 1.9rem)" }}
                >
                  {slide.caption.map((line, li) => (
                    <span key={li} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev / next controls — circular arrows centered on each side. */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="group absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-offset-2 sm:left-5 sm:h-12 sm:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="group absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-offset-2 sm:right-5 sm:h-12 sm:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </section>
  );
}
