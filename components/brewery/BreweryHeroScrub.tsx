"use client";

import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";
import { BreweryHeroOverlay } from "@/components/brewery/BreweryHeroOverlay";

/**
 * Client-side wrapper that pairs the scroll-scrub video hero with the
 * brewery's two-stage text overlay. Lives in a client boundary so the
 * render-prop child passed to ScrollScrubVideoHero (a function) is allowed
 * — server components cannot pass functions to client components.
 */
export function BreweryHeroScrub() {
  return (
    // data-brewery-hero is picked up by SiteHeader to flip the navbar into
    // transparent / "blended" mode while any part of this section is below
    // the navbar, and back to solid once the user scrolls past.
    <div data-brewery-hero>
      <ScrollScrubVideoHero
        src="/brewery/brewery-hero.mp4"
        scrollDistanceVh={360}
        overlayClassName="bg-[color:var(--bg)] opacity-0"
        scrollHint
      >
        {(progress) => <BreweryHeroOverlay progress={progress} />}
      </ScrollScrubVideoHero>
    </div>
  );
}
