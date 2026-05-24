"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Platform = {
  label: string;
  rating: number;
  mark: ReactNode;
};

const PLATFORMS: Platform[] = [
  { label: "Google Review", rating: 4.5, mark: <GoogleMark /> },
  { label: "EazyDiner", rating: 4.5, mark: <EazyDinerMark /> },
  { label: "Zomato", rating: 4.5, mark: <ZomatoMark /> },
  { label: "Swiggy", rating: 4.5, mark: <SwiggyMark /> },
];

export function RatingsStrip() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-12">
          <Reveal preset="fadeUp">
            <p className="max-w-md text-base leading-8 text-white/70 sm:text-lg">
              As of 2025, <strong className="text-white">Nocturne</strong> is
              highly rated by guests across leading platforms, with strong
              reviews on <strong className="text-white">Google</strong>,{" "}
              <strong className="text-white">EazyDiner</strong>,{" "}
              <strong className="text-white">Zomato</strong>, and{" "}
              <strong className="text-white">Swiggy</strong> reflecting
              consistent quality and experience.
            </p>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
            <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-4 sm:gap-x-4">
              {PLATFORMS.map((p) => (
                <RatingBadge key={p.label} platform={p} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function RatingBadge({ platform }: { platform: Platform }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-36 w-36 items-center justify-center">
        {/* Soft golden glow behind the wreath */}
        <div
          aria-hidden="true"
          className="absolute inset-2 rounded-full bg-[radial-gradient(closest-side,rgba(230,184,90,0.18),transparent_72%)]"
        />

        {/* Gold laurel wreath — left half and mirrored right half */}
        <LeafGarland className="absolute left-0 top-1/2 h-36 -translate-y-1/2" />
        <LeafGarland className="absolute right-0 top-1/2 h-36 -translate-y-1/2 -scale-x-100" />

        {/* Tied ribbon at the bottom where the two halves meet */}
        <WreathRibbon className="absolute bottom-0 left-1/2 h-9 w-12 -translate-x-1/2 translate-y-1" />

        <div className="relative flex flex-col items-center">
          <div className="flex h-7 items-center justify-center">
            {platform.mark}
          </div>
          <div className="mt-1 font-[var(--font-serif)] text-2xl leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {platform.rating.toFixed(1)}
          </div>
          <Stars
            rating={platform.rating}
            idPrefix={platform.label.replace(/\s+/g, "-").toLowerCase()}
            className="mt-1"
          />
        </div>
      </div>
      <div className="mt-3 text-xs font-medium tracking-[0.18em] text-white/55">
        {platform.label}
      </div>
    </div>
  );
}

function WreathRibbon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      aria-hidden="true"
      className={className}
      style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.55))" }}
    >
      <defs>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4D88A" />
          <stop offset="55%" stopColor="#C99836" />
          <stop offset="100%" stopColor="#7A5414" />
        </linearGradient>
      </defs>

      {/* Left tail */}
      <path
        d="M 18 14 L 6 30 L 14 30 L 24 18 Z"
        fill="url(#ribbonGrad)"
      />
      {/* Right tail */}
      <path
        d="M 42 14 L 54 30 L 46 30 L 36 18 Z"
        fill="url(#ribbonGrad)"
      />
      {/* Center knot */}
      <ellipse cx="30" cy="16" rx="9" ry="5" fill="url(#ribbonGrad)" />
      <ellipse
        cx="30"
        cy="14.5"
        rx="6"
        ry="1.6"
        fill="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

function Stars({
  rating,
  idPrefix,
  className,
}: {
  rating: number;
  idPrefix: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return <Star key={i} id={`star-${idPrefix}-${i}`} fill={fill} />;
      })}
    </div>
  );
}

function Star({ id, fill }: { id: string; fill: number }) {
  // fill: 1 = full, 0.5 = half, 0 = empty.
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="var(--accent)" />
          <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"
      />
    </svg>
  );
}

// Detailed leaf shape — pointed-almond outline, center vein, side veins, and
// a subtle highlight. Drawn long-axis horizontal so it slots into the
// existing wreath geometry (the prior ellipse-based design used the same).
function Leaf({
  x,
  y,
  rotate,
  size,
  grad,
}: {
  x: number;
  y: number;
  rotate: number;
  size: number;
  grad: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}
    >
      <path
        d="M -9 0 C -6 -3.2 -3 -4 0 -4 C 3 -4 6 -3.2 9 0 C 6 3.2 3 4 0 4 C -3 4 -6 3.2 -9 0 Z"
        fill={`url(#${grad})`}
      />
      {/* Center vein — soft amber instead of harsh black */}
      <line
        x1="-7.5"
        y1="0"
        x2="7.5"
        y2="0"
        stroke="rgba(74,42,12,0.5)"
        strokeWidth="0.25"
      />
      {/* Side veins */}
      <path
        d="M -5 0 Q -4 1.5 -2 2.6 M -2 0 Q -1 1.7 1 2.6 M 1 0 Q 2 1.5 4 2.1"
        stroke="rgba(74,42,12,0.35)"
        strokeWidth="0.18"
        fill="none"
      />
      <path
        d="M -5 0 Q -4 -1.5 -2 -2.6 M -2 0 Q -1 -1.7 1 -2.6 M 1 0 Q 2 -1.5 4 -2.1"
        stroke="rgba(74,42,12,0.35)"
        strokeWidth="0.18"
        fill="none"
      />
      {/* Polished metallic sheen along the upper edge */}
      <path
        d="M -8 -0.5 C -5 -3 -2 -3.5 1 -3.3 C 4 -3 6 -1.9 8 -0.5"
        stroke="rgba(255,250,220,0.55)"
        strokeWidth="0.4"
        fill="none"
      />
    </g>
  );
}

function LeafGarland({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 120"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        filter:
          "drop-shadow(0 2px 3px rgba(0,0,0,0.55)) drop-shadow(0 0 6px rgba(230,184,90,0.25))",
      }}
    >
      <defs>
        {/* Front-facing leaves — polished champagne gold catching light */}
        <linearGradient id="leafFront" x1="0" y1="-0.5" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#FCEFC0" />
          <stop offset="45%" stopColor="#E6B85A" />
          <stop offset="100%" stopColor="#7A521A" />
        </linearGradient>
        {/* Back leaves — deeper amber, slightly in shadow */}
        <linearGradient id="leafBack" x1="0" y1="-0.5" x2="0" y2="0.5">
          <stop offset="0%" stopColor="#D8A248" />
          <stop offset="55%" stopColor="#8C5C1E" />
          <stop offset="100%" stopColor="#3E2A0C" />
        </linearGradient>
        {/* Antique-gold stem */}
        <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C99836" />
          <stop offset="100%" stopColor="#4A3614" />
        </linearGradient>
      </defs>

      {/* Stem curving around one side of the badge */}
      <path
        d="M48 8C20 24 8 52 8 64s12 40 40 56"
        stroke="url(#stemGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner leaves layered first so the front leaves overlap them */}
      <Leaf x={28} y={22} rotate={55} size={0.7} grad="leafBack" />
      <Leaf x={18} y={36} rotate={42} size={0.75} grad="leafBack" />
      <Leaf x={12} y={50} rotate={26} size={0.8} grad="leafBack" />
      <Leaf x={9} y={66} rotate={8} size={0.8} grad="leafBack" />
      <Leaf x={12} y={82} rotate={-10} size={0.8} grad="leafBack" />
      <Leaf x={19} y={97} rotate={-28} size={0.75} grad="leafBack" />
      <Leaf x={31} y={110} rotate={-46} size={0.7} grad="leafBack" />

      {/* Outer (front) leaves — full-sized, brighter */}
      <Leaf x={33} y={16} rotate={40} size={1.0} grad="leafFront" />
      <Leaf x={22} y={28} rotate={28} size={1.05} grad="leafFront" />
      <Leaf x={15} y={42} rotate={14} size={1.1} grad="leafFront" />
      <Leaf x={11} y={58} rotate={0} size={1.1} grad="leafFront" />
      <Leaf x={12} y={74} rotate={-16} size={1.1} grad="leafFront" />
      <Leaf x={17} y={90} rotate={-30} size={1.05} grad="leafFront" />
      <Leaf x={26} y={104} rotate={-44} size={1.0} grad="leafFront" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-6 w-6">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function EazyDinerMark() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8542a] text-sm font-bold lowercase text-white">
      e
    </span>
  );
}

function ZomatoMark() {
  return (
    <span className="rounded bg-[#e23744] px-1.5 py-0.5 text-[10px] font-bold lowercase tracking-tight text-white">
      zomato
    </span>
  );
}

function SwiggyMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        fill="#fc8019"
        d="M12 2c-3.6 0-6.5 2.9-6.5 6.5 0 4.1 5 9.6 6.1 10.8.2.2.6.2.8 0 .4-.5 1.7-1.9 3-3.8h-3.3v-1.6h4.3c.7-1.2 1.2-2.4 1.5-3.6H9.9V8.7h8.4c.1-.7.2-1.4.2-2.2C18.5 4.9 15.6 2 12 2z"
      />
    </svg>
  );
}
