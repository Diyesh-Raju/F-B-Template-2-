"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets `data-theme` on the <html> element based on the current route:
 *   - `/cafe`  → "cream"  (cream/brown palette)
 *   - `/fmcg`  → "navy"   (#001636 navy bg, white text — FMCG brand palette)
 *   - `/`      → "home"   (black page background, original pre-emerald look)
 *   - other    → unset    (default emerald palette)
 * CSS variable overrides for each theme live in globals.css and are scoped
 * to the matching attribute selector.
 */
export function ThemeManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const onCafe = pathname === "/cafe" || pathname.startsWith("/cafe/");
    const onFmcg = pathname === "/fmcg" || pathname.startsWith("/fmcg/");
    const onHome = pathname === "/";
    if (onCafe) {
      root.setAttribute("data-theme", "cream");
    } else if (onFmcg) {
      root.setAttribute("data-theme", "navy");
    } else if (onHome) {
      root.setAttribute("data-theme", "home");
    } else {
      root.removeAttribute("data-theme");
    }
    return () => {
      root.removeAttribute("data-theme");
    };
  }, [pathname]);

  return null;
}
