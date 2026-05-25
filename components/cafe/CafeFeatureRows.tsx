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
  /** Optional themed background that bleeds full-bleed to the viewport edges
   *  for just this row. */
  theme?: "green" | "brown";
};

const THEME_BG: Record<NonNullable<FeatureRow["theme"]>, string> = {
  green: "#1D5200",
  brown: "#6F4E37",
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
    theme: "green",
  },
  {
    eyebrow: "Slow pour",
    title: "Coffee, unhurried",
    body: "A single shot pulled long, poured over ice and milk while you watch. No rush, no noise — just the room, the pour, and a clean, lingering finish.",
    src: "/cafe/coffee-pour.png",
    alt: "Espresso poured over an iced milk glass",
    imageSide: "right",
    imageMaxWidthClass: "max-w-[380px]",
    theme: "brown",
  },
];

export function CafeFeatureRows() {
  return (
    <div className="flex flex-col gap-24 pt-28 sm:gap-32 sm:pt-40">
      {ROWS.map((row) => (
        <RowSection key={row.title} row={row} />
      ))}
    </div>
  );
}

function RowSection({ row }: { row: FeatureRow }) {
  const imageFirstOnDesktop = row.imageSide === "left";
  const isThemed = row.theme !== undefined;

  // Themed rows get larger headings and hard-coded white via arbitrary-value
  // class so the cream-theme .text-white remap doesn't override it.
  const headingClass = isThemed
    ? "mt-4 font-[var(--font-serif)] text-4xl leading-tight tracking-tight text-[#ffffff] sm:text-5xl md:text-6xl"
    : "mt-4 font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl";
  const eyebrowClass = isThemed
    ? "text-xs font-medium tracking-[0.22em] text-[#ffffff]/70"
    : "text-xs font-medium tracking-[0.22em] text-[var(--accent)]";
  const bodyClass = isThemed
    ? "mt-5 text-base leading-7 text-[#ffffff]/80 sm:text-lg"
    : "mt-5 text-base leading-7 text-white/65 sm:text-lg";

  const inner = (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Image */}
      <Reveal
        preset={imageFirstOnDesktop ? "slideInLeft" : "slideInRight"}
        className={imageFirstOnDesktop ? "lg:order-1" : "lg:order-2"}
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
        className={imageFirstOnDesktop ? "lg:order-2" : "lg:order-1"}
      >
        <div className="max-w-xl">
          <div className={eyebrowClass}>{row.eyebrow.toUpperCase()}</div>
          <h2 className={headingClass}>{row.title}</h2>
          <p className={bodyClass}>{row.body}</p>
        </div>
      </Reveal>
    </div>
  );

  // Themed row: full-bleed colored section, content centered inside a max-w
  // wrapper. Padding on the section gives the colored band its visual height.
  if (isThemed) {
    return (
      <section
        className="w-full py-20 sm:py-28"
        style={{ backgroundColor: THEME_BG[row.theme!] }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{inner}</div>
      </section>
    );
  }

  // Default row: standard max-width container, no background.
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{inner}</div>
  );
}
