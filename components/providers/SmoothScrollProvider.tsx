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

    const wake = () => {
      // Re-measure scroll limits — fullscreen toggles, devtools open/close,
      // and BFCache restore can all leave Lenis with a stale clientHeight.
      try {
        lenis.resize();
      } catch {
        /* lenis throws if destroyed mid-flight, harmless */
      }
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

    startLoop();

    return () => {
      lenisRef.current = null;
      stopLoop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", wake);
      window.removeEventListener("focus", wake);
      window.removeEventListener("resize", wake);
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

