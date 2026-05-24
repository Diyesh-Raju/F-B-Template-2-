"use client";

import { Reveal } from "@/components/motion/Reveal";

type Review = {
  name: string;
  initial: string;
  rating: number;
  when: string;
  text: string;
};

const REVIEWS: Review[] = [
  {
    name: "Aarav Mehta",
    initial: "A",
    rating: 5,
    when: "2 weeks ago",
    text: "The small-batch IPA blew me away — bright, clean, and easily the best craft pour in the city.",
  },
  {
    name: "Sophie Turner",
    initial: "S",
    rating: 5,
    when: "1 month ago",
    text: "Cozy taproom, genuinely warm staff, and the seasonal stout is unreal. Already planning my next visit.",
  },
  {
    name: "Rohan Iyer",
    initial: "R",
    rating: 5,
    when: "3 weeks ago",
    text: "Took the brewery tour — super informative and the tasting flight was generous. Worth every minute.",
  },
  {
    name: "Emily Carter",
    initial: "E",
    rating: 4,
    when: "1 week ago",
    text: "Great vibe for an evening out. The salted lager pairs perfectly with the food menu.",
  },
  {
    name: "Karan Shah",
    initial: "K",
    rating: 5,
    when: "2 months ago",
    text: "Consistently excellent pours. You can taste the care that goes into every single batch.",
  },
  {
    name: "Priya Nair",
    initial: "P",
    rating: 5,
    when: "5 days ago",
    text: "Loved the rotating taps — always something new on. Service was quick and friendly throughout.",
  },
  {
    name: "Daniel Brooks",
    initial: "D",
    rating: 5,
    when: "1 month ago",
    text: "Best spot to unwind on a weekend. The Midnight Stout is an absolute must-try.",
  },
];

export function ReviewsMarquee() {
  // Rendered twice so the -50% keyframe loops seamlessly.
  const track = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal preset="fadeUp">
          <div className="max-w-3xl">
            <div className="text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
              REVIEWED ON GOOGLE
            </div>
            <h2 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl">
              Don&apos;t take our word for it
            </h2>
            <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
              Real reviews from guests who pulled up a stool — straight off our
              Google page.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed marquee with soft edge fades. */}
      <div
        className="group relative mt-12 overflow-hidden sm:mt-14"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {track.map((review, i) => (
            <ReviewBubble key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewBubble({ review }: { review: Review }) {
  return (
    <article className="w-[18rem] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:w-[20rem]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-semibold text-[var(--accent)] ring-1 ring-[var(--accent)]/25">
          {review.initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">
            {review.name}
          </div>
          <div className="text-xs text-white/45">{review.when}</div>
        </div>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < review.rating ? "text-[var(--accent)]" : "text-white/15"
            }`}
          />
        ))}
      </div>

      <p className="mt-3 text-sm leading-6 text-white/60">{review.text}</p>
    </article>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
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
