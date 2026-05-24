"use client";

import { Reveal } from "@/components/motion/Reveal";

type FeatureRow = {
  eyebrow: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  /** Side the image sits on at lg+ ("left" or "right"). */
  imageSide: "left" | "right";
  imageMaxWidthClass: string;
};

const ROWS: FeatureRow[] = [
  {
    eyebrow: "Seasonal",
    title: "The art of matcha",
    body: "Stone-ground ceremonial matcha, whisked to order and layered over orange, coconut, strawberry, or cold fresh milk. Grassy, sweet, and quietly bright — a slow ritual in a glass.",
    src: "/cafe/matcha-art.png",
    alt: "The Art of Matcha — orange, coconut, dirty, and strawberry matcha drinks",
    imageSide: "left",
    imageMaxWidthClass: "max-w-[420px]",
  },
  {
    eyebrow: "Slow pour",
    title: "Coffee, unhurried",
    body: "A single shot pulled long, poured over ice and milk while you watch. No rush, no noise — just the room, the pour, and a clean, lingering finish.",
    src: "/cafe/coffee-pour.png",
    alt: "Espresso poured over an iced milk glass",
    imageSide: "right",
    imageMaxWidthClass: "max-w-[380px]",
  },
];

export function CafeFeatureRows() {
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
              {/* Image */}
              <Reveal
                preset={imageFirstOnDesktop ? "slideInLeft" : "slideInRight"}
                className={
                  imageFirstOnDesktop ? "lg:order-1" : "lg:order-2"
                }
              >
                <div
                  className={`mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.45)] ${row.imageMaxWidthClass}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.src}
                    alt={row.alt}
                    className="block h-auto w-full object-cover"
                  />
                </div>
              </Reveal>

              {/* Description */}
              <Reveal
                preset={imageFirstOnDesktop ? "slideInRight" : "slideInLeft"}
                transition={{ delay: 0.08 }}
                className={
                  imageFirstOnDesktop ? "lg:order-2" : "lg:order-1"
                }
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
