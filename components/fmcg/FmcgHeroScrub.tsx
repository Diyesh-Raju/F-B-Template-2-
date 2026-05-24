"use client";

import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";
import { FmcgHeroOverlay } from "@/components/fmcg/FmcgHeroOverlay";

/**
 * Client-side wrapper that pairs the scroll-scrub video hero with FMCG's
 * two-stage text overlay. Mirrors BreweryHeroScrub — lives in a client
 * boundary so the render-prop child passed to ScrollScrubVideoHero (a
 * function) is allowed; server components cannot pass functions to client
 * components.
 *
 * `data-fmcg-hero` is decorative — the navbar's blended state is keyed off
 * the `/fmcg` route plus scroll position, not this attribute, but the data
 * hook is left so future per-section probes (analytics, e2e tests) have a
 * stable selector.
 */
export function FmcgHeroScrub() {
  return (
    <div data-fmcg-hero>
      <ScrollScrubVideoHero
        src="/fmcg/logistics-hero.mp4"
        scrollDistanceVh={800}
        overlayClassName="bg-black opacity-0"
      >
        {(progress) => <FmcgHeroOverlay progress={progress} />}
      </ScrollScrubVideoHero>
    </div>
  );
}
