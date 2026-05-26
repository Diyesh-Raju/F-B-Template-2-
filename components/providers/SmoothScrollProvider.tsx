"use client";

import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { LenisScrollContext } from "@/components/providers/lenis-scroll-context";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const listenersRef = useRef(new Set<() => void>());
  const lenisRef = useRef<Lenis | null>(null);

  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const notifyScroll = useMemo(
    () => () => {
      for (const fn of listenersRef.current) fn();
    },
    []
  );

  const subscribeScroll = useMemo(
    () => (fn: () => void) => {
      listenersRef.current.add(fn);
      return () => {
        listenersRef.current.delete(fn);
      };
    },
    []
  );

  useEffect(() => {
    if (reduce) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", notifyScroll);

    let rafId = 0;
    let running = false;
    let cleanupFonts: () => void = () => {};

    const startLoop = () => {
      if (running) return;
      running = true;
      // Prime the lerp with a fresh "now" so the first dt is ~0 instead of
      // whatever stale value the browser hands us after a throttled-rAF gap
      // (tab hidden, fullscreen toggle, BFCache restore). Without this the
      // first frame after wake can ingest a multi-second dt and visibly
      // freeze the scroll until the user wheels enough to overcome it, or
      // worse, leaves Lenis stuck only able to scroll one direction.
      const raf = (time: number) => {
        if (!running) return;
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);
    };

    const stopLoop = () => {
      running = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // Resize lenis without restarting the rAF loop. Cheap to call frequently —
    // safe to fire from a ResizeObserver, a setTimeout, or any layout-changing
    // event. The lockup symptom ("can scroll up but not down") happens when
    // the document grows AFTER Lenis cached its limit; calling resize() picks
    // up the new max scroll height.
    const safeResize = () => {
      try {
        lenis.resize();
      } catch {
        /* lenis throws if destroyed mid-flight, harmless */
      }
    };

    const wake = () => {
      safeResize();
      startLoop();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stopLoop();
      } else {
        wake();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", wake);
    window.addEventListener("focus", wake);
    window.addEventListener("resize", wake, { passive: true });

    // ResizeObserver on the documentElement catches every layout shift that
    // changes the page's total scrollable height — image loads, font swaps,
    // reveal animations expanding rows, mobile address bar showing/hiding,
    // React state mutations that add content below the fold. Without this,
    // Lenis's cached limit goes stale and the user can scroll up but not
    // down until they refresh. This is the single most important reliability
    // fix for smooth-scroll setups.
    const ro = new ResizeObserver(() => safeResize());
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);

    // Catch images / late assets that finish loading after first paint.
    const onLoad = () => safeResize();
    window.addEventListener("load", onLoad);

    // Font swap is one of the most common late layout shifts on this site
    // (we load ~20 display fonts). Resize once each batch finishes.
    if ("fonts" in document) {
      // The promise resolves once after EACH batch of fonts settles. Re-arm
      // by also listening to the `loadingdone` event from FontFaceSet.
      document.fonts.ready.then(safeResize).catch(() => {});
      const onFontsDone = () => safeResize();
      document.fonts.addEventListener?.("loadingdone", onFontsDone);
      // Cleanup handled in the main return — store a removal closure.
      cleanupFonts = () =>
        document.fonts.removeEventListener?.("loadingdone", onFontsDone);
    }

    startLoop();

    return () => {
      lenisRef.current = null;
      stopLoop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", wake);
      window.removeEventListener("focus", wake);
      window.removeEventListener("resize", wake);
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      cleanupFonts();
      lenis.off("scroll", notifyScroll);
      lenis.destroy();
    };
  }, [reduce, notifyScroll]);

  const ctxValue = useMemo(
    () => ({
      lenisActive: !reduce,
      subscribeScroll,
      scrollToTop,
    }),
    [reduce, subscribeScroll, scrollToTop]
  );

  return (
    <LenisScrollContext.Provider value={ctxValue}>
      {children}
    </LenisScrollContext.Provider>
  );
}

