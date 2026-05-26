"use client";

import { Reveal } from "@/components/motion/Reveal";

type Occasion = {
  label: string;
  image: string;
  alt: string;
};

const TOP_ROW: Occasion[] = [
  {
    label: "Friend's Nightout",
    image: "/brewery/bar-night.png",
    alt: "Friends enjoying a night out",
  },
  {
    label: "Family Dinner",
    image: "/brewery/pillared-day.png",
    alt: "Family dinner gathering",
  },
  {
    label: "Birthday Party",
    image: "/brewery/backdrop-crimson.jpg",
    alt: "Birthday celebration",
  },
];

const BOTTOM_ROW: Occasion[] = [
  {
    label: "Couple's Date",
    image: "/brewery/backdrop-witbier.jpg",
    alt: "Couple on a date",
  },
  {
    label: "Brunch Plans",
    image: "/brewery/pillared-night.png",
    alt: "Brunch gathering with friends",
  },
  {
    label: "Team Party",
    image: "/brewery/backdrop-tiki.jpg",
    alt: "Team celebration",
  },
];

export function OccasionsGrid() {
  return (
    <section className="w-full bg-black py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {TOP_ROW.map((item, i) => (
            <Reveal
              key={item.label}
              preset="fadeUp"
              transition={{ delay: i * 0.08 }}
            >
              <OccasionCard occasion={item} />
            </Reveal>
          ))}
        </div>

        <Reveal preset="fadeUp" transition={{ delay: 0.1 }}>
          <h2
            className="my-14 text-center text-5xl font-normal leading-[1.15] tracking-tight text-white sm:my-20 sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-fascinate)" }}
          >
            Perfect for Every Occasion
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {BOTTOM_ROW.map((item, i) => (
            <Reveal
              key={item.label}
              preset="fadeUp"
              transition={{ delay: i * 0.08 }}
            >
              <OccasionCard occasion={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <article className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={occasion.image}
        alt={occasion.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div className="relative flex h-full w-full items-center justify-center px-4">
        <h3 className="font-[var(--font-display)] text-2xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-3xl">
          {occasion.label}
        </h3>
      </div>
    </article>
  );
}
