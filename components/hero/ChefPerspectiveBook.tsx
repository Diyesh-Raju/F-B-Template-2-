"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ChefSpotlight = {
  name: string;
  role: string;
  description: string;
  image: string;
};

/** Fixed pair: left page / right page when the book is open. */
export const HOUSE_CHEFS_PAIR: readonly [ChefSpotlight, ChefSpotlight] = [
  {
    name: "Chef Mira Okonkwo",
    role: "Executive Chef",
    description:
      "Char and citrus obsessive—menus built like playlists: bright open, deep middle, clean finish.",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chef Rohan Vellani",
    role: "Pastry Lead",
    description:
      "Dark chocolate, salt, and cold cream—desserts engineered for low light and long conversations.",
    image: "/hero/chef-flambe.png",
  },
];

/** Single page on the spread. */
function ChefPage({
  chef,
  side,
  describedBy,
  pageWidth,
  pageHeight,
}: {
  chef: ChefSpotlight;
  side: "left" | "right";
  describedBy?: string;
  pageWidth: number;
  pageHeight: number;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col bg-gradient-to-b from-[#0e1018] to-[#08090e] p-4 sm:p-5",
        side === "left" ? "border-r border-white/10" : ""
      )}
      aria-describedby={describedBy}
      style={{ width: pageWidth, height: pageHeight }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.04) 11px, rgba(255,255,255,0.04) 12px)",
        }}
        aria-hidden
      />
      <div
        className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        style={{ maxWidth: Math.round(pageWidth * 0.78) }}
      >
        <Image
          src={chef.image}
          alt=""
          fill
          className="object-cover"
          sizes={`${pageWidth}px`}
        />
      </div>
      <p className="relative mt-3 text-[10px] font-medium tracking-[0.2em] text-[var(--accent-2)] sm:text-[11px]">
        {chef.role.toUpperCase()}
      </p>
      <h3 className="relative mt-1 font-[var(--font-serif)] text-base leading-snug text-white sm:text-lg">
        {chef.name}
      </h3>
      <p
        id={describedBy}
        className="relative mt-2 text-[11px] leading-relaxed text-white/70 sm:text-xs"
      >
        {chef.description}
      </p>
    </article>
  );
}

type ChefPerspectiveBookProps = {
  className?: string;
  chefs?: readonly [ChefSpotlight, ChefSpotlight];
};

/**
 * Two-page book that opens like a real hardcover sitting on a table:
 *  - The whole book stage is tilted forward (rotateX) so we see it from above.
 *  - The cover is hinged on its LEFT edge (the spine) and rotates around it.
 *  - Because the stage is tilted, the cover's swing arcs UP through the
 *    screen plane, peaks vertically, and comes DOWN on the far side —
 *    the "go up and come down" motion of opening a book.
 */
export function ChefPerspectiveBook({
  className,
  chefs = HOUSE_CHEFS_PAIR,
}: ChefPerspectiveBookProps) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [chefLeft, chefRight] = chefs;

  const [pageWidth, setPageWidth] = useState(280);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const compute = () => {
      const vw = Math.max(320, window.innerWidth || 1024);
      const maxSpread = Math.min(640, vw * 0.92);
      setPageWidth(Math.floor(maxSpread / 2));
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pageHeight = Math.round(pageWidth * 1.35);
  const spreadWidth = pageWidth * 2;
  // Generous vertical room so the cover's UP arc isn't clipped.
  const stageHeight = pageHeight + Math.round(pageWidth * 0.65);

  // Fully opaque so a closed book never lets the chef spread show through.
  const coverGradient =
    "linear-gradient(145deg, rgba(12,13,18,1) 0%, rgba(17,19,27,1) 42%, rgba(0,0,0,1) 100%)";

  // The flip pages finish their arc and fade out at roughly
  //   openDelayMs(i=0) + rotateDurationOpen + fadeDuration
  //   = (300 + 2*220) + 720 + 240 ≈ 1600ms.
  // The chef spread underneath stays hidden until then, so the chefs only
  // appear once every page has finished turning — never mid-flip.
  const chefRevealDelayMs = 1600;

  if (reduce) {
    return (
      <div
        className={cn(
          "mx-auto grid max-w-[640px] gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface)] shadow-[var(--shadow-glow)] sm:grid-cols-2",
          className
        )}
      >
        <ChefPage
          chef={chefLeft}
          side="left"
          describedBy={`${uid}-l`}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
        <ChefPage
          chef={chefRight}
          side="right"
          describedBy={`${uid}-r`}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
        <p className="col-span-full border-t border-white/10 bg-black/30 px-4 py-2 text-center text-[11px] text-white/45">
          Two-page house roster (static layout while reduced motion is on).
        </p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn("mx-auto flex w-full flex-col items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <p className="mb-5 max-w-md text-center text-sm text-white/55">
        Hover the cover—it lifts up and over, like opening a real book.
      </p>

      {/* Outer perspective scene. We give it tall height so the upward arc
         of the flipping cover isn't clipped. */}
      <div
        className="relative mx-auto"
        style={{
          width: spreadWidth,
          maxWidth: "92vw",
          height: stageHeight,
          perspective: "2000px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        {/* Tilted stage — the whole book leans toward the camera so the
           cover's Y-rotation reads as a vertical lift in screen space.
           When closed, we shift the stage right by half a page so the
           single visible cover sits centered in the perspective box;
           when open, the shift is 0 so the full spread is centered. */}
        <div
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
          style={{
            width: spreadWidth,
            height: pageHeight,
            transform: `translate(-50%,-50%) translateX(${
              open ? 0 : pageWidth / 2
            }px) rotateX(18deg)`,
            transition:
              "transform 900ms cubic-bezier(0.55, 0.05, 0.25, 1)",
          }}
        >
          {/* Spread shell — clips horizontally so only the LEFT page slot
             is visible when closed. The cover lives OUTSIDE this shell so
             it can swing freely up and over without being clipped. */}
          <div
            className="absolute left-0 top-0 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.55)] [transform-style:preserve-3d]"
            style={{
              width: open ? spreadWidth : pageWidth,
              height: pageHeight,
              transition:
                "width 900ms cubic-bezier(0.55, 0.05, 0.25, 1)",
            }}
            aria-hidden={!open}
          >
            <div
              className="flex"
              style={{
                width: spreadWidth,
                // Hidden while closed and during the flip; fades in only after
                // every page has finished turning. Closing hides it at once.
                opacity: open ? 1 : 0,
                transition: open
                  ? `opacity 320ms ease ${chefRevealDelayMs}ms`
                  : "opacity 160ms ease",
              }}
            >
              <ChefPage
                chef={chefLeft}
                side="left"
                describedBy={`${uid}-l`}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
              />
              <ChefPage
                chef={chefRight}
                side="right"
                describedBy={`${uid}-r`}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
              />
            </div>

            {/* Decorative flip pages — stacked on the right page slot.
               Each does the same down-to-up-to-down arc as the cover:
               rotates a full ~180deg around the spine, visible throughout
               the swing (no backface hiding). Once a page reaches its
               resting state on the left, it fades out so chef-left is
               revealed — i.e. cover lifts → pages turn → chefs shown. */}
            {[0, 1, 2].map((i) => {
              const total = 3;
              // Opening order: topmost page (i=total-1) flips first, so
              // each successive flip reveals the leaf beneath. After the
              // last page completes its arc, all three are faded out and
              // the chef spread is exposed.
              const openDelayMs = 300 + (total - 1 - i) * 220;
              const closeDelayMs = i * 130;
              const rotateDurationOpen = 720;
              const rotateDurationClose = 380;
              const fadeDuration = 240;
              // Opacity transition is timed to start ~100ms before the
              // rotation finishes — by then the page is past ~150deg and
              // already settling onto the left, so the cross-fade reads as
              // "page lands, then dissolves," not "page disappears in mid
              // air."
              const openFadeStart = openDelayMs + rotateDurationOpen - 100;
              const transition = open
                ? `transform ${rotateDurationOpen}ms cubic-bezier(0.55,0.05,0.25,1) ${openDelayMs}ms, opacity ${fadeDuration}ms ease ${openFadeStart}ms`
                : `transform ${rotateDurationClose}ms cubic-bezier(0.55,0.05,0.25,1) ${closeDelayMs}ms, opacity ${rotateDurationClose}ms ease ${closeDelayMs}ms`;
              return (
                <div
                  key={`flip-${i}`}
                  aria-hidden
                  className="pointer-events-none absolute top-0 overflow-hidden rounded-r-md border-r border-white/10"
                  style={{
                    left: pageWidth,
                    width: pageWidth,
                    height: pageHeight,
                    transformOrigin: "left center",
                    transform: open
                      ? "rotateY(-178deg)"
                      : "rotateY(0deg)",
                    opacity: open ? 0 : 1,
                    transition,
                    backgroundImage:
                      "linear-gradient(135deg, rgba(14,16,24,0.97) 0%, rgba(11,12,18,0.97) 60%, rgba(7,8,12,0.98) 100%)",
                    boxShadow:
                      "inset 12px 0 22px -12px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.35)",
                    zIndex: 3 + i,
                  }}
                >
                  {/* Spine shadow on the binding edge */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-full w-[10%]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.18) 35%, transparent 75%)",
                    }}
                  />
                  {/* Paper-grain lines, slightly different per page */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      opacity: 0.16 + i * 0.02,
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.04) 11px, rgba(255,255,255,0.04) 12px)",
                    }}
                  />
                  {/* Subtle warm wash so each leaf catches a hint of the
                     cover lighting as it sweeps. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 18%, rgba(255,179,71,0.10), transparent 55%)",
                    }}
                  />
                  {/* Small bottom-right serif italicized teaser, different
                     per page, so the user sees a hint of content turning. */}
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <p className="ml-auto max-w-[78%] text-right font-[var(--font-serif)] text-[11px] italic leading-snug text-white/35 sm:text-xs">
                      {i === 0
                        ? "— turning to the kitchen —"
                        : i === 1
                        ? "— two chefs, two pages —"
                        : "— next: the line cook's hand —"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Front cover — sibling of the shell, exactly 1 page wide,
             hinged on its LEFT edge (the spine). Sits on the LEFT page slot
             when closed. */}
          <div
            className={cn(
              "absolute left-0 top-0 flex flex-col justify-between overflow-hidden rounded-l-xl rounded-r-md border border-white/15 p-[10%] [backface-visibility:hidden] focus-visible:outline-none",
              open
                ? "shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                : "shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
            )}
            style={{
              width: pageWidth,
              height: pageHeight,
              transformOrigin: "left center",
              transform: open
                ? "translateZ(0px) rotateY(-176deg)"
                : "translateZ(8px) rotateY(0deg)",
              transition:
                "transform 900ms cubic-bezier(0.55, 0.05, 0.25, 1), box-shadow 900ms ease",
              backgroundImage: `${coverGradient}, radial-gradient(circle at 18% 12%, rgba(255,179,71,0.22), transparent 42%), radial-gradient(circle at 88% 88%, rgba(197,255,211,0.12), transparent 45%)`,
            }}
            tabIndex={0}
            role="button"
            aria-expanded={open}
            aria-label="House book cover. Hover or focus to flip the cover open."
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                (e.currentTarget as HTMLElement).blur();
                return;
              }
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            {/* Spine highlight on the LEFT (binding) edge */}
            <div
              className="pointer-events-none absolute left-0 top-0 h-full w-[10%] opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 30%, transparent 70%), linear-gradient(90deg, hsla(0,0%,100%,0.18) 8%, hsla(0,0%,100%,0) 30%)",
              }}
              aria-hidden
            />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] text-[var(--accent)]">
                  NOCTURNE
                </p>
                <p className="mt-3 font-[var(--font-serif)] text-2xl leading-tight text-white sm:text-3xl">
                  House
                  <br />
                  Roster
                </p>
                <p className="mt-3 max-w-[95%] text-[11px] leading-relaxed text-white/55">
                  Two chefs, two pages—lift the cover for the full spread.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] tracking-[0.2em] text-white/40">
                  HOVER TO OPEN
                </span>
                <span
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-[var(--accent-2)]"
                  aria-hidden
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 7a5 5 0 0 0-5-5H4.5A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22H7a5 5 0 0 0 5-5v-10Z" />
                    <path d="M12 7a5 5 0 0 1 5-5h2.5A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5H17a5 5 0 0 1-5-5v-10Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
