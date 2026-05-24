"use client";

import { Reveal } from "@/components/motion/Reveal";

type Feature = {
  title: string;
  description: string;
  icon: string;
  alt: string;
};

const FEATURES: Feature[] = [
  {
    title: "Nature-inspired Ambience",
    description:
      "A refined setting infused with lush greenery and nature-led design, creating a visually rich and immersive atmosphere.",
    icon: "/brewery/icon-nature.png",
    alt: "Palm tree",
  },
  {
    title: "Award Winning Crafts",
    description:
      "Celebrated craftsmanship defined by balance, depth, and distinctive character.",
    icon: "/brewery/icon-crafts.png",
    alt: "Mug of beer",
  },
  {
    title: "Global Cusine",
    description:
      "Celebrated craftsmanship defined by balance, depth, and distinctive character.",
    icon: "/brewery/icon-cuisine.png",
    alt: "Plate with fork and knife",
  },
  {
    title: "Live Music & Vibes",
    description:
      "Music and soundscapes designed to shape the moment.",
    icon: "/brewery/icon-music.png",
    alt: "Music note",
  },
];

export function FeatureStrip() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-20 sm:py-28">
      {/* Decorative pots in the side margins. Wrapper has a fixed width and
          an inward left/right offset so the pot lives in the gap between
          the section edge and the first/last card without ever overlapping
          them. Object-contain inside lets the pot keep its aspect ratio
          while still spanning the icon-top → description-bottom height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-20 left-4 w-40 select-none sm:inset-y-28 sm:left-8 sm:w-44 md:left-10 md:w-48 lg:left-14 lg:w-56"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brewery/pot.png?v=4"
          alt=""
          className="h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-20 right-4 w-40 select-none sm:inset-y-28 sm:right-8 sm:w-44 md:right-10 md:w-48 lg:right-14 lg:w-56"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brewery/pot.png?v=4"
          alt=""
          className="h-full w-full -scale-x-100 object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 sm:gap-x-10 md:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal
              key={feature.title}
              preset="fadeUp"
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex h-full flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.icon}
                    alt={feature.alt}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
                  />
                </div>
                <h3 className="mt-6 flex min-h-[4rem] items-center justify-center font-[var(--font-display)] text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                  {feature.title}
                </h3>
                <div className="mt-5 w-full rounded-2xl bg-[#048C66] px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:px-6 sm:py-5">
                  <p className="font-[var(--font-serif)] text-sm font-medium leading-6 text-white/95">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
