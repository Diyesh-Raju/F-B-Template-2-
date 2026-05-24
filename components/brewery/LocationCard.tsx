"use client";

import { Reveal } from "@/components/motion/Reveal";

// Static styled map. Avoiding an iframe keeps the page CSP-clean and means
// the panel renders instantly without a third-party tile request.
function StyledMap() {
  return (
    <div className="absolute inset-0">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 60% 50%, #1a1d28 0%, #0a0c12 60%, #050608 100%)",
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 480"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-60"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1200" height="480" fill="url(#grid)" />
        {/* roads */}
        <g stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none">
          <path d="M0 320 Q 300 280 600 300 T 1200 260" />
          <path d="M0 180 Q 350 220 700 180 T 1200 200" />
          <path d="M260 0 L 320 480" />
          <path d="M720 0 Q 760 240 740 480" />
          <path d="M980 0 L 1020 480" />
        </g>
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
          <path d="M0 80 L 1200 110" />
          <path d="M0 400 L 1200 420" />
          <path d="M120 0 L 160 480" />
          <path d="M500 0 L 540 480" />
          <path d="M860 0 L 880 480" />
        </g>
        {/* building blocks */}
        <g fill="rgba(255,255,255,0.04)">
          <rect x="80" y="100" width="120" height="60" rx="4" />
          <rect x="340" y="60" width="140" height="90" rx="4" />
          <rect x="560" y="120" width="100" height="50" rx="4" />
          <rect x="800" y="80" width="120" height="70" rx="4" />
          <rect x="1040" y="100" width="120" height="60" rx="4" />
          <rect x="100" y="360" width="140" height="80" rx="4" />
          <rect x="380" y="340" width="120" height="100" rx="4" />
          <rect x="600" y="360" width="100" height="60" rx="4" />
          <rect x="800" y="340" width="140" height="90" rx="4" />
          <rect x="1020" y="360" width="120" height="70" rx="4" />
        </g>
      </svg>
    </div>
  );
}

function Pin() {
  return (
    <div className="absolute left-[68%] top-[54%] -translate-x-1/2 -translate-y-full">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)]/30 blur-xl"
        />
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 text-[color:var(--accent)] drop-shadow-[0_4px_12px_rgba(255,179,71,0.45)]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C7.6 2 4 5.4 4 9.7c0 5.5 7 11.6 7.3 11.9.2.2.5.2.7 0 .3-.3 7.3-6.4 7.3-11.9C19.3 5.4 15.7 2 12 2zm0 11a3.3 3.3 0 110-6.5 3.3 3.3 0 010 6.5z" />
        </svg>
      </div>
    </div>
  );
}

export function LocationCard() {
  return (
    <section className="mx-auto w-full max-w-[1700px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
      <Reveal preset="fadeUp">
        <div className="relative h-[60vh] min-h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[var(--shadow-glow)] sm:h-[70vh] sm:min-h-[640px] lg:h-[78vh]">
          <StyledMap />
          <Pin />

          <div className="absolute left-1/2 top-1/2 w-[min(360px,calc(100%-2.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[color:var(--accent)]/55 bg-[color:var(--surface)]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:left-12 sm:translate-x-0">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-[var(--font-serif)] text-xl tracking-wide text-[color:var(--accent)] sm:text-2xl">
              NOCTURNE BREWERY.
            </h3>
            <p className="mt-3 text-base leading-6 text-white">
              14 Midnight Lane,
              <br />
              Bandra West, Mumbai
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Bandra+West+Mumbai"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--accent)] hover:underline"
            >
              Get Directions
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
