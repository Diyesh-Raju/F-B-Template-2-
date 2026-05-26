"use client";

import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";
import { CafeHeroOverlay } from "@/components/cafe/CafeHeroOverlay";

/**
 * Client-side wrapper that pairs the cafe scroll-scrub video hero with the
 * two-stage text overlay (intro line fades in once scrolling starts, outro
 * name plate appears at the end). Lives in a client boundary so the
 * render-prop child passed to ScrollScrubVideoHero is allowed — server
 * components can't pass functions to client components.
 */
export function CafeHeroScrub() {
  return (
    <ScrollScrubVideoHero
      src="/hero/cafe-scroll-hero.mp4"
      scrollDistanceVh={300}
      overlayClassName="bg-transparent opacity-0"
    >
      {(progress) => <CafeHeroOverlay progress={progress} />}
    </ScrollScrubVideoHero>
  );
}
