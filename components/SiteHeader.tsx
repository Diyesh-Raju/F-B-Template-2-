"use client";

import { ScrollLink } from "@/components/ScrollLink";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect runs synchronously before paint on the client, which lets
// us settle the navbar's "blended" state on the first frame instead of
// flashing the solid background. Falls back to useEffect on the server so
// Next.js's SSR pass doesn't warn.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const nav = [
  { href: "/fmcg", label: "FMCG" },
  { href: "/brewery", label: "Brewery" },
  { href: "/cafe", label: "Cafe" },
  { href: "/contact", label: "Contact us" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// Routes whose first child is a video / parallax hero that the navbar
// should sit transparently over. Each entry's value is the hero section's
// own scrollDistanceVh — the same number passed to ScrollScrubVideoHero —
// so the navbar knows exactly when to flip back to solid. The server-
// rendered HTML for these routes gets the blended look on the very first
// paint, eliminating the green-then-transparent flash you'd otherwise see
// while React hydrates.
const BLENDED_ROUTE_HERO_VH: Record<string, number> = {
  "/brewery": 360,
  "/fmcg": 800,
};
function matchBlendedRoute(pathname: string): number | null {
  for (const [route, vh] of Object.entries(BLENDED_ROUTE_HERO_VH)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) return vh;
  }
  return null;
}
function isBlendedRoute(pathname: string) {
  return matchBlendedRoute(pathname) !== null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // "Blended" navbar = transparent over a hero section that opts in via
  // [data-brewery-hero]. Seed from pathname so SSR + first paint already
  // have the right state; the layout effect below then refines from the
  // actual hero rect for subsequent navigations and scrolls.
  const [blended, setBlended] = useState(() => isBlendedRoute(pathname));
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const heroVh = matchBlendedRoute(pathname);
    if (heroVh === null) {
      setBlended(false);
      return;
    }

    // Scroll-position based — no DOM query required, so there's no race with
    // the hero mounting. Each blended hero sits at the very top of the page,
    // so "still over the hero" simply means scrollY hasn't crossed
    // (heroHeight - navHeight). heroVh comes from the per-route map above and
    // must match the hero's own scrollDistanceVh.
    const NAV_HEIGHT = 68;

    const update = () => {
      const heroEndPx =
        (window.innerHeight * heroVh) / 100 - NAV_HEIGHT;
      setBlended(window.scrollY < heroEndPx);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // Always restore to empty string (the inline-style "unset" state) on
    // cleanup. We intentionally don't snapshot a "previous value" here — if
    // something else set body.style.overflow we'd risk fighting them, but on
    // this site no other component touches it, and the defensive reset
    // guarantees the page is never left in a scroll-locked state if the
    // cleanup runs in an unexpected order (BFCache restore, fast-refresh
    // hot reload, navigation while the menu is open).
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hard guarantee: when the route changes, the menu must close. Otherwise a
  // user who taps a nav link, then taps back-button before the panel finishes
  // closing, can leave `open === true` and the body permanently scroll-locked.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
      return;
    }
    triggerRef.current?.focus();
  }, [open]);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-colors duration-300",
        blended
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-[color:var(--bg)]",
      ].join(" ")}
    >
      {/* Subtle dark fade behind the nav while blended so the white text and
          links stay readable over bright frames of the hero video. */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-32 transition-opacity duration-300",
          "bg-gradient-to-b from-black/55 via-black/20 to-transparent",
          blended ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <ScrollLink
          href="/"
          className="group inline-flex cursor-pointer items-baseline gap-2 focus-visible:outline-offset-4"
        >
          <span className="font-[var(--font-serif)] text-lg tracking-wide">
            Nocturne
          </span>
          <span className="text-xs text-white/60">F&amp;B</span>
          <span className="ml-2 h-px w-8 bg-gradient-to-r from-[var(--accent)]/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </ScrollLink>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <ScrollLink
                key={item.href}
                href={item.href}
                className={[
                  "relative cursor-pointer rounded-full px-3 py-2 text-sm transition",
                  "text-white/70 hover:text-white",
                  "focus-visible:outline-offset-4",
                  active ? "text-white" : "",
                ].join(" ")}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-3 -bottom-[1px] h-px",
                    "bg-gradient-to-r from-transparent via-[var(--accent)]/70 to-transparent",
                    "transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </ScrollLink>
            );
          })}
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-offset-4"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
            ref={triggerRef}
          >
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 h-full w-full bg-[color:var(--bg)]"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute right-3 top-3 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-white/12 bg-[var(--surface)] shadow-[var(--shadow-glow)]"
              initial={{ x: 18, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: 18, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              ref={panelRef}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div id={titleId} className="font-[var(--font-serif)] text-base">
                  Nocturne
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="p-2">
                {nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <ScrollLink
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition",
                        "text-white/80 hover:bg-white/10 hover:text-white",
                        "focus-visible:outline-offset-4",
                        active ? "bg-white/10 text-white" : "",
                      ].join(" ")}
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      ) : null}
                    </ScrollLink>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

