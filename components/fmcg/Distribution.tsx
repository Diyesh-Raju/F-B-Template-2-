"use client";

import { Reveal } from "@/components/motion/Reveal";

const PANEL =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-[#024E36] shadow-[0_18px_50px_rgba(0,0,0,0.45)]";

export function Distribution() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="space-y-5">
        {/* Hero panel — full width */}
        <Reveal preset="fadeUp">
          <div className={`${PANEL} min-h-[280px] p-8 sm:min-h-[340px] sm:p-12`}>
            <PersonHalo className="absolute -right-12 top-1/2 h-[140%] w-[55%] -translate-y-1/2 opacity-55" />
            <div className="relative max-w-[60%]">
              <h2 className="font-[var(--font-serif)] text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl">
                Direct Distribution to over{" "}
                <span className="text-[var(--accent)]">1,45,000+</span> Retail
                Stores in India
              </h2>
              <p className="mt-5 font-[var(--font-sans)] text-base leading-7 text-white/80 sm:text-lg">
                we operate as a{" "}
                <span className="underline decoration-[var(--accent)]/60 underline-offset-4">
                  large scale distributor in India
                </span>
                , delivering FMCG products efficiently across regions.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Row — Organization + Backroom executives */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div
              className={`${PANEL} flex h-full min-h-[280px] flex-col justify-center p-8 sm:p-10`}
            >
              <div className="font-[var(--font-serif)] text-4xl font-bold leading-[1.05] text-[var(--accent)] sm:text-5xl">
                Organization of
              </div>
              <div className="mt-1 font-[var(--font-serif)] text-4xl font-bold leading-[1.05] text-[var(--accent)] sm:text-5xl">
                1,800+ People
              </div>
              <p className="mt-5 max-w-sm font-[var(--font-sans)] text-base leading-7 text-white/75 sm:text-lg">
                comprised of dedicated resale and backroom teams.
              </p>
            </div>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div className={`${PANEL} h-full min-h-[280px] p-8 sm:p-10`}>
              <div className="relative z-10">
                <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-[var(--accent)] sm:text-6xl">
                  900+
                </div>
                <div className="mt-3 font-[var(--font-sans)] text-base leading-snug text-white/85 sm:text-lg">
                  Backroom
                  <br />
                  Executives
                </div>

                <div className="mt-8 flex items-center gap-1.5">
                  <Dot active />
                  <Dot />
                  <Dot />
                </div>
              </div>
              <PortraitDisk className="absolute -right-6 top-1/2 h-[110%] w-[55%] -translate-y-1/2" />
            </div>
          </Reveal>
        </div>

        {/* Row — Pan India + branches/warehouses */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div className={`${PANEL} h-full min-h-[280px] p-8 sm:p-10`}>
              <div className="relative z-10 max-w-[58%]">
                <h3 className="font-[var(--font-serif)] text-3xl font-bold leading-tight text-[var(--accent)] sm:text-4xl">
                  PAN INDIA Distribution
                </h3>
                <p className="mt-4 font-[var(--font-sans)] text-base leading-7 text-white/75">
                  Our status as{" "}
                  <span className="underline decoration-[var(--accent)]/60 underline-offset-4">
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
              className={`${PANEL} flex h-full min-h-[280px] flex-col justify-between p-8 sm:p-10`}
            >
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-[var(--accent)] sm:text-6xl">
                    40
                  </div>
                  <div className="mt-3 font-[var(--font-sans)] text-sm leading-snug text-white/75 sm:text-base">
                    Physical
                    <br />
                    Branches
                  </div>
                </div>
                <div>
                  <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-[var(--accent)] sm:text-6xl">
                    4
                  </div>
                  <div className="mt-3 font-[var(--font-sans)] text-sm leading-snug text-white/75 sm:text-base">
                    Mother
                    <br />
                    Warehouses
                  </div>
                </div>
              </div>
              <WarehouseTile className="mt-6 h-28 w-full sm:h-32" />
            </div>
          </Reveal>
        </div>

        {/* Row — Revenue + international brands */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div className={`${PANEL} h-full min-h-[280px] p-8 sm:p-10`}>
              <div className="relative z-10">
                <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-[var(--accent)] sm:text-6xl">
                  900+
                </div>
                <div className="mt-3 font-[var(--font-sans)] text-base leading-snug text-white/85 sm:text-lg">
                  Crore FY 24-25
                </div>
              </div>
              <BarChart className="absolute bottom-6 right-6 h-[55%] w-[50%]" />
            </div>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div className={`${PANEL} h-full min-h-[280px] p-8 sm:p-10`}>
              <div className="relative z-10">
                <div className="font-[var(--font-serif)] text-5xl font-bold leading-none text-[var(--accent)] sm:text-6xl">
                  17
                </div>
                <div className="mt-3 font-[var(--font-sans)] text-base leading-snug text-white/85 sm:text-lg">
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

function Dot({ active }: { active?: boolean }) {
  return (
    <span
      className={`block h-1.5 w-1.5 rounded-full ${
        active ? "bg-white" : "bg-white/40"
      }`}
    />
  );
}

function PersonHalo({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background:
          "radial-gradient(60% 70% at 50% 45%, rgba(58,128,98,0.55), rgba(2,78,54,0) 70%)",
      }}
    />
  );
}

function PortraitDisk({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`${className} pointer-events-none`}
    >
      <div
        className="absolute right-6 top-1/2 aspect-square h-[80%] -translate-y-1/2 overflow-hidden rounded-full ring-1 ring-white/15"
        style={{
          background:
            "radial-gradient(60% 55% at 38% 35%, #f4d2a9 0%, #c89c70 22%, #5a3d28 50%, #1c2a22 80%)",
        }}
      />
    </div>
  );
}

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

function WarehouseTile({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`${className} relative overflow-hidden rounded-2xl ring-1 ring-white/10`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.4)), linear-gradient(135deg, #1c4c39, #013220 60%, #00251a)",
      }}
    >
      <svg
        viewBox="0 0 240 80"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-60"
      >
        {/* Roofline */}
        <path
          d="M 0 30 L 60 12 L 120 30 L 180 12 L 240 30 L 240 80 L 0 80 Z"
          fill="rgba(0,0,0,0.35)"
        />
        {/* Doors */}
        <rect x="20" y="44" width="34" height="32" fill="rgba(0,0,0,0.45)" />
        <rect x="80" y="44" width="34" height="32" fill="rgba(0,0,0,0.45)" />
        <rect x="140" y="44" width="34" height="32" fill="rgba(0,0,0,0.45)" />
        <rect x="200" y="44" width="30" height="32" fill="rgba(0,0,0,0.45)" />
      </svg>
    </div>
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
