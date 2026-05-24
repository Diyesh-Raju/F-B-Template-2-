"use client";

import { createContext, useContext } from "react";

export type LenisScrollContextValue = {
  /** True when Lenis is running (not reduced-motion). */
  lenisActive: boolean;
  /** Called on every Lenis scroll tick (smooth + native sync). */
  subscribeScroll: (fn: () => void) => () => void;
  /** Instant scroll to top (Lenis or native fallback). */
  scrollToTop: () => void;
};

export const LenisScrollContext = createContext<LenisScrollContextValue>({
  lenisActive: false,
  subscribeScroll: () => () => {
    /* noop */
  },
  scrollToTop: () => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  },
});

export function useLenisScroll() {
  return useContext(LenisScrollContext);
}
