"use client";

import { useEffect, useState } from "react";

type Brew = {
  name: string;
  abv: string;
  ibu: string;
  glass: string;
  /** Panel backdrop (CSS background value). */
  bg: string;
  /** Color used for the ambient backglow behind the glass — picks up the
   *  drink's hue and bleeds it onto the scene like real bounce light. */
  glow: string;
};

// Each backdrop layers a soft top-down darken over the photo so the white
// caption at the bottom stays readable on bright frames.
const SCRIM =
  "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0) 75%)";

const BREWS: Brew[] = [
  {
    name: "Crimson Sour",
    abv: "4.60%",
    ibu: "6",
    glass: "/brewery/brew-1.png",
    bg: `${SCRIM}, url('/brewery/backdrop-crimson.jpg') center/cover no-repeat`,
    glow: "rgba(220, 50, 75, 0.7)",
  },
  {
    name: "Midnight Stout",
    abv: "5.80%",
    ibu: "34",
    glass: "/brewery/brew-2.png",
    bg: `${SCRIM}, url('/brewery/backdrop-stout.jpg') center/cover no-repeat`,
    glow: "rgba(160, 95, 50, 0.6)",
  },
  {
    name: "Belgian Witbier",
    abv: "4.20%",
    ibu: "8",
    glass: "/brewery/brew-3.png",
    bg: `${SCRIM}, url('/brewery/backdrop-witbier.jpg') center/cover no-repeat`,
    glow: "rgba(230, 190, 100, 0.55)",
  },
  {
    name: "Tiki Punch",
    abv: "6.20%",
    ibu: "0",
    glass: "/brewery/brew-4.png",
    bg: `${SCRIM}, url('/brewery/backdrop-tiki.jpg') center/cover no-repeat`,
    glow: "rgba(255, 130, 60, 0.7)",
  },
];

// Number of visible panels across the strip.
const VISIBLE = 3;
const PANEL_VW = 100 / VISIBLE; // = 33.333...

export function BrewCarousel() {
  const N = BREWS.length;
  // Three copies so prev/next stays in array bounds; snap back to the middle
  // copy when a transition lands outside [N, 2N).
  const panels = [...BREWS, ...BREWS, ...BREWS];
  const [index, setIndex] = useState(N);
  const [animated, setAnimated] = useState(true);

  // Touch detection (phones). Computed after mount so SSR markup is identical
  // for everyone and there's no hydration mismatch. On touch we hide the
  // arrows and switch the tilt/blur effect from hover to tap-to-toggle.
  const [isTouch, setIsTouch] = useState(false);
  // Which duplicated-panel index is currently "opened" by a tap (touch only).
  const [activePanel, setActivePanel] = useState<number | null>(null);

  useEffect(() => {
    // Detect touch after mount so SSR markup is identical for all viewers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const next = () => {
    setAnimated(true);
    setIndex((i) => i + 1);
  };
  const prev = () => {
    setAnimated(true);
    setIndex((i) => i - 1);
  };

  // Autoplay: advance one panel every 2.5s. Paused while a panel is tapped
  // open on touch so the user can actually look at the tilted glass instead
  // of it sliding away. Manual interactions restart the window via `index`.
  useEffect(() => {
    if (activePanel !== null) return;
    const id = setTimeout(() => {
      setAnimated(true);
      setIndex((i) => i + 1);
    }, 2500);
    return () => clearTimeout(id);
  }, [index, activePanel]);

  // After the slide animation completes, if we've drifted out of the middle
  // copy, rebase without animation so the carousel can loop endlessly.
  // Filter to the track's own transition — the glass hover transition is also
  // `transition-transform` and bubbles up here otherwise.
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (index >= 2 * N) {
      setAnimated(false);
      setIndex(index - N);
    } else if (index < N) {
      setAnimated(false);
      setIndex(index + N);
    }
  };

  // Tap-to-toggle on touch devices. Tapping the same panel again closes it.
  const togglePanel = (i: number) => {
    if (!isTouch) return;
    setActivePanel((cur) => (cur === i ? null : i));
  };

  // Re-enable animation on the frame after a rebase so the next click slides.
  // Double rAF guarantees the browser has committed the unanimated transform
  // before we flip transitions back on.
  useEffect(() => {
    if (animated) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimated(true))
    );
    return () => cancelAnimationFrame(id);
  }, [animated]);

  return (
    <section className="relative w-full overflow-hidden">
      <div
        onTransitionEnd={onTransitionEnd}
        className={`flex w-max will-change-transform [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
          animated ? "transition-transform duration-700 ease-out" : ""
        }`}
        // translate3d (rather than translateX) keeps Safari from
        // re-rasterizing the text in descendant panels every animation frame,
        // which is what causes captions to flicker on / off during the slide.
        style={{ transform: `translate3d(-${index * PANEL_VW}vw, 0, 0)` }}
      >
        {panels.map((brew, i) => (
          <BrewPanel
            key={i}
            brew={brew}
            isTouch={isTouch}
            active={activePanel === i}
            onToggle={() => togglePanel(i)}
          />
        ))}
      </div>

      {/* Arrows are desktop-only; phones auto-advance and use tap-to-tilt. */}
      {!isTouch ? (
        <>
          <ArrowButton side="left" onClick={prev} label="Previous brew" />
          <ArrowButton side="right" onClick={next} label="Next brew" />
        </>
      ) : null}
    </section>
  );
}

function BrewPanel({
  brew,
  isTouch,
  active,
  onToggle,
}: {
  brew: Brew;
  isTouch: boolean;
  active: boolean;
  onToggle: () => void;
}) {
  // On touch the tilt/blur is driven by `active` (a tap); on desktop it stays
  // hover-driven via the `group-hover:` utilities. `forced` adds the same
  // effect classes unconditionally when a panel is tapped open.
  const backdropForced = active ? "blur-md" : "";
  const glassForced = active ? "[transform:rotate(22deg)_scale(0.78)]" : "";
  const floorForced = active ? "opacity-0" : "";
  const glowForced = active ? "opacity-80" : "";
  const shadowForced = active ? "h-[2vh] w-[16vh] opacity-40" : "";
  return (
    <article
      onClick={isTouch ? onToggle : undefined}
      className={`group relative h-[90vh] min-h-[600px] w-[33.3333vw] shrink-0 overflow-hidden bg-black ${
        isTouch ? "cursor-pointer" : ""
      }`}
    >
      {/* Backdrop layer — slightly oversized so the blur on hover doesn't
          show a soft fade at the panel edges. */}
      <div
        aria-hidden="true"
        className={`absolute -inset-6 transition-[filter] duration-500 ease-out will-change-[filter] group-hover:blur-md ${backdropForced}`}
        style={{ background: brew.bg }}
      />

      {/* Bottom scrim for caption legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent"
      />

      {/* Glass stage — color-matched backglow, drop-shadowed glass, a floor
          reflection, and a soft contact shadow combine to anchor the cup in
          the scene so it reads as a real object sitting on a surface rather
          than a flat pasted cutout. On panel hover the glass tilts and the
          floor effects fade out, as if the cup were being lifted. */}
      <div className="absolute inset-x-0 top-[14%] flex justify-center">
        <div className="relative">
          {/* Ambient bounce light tinted by the drink */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[55vh] rounded-full opacity-55 blur-3xl transition-opacity duration-500 group-hover:opacity-80 ${glowForced}`}
            style={{
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(closest-side, ${brew.glow}, transparent 72%)`,
            }}
          />

          {/* Glass — layered drop shadows give it real volume in the scene */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brew.glass}
            alt={brew.name}
            className={`relative block h-[60vh] w-auto object-contain transition-transform duration-500 ease-out will-change-transform group-hover:[transform:rotate(22deg)_scale(0.78)] ${glassForced}`}
            style={{
              filter:
                "drop-shadow(0 4px 5px rgba(0,0,0,0.55)) drop-shadow(0 18px 22px rgba(0,0,0,0.45)) drop-shadow(0 50px 70px rgba(0,0,0,0.35))",
            }}
           loading="lazy" decoding="async"/>

          {/* Floor reflection — mirrored, masked so it dissolves into the
              surface. Vanishes on hover when the glass "lifts off". */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="true"
            src={brew.glass}
            alt=""
            className={`pointer-events-none absolute left-1/2 block h-[60vh] w-auto object-contain opacity-25 transition-opacity duration-500 group-hover:opacity-0 ${floorForced}`}
            style={{
              top: "calc(100% - 5vh)",
              transform: "translateX(-50%) scaleY(-1)",
              maskImage:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 28%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 28%)",
            }}
           loading="lazy" decoding="async"/>

          {/* Contact shadow — a soft ellipse directly under the base sells
              the cup as sitting on something solid. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 h-[3vh] w-[24vh] rounded-[50%] bg-black/75 blur-2xl transition-all duration-500 group-hover:h-[2vh] group-hover:w-[16vh] group-hover:opacity-40 ${shadowForced}`}
            style={{
              top: "calc(100% - 5vh)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {/* Caption — promoted to its own composited layer so Safari keeps it
          rasterized as a stable bitmap during the track's slide, instead of
          re-rendering the glyphs every frame (which makes them flicker). */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-[6vh] text-center will-change-transform [transform:translateZ(0)] [-webkit-font-smoothing:antialiased]">
        <h3 className="font-[var(--font-serif)] text-3xl text-white drop-shadow sm:text-4xl">
          {brew.name}
        </h3>
        <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-white/80">
          ABV {brew.abv} | IBU {brew.ibu}
        </p>
        {/* Tap hint — touch only. Tells the user the card is interactive. */}
        {isTouch ? (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            {active ? "click to close" : "click"}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function ArrowButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 -translate-y-1/2 ${
        isLeft ? "left-4 sm:left-6" : "right-4 sm:right-6"
      } flex h-20 w-20 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm ring-1 ring-white/15 transition hover:bg-black/60 hover:ring-white/30`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`h-10 w-10 ${isLeft ? "" : "rotate-180"}`}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
