"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { useLenisScroll } from "@/components/providers/lenis-scroll-context";
import { isSamePath } from "@/lib/navigation";

export type ScrollLinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Next.js navigation without default scroll (Lenis handles position).
 * Same-route clicks scroll to top without a full reload.
 */
export function ScrollLink({ href, onClick, ...props }: ScrollLinkProps) {
  const pathname = usePathname();
  const { scrollToTop } = useLenisScroll();

  return (
    <Link
      href={href}
      scroll={false}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (typeof href !== "string") return;
        if (isSamePath(pathname, href)) {
          e.preventDefault();
          scrollToTop();
        }
      }}
    />
  );
}
