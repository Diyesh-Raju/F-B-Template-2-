"use client";

import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { LenisScrollContext } from "@/components/providers/lenis-scroll-context";
import { dlog } from "@/lib/debug";

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
      // prefers-reduced-motion (incl. many phones in battery saver): Lenis is
      // intentionally NOT started, so scrub components fall back to native
      // scroll. A frequent dev-vs-public difference — devs rarely have it on.
      dlog("lenis", "reduced-motion ON — Lenis disabled, native scroll only");
      lenisRef.current = null;
      return;
    }

    dlog("lenis", "init — smooth scroll active");
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
    // True for one frame after a wake. The first rAF callback uses this to
    // reset Lenis's internal `time` field so the deltaTime on the resumed
    // frame is 0 instead of "however many seconds the tab was inactive".
    // Without this, Lenis ingests a multi-second dt on the resume frame and
    // the lerp jumps past the target — the symptom users see is scroll being
    // "stuck" / "frozen" until they wheel enough to overcome the bad state.
    let primeNextRaf = true;
    // Internal Lenis field we have to reach into. Lenis 1.3.x stores its
    // last raf timestamp as `time`; clearing it makes the next raf compute
    // dt = 0 (see raf() in lenis.mjs: `deltaTime = time - (this.time || time)`).
    // Documented private field — version-pinned via package.json.
    type LenisInternal = Lenis & { time?: number };

    const startLoop = () => {
      if (running) return;
      running = true;
      const raf = (time: number) => {
        if (!running) return;
        if (primeNextRaf) {
          (lenis as LenisInternal).time = time;
          primeNextRaf = false;
        }
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
      // Arm the prime-on-next-raf flag so the first resumed frame starts
      // with dt=0, regardless of whether the loop happened to keep ticking
      // at 1Hz while hidden (browsers throttle differently — some keep one
      // tick per second, some pause entirely).
      primeNextRaf = true;
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
    const onLoad = () => {
      dlog("lenis", "window load — resize() to pick up final layout height");
      safeResize();
    };
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

