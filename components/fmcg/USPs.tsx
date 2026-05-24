"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type USP = {
  title: string;
  description: string;
  icon: ReactNode;
};

const ICON = "h-12 w-12 sm:h-14 sm:w-14";

const USPS: USP[] = [
  {
    title: "Direct Coverage",
    description:
      "Our direct relationships with 1,45,000+ retail stores ensure that your products receive unmatched visibility, reach, and access, eliminating unnecessary intermediaries.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className={ICON}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    title: "PAN India Expertise",
    description:
      "Leveraging our 14 years of experience across 13 brands, we possess an in-depth understanding of the territory and retailer behavior in the regions we serve, which positions us for success.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className={ICON}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18"
        />
      </svg>
    ),
  },
  {
    title: "Market Penetration",
    description:
      "With our existing scale, diverse portfolio of brands, and well-established relationships with over 1,45,000+ stores, we are the ideal choice for market entry.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className={ICON}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 12h15m0 0-5-5m5 5-5 5"
        />
      </svg>
    ),
  },
  {
    title: "Well Established Backend",
    description:
      "We boast a state-of-the-art backend supported by logistics experts, IT specialists, and finance professionals.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className={ICON}
        aria-hidden="true"
      >
        <circle cx="12" cy="6" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="16" cy="18" r="2" />
        <path
          strokeLinecap="round"
          d="M12 8v2m0 0-3.5 2M12 10l3.5 2M8 14l-.5 2.5M16 14l.5 2.5"
        />
      </svg>
    ),
  },
];

export function USPs() {
  // Track is duplicated so the -50% loop seam is invisible.
  const track = [...USPS, ...USPS];

  return (
    <section className="w-full overflow-hidden py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        <Reveal preset="fadeUp">
          <h2 className="font-[var(--font-serif)] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            What separates us from{" "}
            <span className="text-[var(--accent)]">the rest?</span>
          </h2>
        </Reveal>
      </div>

      <div
        className="group relative mt-12 overflow-hidden sm:mt-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-6 px-4 [animation-duration:48s] group-hover:[animation-play-state:paused] sm:gap-8 sm:px-6">
          {track.map((usp, i) => (
            <USPCard key={i} usp={usp} />
          ))}
        </div>
      </div>
    </section>
  );
}

function USPCard({ usp }: { usp: USP }) {
  return (
    <article
      className="flex h-[340px] w-[320px] shrink-0 flex-col rounded-2xl bg-[#fdf6e3] p-6 text-[#001636] shadow-[0_22px_60px_rgba(0,0,0,0.35)] sm:h-[360px] sm:w-[380px] sm:p-7"
    >
      <div>{usp.icon}</div>
      <h3 className="mt-6 font-[var(--font-serif)] text-2xl font-bold leading-tight sm:text-3xl">
        {usp.title}
      </h3>
      <p className="mt-3 font-[var(--font-sans)] text-base leading-7 sm:mt-4 sm:text-lg">
        {usp.description}
      </p>
    </article>
  );
}
