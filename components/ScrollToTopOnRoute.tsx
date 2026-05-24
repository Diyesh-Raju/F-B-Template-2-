"use client";

import { useLenisScroll } from "@/components/providers/lenis-scroll-context";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Scroll to top whenever the route changes (Lenis-aware). */
export function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const { scrollToTop } = useLenisScroll();

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname, scrollToTop]);

  return null;
}
