"use client";

import { Reveal } from "@/components/motion/Reveal";

type MachineRow = {
  eyebrow: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  /** Side the image sits on at lg+ ("left" or "right"). */
  imageSide: "left" | "right";
};

const ROWS: MachineRow[] = [
  {
    eyebrow: "xBloom",
    title: "Original",
    body: "Grinder, scale, and pour-over routine collapsed into a single push-button ritual. Drop a bean disc, tap once, and the machine dials the dose, water temperature, and bloom curve for you — café-grade extraction without the morning fuss.",
    src: "/cafe/xbloom-original.png",
    alt: "Two xBloom Original pour-over machines side-by-side on a wooden console",
    imageSide: "left",
  },
  {
    eyebrow: "Breville",
    title: "The Barista Express",
    body: "A built-in conical burr grinder feeds straight into the portafilter, the steam wand textures milk for proper latte art, and the PID-controlled boiler holds temperature shot after shot. The fastest path from whole bean to a balanced double in your own kitchen.",
    src: "/cafe/breville-barista-express.png",
    alt: "Breville Barista Express espresso machine with grinder, milk jug, and bean bag",
    imageSide: "right",
  },
];

export function CafeMachinesShowcase() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col gap-16 sm:gap-24">
        {ROWS.map((row) => {
          const imageFirstOnDesktop = row.imageSide === "left";
          return (
            <div
              key={row.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              {/* Image — box sized to the 43coffee.com reference (≈ 6:5
                  aspect). Photo fills via object-cover. */}
              <Reveal
                preset={imageFirstOnDesktop ? "slideInLeft" : "slideInRight"}
                className={imageFirstOnDesktop ? "lg:order-1" : "lg:order-2"}
              >
                <div className="mx-auto aspect-[6/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.src}
                    alt={row.alt}
                    className="block h-full w-full object-cover"
                  />
                </div>
              </Reveal>

              {/* Description */}
              <Reveal
                preset={imageFirstOnDesktop ? "slideInRight" : "slideInLeft"}
                transition={{ delay: 0.08 }}
                className={imageFirstOnDesktop ? "lg:order-2" : "lg:order-1"}
              >
                <div className="max-w-xl">
                  <div className="text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
                    {row.eyebrow.toUpperCase()}
                  </div>
                  <h2 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl">
                    {row.title}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-white/65 sm:text-lg">
                    {row.body}
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
