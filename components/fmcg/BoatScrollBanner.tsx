import type { ReactNode } from "react";

/**
 * Sticky boat-aerial backing for the FMCG Range section. The boat image pins
 * to the top of the viewport for one screen height while the children (the
 * Range section) scroll up over it from below — image stays put, the bar
 * literally rises over it. Mirrors the intent of the brewery sandwich but
 * uses position: sticky instead of parallax translation so the overlap is
 * exact.
 *
 * Children must have an opaque background so they fully cover the pinned
 * image once they reach viewport top.
 */
export function BoatScrollBanner({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Pinned backdrop — the boat image AND the tagline both live inside
        * the sticky element, so they ride together as the section sticks
        * to the top of the viewport. The tagline never shifts independently
        * of the image while the banner is visible. */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <div
          aria-label="Aerial view of a boat's wake on dark navy water"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/fmcg/boat-wake.png')" }}
        />
        <p
          className="absolute left-6 top-1/2 max-w-xl -translate-y-1/2 text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] sm:left-12 sm:max-w-xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          The Art of Logistics—Delivered with Precision
        </p>
      </div>
      <div className="relative z-10 bg-[var(--bg)]">{children}</div>
    </div>
  );
}
