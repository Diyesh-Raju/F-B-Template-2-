"use client";

import { Reveal } from "@/components/motion/Reveal";

const PANEL =
  "relative overflow-hidden rounded-3xl border border-black/10 bg-white text-black shadow-[0_18px_50px_rgba(0,0,0,0.45)]";

export function Distribution() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="space-y-5">
        {/* Hero stats — "Nocturne at a glance" row of four highlights */}
        <Reveal preset="fadeUp">
          <h2 className="font-[var(--font-serif)] text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl">
            Nocturne at a glance
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "20+ years", sub: "of presence in India" },
            { stat: "50+", sub: "FMCG brands in India" },
            { stat: "90,000+", sub: "Direct Distribution to Retail Stores in India" },
            { stat: "₹12,000 Cr", sub: "Crore turnover in FY 2025-2026" },
          ].map((item, i) => (
            <Reveal key={item.stat} preset="fadeUp" transition={{ delay: i * 0.06 }}>
              <div className={`${PANEL} flex h-full min-h-[180px] flex-col justify-center p-6 sm:p-7`}>
                <div className="font-[var(--font-serif)] text-3xl font-bold leading-[1.05] text-black sm:text-4xl">
                  {item.stat}
                </div>
                <p className="mt-2 font-[var(--font-sans)] text-sm leading-6 text-black/75 sm:text-base">
                  {item.sub}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Row — Organization (full width since the Backroom Executives box
            beside it was removed) */}
        <Reveal preset="fadeUp">
          <div
            className={`${PANEL} flex min-h-[220px] flex-col justify-center p-6 sm:min-h-[240px] sm:p-8`}
          >
            <div className="font-[var(--font-serif)] text-3xl font-bold leading-[1.05] text-black sm:text-4xl">
              Organization of
            </div>
            <div className="mt-1 font-[var(--font-serif)] text-3xl font-bold leading-[1.05] text-black sm:text-4xl">
              1,800+ People
            </div>
            <p className="mt-4 max-w-sm font-[var(--font-sans)] text-sm leading-6 text-black/75 sm:text-base">
              comprised of dedicated resale and backroom teams.
            </p>
          </div>
        </Reveal>

        {/* Row — Pan India + branches/warehouses */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div className={`${PANEL} h-full min-h-[220px] p-6 sm:min-h-[240px] sm:p-8`}>
              <div className="relative z-10 max-w-[58%]">
                <h3 className="font-[var(--font-serif)] text-3xl font-bold leading-tight text-black sm:text-4xl">
                  PAN INDIA Distribution
                </h3>
                <p className="mt-4 font-[var(--font-sans)] text-base leading-7 text-black/75">
                  Our status as{" "}
                  <span className="underline decoration-black/60 underline-offset-4">
                    PAN India FMCG distributors
                  </span>{" "}
                  ensures your products are available in every state.
                </p>
              </div>
              <IndiaShape className="absolute right-2 top-1/2 h-[80%] -translate-y-1/2 sm:right-4" />
            </div>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div
              className={`${PANEL} flex h-full min-h-[220px] flex-col justify-between p-6 sm:min-h-[240px] sm:p-8`}
            >
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-black sm:text-6xl">
                    40
                  </div>
                  <div className="mt-3 font-[var(--font-sans)] text-sm leading-snug text-black/75 sm:text-base">
                    Physical
                    <br />
                    Branches
                  </div>
                </div>
                <div>
                  <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-black sm:text-6xl">
                    4
                  </div>
                  <div className="mt-3 font-[var(--font-sans)] text-sm leading-snug text-black/75 sm:text-base">
                    Mother
                    <br />
                    Warehouses
                  </div>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fmcg/warehouse-real.png"
                alt="Modern logistics warehouse exterior at dusk"
                className="mt-6 h-28 w-full rounded-2xl object-cover ring-1 ring-black/10 sm:h-32"
              />
            </div>
          </Reveal>
        </div>

        {/* Row — Revenue + international brands */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div className={`${PANEL} h-full min-h-[220px] p-6 sm:min-h-[240px] sm:p-8`}>
              <div className="relative z-10">
                <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-black sm:text-6xl">
                  900+
                </div>
                <div className="mt-3 font-[var(--font-sans)] text-base leading-snug text-black/85 sm:text-lg">
                  Crore FY 24-25
                </div>
              </div>
              <BarChart className="absolute bottom-6 right-6 h-[55%] w-[50%]" />
            </div>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div className={`${PANEL} h-full min-h-[220px] p-6 sm:min-h-[240px] sm:p-8`}>
              <div className="relative z-10">
                <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-black sm:text-6xl">
                  17
                </div>
                <div className="mt-3 font-[var(--font-sans)] text-base leading-snug text-black/85 sm:text-lg">
                  International Brands
                </div>
              </div>
              <BottleTile className="absolute -right-6 top-1/2 h-[110%] w-[55%] -translate-y-1/2 opacity-70" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* — Decorative placeholders — drawn in SVG / CSS gradients so the layout
 *   reads at the right density without needing real photography. Swap any
 *   of these out for an <img> when the real assets land.                */

function IndiaShape({ className }: { className?: string }) {
  // Real cartographic India map. PNG has a transparent backdrop (the navy
  // surround was alpha-cut so only the map silhouette + state outlines
  // composite onto the green panel).
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/fmcg/india-map.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ objectFit: "contain", objectPosition: "right center" }}
    />
  );
}


function BarChart({ className }: { className?: string }) {
  // Rising bars with a subtle line over the top.
  const bars = [10, 14, 18, 22, 28, 36, 44, 52, 62, 72, 84, 96];
  return (
    <svg
      viewBox="0 0 220 110"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 18 + 4}
          y={108 - h}
          width="5"
          height={h}
          fill="url(#barFill)"
        />
      ))}
      <polyline
        points={bars
          .map((h, i) => `${i * 18 + 6.5},${108 - h - 4}`)
          .join(" ")}
        stroke="var(--accent)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

function BottleTile({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background:
          "radial-gradient(55% 60% at 60% 50%, rgba(255,179,71,0.18), transparent 70%), linear-gradient(to right, transparent, rgba(2,78,54,0.5) 30%, rgba(2,78,54,0.9))",
      }}
    />
  );
}
